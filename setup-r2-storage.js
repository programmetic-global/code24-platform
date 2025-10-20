/**
 * Code24 R2 Storage Setup Script
 * Configures R2 buckets and uploads templates using provided credentials
 */

import { S3Client, CreateBucketCommand, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

// R2 Configuration with provided credentials
const R2_CONFIG = {
  endpoint: 'https://e88bd087a41fe8d87d26724c8a0c7d0f.r2.cloudflarestorage.com',
  accessKeyId: '5d8dc36d43c9ad673318227bcd057b3b',
  secretAccessKey: '8e9a9a43c9ab9162a0302651f21bfc878a37244e73578a8fa946daee1d9eeb27',
  accountId: 'e88bd087a41fe8d87d26724c8a0c7d0f',
  region: 'auto'
};

// S3 Compatible Client for R2
const r2Client = new S3Client({
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey
  },
  region: R2_CONFIG.region
});

// Required buckets for Code24 platform
const REQUIRED_BUCKETS = [
  'code24-customer-sites',
  'code24-assets', 
  'code24-data-pipeline',
  'code24-processed-data',
  'code24-customer-assets',
  'code24-elite-workers-data',
  'code24-templates'
];

async function setupR2Storage() {
  console.log('🚀 Setting up Code24 R2 Storage...');
  console.log('Endpoint:', R2_CONFIG.endpoint);
  
  try {
    // List existing buckets
    console.log('\n📋 Checking existing buckets...');
    const listResponse = await r2Client.send(new ListBucketsCommand({}));
    const existingBuckets = listResponse.Buckets?.map(b => b.Name) || [];
    console.log('Existing buckets:', existingBuckets);
    
    // Create required buckets
    console.log('\n🪣 Creating required buckets...');
    for (const bucketName of REQUIRED_BUCKETS) {
      if (!existingBuckets.includes(bucketName)) {
        try {
          await r2Client.send(new CreateBucketCommand({ Bucket: bucketName }));
          console.log(`✅ Created bucket: ${bucketName}`);
        } catch (error) {
          if (error.Code === 'BucketAlreadyOwnedByYou') {
            console.log(`ℹ️  Bucket already exists: ${bucketName}`);
          } else {
            console.error(`❌ Failed to create ${bucketName}:`, error.message);
          }
        }
      } else {
        console.log(`ℹ️  Bucket already exists: ${bucketName}`);
      }
    }
    
    // Upload templates and assets
    await uploadTemplates();
    await uploadAssets();
    await setupCustomerExamples();
    
    console.log('\n🎉 R2 Storage setup complete!');
    console.log('\n📊 Storage Architecture:');
    console.log('├── code24-customer-sites     (Customer websites)');
    console.log('├── code24-assets            (Platform assets)');
    console.log('├── code24-data-pipeline     (Raw data for ETL)');
    console.log('├── code24-processed-data    (Processed ETL results)');
    console.log('├── code24-customer-assets   (Customer specific assets)');
    console.log('├── code24-elite-workers-data (Elite Workers data)');
    console.log('└── code24-templates         (Worker and site templates)');
    
  } catch (error) {
    console.error('❌ R2 Storage setup failed:', error);
    throw error;
  }
}

async function uploadTemplates() {
  console.log('\n📄 Uploading templates...');
  
  // Customer worker template
  const customerWorkerTemplate = `
// Customer Worker Template for Code24 Platform
export default {
  async fetch(request, env, ctx) {
    const customerId = '{{customerId}}';
    const plan = '{{plan}}';
    const features = {{features}};
    
    // Customer-specific routing and logic
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response(\`
        <!DOCTYPE html>
        <html>
        <head><title>{{customerId}} - Code24</title></head>
        <body>
          <h1>Welcome to {{customerId}}</h1>
          <p>Plan: {{plan}}</p>
          <p>Features: {{features}}</p>
          <p>Powered by Code24 Elite Workers</p>
        </body>
        </html>
      \`, { headers: { 'Content-Type': 'text/html' }});
    }
    
    return new Response('Page not found', { status: 404 });
  }
};`;
  
  await uploadFile('code24-templates', 'customer-worker-base.js', customerWorkerTemplate);
  
  // Default site template
  const defaultSiteTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{siteName}} - Powered by Code24</title>
  <style>
    body { 
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container { text-align: center; max-width: 600px; padding: 40px; }
    h1 { font-size: 3rem; margin-bottom: 20px; }
    p { font-size: 1.2rem; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 {{siteName}}</h1>
    <p>Your website is being optimized by Code24 Elite Workers</p>
    <p>{{description}}</p>
  </div>
</body>
</html>`;
  
  await uploadFile('code24-templates', 'default-site.html', defaultSiteTemplate);
  
  console.log('✅ Templates uploaded');
}

async function uploadAssets() {
  console.log('\n🎨 Uploading platform assets...');
  
  // CSS framework for customer sites
  const cssFramework = `
/* Code24 CSS Framework */
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #f44336;
  --text: #333;
  --bg: #fff;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.btn { 
  padding: 12px 24px; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.btn-primary { background: var(--primary); color: white; }
.btn-secondary { background: var(--secondary); color: white; }

.hero {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 100px 0;
  text-align: center;
}

.hero h1 { font-size: 3rem; margin-bottom: 20px; }
.hero p { font-size: 1.2rem; opacity: 0.9; }

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .hero p { font-size: 1rem; }
}`;
  
  await uploadFile('code24-assets', 'css/framework.css', cssFramework);
  
  // JavaScript utilities
  const jsUtilities = `
// Code24 JavaScript Utilities
window.Code24 = {
  analytics: {
    track: function(event, data) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
      }).catch(console.error);
    }
  },
  
  optimization: {
    trigger: function() {
      return fetch('/api/optimize', { method: 'POST' })
        .then(r => r.json())
        .then(result => {
          console.log('Optimization triggered:', result);
          return result;
        });
    }
  },
  
  eliteWorkers: {
    status: function() {
      return fetch('/elite/status').then(r => r.json());
    }
  }
};

