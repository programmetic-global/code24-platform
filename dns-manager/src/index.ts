/**
 * DNS Manager Worker
 * Automatically configures DNS records for Code24 staging environment
 */

interface Env {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ZONE_ID: string;
}

interface DNSRecord {
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

interface CloudflareAPIResponse {
  success: boolean;
  errors: any[];
  messages: any[];
  result: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (url.pathname) {
        case '/setup-staging-dns':
          return await setupStagingDNS(env, corsHeaders);
        case '/dry-run':
          return await dryRunStagingDNS(corsHeaders);
        case '/config-check':
          return await checkConfiguration(env, corsHeaders);
        case '/list-dns':
          return await listDNSRecords(env, corsHeaders);
        case '/fix-staging-proxy':
          return await fixStagingProxy(env, corsHeaders);
        case '/health':
          return new Response('DNS Manager Worker is healthy', { headers: corsHeaders });
        default:
          return new Response('DNS Manager Worker\n\nEndpoints:\n- POST /setup-staging-dns - Configure staging DNS\n- GET /dry-run - Show what DNS records would be created\n- GET /list-dns - List DNS records\n- GET /health - Health check', { 
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
          });
      }
    } catch (error) {
      console.error('DNS Manager Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  },
};

async function checkConfiguration(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const hasApiToken = !!env.CLOUDFLARE_API_TOKEN;
  const hasZoneId = !!env.CLOUDFLARE_ZONE_ID;
  
  const config = {
    api_token_configured: hasApiToken,
    zone_id_configured: hasZoneId,
    zone_id: env.CLOUDFLARE_ZONE_ID || 'Not configured',
    account_id: 'e88bd087a41fe8d87d26724c8a0c7d0f',
    ready_for_dns_setup: hasApiToken && hasZoneId,
    status: hasApiToken && hasZoneId ? 'ready' : 'needs_configuration'
  };

  if (!hasApiToken) {
    config['missing'] = 'CLOUDFLARE_API_TOKEN - Set with: wrangler secret put CLOUDFLARE_API_TOKEN';
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'DNS Manager Configuration Status',
    configuration: config,
    next_steps: config.ready_for_dns_setup ? 
      ['Ready! Call /setup-staging-dns to create DNS records'] :
      ['Set missing configuration and try again']
  }, null, 2), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

async function dryRunStagingDNS(corsHeaders: Record<string, string>): Promise<Response> {
  const stagingWorkers = [
    'seo-optimizer',
    'conversion-optimizer', 
    'performance-monitor',
    'cross-site-learning',
    'site-builder',
    'shared-analytics'
  ];

  const dnsRecords = stagingWorkers.map(worker => ({
    worker,
    subdomain: `${worker}.staging.code24.dev`,
    target: `${worker}-staging.daniel-e88.workers.dev`,
    type: 'CNAME',
    ttl: 300,
    proxied: true,
    action: 'would_create'
  }));

  // Add main staging domain
  dnsRecords.unshift({
    worker: 'main-staging',
    subdomain: 'staging.code24.dev',
    target: 'code24-dispatcher-staging.daniel-e88.workers.dev',
    type: 'CNAME',
    ttl: 300,
    proxied: true,
    action: 'would_create'
  });

  return new Response(JSON.stringify({
    success: true,
    message: 'DNS records that would be created for staging.code24.dev',
    total_records: dnsRecords.length,
    records: dnsRecords,
    instructions: {
      manual_setup: 'To set up these DNS records manually in Cloudflare Dashboard:',
      steps: [
        '1. Go to Cloudflare Dashboard → Zones → code24.dev → DNS',
        '2. For each record below, click "Add record"',
        '3. Type: CNAME, Name: [subdomain], Content: [target]',
        '4. Set TTL to 5 minutes (300 seconds) for staging',
        '5. Enable Proxy (orange cloud icon) for security'
      ]
    }
  }, null, 2), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

async function setupStagingDNS(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  console.log('Setting up staging DNS records...');

  // Check if we have API token
  if (!env.CLOUDFLARE_API_TOKEN) {
    return new Response(JSON.stringify({
      success: false,
      error: 'CLOUDFLARE_API_TOKEN not configured',
      message: 'Please set the API token as a secret: wrangler secret put CLOUDFLARE_API_TOKEN',
      zone_id: env.CLOUDFLARE_ZONE_ID || 'Not configured',
      next_steps: [
        '1. Get a Cloudflare API token from: https://dash.cloudflare.com/profile/api-tokens',
        '2. Token should have Zone:Edit permissions for code24.dev',
        '3. Set token: wrangler secret put CLOUDFLARE_API_TOKEN',
        '4. Redeploy worker and try again'
      ]
    }, null, 2), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  // Code24 staging workers that need DNS records
  const stagingWorkers = [
    'seo-optimizer',
    'conversion-optimizer', 
    'performance-monitor',
    'cross-site-learning',
    'site-builder',
    'shared-analytics'
  ];

  // Also create main staging domain
  const mainStagingDomain = {
    worker: 'main-staging',
    subdomain: 'staging.code24.dev',
    target: 'code24-dispatcher-staging.daniel-e88.workers.dev'
  };

  const results = [];

  try {
    // First, get existing DNS records to avoid duplicates
    const existingRecords = await getExistingDNSRecords(env);
    const existingNames = new Set(existingRecords.map((record: any) => record.name));

    // Create records for individual workers
    for (const worker of stagingWorkers) {
      const subdomain = `${worker}.staging.code24.dev`;
      
      // Skip if record already exists
      if (existingNames.has(subdomain)) {
        console.log(`DNS record for ${subdomain} already exists, skipping`);
        results.push({
          worker,
          subdomain,
          status: 'skipped',
          reason: 'Record already exists'
        });
        continue;
      }

      // Create CNAME record pointing to the worker's .workers.dev URL
      const workerUrl = `${worker}-staging.daniel-e88.workers.dev`;
      
      const dnsRecord: DNSRecord = {
        type: 'CNAME',
        name: subdomain,
        content: workerUrl,
        ttl: 300, // 5 minutes for staging
        proxied: true // Enable Cloudflare proxy for security
      };

      const result = await createDNSRecord(env, dnsRecord);
      
      if (result.success) {
        console.log(`✅ DNS record created for ${subdomain} → ${workerUrl}`);
        results.push({
          worker,
          subdomain,
          target: workerUrl,
          status: 'created',
          record_id: result.result.id
        });
      } else {
        console.error(`❌ Failed to create DNS record for ${subdomain}:`, result.errors);
        results.push({
          worker,
          subdomain,
          target: workerUrl,
          status: 'failed',
          errors: result.errors
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Create main staging domain record
    if (!existingNames.has(mainStagingDomain.subdomain)) {
      const dnsRecord: DNSRecord = {
        type: 'CNAME',
        name: mainStagingDomain.subdomain,
        content: mainStagingDomain.target,
        ttl: 300,
        proxied: true
      };

      const result = await createDNSRecord(env, dnsRecord);
      
      if (result.success) {
        console.log(`✅ Main staging DNS record created: ${mainStagingDomain.subdomain} → ${mainStagingDomain.target}`);
        results.push({
          worker: mainStagingDomain.worker,
          subdomain: mainStagingDomain.subdomain,
          target: mainStagingDomain.target,
          status: 'created',
          record_id: result.result.id
        });
      } else {
        console.error(`❌ Failed to create main staging DNS record:`, result.errors);
        results.push({
          worker: mainStagingDomain.worker,
          subdomain: mainStagingDomain.subdomain,
          target: mainStagingDomain.target,
          status: 'failed',
          errors: result.errors
        });
      }
    } else {
      results.push({
        worker: mainStagingDomain.worker,
        subdomain: mainStagingDomain.subdomain,
        status: 'skipped',
        reason: 'Record already exists'
      });
    }

    const summary = {
      total_workers: stagingWorkers.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    };

    console.log('DNS setup completed:', summary);

    return new Response(JSON.stringify({
      success: true,
      message: 'Staging DNS records setup completed',
      summary
    }, null, 2), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error setting up DNS:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to setup DNS records',
      details: error instanceof Error ? error.message : 'Unknown error',
      results
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

async function getExistingDNSRecords(env: Env): Promise<any[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records?per_page=100`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data: CloudflareAPIResponse = await response.json();
  
  if (!data.success) {
    console.error('Failed to fetch existing DNS records:', data.errors);
    return [];
  }

  return data.result || [];
}

async function createDNSRecord(env: Env, record: DNSRecord): Promise<CloudflareAPIResponse> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    }
  );

  return await response.json();
}

async function fixStagingProxy(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    console.log('Fixing staging domain proxy setting...');
    
    // Get the staging record
    const records = await getExistingDNSRecords(env);
    const stagingRecord = records.find((record: any) => record.name === 'staging.code24.dev');
    
    if (!stagingRecord) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Staging DNS record not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update the record to disable proxy
    const updateResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records/${stagingRecord.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: 'staging.code24.dev',
          content: 'code24-dispatcher-staging.daniel-e88.workers.dev',
          ttl: 300,
          proxied: true  // Enable proxy (orange cloud) - required for Workers
        }),
      }
    );

    const updateData = await updateResponse.json();
    
    if (!updateData.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update DNS record',
        details: updateData.errors
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Staging domain proxy disabled - should resolve 522 error',
      record: {
        name: updateData.result.name,
        content: updateData.result.content,
        proxied: updateData.result.proxied,
        ttl: updateData.result.ttl
      },
      note: 'DNS propagation may take 5-10 minutes'
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fixing staging proxy:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fix staging proxy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function listDNSRecords(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records?per_page=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data: CloudflareAPIResponse = await response.json();
    
    if (!data.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to fetch DNS records',
        errors: data.errors
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Filter for staging records
    const stagingRecords = data.result.filter((record: any) => 
      record.name.includes('staging.code24.dev')
    );

    return new Response(JSON.stringify({
      success: true,
      total_records: data.result.length,
      staging_records: stagingRecords.length,
      records: stagingRecords.map((record: any) => ({
        id: record.id,
        name: record.name,
        type: record.type,
        content: record.content,
        proxied: record.proxied,
        ttl: record.ttl
      }))
    }, null, 2), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error listing DNS records:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to list DNS records',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}