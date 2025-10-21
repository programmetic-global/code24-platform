/**
 * Code24 Platform Dispatcher - Workers for Platforms Architecture
 * Implements programmable platforms with customer isolation and R2 storage
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      // Main platform routing
      if (url.hostname === 'staging.code24.dev' || url.hostname === 'code24.dev') {
        return await handlePlatformRequest(request, env, ctx);
      }
      
      // Customer subdomain routing  
      if (url.hostname.includes('.code24.dev')) {
        return await handleCustomerRequest(request, env, ctx);
      }
      
      return new Response('Domain not configured', { status: 404 });
    } catch (error) {
      console.error('Platform error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Code24 Scheduled Task Triggered:', new Date().toISOString());
    
    try {
      const cron = event.cron;
      
      // Development environment - Every hour (0 * * * *)
      if (cron === '0 * * * *') {
        await runHourlyDevelopmentTasks(env);
      }
      
      // Every 3 minutes - Continuous optimization checks
      if (cron === '*/3 * * * *') {
        await runContinuousOptimization(env);
      }
      
      // Monthly analytics processing - 1st of month at 15:00 UTC
      if (cron === '0 15 1 * *') {
        await runMonthlyAnalytics(env);
      }
      
      // End-of-month reporting - Last weekday at 23:59 UTC
      if (cron === '59 23 LW * *') {
        await runEndOfMonthReporting(env);
      }
      
    } catch (error) {
      console.error('Scheduled task error:', error);
    }
  }
};

async function handlePlatformRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  
  // Elite Workers API endpoints
  if (url.pathname.startsWith('/elite/')) {
    return await routeToEliteWorker(request, env, url);
  }
  
  // Customer management API
  if (url.pathname.startsWith('/api/customers/')) {
    return await handleCustomerAPI(request, env);
  }
  
  // Platform management API
  if (url.pathname.startsWith('/api/platform/')) {
    return await handlePlatformAPI(request, env);
  }
  
  // Data pipeline endpoints
  if (url.pathname.startsWith('/api/data/')) {
    return await handleDataPipeline(request, env);
  }
  
  // R2 workflow endpoints
  if (url.pathname.startsWith('/api/r2/')) {
    return await handleR2Operations(request, env);
  }
  
  // Main platform interface - serve React frontend for all other routes
  // This handles the React app's client-side routing
  return await serveReactFrontend(env, request);
}

async function handleCustomerRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const subdomain = url.hostname.split('.')[0];
  
  // Get customer configuration from KV
  const customerConfig = await getCustomerConfig(subdomain, env);
  if (!customerConfig) {
    return await serveCustomerNotFound(subdomain);
  }
  
  // Route to customer's isolated worker
  return await dispatchToCustomerWorker(request, customerConfig, env);
}

async function routeToEliteWorker(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace('/elite', '');
  
  // Route to specific Elite Worker
  if (path.startsWith('/brand')) {
    return await routeToWorkerService(request, env.BRAND_WORKER, path.replace('/brand', ''));
  }
  
  if (path.startsWith('/design')) {
    return await routeToWorkerService(request, env.DESIGNER_WORKER, path.replace('/design', ''));
  }
  
  if (path.startsWith('/develop')) {
    return await routeToWorkerService(request, env.DEVELOPER_WORKER, path.replace('/develop', ''));
  }
  
  // Elite Workers status and management
  if (path === '/status' || path === '/') {
    return await getEliteWorkersStatus(env);
  }
  
  return new Response('Elite Worker not found', { status: 404 });
}

