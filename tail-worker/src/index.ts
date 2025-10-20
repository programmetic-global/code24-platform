/**
 * Code24 Platform - Tail Worker for Observability
 * Implements logging, monitoring, and analytics as per Cloudflare reference architecture
 */

interface TailEvent {
  outcome: string;
  scriptName: string;
  exceptions: any[];
  logs: any[];
  eventTimestamp: number;
  event: {
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
      cf?: any;
    };
    response?: {
      status: number;
    };
  };
}

interface Env {
  ANALYTICS_DATASET: AnalyticsEngineDataset;
  LOGS_STORAGE: R2Bucket;
  ALERTS_KV: KVNamespace;
}

export default {
  async tail(events: TailEvent[], env: Env, ctx: ExecutionContext): Promise<void> {
    // Process each tail event
    for (const event of events) {
      await Promise.all([
        // 1. Send metrics to Analytics Engine
        recordMetrics(event, env),
        
        // 2. Store detailed logs to R2
        storeLogs(event, env),
        
        // 3. Check for alerts and errors
        checkAlerts(event, env),
        
        // 4. Track platform usage patterns
        trackUsagePatterns(event, env)
      ]);
    }
  },
};

async function recordMetrics(event: TailEvent, env: Env): Promise<void> {
  try {
    const request = event.event?.request;
    const response = event.event?.response;
    
    if (!request) return;

    // Extract platform-specific metrics
    const url = new URL(request.url);
    const isMainPlatform = url.hostname.includes('code24.dev');
    const isCustomerSite = url.hostname.includes('.code24.dev') && !isMainPlatform;
    
    // Prepare analytics data
    const analyticsData = {
      timestamp: new Date(event.eventTimestamp).toISOString(),
      scriptName: event.scriptName,
      outcome: event.outcome,
      method: request.method,
      status: response?.status || 0,
      path: url.pathname,
      hostname: url.hostname,
      country: request.cf?.country || 'unknown',
      isMainPlatform: isMainPlatform ? 1 : 0,
      isCustomerSite: isCustomerSite ? 1 : 0,
      hasExceptions: event.exceptions.length > 0 ? 1 : 0,
      responseTime: Date.now() - event.eventTimestamp // Approximate
    };

    // Send to Analytics Engine
    env.ANALYTICS_DATASET.writeDataPoint(analyticsData);
    
  } catch (error) {
    console.error('Failed to record metrics:', error);
  }
}

async function storeLogs(event: TailEvent, env: Env): Promise<void> {
  try {
    // Only store detailed logs for errors or important events
    const shouldStoreLogs = 
      event.outcome === 'exception' ||
      event.exceptions.length > 0 ||
      event.logs.some(log => log.level === 'error') ||
      event.event?.response?.status >= 400;

    if (!shouldStoreLogs) return;

    const logData = {
      timestamp: new Date(event.eventTimestamp).toISOString(),
      scriptName: event.scriptName,
      outcome: event.outcome,
      request: event.event?.request,
      response: event.event?.response,
      exceptions: event.exceptions,
      logs: event.logs
    };

    // Store in R2 with timestamp-based key
    const logKey = `logs/${new Date().toISOString().split('T')[0]}/${event.scriptName}/${event.eventTimestamp}.json`;
    
    await env.LOGS_STORAGE.put(logKey, JSON.stringify(logData, null, 2), {
      httpMetadata: {
        contentType: 'application/json'
      }
    });

  } catch (error) {
    console.error('Failed to store logs:', error);
  }
}

async function checkAlerts(event: TailEvent, env: Env): Promise<void> {
  try {
    const alerts = [];

    // Check for exceptions
    if (event.outcome === 'exception' || event.exceptions.length > 0) {
      alerts.push({
        type: 'exception',
        severity: 'high',
        script: event.scriptName,
        details: event.exceptions
      });
    }

    // Check for high error rates
    if (event.event?.response?.status >= 500) {
      alerts.push({
        type: 'server_error',
        severity: 'medium',
        script: event.scriptName,
        status: event.event.response.status
      });
    }

    // Check for performance issues (placeholder - would need more sophisticated logic)
    const responseTime = Date.now() - event.eventTimestamp;
    if (responseTime > 5000) { // 5 seconds
      alerts.push({
        type: 'performance',
        severity: 'low',
        script: event.scriptName,
        responseTime
      });
    }

    // Store alerts in KV for dashboard consumption
    if (alerts.length > 0) {
      const alertKey = `alerts:${Date.now()}:${event.scriptName}`;
      await env.ALERTS_KV.put(alertKey, JSON.stringify({
        timestamp: new Date().toISOString(),
        script: event.scriptName,
        alerts
      }), {
        expirationTtl: 86400 * 7 // Keep alerts for 7 days
      });
    }

  } catch (error) {
    console.error('Failed to check alerts:', error);
  }
}

async function trackUsagePatterns(event: TailEvent, env: Env): Promise<void> {
  try {
    const request = event.event?.request;
    if (!request) return;

    const url = new URL(request.url);
    
    // Track API usage patterns
    if (url.pathname.startsWith('/api/')) {
      const endpoint = url.pathname;
      const usageKey = `usage:api:${endpoint}:${new Date().toISOString().split('T')[0]}`;
      
      // Increment usage counter
      const currentCount = await env.ALERTS_KV.get(usageKey) || '0';
      const newCount = parseInt(currentCount) + 1;
      
      await env.ALERTS_KV.put(usageKey, newCount.toString(), {
        expirationTtl: 86400 * 30 // Keep usage data for 30 days
      });
    }

    // Track customer site activity
    if (url.hostname.includes('.code24.dev') && !url.hostname.includes('staging.code24.dev')) {
      const subdomain = url.hostname.split('.')[0];
      const activityKey = `activity:${subdomain}:${new Date().toISOString().split('T')[0]}`;
      
      const currentActivity = await env.ALERTS_KV.get(activityKey) || '0';
      const newActivity = parseInt(currentActivity) + 1;
      
      await env.ALERTS_KV.put(activityKey, newActivity.toString(), {
        expirationTtl: 86400 * 90 // Keep activity data for 90 days
      });
    }

  } catch (error) {
    console.error('Failed to track usage patterns:', error);
  }
}