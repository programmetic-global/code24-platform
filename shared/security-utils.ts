/**
 * Code24 Security Utilities
 * Infrastructure obfuscation and security measures
 */

export interface SecurityConfig {
  platform: string;
  version: string;
  customHeaders: Record<string, string>;
  removeHeaders: string[];
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  platform: 'Code24',
  version: '1.0',
  customHeaders: {
    'Server': 'Code24/1.0',
    'X-Powered-By': 'Code24 Platform',
    'X-Platform': 'Code24-Engine',
    'X-Version': '1.0'
  },
  removeHeaders: [
    'CF-RAY',
    'CF-Cache-Status', 
    'CF-Request-ID',
    'Report-To',
    'NEL',
    'alt-svc'
  ]
};

/**
 * Sanitize response headers to hide Cloudflare infrastructure
 */
export function sanitizeResponse(response: Response, config: SecurityConfig = DEFAULT_SECURITY_CONFIG): Response {
  const newHeaders = new Headers(response.headers);
  
  // Remove Cloudflare signatures
  config.removeHeaders.forEach(header => {
    newHeaders.delete(header);
  });
  
  // Add custom platform headers
  Object.entries(config.customHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * Create CORS headers that don't expose infrastructure
 */
export function createSecureCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Platform, X-Client-ID',
    'Access-Control-Expose-Headers': 'X-Platform, X-Version',
    'Server': 'Code24/1.0',
    'X-Powered-By': 'Code24 Platform'
  };
}

/**
 * Create custom error page without Cloudflare branding
 */
export function createCustomErrorPage(status: number, message: string, requestId?: string): Response {
  const errorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Code24 Platform</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container { text-align: center; max-width: 500px; padding: 40px; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        h1 { font-size: 32px; margin-bottom: 16px; }
        p { font-size: 18px; opacity: 0.9; margin-bottom: 16px; }
        .error-code { font-size: 14px; opacity: 0.7; font-family: monospace; }
        .btn { 
          background: #ff6b6b; 
          color: white; 
          padding: 12px 24px; 
          border: none; 
          border-radius: 6px; 
          text-decoration: none; 
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🚀</div>
        <h1>Code24 Platform</h1>
        <p>${message}</p>
        <p>Our AI-powered optimization engine is working to resolve this issue.</p>
        ${requestId ? `<div class="error-code">Request ID: ${requestId}</div>` : ''}
        <a href="https://code24.dev" class="btn">Return to Platform</a>
      </div>
    </body>
    </html>
  `;
  
  return new Response(errorHTML, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...DEFAULT_SECURITY_CONFIG.customHeaders
    }
  });
}

/**
 * Wrap API responses with Code24 branding
 */
export interface Code24Response<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    platform: string;
    version: string;
    timestamp: string;
    request_id: string;
  };
}

export function wrapApiResponse<T>(
  data: T, 
  requestId: string, 
  success: boolean = true
): Code24Response<T> {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : (data as any)?.message || 'An error occurred',
    meta: {
      platform: 'Code24',
      version: '1.0',
      timestamp: new Date().toISOString(),
      request_id: requestId
    }
  };
}

/**
 * Generate request ID for tracking without exposing infrastructure
 */
export function generateRequestId(): string {
  return 'c24_' + crypto.randomUUID().substring(0, 8);
}

/**
 * Check if response might expose infrastructure details
 */
export function detectInfrastructureLeaks(response: Response): boolean {
  const exposurePatterns = [
    /\.workers\.dev/gi,
    /cloudflare/gi,
    /CF-RAY/gi,
    /wrangler/gi,
    /d1[-_]database/gi,
    /\.cfdata\./gi
  ];
  
  // Check headers
  const headerString = Array.from(response.headers.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join(' ');
  
  return exposurePatterns.some(pattern => pattern.test(headerString));
}

/**
 * Log security events for monitoring
 */
export function logSecurityEvent(
  request: Request, 
  eventType: string, 
  details?: Record<string, any>
): void {
  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || 'unknown',
    userAgent: request.headers.get('User-Agent') || 'unknown',
    url: request.url,
    method: request.method,
    ...details
  };
  
  console.warn('🔒 SECURITY EVENT:', JSON.stringify(event));
}

/**
 * Middleware wrapper for secure response handling
 */
export function secureHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const requestId = generateRequestId();
    
    try {
      const response = await handler(request, ...args);
      
      // Check for infrastructure leaks
      if (detectInfrastructureLeaks(response)) {
        logSecurityEvent(request, 'INFRASTRUCTURE_LEAK_DETECTED', {
          request_id: requestId,
          response_headers: Array.from(response.headers.entries())
        });
      }
      
      // Sanitize response
      return sanitizeResponse(response);
      
    } catch (error) {
      logSecurityEvent(request, 'HANDLER_ERROR', {
        request_id: requestId,
        error: error.message
      });
      
      return createCustomErrorPage(500, 'Internal Server Error', requestId);
    }
  };
}

/**
 * Create client integration script without infrastructure references
 */
export function generateClientScript(siteId: string, config?: Partial<SecurityConfig>): string {
  const securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...config };
  
  return `
(function() {
  'use strict';
  
  const CODE24_CONFIG = {
    apiBase: 'https://insights.code24.dev',
    platform: '${securityConfig.platform}',
    version: '${securityConfig.version}',
    siteId: '${siteId}'
  };
  
  function getVisitorId() {
    let id = localStorage.getItem('c24_visitor_id');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 16);
      localStorage.setItem('c24_visitor_id', id);
    }
    return id;
  }
  
  function getSessionId() {
    let id = sessionStorage.getItem('c24_session_id');
    if (!id) {
      id = 's_' + Math.random().toString(36).substr(2, 16);
      sessionStorage.setItem('c24_session_id', id);
    }
    return id;
  }
  
  function trackEvent(eventType, data) {
    fetch(CODE24_CONFIG.apiBase + '/track', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Platform': 'Code24-Client',
        'X-Version': CODE24_CONFIG.version
      },
      body: JSON.stringify({
        siteId: CODE24_CONFIG.siteId,
        eventType: eventType,
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        pageUrl: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
        metadata: data || {}
      })
    }).catch(function(error) {
      console.debug('Code24 tracking error:', error);
    });
  }
  
  // Track page view on load
  window.addEventListener('load', function() {
    trackEvent('page_view');
  });
  
  // Expose tracking function
  window.Code24 = { track: trackEvent };
})();
`;
}

/**
 * Configuration for production deployment security
 */
export const PRODUCTION_SECURITY_CONFIG = {
  workerNamePrefix: 'c24-core-',
  databaseNamePrefix: 'c24-db-',
  customDomains: {
    main: 'code24.dev',
    api: 'api.code24.dev', 
    insights: 'insights.code24.dev',
    assets: 'assets.code24.dev'
  },
  internalDomains: {
    analytics: 'analytics-internal.code24.dev',
    ai: 'ai-internal.code24.dev',
    testing: 'testing-internal.code24.dev'
  }
};