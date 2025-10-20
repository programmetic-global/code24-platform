/**
 * Code24 ETL Pipeline Worker - Serverless Data Processing
 * Implements the serverless ETL architecture with R2 storage and Elite Workers
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return new Response('ETL Pipeline healthy', { status: 200 });
    }
    
    if (url.pathname === '/ingest' && request.method === 'POST') {
      return await ingestData(request, env);
    }
    
    if (url.pathname === '/process' && request.method === 'POST') {
      return await triggerProcessing(request, env);
    }
    
    if (url.pathname === '/status') {
      return await getProcessingStatus(env);
    }
    
    return new Response('ETL endpoint not found', { status: 404 });
  },
  
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processMessage(message, env);
        message.ack();
      } catch (error) {
        console.error('Queue processing error:', error);
        message.retry();
      }
    }
  }
};

async function ingestData(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const ingestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    // Store raw data in R2
    const rawKey = `raw/${timestamp.split('T')[0]}/${ingestId}.json`;
    await env.DATA_STORAGE.put(rawKey, JSON.stringify({
      ...data,
      ingestId,
      ingestedAt: timestamp,
      status: 'ingested'
    }));
    
    // Create processing job
    const processingJob = {
      id: ingestId,
      type: data.type || 'general',
      rawKey: rawKey,
      customerId: data.customerId,
      priority: data.priority || 'normal',
      timestamp: timestamp
    };
    
    // Queue for processing based on type
    if (data.type === 'website_optimization') {
      await env.OPTIMIZATION_QUEUE.send(processingJob);
    } else {
      await env.DATA_PROCESSING_QUEUE.send(processingJob);
    }
    
    // Update analytics
    env.ETL_ANALYTICS.writeDataPoint({
      blobs: ['data_ingested', data.type || 'unknown'],
      doubles: [1],
      indexes: [data.customerId || 'system']
    });
    
    return new Response(JSON.stringify({
      success: true,
      ingestId: ingestId,
      rawKey: rawKey,
      queued: true,
      estimatedProcessingTime: getEstimatedProcessingTime(data.type)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Data ingestion error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Ingestion failed'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function processMessage(message: any, env: Env): Promise<void> {
  const job = message.body;
  console.log(`Processing job ${job.id} of type ${job.type}`);
  
  // Update processing state
  await env.PROCESSING_STATE.put(`job:${job.id}`, JSON.stringify({
    ...job,
    status: 'processing',
    startedAt: new Date().toISOString()
  }));
  
  try {
    // Get raw data from R2
    const rawData = await env.DATA_STORAGE.get(job.rawKey);
    if (!rawData) {
      throw new Error(`Raw data not found: ${job.rawKey}`);
    }
    
    const data = JSON.parse(await rawData.text());
    let processedResult;
    
    // Route to appropriate Elite Worker based on job type
    switch (job.type) {
      case 'brand_analysis':
        processedResult = await processBrandAnalysis(data, env);
        break;
      case 'design_optimization':
        processedResult = await processDesignOptimization(data, env);
        break;
      case 'code_analysis':
        processedResult = await processCodeAnalysis(data, env);
        break;
      case 'website_optimization':
        processedResult = await processWebsiteOptimization(data, env);
        break;
      default:
        processedResult = await processGenericData(data, env);
    }
    
    // Store processed data in R2
    const processedKey = job.rawKey.replace('raw/', 'processed/');
    await env.PROCESSED_DATA.put(processedKey, JSON.stringify({
      ...data,
      processing: {
        jobId: job.id,
        processedAt: new Date().toISOString(),
        processingTime: Date.now() - new Date(job.timestamp).getTime(),
        result: processedResult
      }
    }));
    
    // Update job status
    await env.PROCESSING_STATE.put(`job:${job.id}`, JSON.stringify({
      ...job,
      status: 'completed',
      completedAt: new Date().toISOString(),
      processedKey: processedKey
    }));
    
    // Update analytics
    env.ETL_ANALYTICS.writeDataPoint({
      blobs: ['job_completed', job.type],
      doubles: [1],
      indexes: [job.customerId || 'system']
    });
    
    console.log(`Job ${job.id} completed successfully`);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    
    // Update job status with error
    await env.PROCESSING_STATE.put(`job:${job.id}`, JSON.stringify({
      ...job,
      status: 'failed',
      failedAt: new Date().toISOString(),
      error: error.message
    }));
    
    // Update analytics
    env.ETL_ANALYTICS.writeDataPoint({
      blobs: ['job_failed', job.type],
      doubles: [1],
      indexes: [job.customerId || 'system']
    });
    
    throw error; // Re-throw to trigger message retry
  }
}

async function processBrandAnalysis(data: any, env: Env): Promise<any> {
  try {
    const brandRequest = new Request('https://internal/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url,
        companyName: data.companyName,
        industry: data.industry,
        targetAudience: data.targetAudience
      })
    });
    
    const response = await env.BRAND_WORKER.fetch(brandRequest);
    if (!response.ok) {
      throw new Error(`Brand Worker failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Brand analysis error:', error);
    throw error;
  }
}

async function processDesignOptimization(data: any, env: Env): Promise<any> {
  try {
    const designRequest = new Request('https://internal/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.url,
        businessType: data.businessType,
        targetAudience: data.targetAudience,
        currentDesign: data.currentDesign
      })
    });
    
    const response = await env.DESIGNER_WORKER.fetch(designRequest);
    if (!response.ok) {
      throw new Error(`Designer Worker failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Design optimization error:', error);
    throw error;
  }
}

async function processCodeAnalysis(data: any, env: Env): Promise<any> {
  try {
    const codeRequest = new Request('https://internal/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codebase: data.codebase,
        language: data.language,
        analysisType: data.analysisType || 'all'
      })
    });
    
    const response = await env.DEVELOPER_WORKER.fetch(codeRequest);
    if (!response.ok) {
      throw new Error(`Developer Worker failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Code analysis error:', error);
    throw error;
  }
}

async function processWebsiteOptimization(data: any, env: Env): Promise<any> {
  try {
    // Comprehensive optimization using all Elite Workers
    const [brandResult, designResult, codeResult] = await Promise.all([
      processBrandAnalysis(data, env),
      processDesignOptimization(data, env),
      processCodeAnalysis(data, env)
    ]);
    
    return {
      brand: brandResult,
      design: designResult,
      code: codeResult,
      optimizationScore: calculateOptimizationScore(brandResult, designResult, codeResult),
      recommendations: generateOptimizationRecommendations(brandResult, designResult, codeResult)
    };
  } catch (error) {
    console.error('Website optimization error:', error);
    throw error;
  }
}

async function processGenericData(data: any, env: Env): Promise<any> {
  // Basic data processing for unknown types
  return {
    processed: true,
    timestamp: new Date().toISOString(),
    dataSize: JSON.stringify(data).length,
    summary: 'Generic data processing completed'
  };
}

function calculateOptimizationScore(brand: any, design: any, code: any): number {
  const brandScore = brand?.brandStrength || 50;
  const designScore = design?.modernityScore || 50;
  const codeScore = code?.codeQuality || 50;
  
  return Math.round((brandScore + designScore + codeScore) / 3);
}

function generateOptimizationRecommendations(brand: any, design: any, code: any): string[] {
  const recommendations = [];
  
  if (brand?.brandStrength < 70) {
    recommendations.push('Strengthen brand identity and messaging');
  }
  
  if (design?.modernityScore < 80) {
    recommendations.push('Update design to modern standards');
  }
  
  if (code?.codeQuality < 75) {
    recommendations.push('Improve code quality and architecture');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue current optimization strategy');
  }
  
  return recommendations;
}

async function triggerProcessing(request: Request, env: Env): Promise<Response> {
  try {
    const { jobIds } = await request.json();
    
    for (const jobId of jobIds) {
      const jobState = await env.PROCESSING_STATE.get(`job:${jobId}`);
      if (jobState) {
        const job = JSON.parse(jobState);
        await env.DATA_PROCESSING_QUEUE.send(job);
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      triggeredJobs: jobIds.length
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

async function getProcessingStatus(env: Env): Promise<Response> {
  try {
    // Get recent job statuses (this is a simplified version)
    const status = {
      pipeline: 'Code24 ETL Pipeline',
      timestamp: new Date().toISOString(),
      queues: {
        dataProcessing: 'active',
        optimization: 'active'
      },
      storage: {
        r2Buckets: ['data-storage', 'processed-data', 'customer-assets'],
        status: 'connected'
      },
      eliteWorkers: {
        brand: 'connected',
        design: 'connected',
        developer: 'connected'
      }
    };
    
    return new Response(JSON.stringify(status, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get status'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getEstimatedProcessingTime(type: string): string {
  switch (type) {
    case 'brand_analysis': return '2-5 minutes';
    case 'design_optimization': return '3-7 minutes';
    case 'code_analysis': return '1-3 minutes';
    case 'website_optimization': return '5-15 minutes';
    default: return '1-2 minutes';
  }
}

// Environment interface
interface Env {
  // R2 Buckets
  DATA_STORAGE: R2Bucket;
  PROCESSED_DATA: R2Bucket;
  CUSTOMER_ASSETS: R2Bucket;
  
  // KV
  PROCESSING_STATE: KVNamespace;
  
  // Queues
  DATA_PROCESSING_QUEUE: Queue;
  OPTIMIZATION_QUEUE: Queue;
  
  // Analytics
  ETL_ANALYTICS: AnalyticsEngineDataset;
  
  // Service bindings to Elite Workers
  BRAND_WORKER: Fetcher;
  DESIGNER_WORKER: Fetcher;
  DEVELOPER_WORKER: Fetcher;
  
  // Environment variables
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  ACCOUNT_ID: string;
}