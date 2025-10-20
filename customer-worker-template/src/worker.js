/**
 * Code24 Customer Worker Template - Fullstack Serverless Application
 * Generated dynamically for each customer with their specific features
 */

// Customer Configuration (injected during deployment)
const CUSTOMER_CONFIG = {
  customerId: '{{customerId}}',
  plan: '{{plan}}',
  features: {{features}},
  settings: {{settings}},
  eliteWorkersEnabled: {{eliteWorkersEnabled}},
  analyticsEnabled: {{analyticsEnabled}},
  optimizationEnabled: {{optimizationEnabled}}
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Security layer - validate customer access
      const customerContext = await validateCustomerAccess(request, env);
      if (!customerContext) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      // Performance layer - check cache first
      const cacheKey = `${CUSTOMER_CONFIG.customerId}:${url.pathname}`;
      const cached = await env.CACHE.get(cacheKey);
      if (cached && url.searchParams.get('nocache') !== 'true') {
        return new Response(cached, {
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=300',
            'X-Cache': 'HIT'
          }
        });
      }
      
      // Compute layer - route request
      let response;
      
      if (url.pathname === '/' || url.pathname === '/index.html') {
        response = await serveCustomerSite(customerContext, env);
      } else if (url.pathname.startsWith('/api/')) {
        response = await handleCustomerAPI(request, customerContext, env);
      } else if (url.pathname.startsWith('/assets/')) {
        response = await serveCustomerAssets(url.pathname, env);
      } else if (url.pathname === '/optimize' && CUSTOMER_CONFIG.optimizationEnabled) {
        response = await triggerOptimization(customerContext, env);
      } else {
        response = await serveCustomerSite(customerContext, env);
      }
      
      // Cache successful responses
      if (response.status === 200 && request.method === 'GET') {
        const responseText = await response.clone().text();
        await env.CACHE.put(cacheKey, responseText, { expirationTtl: 300 });
      }
      
      // Analytics layer
      if (CUSTOMER_CONFIG.analyticsEnabled) {
        ctx.waitUntil(recordAnalytics(request, response, customerContext, env));
      }
      
      return response;
    } catch (error) {
      console.error('Customer worker error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
};

async function validateCustomerAccess(request, env) {
  try {
    const customerId = request.headers.get('X-Customer-ID') || CUSTOMER_CONFIG.customerId;
    
    // Get customer metadata from KV
    const customerData = await env.CUSTOMER_METADATA.get(`customer:${customerId}`, { type: 'json' });
    if (!customerData || customerData.status !== 'active') {
      return null;
    }
    
    return {
      id: customerId,
      subdomain: customerData.subdomain,
      plan: customerData.plan,
      features: customerData.features,
      lastOptimized: customerData.lastOptimized
    };
  } catch (error) {
    console.error('Customer validation error:', error);
    return null;
  }
}

async function serveCustomerSite(customerContext, env) {
  try {
    // Get customer's site from R2
    const siteKey = `sites/${customerContext.subdomain}/index.html`;
    const site = await env.CUSTOMER_SITES.get(siteKey);
    
    if (!site) {
      // Generate default site if none exists
      return await generateDefaultSite(customerContext, env);
    }
    
    let siteContent = await site.text();
    
    // Inject Elite Workers optimizations if enabled
    if (CUSTOMER_CONFIG.eliteWorkersEnabled) {
      siteContent = await injectEliteWorkerOptimizations(siteContent, customerContext, env);
    }
    
    return new Response(siteContent, {
      headers: { 
        'Content-Type': 'text/html',
        'X-Powered-By': 'Code24',
        'X-Customer-Plan': customerContext.plan
      }
    });
  } catch (error) {
    console.error('Site serving error:', error);
    return new Response('Site temporarily unavailable', { status: 503 });
  }
}

async function generateDefaultSite(customerContext, env) {
  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${customerContext.subdomain} - Powered by Code24</title>
  <style>
    body { 
      font-family: 'Inter', -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      max-width: 600px;
      padding: 40px 20px;
    }
    h1 { font-size: 3rem; margin-bottom: 20px; }
    p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
    .status {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.2);
      margin-top: 40px;
    }
    .feature {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      margin: 5px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Welcome to ${customerContext.subdomain}</h1>
    <p>Your Code24-powered website is being optimized and will be ready soon.</p>
    
    <div class="status">
      <h3>🎯 Platform Status</h3>
      <div class="feature">Plan: ${customerContext.plan}</div>
      ${CUSTOMER_CONFIG.eliteWorkersEnabled ? '<div class="feature">✨ Elite Workers: Active</div>' : ''}
      ${CUSTOMER_CONFIG.analyticsEnabled ? '<div class="feature">📊 Analytics: Enabled</div>' : ''}
      ${CUSTOMER_CONFIG.optimizationEnabled ? '<div class="feature">⚡ Auto-Optimization: On</div>' : ''}
    </div>
    
    <div style="margin-top: 40px; font-size: 0.9rem; opacity: 0.7;">
      <p>Powered by Code24 - The Future of Web Development</p>
      ${customerContext.lastOptimized ? `<p>Last optimized: ${new Date(customerContext.lastOptimized).toLocaleDateString()}</p>` : ''}
    </div>
  </div>
  
  ${CUSTOMER_CONFIG.analyticsEnabled ? `
  <script>
    // Basic analytics tracking
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: '/',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    }).catch(() => {});
  </script>
  ` : ''}
</body>
</html>`;
  
  // Store the generated site in R2
  const siteKey = `sites/${customerContext.subdomain}/index.html`;
  await env.CUSTOMER_SITES.put(siteKey, defaultHtml);
  
  return new Response(defaultHtml, {
    headers: { 
      'Content-Type': 'text/html',
      'X-Generated': 'true'
    }
  });
}

async function injectEliteWorkerOptimizations(siteContent, customerContext, env) {
  try {
    // Check if site has been recently optimized
    const lastOptimized = new Date(customerContext.lastOptimized || 0);
    const hoursSinceOptimization = (Date.now() - lastOptimized.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceOptimization < 24) {
      // Use cached optimizations
      const cachedOptimizations = await env.CACHE.get(`optimizations:${customerContext.subdomain}`);
      if (cachedOptimizations) {
        return applyCachedOptimizations(siteContent, JSON.parse(cachedOptimizations));
      }
    }
    
    // Trigger new optimization through ETL pipeline
    await env.OPTIMIZATION_QUEUE.send({
      customerId: customerContext.id,
      subdomain: customerContext.subdomain,
      type: 'website_optimization',
      priority: 'normal'
    });
    
    return siteContent; // Return original for now, optimizations applied async
  } catch (error) {
    console.error('Elite Worker optimization error:', error);
    return siteContent;
  }
}

async function handleCustomerAPI(request, customerContext, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  if (path === '/analytics/pageview' && request.method === 'POST') {
    return await recordPageview(request, customerContext, env);
  }
  
  if (path === '/optimize' && request.method === 'POST') {
    return await triggerOptimization(customerContext, env);
  }
  
  if (path === '/status') {
    return await getCustomerStatus(customerContext, env);
  }
  
  return new Response('API endpoint not found', { status: 404 });
}

async function serveCustomerAssets(assetPath, env) {
  try {
    const asset = await env.CUSTOMER_ASSETS.get(assetPath.replace('/assets/', ''));
    if (!asset) {
      return new Response('Asset not found', { status: 404 });
    }
    
    const contentType = getContentType(assetPath);
    return new Response(asset.body, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    return new Response('Asset error', { status: 500 });
  }
}

async function triggerOptimization(customerContext, env) {
  try {
    // Queue optimization job
    await env.OPTIMIZATION_QUEUE.send({
      customerId: customerContext.id,
      subdomain: customerContext.subdomain,
      type: 'website_optimization',
      priority: 'high',
      requestedAt: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Optimization queued',
      estimatedTime: '5-15 minutes'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Optimization failed to queue'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function recordPageview(request, customerContext, env) {
  try {
    const data = await request.json();
    
    // Store in analytics
    if (env.CUSTOMER_ANALYTICS) {
      env.CUSTOMER_ANALYTICS.writeDataPoint({
        blobs: ['pageview', data.page],
        doubles: [1],
        indexes: [customerContext.id]
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function recordAnalytics(request, response, customerContext, env) {
  try {
    if (env.CUSTOMER_ANALYTICS) {
      env.CUSTOMER_ANALYTICS.writeDataPoint({
        blobs: ['request', request.method, response.status.toString()],
        doubles: [1],
        indexes: [customerContext.id]
      });
    }
  } catch (error) {
    console.error('Analytics recording error:', error);
  }
}

async function getCustomerStatus(customerContext, env) {
  const status = {
    customer: customerContext.id,
    subdomain: customerContext.subdomain,
    plan: customerContext.plan,
    features: CUSTOMER_CONFIG.features,
    lastOptimized: customerContext.lastOptimized,
    eliteWorkers: CUSTOMER_CONFIG.eliteWorkersEnabled,
    analytics: CUSTOMER_CONFIG.analyticsEnabled,
    optimization: CUSTOMER_CONFIG.optimizationEnabled
  };
  
  return new Response(JSON.stringify(status, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function applyCachedOptimizations(siteContent, optimizations) {
  // Apply cached Elite Worker optimizations
  let optimizedContent = siteContent;
  
  if (optimizations.brand) {
    // Apply brand optimizations
    optimizedContent = optimizedContent.replace(
      /<title>([^<]*)<\/title>/,
      `<title>${optimizations.brand.optimizedTitle || '$1'}</title>`
    );
  }
  
  if (optimizations.design) {
    // Apply design optimizations
    const designCSS = optimizations.design.css || '';
    optimizedContent = optimizedContent.replace(
      '</head>',
      `<style>${designCSS}</style></head>`
    );
  }
  
  return optimizedContent;
}

function getContentType(path) {
  const ext = path.split('.').pop();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}