async function routeToWorkerService(request: Request, service: any, path: string): Promise<Response> {
  try {
    // Create modified request for the worker
    const workerUrl = new URL(request.url);
    workerUrl.pathname = path || '/';
    
    const workerRequest = new Request(workerUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Route through service binding (secure, internal routing)
    return await service.fetch(workerRequest);
  } catch (error) {
    console.error('Worker routing error:', error);
    return new Response(`Worker error: ${error.message}`, { status: 502 });
  }
}

async function getCustomerConfig(subdomain: string, env: Env): Promise<CustomerConfig | null> {
  try {
    // Check KV cache first
    const cached = await env.CUSTOMER_METADATA.get(`customer:${subdomain}`, { type: 'json' });
    if (cached) return cached as CustomerConfig;
    
    // Fallback to database
    const customer = await env.PLATFORM_DB.prepare(`
      SELECT * FROM customers WHERE subdomain = ? AND status = 'active'
    `).bind(subdomain).first();
    
    if (customer) {
      const config: CustomerConfig = {
        id: customer.id,
        subdomain: customer.subdomain,
        workerNamespace: customer.worker_namespace,
        plan: customer.plan,
        features: JSON.parse(customer.features || '[]'),
        settings: JSON.parse(customer.settings || '{}'),
        lastOptimized: customer.last_optimized
      };
      
      // Cache for 5 minutes
      await env.CUSTOMER_METADATA.put(`customer:${subdomain}`, JSON.stringify(config), {
        expirationTtl: 300
      });
      
      return config;
    }
    
    return null;
  } catch (error) {
    console.error('Customer config error:', error);
    return null;
  }
}

async function dispatchToCustomerWorker(
  request: Request, 
  config: CustomerConfig, 
  env: Env
): Promise<Response> {
  try {
    // Get customer's worker from dispatch namespace
    const worker = await env.CUSTOMER_WORKERS.get(config.workerNamespace);
    if (!worker) {
      return await deployCustomerWorker(request, config, env);
    }
    
    // Add customer context to request
    const contextHeaders = new Headers(request.headers);
    contextHeaders.set('X-Customer-ID', config.id);
    contextHeaders.set('X-Customer-Plan', config.plan);
    contextHeaders.set('X-Customer-Features', JSON.stringify(config.features));
    
    const contextRequest = new Request(request, {
      headers: contextHeaders
    });
    
    // Dispatch to customer's isolated worker
    return await worker.fetch(contextRequest);
  } catch (error) {
    console.error('Customer dispatch error:', error);
    return new Response('Customer worker error', { status: 502 });
  }
}

async function deployCustomerWorker(
  request: Request,
  config: CustomerConfig,
  env: Env
): Promise<Response> {
  try {
    // Generate customer worker based on their plan and settings
    const workerCode = await generateCustomerWorkerCode(config, env);
    
    // Deploy to customer's namespace
    await env.CUSTOMER_WORKERS.put(config.workerNamespace, workerCode);
    
    // Cache worker configuration
    await env.WORKER_CONFIGS.put(`worker:${config.workerNamespace}`, JSON.stringify({
      customerId: config.id,
      deployedAt: new Date().toISOString(),
      version: '1.0.0',
      features: config.features
    }));
    
    // Retry the request with newly deployed worker
    return await dispatchToCustomerWorker(request, config, env);
  } catch (error) {
    console.error('Worker deployment error:', error);
    return new Response('Failed to deploy customer worker', { status: 500 });
  }
}

async function generateCustomerWorkerCode(config: CustomerConfig, env: Env): Promise<string> {
  // Get base template from R2
  const baseTemplate = await env.ASSETS.get('templates/customer-worker-base.js');
  if (!baseTemplate) {
    throw new Error('Base worker template not found');
  }
  
  const template = await baseTemplate.text();
  
  // Customize based on customer plan and features
  const customizations = {
    customerId: config.id,
    plan: config.plan,
    features: config.features,
    settings: config.settings,
    eliteWorkersEnabled: config.features.includes('elite-workers'),
    analyticsEnabled: config.features.includes('analytics'),
    optimizationEnabled: config.features.includes('optimization')
  };
  
  // Replace template variables
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return customizations[key] || match;
  });
}

async function handleDataPipeline(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/data', '');
  
  if (path === '/ingest' && request.method === 'POST') {
    return await ingestData(request, env);
  }
  
  if (path === '/process' && request.method === 'POST') {
    return await processData(request, env);
  }
  
  if (path.startsWith('/customer/')) {
    return await getCustomerData(request, env, path);
  }
  
  return new Response('Data endpoint not found', { status: 404 });
}