// Auto-track page views
document.addEventListener('DOMContentLoaded', function() {
  Code24.analytics.track('pageview', {
    page: location.pathname,
    referrer: document.referrer
  });
});`;
  
  await uploadFile('code24-assets', 'js/code24-utils.js', jsUtilities);
  
  console.log('✅ Platform assets uploaded');
}

async function setupCustomerExamples() {
  console.log('\n👥 Setting up customer examples...');
  
  // Example customer site
  const exampleSite = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Customer - Code24</title>
  <link rel="stylesheet" href="/assets/css/framework.css">
</head>
<body>
  <div class="hero">
    <div class="container">
      <h1>🎯 Demo Customer</h1>
      <p>This is an example customer site powered by Code24 Elite Workers</p>
      <a href="#optimize" class="btn btn-primary" onclick="Code24.optimization.trigger()">
        Optimize with Elite Workers
      </a>
    </div>
  </div>
  
  <div class="container" style="padding: 60px 20px; text-align: center;">
    <h2>Features Enabled</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 40px 0;">
      <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h3>🎨 Elite Brand Worker</h3>
        <p>World-class brand optimization</p>
      </div>
      <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h3>🎯 Elite Designer Worker</h3>
        <p>Conversion-optimized design</p>
      </div>
      <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h3>🏆 Elite Developer Worker</h3>
        <p>Enterprise-grade development</p>
      </div>
    </div>
    
    <div id="status" style="margin: 40px 0;"></div>
  </div>
  
  <script src="/assets/js/code24-utils.js"></script>
  <script>
    // Load Elite Workers status
    Code24.eliteWorkers.status().then(status => {
      document.getElementById('status').innerHTML = \`
        <h3>Elite Workers Status</h3>
        <p>Brand: \${status.workers.brand.status}</p>
        <p>Design: \${status.workers.design.status}</p>
        <p>Development: \${status.workers.develop.status}</p>
      \`;
    });
  </script>
</body>
</html>`;
  
  await uploadFile('code24-customer-sites', 'demo/index.html', exampleSite);
  
  // Example processed data
  const exampleProcessedData = {
    customerId: 'demo',
    type: 'website_optimization',
    processedAt: new Date().toISOString(),
    results: {
      brand: { score: 85, improvements: ['Strengthen call-to-action', 'Improve value proposition'] },
      design: { score: 92, improvements: ['Add micro-interactions', 'Optimize color contrast'] },
      development: { score: 88, improvements: ['Improve Core Web Vitals', 'Add caching headers'] }
    }
  };
  
  await uploadFile('code24-processed-data', 'demo/optimization-results.json', JSON.stringify(exampleProcessedData, null, 2));
  
  console.log('✅ Customer examples created');
}

async function uploadFile(bucketName, key, content) {
  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
      ContentType: getContentType(key)
    }));
    console.log(`   📁 ${bucketName}/${key}`);
  } catch (error) {
    console.error(`   ❌ Failed to upload ${bucketName}/${key}:`, error.message);
  }
}

function getContentType(key) {
  const ext = key.split('.').pop();
  const types = {
    'html': 'text/html',
    'css': 'text/css', 
    'js': 'application/javascript',
    'json': 'application/json'
  };
  return types[ext] || 'text/plain';
}

// Run setup
if (import.meta.main) {
  setupR2Storage().catch(console.error);
}

export { setupR2Storage, R2_CONFIG };`;
  
// Create package.json for the setup script
const packageJson = {
  "name": "code24-r2-setup",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.400.0"
  }
};

await uploadFile('code24-templates', 'setup/package.json', JSON.stringify(packageJson, null, 2));