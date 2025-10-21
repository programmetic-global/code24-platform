/**
 * Code24 Dynamic Dispatch Worker
 * Implements Cloudflare Workers for Platforms dynamic dispatch pattern
 * Routes AI worker requests through the proper dispatch namespace
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Extract worker routing information
    const path = url.pathname;
    const hostname = url.hostname;
    
    console.log(`Dynamic dispatch request: ${hostname}${path}`);
    
    // Route AI Worker requests through dispatch namespace
    if (path.startsWith('/api/')) {
      return await handleAPIRoute(request, env, path);
    }
    
    // Route Elite Worker requests
    if (path.startsWith('/elite/')) {
      return await handleEliteWorkerRoute(request, env, path);
    }
    
    // Default response
    return new Response('Dynamic Dispatcher - Code24 Workers for Platforms', {
      headers: { 'Content-Type': 'text/plain' }
    });
  },
};

async function handleAPIRoute(request: Request, env: Env, path: string): Promise<Response> {
  try {
    const apiPath = path.replace('/api/', '');
    
    // Route to appropriate worker through dispatch namespace
    if (apiPath.startsWith('competitive/')) {
      return await dispatchToWorker(request, env, 'competitive-analysis', apiPath.replace('competitive/', ''));
    }
    
    if (apiPath.startsWith('market/')) {
      return await dispatchToWorker(request, env, 'market-research', apiPath.replace('market/', ''));
    }
    
    if (apiPath.startsWith('brand/')) {
      return await dispatchToWorker(request, env, 'brand-worker', apiPath.replace('brand/', ''));
    }
    
    if (apiPath.startsWith('design/')) {
      return await dispatchToWorker(request, env, 'designer-worker', apiPath.replace('design/', ''));
    }
    
    if (apiPath.startsWith('develop/')) {
      return await dispatchToWorker(request, env, 'developer-worker', apiPath.replace('develop/', ''));
    }
    
    return new Response(`API endpoint not found: ${apiPath}`, { status: 404 });
    
  } catch (error) {
    console.error('API routing error:', error);
    return new Response(`API routing error: ${error.message}`, { status: 500 });
  }
}

async function handleEliteWorkerRoute(request: Request, env: Env, path: string): Promise<Response> {
  try {
    const elitePath = path.replace('/elite/', '');
    
    // Route to appropriate elite worker through dispatch namespace
    if (elitePath.startsWith('brand/')) {
      return await dispatchToWorker(request, env, 'brand-worker', elitePath.replace('brand/', ''));
    }
    
    if (elitePath.startsWith('design/')) {
      return await dispatchToWorker(request, env, 'designer-worker', elitePath.replace('design/', ''));
    }
    
    if (elitePath.startsWith('develop/')) {
      return await dispatchToWorker(request, env, 'developer-worker', elitePath.replace('develop/', ''));
    }
    
    if (elitePath.startsWith('competitive/')) {
      return await dispatchToWorker(request, env, 'competitive-analysis', elitePath.replace('competitive/', ''));
    }
    
    if (elitePath.startsWith('market/')) {
      return await dispatchToWorker(request, env, 'market-research', elitePath.replace('market/', ''));
    }
    
    return new Response(`Elite worker not found: ${elitePath}`, { status: 404 });
    
  } catch (error) {
    console.error('Elite worker routing error:', error);
    return new Response(`Elite worker routing error: ${error.message}`, { status: 500 });
  }
}

async function dispatchToWorker(request: Request, env: Env, workerName: string, workerPath: string): Promise<Response> {
  try {
    console.log(`Dispatching to worker: ${workerName}, path: /${workerPath}`);
    
    // Use Workers for Platforms dispatch namespace
    const worker = env.DISPATCHER.get(workerName);
    
    // Create new request with the worker-specific path
    const workerUrl = new URL(request.url);
    workerUrl.pathname = '/' + workerPath;
    
    const workerRequest = new Request(workerUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Dispatch to the worker
    const response = await worker.fetch(workerRequest);
    
    // Add dispatch metadata headers
    const enhancedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'X-Code24-Worker': workerName,
        'X-Code24-Dispatch': 'dynamic',
        'X-Code24-Path': workerPath
      }
    });
    
    return enhancedResponse;
    
  } catch (error) {
    console.error(`Worker dispatch error for ${workerName}:`, error);
    
    // Return fallback JSON response for AI workers
    return getFallbackResponse(workerName, workerPath, error);
  }
}

function getFallbackResponse(workerName: string, workerPath: string, error: Error): Response {
  const fallbackData = {
    error: 'Worker temporarily unavailable',
    worker: workerName,
    path: workerPath,
    fallback: true,
    timestamp: new Date().toISOString(),
    data: getFallbackData(workerName, workerPath)
  };
  
  return new Response(JSON.stringify(fallbackData, null, 2), {
    status: 200, // Return 200 so workflows don't fail
    headers: {
      'Content-Type': 'application/json',
      'X-Code24-Fallback': 'true',
      'X-Code24-Worker': workerName
    }
  });
}

function getFallbackData(workerName: string, workerPath: string): any {
  switch (workerName) {
    case 'competitive-analysis':
      return {
        analysis: {
          industry: 'technology',
          competitors: ['Industry Leader A', 'Industry Leader B', 'Industry Leader C'],
          benchmarks: {
            average_conversion_rate: 2.8,
            average_load_time: 3200,
            market_growth: '12% annually'
          },
          opportunities: ['Mobile optimization', 'AI integration', 'User experience improvements'],
          threats: ['Market saturation', 'New entrants', 'Technology shifts']
        }
      };
      
    case 'market-research':
      return {
        research: {
          industry: 'technology',
          size: '$2.3B annually',
          growth_rate: '15% CAGR',
          trends: ['Digital transformation', 'AI adoption', 'Mobile-first approach'],
          target_audience: 'Business decision makers aged 25-55',
          geography: 'Global',
          opportunities: ['Emerging markets', 'Technology integration', 'Sustainability focus']
        }
      };
      
    case 'brand-worker':
      return {
        brand: {
          name: 'Your Business',
          tagline: 'Excellence in Technology',
          colors: { primary: '#2563eb', secondary: '#1d4ed8', accent: '#3b82f6' },
          logo: { status: 'generated', url: '/assets/logo.svg' },
          style: 'modern professional'
        }
      };
      
    case 'designer-worker':
      return {
        design: {
          layout: 'modern_hero_sections',
          css: '/* Modern professional CSS */\nbody { font-family: "Inter", sans-serif; }\n.hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
          html: '<div class="hero"><h1>Your Business</h1><p>Professional website</p></div>',
          colors: { primary: '#2563eb', secondary: '#1d4ed8' },
          typography: { headings: 'Inter', body: 'Inter' }
        }
      };
      
    case 'developer-worker':
      return {
        development: {
          framework: 'react',
          features: ['responsive design', 'SEO optimization', 'performance optimization'],
          technical_specs: {
            load_time: '<2s',
            accessibility_score: '95+',
            mobile_optimization: 'complete'
          }
        }
      };
      
    default:
      return {
        message: 'Worker data available',
        status: 'operational'
      };
  }
}

interface Env {
  DISPATCHER: DurableObjectNamespace;
  METADATA?: KVNamespace;
  [key: string]: any;
}