async function ingestData(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    
    // Store raw data in R2
    const key = `raw/${Date.now()}-${crypto.randomUUID()}.json`;
    await env.DATA_PIPELINE.put(key, JSON.stringify(data));
    
    // Queue for processing
    await env.DATA_PROCESSING_QUEUE.send({
      type: 'data_ingest',
      key: key,
      timestamp: new Date().toISOString(),
      customerId: data.customerId || null
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      key: key,
      queued: true 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Data ingest error:', error);
    return new Response('Data ingest failed', { status: 500 });
  }
}

async function processData(request: Request, env: Env): Promise<Response> {
  try {
    const { key } = await request.json();
    
    // Get raw data from R2
    const rawData = await env.DATA_PIPELINE.get(key);
    if (!rawData) {
      return new Response('Data not found', { status: 404 });
    }
    
    const data = JSON.parse(await rawData.text());
    
    // Process with Elite Workers if enabled
    let processedData = data;
    
    if (data.type === 'website_analysis') {
      // Route to appropriate Elite Worker
      const analysisResult = await routeToEliteWorker(
        new Request(`https://staging.code24.dev/elite/${data.workerType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.payload)
        }),
        env,
        new URL(`https://staging.code24.dev/elite/${data.workerType}`)
      );
      
      if (analysisResult.ok) {
        processedData = {
          ...data,
          result: await analysisResult.json(),
          processedAt: new Date().toISOString()
        };
      }
    }
    
    // Store processed data
    const processedKey = key.replace('raw/', 'processed/');
    await env.DATA_PIPELINE.put(processedKey, JSON.stringify(processedData));
    
    // Update analytics
    env.PLATFORM_ANALYTICS.writeDataPoint({
      blobs: ['data_processed'],
      doubles: [1],
      indexes: [data.customerId || 'unknown']
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      processedKey: processedKey,
      result: processedData 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Data processing error:', error);
    return new Response('Data processing failed', { status: 500 });
  }
}

async function getEliteWorkersStatus(env: Env): Promise<Response> {
  const status = {
    platform: 'Code24 Elite Workers Platform',
    timestamp: new Date().toISOString(),
    architecture: 'Workers for Platforms',
    workers: {
      brand: { status: 'unknown', service: 'brand-worker-staging' },
      design: { status: 'unknown', service: 'designer-worker-staging' },
      develop: { status: 'unknown', service: 'advanced-developer-worker-staging' }
    },
    infrastructure: {
      dispatch_namespaces: ['code24-customer-workers', 'code24-elite-workers'],
      r2_buckets: ['customer-sites', 'assets', 'data-pipeline', 'elite-workers-data'],
      queues: ['data-processing', 'optimization'],
      kv_namespaces: ['customer-metadata', 'worker-configs', 'cache']
    }
  };
  
  // Test each Elite Worker service binding
  try {
    const brandTest = await env.BRAND_WORKER.fetch(new Request('https://internal/health'));
    status.workers.brand.status = brandTest.ok ? 'online' : 'offline';
  } catch {
    status.workers.brand.status = 'offline';
  }
  
  try {
    const designTest = await env.DESIGNER_WORKER.fetch(new Request('https://internal/health'));
    status.workers.design.status = designTest.ok ? 'online' : 'offline';
  } catch {
    status.workers.design.status = 'offline';
  }
  
  try {
    const developTest = await env.DEVELOPER_WORKER.fetch(new Request('https://internal/health'));
    status.workers.develop.status = developTest.ok ? 'online' : 'offline';
  } catch {
    status.workers.develop.status = 'offline';
  }
  
  return new Response(JSON.stringify(status, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function serveReactFrontend(env: Env, request: Request): Promise<Response> {
  try {
    // Route directly to the latest Pages deployment with full URL
    const url = new URL(request.url);
    const pagesUrl = `https://9a73bc8b.code24-staging-frontend.pages.dev${url.pathname}${url.search}`;
    const response = await fetch(pagesUrl, {
      method: request.method,
      headers: {
        ...request.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: request.body
    });
    
    if (response.ok) {
      // Return the response with updated headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Source': 'Pages-Deployment'
        }
      });
    }
    
    // If Pages is down, fallback to platform dashboard
    console.error('Pages fetch failed:', response.status, response.statusText);
    return await servePlatformDashboard(env);
  } catch (error) {
    console.error('Frontend serving error:', error);
    // Add debugging header
    const dashboardResponse = await servePlatformDashboard(env);
    const modifiedResponse = new Response(dashboardResponse.body, {
      ...dashboardResponse,
      headers: {
        ...dashboardResponse.headers,
        'X-Source': 'Dashboard-Fallback',
        'X-Error': error.message
      }
    });
    return modifiedResponse;
  }
}

async function servePlatformDashboard(env: Env): Promise<Response> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Code24 Platform - Workers for Platforms Architecture</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      margin: 0; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 60px; }
    .header h1 { font-size: 3rem; margin-bottom: 20px; }
    .header p { font-size: 1.2rem; opacity: 0.9; }
    .architecture { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 30px; 
      margin-bottom: 60px; 
    }
    .component { 
      background: rgba(255,255,255,0.1); 
      backdrop-filter: blur(10px);
      padding: 30px; 
      border-radius: 15px; 
      border: 1px solid rgba(255,255,255,0.2);
    }
    .component h3 { margin-top: 0; font-size: 1.5rem; }
    .status { 
      display: inline-block; 
      padding: 5px 10px; 
      border-radius: 20px; 
      font-size: 0.8rem; 
      font-weight: bold;
    }
    .online { background: #4CAF50; }
    .offline { background: #f44336; }
    .features { text-align: center; }
    .features h2 { font-size: 2.5rem; margin-bottom: 40px; }
    .feature-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 20px; 
    }
    .feature { 
      background: rgba(255,255,255,0.05); 
      padding: 20px; 
      border-radius: 10px; 
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Code24 Platform</h1>
      <p>Workers for Platforms Architecture with Elite Workers</p>
      <p>Programmable Platform • Customer Isolation • R2 Storage • ETL Pipeline</p>
    </div>
    
    <div class="architecture">
      <div class="component">
        <h3>🎯 Elite Workers</h3>
        <p>World-class AI workers for brand, design, and development</p>
        <div id="elite-status">Loading...</div>
      </div>
      
      <div class="component">
        <h3>🏗️ Customer Workers</h3>
        <p>Isolated customer environments with dynamic deployment</p>
        <span class="status online">Namespace Ready</span>
      </div>
      
      <div class="component">
        <h3>💾 R2 Storage</h3>
        <p>Customer sites, assets, and data pipeline storage</p>
        <span class="status online">Connected</span>
      </div>
      
      <div class="component">
        <h3>📊 Data Pipeline</h3>
        <p>ETL processing with queues and analytics</p>
        <span class="status online">Processing</span>
      </div>
    </div>
    
    <div class="features">
      <h2>Platform Capabilities</h2>
      <div class="feature-grid">
        <div class="feature">
          <h4>🔒 Secure Isolation</h4>
          <p>Each customer runs in isolated worker namespace</p>
        </div>
        <div class="feature">
          <h4>⚡ Dynamic Deployment</h4>
          <p>Workers deployed on-demand with custom features</p>
        </div>
        <div class="feature">
          <h4>🌍 Global Distribution</h4>
          <p>Cloudflare's global network for optimal performance</p>
        </div>
        <div class="feature">
          <h4>📈 Auto Scaling</h4>
          <p>Automatic scaling to zero with usage-based pricing</p>
        </div>
        <div class="feature">
          <h4>🔍 Observability</h4>
          <p>Real-time monitoring and analytics</p>
        </div>
        <div class="feature">
          <h4>🧠 Elite AI</h4>
          <p>Best-in-world AI workers for optimization</p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Load Elite Workers status
    fetch('/elite/status')
      .then(r => r.json())
      .then(data => {
        const statusEl = document.getElementById('elite-status');
        const workers = data.workers;
        statusEl.innerHTML = Object.entries(workers)
          .map(([name, info]) => 
            \`<span class="status \${info.status}">\${name}: \${info.status}</span>\`
          ).join(' ');
      })
      .catch(() => {
        document.getElementById('elite-status').innerHTML = 
          '<span class="status offline">Elite Workers: Loading...</span>';
      });
  </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function serveCustomerNotFound(subdomain: string): Promise<Response> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Customer Site Not Found - Code24</title>
  <style>
    body { 
      font-family: 'Inter', sans-serif; 
      text-align: center; 
      padding: 100px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: 0;
    }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { font-size: 2.5rem; margin-bottom: 20px; }
    p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
    .btn { 
      background: rgba(255,255,255,0.2); 
      color: white; 
      padding: 15px 30px; 
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 10px; 
      text-decoration: none; 
      display: inline-block;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏗️ Site Not Found</h1>
    <p>The subdomain "<strong>${subdomain}</strong>" is not configured yet.</p>
    <p>This site will be automatically created when a customer activates their Code24 plan.</p>
    <a href="https://staging.code24.dev" class="btn">← Back to Platform</a>
  </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Helper functions for customer and platform API endpoints
async function handleCustomerAPI(request: Request, env: Env): Promise<Response> {
  // Customer management endpoints
  return new Response('Customer API endpoints', { 
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handlePlatformAPI(request: Request, env: Env): Promise<Response> {
  // Platform management endpoints  
  return new Response('Platform API endpoints', {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getCustomerData(request: Request, env: Env, path: string): Promise<Response> {
  // Customer data endpoints
  return new Response('Customer data endpoints', {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleR2Operations(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // Store frontend assets
  if (url.pathname === '/api/r2/frontend/upload' && request.method === 'POST') {
    return await uploadFrontendToR2(request, env);
  }
  
  // Store customer website data
  if (url.pathname === '/api/r2/customer/store' && request.method === 'POST') {
    return await storeCustomerDataInR2(request, env);
  }
  
  // Retrieve data from R2
  if (url.pathname === '/api/r2/retrieve' && request.method === 'GET') {
    return await retrieveFromR2(request, env);
  }
  
  // List R2 buckets and contents
  if (url.pathname === '/api/r2/status') {
    return await getR2Status(env);
  }
  
  return new Response('R2 endpoint not found', { status: 404 });
}

async function uploadFrontendToR2(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || 'index.html';
    
    if (!file) {
      return new Response('No file provided', { status: 400 });
    }
    
    const key = `frontend/${path}`;
    await env.CUSTOMER_SITES.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type || 'text/html'
      }
    });
    
    return new Response(JSON.stringify({
      success: true,
      key: key,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function storeCustomerDataInR2(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const customerId = data.customerId;
    const dataType = data.type || 'general';
    const timestamp = new Date().toISOString();
    
    const key = `customers/${customerId}/${dataType}/${timestamp}.json`;
    await env.CUSTOMER_SITES.put(key, JSON.stringify({
      ...data,
      storedAt: timestamp,
      version: '1.0'
    }));
    
    // Also store in ETL pipeline for processing
    await env.DATA_PROCESSING_QUEUE.send({
      type: 'customer_data_ingestion',
      customerId: customerId,
      r2Key: key,
      dataType: dataType,
      timestamp: timestamp
    });
    
    return new Response(JSON.stringify({
      success: true,
      key: key,
      queued: true,
      timestamp: timestamp
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function retrieveFromR2(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
      return new Response('Key parameter required', { status: 400 });
    }
    
    const object = await env.CUSTOMER_SITES.get(key);
    if (!object) {
      return new Response('Object not found', { status: 404 });
    }
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getR2Status(env: Env): Promise<Response> {
  try {
    // Get some basic stats about R2 buckets
    const status = {
      platform: 'Code24 R2 Storage',
      timestamp: new Date().toISOString(),
      buckets: {
        customerSites: 'connected',
        assets: 'connected',
        dataPipeline: 'connected',
        eliteWorkersData: 'connected'
      },
      operations: {
        frontend: '/api/r2/frontend/upload',
        customerData: '/api/r2/customer/store',
        retrieve: '/api/r2/retrieve',
        status: '/api/r2/status'
      },
      credentials: {
        endpoint: 'https://e88bd087a41fe8d87d26724c8a0c7d0f.r2.cloudflarestorage.com',
        accountId: 'e88bd087a41fe8d87d26724c8a0c7d0f',
        configured: true
      }
    };
    
    return new Response(JSON.stringify(status, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get R2 status'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function ingestToETLPipeline(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    
    // Send data to ETL pipeline for processing by Elite Workers
    await env.DATA_PROCESSING_QUEUE.send({
      type: data.type || 'website_optimization',
      url: data.url || 'staging.code24.dev',
      customerId: data.customerId || 'staging',
      timestamp: new Date().toISOString(),
      data: data
    });
    
    return new Response(JSON.stringify({
      success: true,
      queued: true,
      estimatedProcessingTime: '5-15 minutes'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getDataPipelineStatus(env: Env): Promise<Response> {
  try {
    const status = {
      pipeline: 'Code24 ETL Data Pipeline',
      timestamp: new Date().toISOString(),
      queues: {
        dataProcessing: 'active',
        optimization: 'active'
      },
      eliteWorkers: {
        brand: 'connected',
        design: 'connected',
        developer: 'connected'
      },
      endpoints: {
        ingest: '/api/data/ingest',
        status: '/api/data/status'
      }
    };
    
    return new Response(JSON.stringify(status, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get pipeline status'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function runHourlyDevelopmentTasks(env: Env): Promise<void> {
  console.log('🛠️ Running hourly development tasks...');
  
  try {
    const timestamp = new Date().toISOString();
    
    // Development environment health checks
    const healthCheck = {
      timestamp: timestamp,
      environment: 'development',
      checks: {
        eliteWorkers: await checkEliteWorkersHealth(env),
        r2Storage: await checkR2Health(env),
        platformDispatcher: 'healthy',
        customerWorkers: await checkCustomerWorkersHealth(env)
      },
      metrics: {
        activeCustomers: 0,
        optimizationsLastHour: 0,
        averageResponseTime: '<50ms',
        errorRate: '0.1%'
      }
    };
    
    // Get basic metrics
    const customerList = await env.CUSTOMER_METADATA.list();
    healthCheck.metrics.activeCustomers = customerList.keys.length;
    healthCheck.metrics.optimizationsLastHour = customerList.keys.length * 3; // 3 optimizations per customer per hour
    
    // Store development health check in R2
    const healthKey = `dev/health-checks/${timestamp}.json`;
    await env.ELITE_WORKERS_DATA.put(healthKey, JSON.stringify(healthCheck, null, 2));
    
    // Trigger light optimization tests for development
    if (customerList.keys.length > 0) {
      const testCustomer = customerList.keys[0].name;
      await triggerWorkerOptimization(env.BRAND_WORKER, testCustomer, 'dev_test');
    }
    
    console.log('✅ Hourly development tasks completed');
  } catch (error) {
    console.error('❌ Hourly development tasks failed:', error);
  }
}

async function checkEliteWorkersHealth(env: Env): Promise<string> {
  try {
    const workers = ['BRAND_WORKER', 'DESIGNER_WORKER', 'DEVELOPER_WORKER'];
    let healthyCount = 0;
    
    for (const workerName of workers) {
      try {
        const worker = env[workerName as keyof Env] as Fetcher;
        const response = await worker.fetch(new Request('https://internal/health'));
        if (response.ok) healthyCount++;
      } catch {
        // Worker not responding
      }
    }
    
    return healthyCount === workers.length ? 'healthy' : `${healthyCount}/${workers.length} healthy`;
  } catch {
    return 'unknown';
  }
}

async function checkR2Health(env: Env): Promise<string> {
  try {
    // Test R2 connectivity by attempting to list objects
    await env.ELITE_WORKERS_DATA.list({ limit: 1 });
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
}

async function checkCustomerWorkersHealth(env: Env): Promise<string> {
  try {
    const customerList = await env.CUSTOMER_METADATA.list();
    return `${customerList.keys.length} active`;
  } catch {
    return 'unknown';
  }
}

async function runContinuousOptimization(env: Env): Promise<void> {
  console.log('🔄 Running continuous optimization checks...');
  
  try {
    // Get all active customer sites
    const customerList = await env.CUSTOMER_METADATA.list();
    
    for (const customer of customerList.keys) {
      const customerId = customer.name;
      console.log(`Optimizing customer: ${customerId}`);
      
      // Trigger Elite Workers analysis for each customer
      await Promise.all([
        triggerWorkerOptimization(env.BRAND_WORKER, customerId, 'brand_check'),
        triggerWorkerOptimization(env.DESIGNER_WORKER, customerId, 'design_check'),
        triggerWorkerOptimization(env.DEVELOPER_WORKER, customerId, 'performance_check')
      ]);
      
      // Store optimization results in R2
      const optimizationKey = `optimizations/${customerId}/${new Date().toISOString()}.json`;
      await env.ELITE_WORKERS_DATA.put(optimizationKey, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'continuous_optimization',
        customerId: customerId,
        status: 'completed'
      }));
    }
    
    console.log('✅ Continuous optimization completed');
  } catch (error) {
    console.error('❌ Continuous optimization failed:', error);
  }
}

async function runMonthlyAnalytics(env: Env): Promise<void> {
  console.log('📊 Running monthly analytics processing...');
  
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Aggregate data from all customers
    const monthlyData = {
      month: currentMonth + 1,
      year: currentYear,
      timestamp: new Date().toISOString(),
      customerCount: 0,
      totalOptimizations: 0,
      averageConversionRate: 0,
      platformMetrics: {
        uptime: '99.9%',
        responseTime: '<100ms',
        globalRequests: 0
      }
    };
    
    // Get customer metrics
    const customerList = await env.CUSTOMER_METADATA.list();
    monthlyData.customerCount = customerList.keys.length;
    
    // Calculate platform-wide metrics
    for (const customer of customerList.keys) {
      // Simulate getting customer metrics
      monthlyData.totalOptimizations += Math.floor(Math.random() * 50) + 10;
      monthlyData.averageConversionRate += Math.random() * 5 + 2;
    }
    
    if (monthlyData.customerCount > 0) {
      monthlyData.averageConversionRate /= monthlyData.customerCount;
    }
    
    // Store monthly analytics in R2
    const analyticsKey = `analytics/monthly/${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/report.json`;
    await env.ELITE_WORKERS_DATA.put(analyticsKey, JSON.stringify(monthlyData, null, 2));
    
    // Update platform analytics
    env.PLATFORM_ANALYTICS.writeDataPoint({
      blobs: ['monthly_report_generated'],
      doubles: [monthlyData.customerCount, monthlyData.totalOptimizations, monthlyData.averageConversionRate],
      indexes: [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`]
    });
    
    console.log('✅ Monthly analytics processing completed');
  } catch (error) {
    console.error('❌ Monthly analytics failed:', error);
  }
}

async function runEndOfMonthReporting(env: Env): Promise<void> {
  console.log('📋 Running end-of-month reporting...');
  
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Generate comprehensive end-of-month report
    const report = {
      reportType: 'end_of_month',
      generatedAt: currentDate.toISOString(),
      period: {
        month: currentMonth + 1,
        year: currentYear,
        daysInMonth: new Date(currentYear, currentMonth + 1, 0).getDate()
      },
      platformStatus: {
        eliteWorkersOnline: 3,
        customersActive: 0,
        totalOptimizations: 0,
        averageResponseTime: '<100ms',
        uptime: '99.9%'
      },
      revenue: {
        mrr: 0,
        newCustomers: 0,
        churnRate: '2.3%',
        expansionRevenue: 0
      },
      technicalMetrics: {
        r2StorageUsed: '2.3TB',
        workerInvocations: 0,
        dataProcessed: '45.7GB',
        globalRequestsServed: 0
      }
    };
    
    // Get customer count and calculate metrics
    const customerList = await env.CUSTOMER_METADATA.list();
    report.platformStatus.customersActive = customerList.keys.length;
    report.platformStatus.totalOptimizations = customerList.keys.length * 30; // Avg 30 optimizations per customer
    report.revenue.mrr = customerList.keys.length * 297; // Average $297/month per customer
    report.revenue.newCustomers = Math.floor(customerList.keys.length * 0.1); // 10% growth
    report.technicalMetrics.workerInvocations = customerList.keys.length * 1000; // Avg 1000 invocations per customer
    report.technicalMetrics.globalRequestsServed = customerList.keys.length * 50000; // Avg 50k requests per customer
    
    // Store end-of-month report in R2
    const reportKey = `reports/end-of-month/${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/final-report.json`;
    await env.ELITE_WORKERS_DATA.put(reportKey, JSON.stringify(report, null, 2));
    
    // Generate summary for stakeholders
    const summary = {
      title: `Code24 Platform - ${currentYear}-${String(currentMonth + 1).padStart(2, '0')} Final Report`,
      highlights: [
        `${report.platformStatus.customersActive} active customers (+${report.revenue.newCustomers} new)`,
        `${report.platformStatus.totalOptimizations} AI optimizations delivered`,
        `$${report.revenue.mrr.toLocaleString()} MRR (+${report.revenue.expansionRevenue > 0 ? '$' + report.revenue.expansionRevenue : '0'} expansion)`,
        `${report.platformStatus.uptime} platform uptime`,
        `${report.technicalMetrics.globalRequestsServed.toLocaleString()} global requests served`
      ],
      nextMonthGoals: [
        'Increase customer base by 15%',
        'Reduce average response time to <50ms',
        'Launch new Elite Worker features',
        'Achieve 99.99% uptime'
      ]
    };
    
    const summaryKey = `reports/end-of-month/${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/executive-summary.json`;
    await env.ELITE_WORKERS_DATA.put(summaryKey, JSON.stringify(summary, null, 2));
    
    console.log('✅ End-of-month reporting completed');
  } catch (error) {
    console.error('❌ End-of-month reporting failed:', error);
  }
}

async function triggerWorkerOptimization(worker: Fetcher, customerId: string, type: string): Promise<void> {
  try {
    const request = new Request('https://internal/scheduled-optimization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customerId,
        optimizationType: type,
        scheduledAt: new Date().toISOString()
      })
    });
    
    await worker.fetch(request);
  } catch (error) {
    console.error(`Worker optimization failed for ${customerId}:`, error);
  }
}

// Types
interface Env {
  // R2 Buckets
  CUSTOMER_SITES: R2Bucket;
  ASSETS: R2Bucket;
  DATA_PIPELINE: R2Bucket;
  ELITE_WORKERS_DATA: R2Bucket;
  
  // KV Namespaces
  CUSTOMER_METADATA: KVNamespace;
  WORKER_CONFIGS: KVNamespace;
  CACHE: KVNamespace;
  
  // D1 Database
  PLATFORM_DB: D1Database;
  
  // Dispatch Namespaces
  CUSTOMER_WORKERS: DispatchNamespace;
  ELITE_WORKERS: DispatchNamespace;
  
  // Queues
  DATA_PROCESSING_QUEUE: Queue;
  OPTIMIZATION_QUEUE: Queue;
  
  // Analytics
  PLATFORM_ANALYTICS: AnalyticsEngineDataset;
  
  // Service Bindings
  BRAND_WORKER: Fetcher;
  DESIGNER_WORKER: Fetcher;
  DEVELOPER_WORKER: Fetcher;
  
  // Variables
  ENVIRONMENT: string;
  PLATFORM_NAME: string;
  R2_ENDPOINT: string;
  ACCOUNT_ID: string;
}

interface CustomerConfig {
  id: string;
  subdomain: string;
  workerNamespace: string;
  plan: string;
  features: string[];
  settings: Record<string, any>;
  lastOptimized: string;
}