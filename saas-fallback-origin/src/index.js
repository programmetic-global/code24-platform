/**
 * Code24 SaaS Fallback Origin Worker
 * Routes custom hostname traffic to appropriate customer sites
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    try {
      // Get custom domain info from SaaS domains KV
      const domainInfo = await env.SAAS_DOMAINS.get(`domain:${hostname}`);
      
      if (domainInfo) {
        const domain = JSON.parse(domainInfo);
        const customerId = domain.customerId;
        
        // Get customer metadata
        const customerData = await env.METADATA.get(`customer:${customerId}`);
        
        if (customerData) {
          const customer = JSON.parse(customerData);
          const scriptName = customer.scriptName;
          
          // Route to customer's Worker via Workers for Platforms
          try {
            const customerWorker = env.CUSTOMER_SITES.get(scriptName);
            
            // Forward the request to the customer's Worker
            const response = await customerWorker.fetch(request);
            
            // Add SaaS headers
            const modifiedResponse = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: {
                ...response.headers,
                'X-Code24-SaaS': 'true',
                'X-Code24-Customer': customerId,
                'X-Code24-Domain': hostname
              }
            });
            
            return modifiedResponse;
            
          } catch (error) {
            console.error(`Failed to route to customer worker: ${error.message}`);
            return new Response('Service temporarily unavailable', { 
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          }
        }
      }
      
      // No custom domain found - serve default page
      return new Response(getDefaultPage(hostname), {
        headers: { 
          'Content-Type': 'text/html',
          'X-Code24-SaaS': 'fallback'
        }
      });
      
    } catch (error) {
      console.error(`SaaS routing error: ${error.message}`);
      return new Response('Internal server error', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

function getDefaultPage(hostname) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code24 - Domain Setup</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 600px;
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .domain { 
            font-family: monospace; 
            background: rgba(255,255,255,0.2); 
            padding: 0.5rem 1rem; 
            border-radius: 8px; 
            display: inline-block;
            margin: 1rem 0;
        }
        .cta {
            background: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            display: inline-block;
            margin-top: 2rem;
            transition: transform 0.2s;
        }
        .cta:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Code24</h1>
        <p>Your domain <span class="domain">${hostname}</span> is ready for setup!</p>
        <p>This domain will serve your AI-built website once configuration is complete.</p>
        <a href="https://code24.dev" class="cta">Complete Setup</a>
    </div>
</body>
</html>`;
}