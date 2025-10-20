/**
 * Code24 Platform - Outbound Worker for Egress Control
 * Intercepts and manages outbound requests as per Cloudflare reference architecture
 */

interface Env {
  ALLOWED_HOSTS: KVNamespace;
  SECURITY_LOGS: R2Bucket;
  RATE_LIMITS: KVNamespace;
}

interface OutboundRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  originWorker: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Parse the outbound request details
    const outboundRequest: OutboundRequest = await request.json();
    const targetUrl = new URL(outboundRequest.url);
    const targetHost = targetUrl.hostname;
    
    try {
      // 1. Security checks
      const securityResult = await performSecurityChecks(outboundRequest, env);
      if (!securityResult.allowed) {
        return new Response(JSON.stringify({
          error: 'Request blocked by security policy',
          reason: securityResult.reason
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 2. Rate limiting
      const rateLimitResult = await checkRateLimit(outboundRequest, env);
      if (!rateLimitResult.allowed) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        }), { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        });
      }

      // 3. Host allowlist check
      const isAllowed = await isHostAllowed(targetHost, env);
      if (!isAllowed) {
        await logSecurityEvent('blocked_host', outboundRequest, env);
        return new Response(JSON.stringify({
          error: 'Host not in allowlist',
          host: targetHost
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 4. Make the actual outbound request
      const outboundResponse = await makeOutboundRequest(outboundRequest);
      
      // 5. Log successful request
      await logOutboundRequest(outboundRequest, outboundResponse.status, env);
      
      return outboundResponse;

    } catch (error) {
      console.error('Outbound worker error:', error);
      await logSecurityEvent('outbound_error', outboundRequest, env, error);
      
      return new Response(JSON.stringify({
        error: 'Outbound request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};

async function performSecurityChecks(request: OutboundRequest, env: Env): Promise<{allowed: boolean, reason?: string}> {
  const url = new URL(request.url);
  
  // Block internal/private networks
  const hostname = url.hostname;
  if (
    hostname === 'localhost' ||
    hostname.startsWith('127.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.includes('internal') ||
    hostname.includes('admin')
  ) {
    return { allowed: false, reason: 'Private network access blocked' };
  }

  // Block suspicious protocols
  if (!['http:', 'https:'].includes(url.protocol)) {
    return { allowed: false, reason: 'Unsupported protocol' };
  }

  // Check for malicious patterns in headers
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'authorization'];
  for (const header of suspiciousHeaders) {
    if (request.headers[header] && request.headers[header].includes('..')) {
      return { allowed: false, reason: 'Suspicious header content' };
    }
  }

  // Block requests with suspicious user agents
  const userAgent = request.headers['user-agent'] || '';
  const suspiciousAgents = ['bot', 'crawler', 'scanner', 'curl', 'wget'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return { allowed: false, reason: 'Suspicious user agent' };
  }

  return { allowed: true };
}

async function checkRateLimit(request: OutboundRequest, env: Env): Promise<{allowed: boolean, retryAfter?: number}> {
  const url = new URL(request.url);
  const rateLimitKey = `rate_limit:${request.originWorker}:${url.hostname}`;
  
  // Get current request count
  const currentCount = await env.RATE_LIMITS.get(rateLimitKey) || '0';
  const requestCount = parseInt(currentCount);
  
  // Rate limit: 100 requests per minute per worker per host
  const limit = 100;
  const windowSeconds = 60;
  
  if (requestCount >= limit) {
    return { allowed: false, retryAfter: windowSeconds };
  }
  
  // Increment counter
  await env.RATE_LIMITS.put(rateLimitKey, (requestCount + 1).toString(), {
    expirationTtl: windowSeconds
  });
  
  return { allowed: true };
}

async function isHostAllowed(hostname: string, env: Env): Promise<boolean> {
  // Check if host is in allowlist
  const allowedHost = await env.ALLOWED_HOSTS.get(hostname);
  if (allowedHost) {
    return true;
  }

  // Allow common, safe domains
  const safeDomains = [
    'api.openai.com',
    'api.anthropic.com',
    'httpbin.org',
    'jsonplaceholder.typicode.com',
    'api.github.com',
    'api.stripe.com',
    'api.mailgun.net',
    'api.sendgrid.com'
  ];
  
  return safeDomains.includes(hostname);
}

async function makeOutboundRequest(request: OutboundRequest): Promise<Response> {
  const headers = new Headers();
  
  // Copy headers, but filter sensitive ones
  Object.entries(request.headers).forEach(([key, value]) => {
    if (!['authorization', 'cookie', 'x-forwarded-for'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  
  // Add platform identification
  headers.set('User-Agent', 'Code24-Platform/1.0');
  headers.set('X-Requested-With', 'Code24-Outbound-Worker');
  
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };
  
  if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    fetchOptions.body = request.body;
  }
  
  return await fetch(request.url, fetchOptions);
}

async function logOutboundRequest(request: OutboundRequest, status: number, env: Env): Promise<void> {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      originWorker: request.originWorker,
      method: request.method,
      url: request.url,
      status,
      type: 'outbound_request'
    };

    const logKey = `outbound/${new Date().toISOString().split('T')[0]}/${Date.now()}.json`;
    
    await env.SECURITY_LOGS.put(logKey, JSON.stringify(logEntry), {
      httpMetadata: {
        contentType: 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to log outbound request:', error);
  }
}

async function logSecurityEvent(eventType: string, request: OutboundRequest, env: Env, error?: any): Promise<void> {
  try {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      eventType,
      originWorker: request.originWorker,
      method: request.method,
      url: request.url,
      error: error instanceof Error ? error.message : error,
      type: 'security_event'
    };

    const logKey = `security/${new Date().toISOString().split('T')[0]}/${Date.now()}.json`;
    
    await env.SECURITY_LOGS.put(logKey, JSON.stringify(securityEvent), {
      httpMetadata: {
        contentType: 'application/json'
      }
    });
  } catch (logError) {
    console.error('Failed to log security event:', logError);
  }
}