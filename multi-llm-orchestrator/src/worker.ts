/**
 * Multi-LLM Orchestrator Worker for Code24
 * Routes AI tasks to optimal models (OpenAI/Anthropic) for maximum performance
 */

import { MultiLLMOrchestrator, TaskRequest, LLMResponse } from './index';

interface Env {
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  PERFORMANCE_DB: D1Database;
  MODEL_CACHE: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
  BRAND_WORKER: Fetcher;
  DESIGNER_WORKER: Fetcher;
  DEVELOPER_WORKER: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      const orchestrator = new MultiLLMOrchestrator(
        env.OPENAI_API_KEY,
        env.ANTHROPIC_API_KEY
      );

      switch (url.pathname) {
        case '/process':
          return await handleTaskProcessing(request, orchestrator, env);
        
        case '/enhance-worker':
          return await handleWorkerEnhancement(request, orchestrator, env);
        
        case '/analytics':
          return await handleAnalytics(orchestrator, env);
        
        case '/health':
          return await handleHealthCheck(env);
        
        default:
          return new Response(JSON.stringify({
            service: 'Code24 Multi-LLM Orchestrator',
            status: 'online',
            capabilities: [
              'Intelligent model selection (OpenAI + Anthropic)',
              'Task-optimized routing',
              'Performance analytics',
              'Elite Worker enhancement',
              'Cost optimization',
              'Quality scoring'
            ],
            providers: {
              openai: {
                models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
                strengths: ['coding', 'analysis', 'structured_output']
              },
              anthropic: {
                models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
                strengths: ['creative_writing', 'brand_strategy', 'complex_reasoning']
              }
            },
            endpoints: [
              'POST /process - Process task with optimal model',
              'POST /enhance-worker - Enhance Elite Worker responses',
              'GET /analytics - Performance analytics',
              'GET /health - System health check'
            ]
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Multi-LLM Orchestrator error:', error);
      return new Response(JSON.stringify({
        error: 'Multi-LLM service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleTaskProcessing(request: Request, orchestrator: MultiLLMOrchestrator, env: Env): Promise<Response> {
  try {
    const taskRequest: TaskRequest = await request.json();
    
    // Process with optimal model selection
    const result = await orchestrator.processTask(taskRequest);
    
    // Store performance data
    await storePerformanceData(result, taskRequest, env);
    
    // Track analytics
    await trackTaskAnalytics(taskRequest, result, env);
    
    return new Response(JSON.stringify({
      success: true,
      result,
      modelSelection: {
        provider: result.provider,
        model: result.model,
        reasoning: result.reasoning || 'Optimal model selected based on task requirements'
      },
      performance: {
        processingTime: result.metrics.processingTime,
        cost: result.metrics.cost,
        qualityScore: result.metrics.qualityScore
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Task processing failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Task processing failed',
      fallback: 'Consider using individual Elite Workers directly'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleWorkerEnhancement(request: Request, orchestrator: MultiLLMOrchestrator, env: Env): Promise<Response> {
  try {
    const { workerType, originalResponse, enhancementRequest } = await request.json();
    
    // Create enhancement task
    const enhancementTask: TaskRequest = {
      type: workerType,
      complexity: 'medium',
      priority: 'quality',
      context: enhancementRequest.context || {},
      content: `Please enhance this ${workerType} response:

Original Response:
${originalResponse}

Enhancement Requirements:
${enhancementRequest.requirements || 'Improve clarity, depth, and actionability'}

Business Context: ${JSON.stringify(enhancementRequest.context || {})}`,
      metadata: {
        expectedOutputLength: 1500,
        creativityLevel: workerType === 'brand' || workerType === 'design' ? 0.8 : 0.5
      }
    };
    
    // Process enhancement
    const enhancedResult = await orchestrator.processTask(enhancementTask);
    
    // Store enhancement analytics
    await trackEnhancementAnalytics(workerType, originalResponse, enhancedResult, env);
    
    return new Response(JSON.stringify({
      success: true,
      originalResponse,
      enhancedResponse: enhancedResult.content,
      enhancement: {
        provider: enhancedResult.provider,
        model: enhancedResult.model,
        qualityImprovement: enhancedResult.metrics.qualityScore,
        processingTime: enhancedResult.metrics.processingTime
      },
      comparison: {
        originalLength: originalResponse.length,
        enhancedLength: enhancedResult.content.length,
        improvementRatio: enhancedResult.content.length / originalResponse.length
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Worker enhancement failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Enhancement service temporarily unavailable',
      originalResponse: request.body ? JSON.parse(await request.text()).originalResponse : null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAnalytics(orchestrator: MultiLLMOrchestrator, env: Env): Promise<Response> {
  try {
    const analytics = await orchestrator.getPerformanceAnalytics();
    
    // Get additional analytics from database
    const dbAnalytics = await getAnalyticsFromDatabase(env);
    
    const combinedAnalytics = {
      ...analytics,
      database: dbAnalytics,
      insights: generateInsights(analytics, dbAnalytics),
      recommendations: generateRecommendations(analytics)
    };
    
    return new Response(JSON.stringify(combinedAnalytics), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Analytics generation failed:', error);
    
    return new Response(JSON.stringify({
      error: 'Analytics temporarily unavailable',
      basicStats: {
        status: 'Multi-LLM system operational',
        providers: ['OpenAI', 'Anthropic'],
        capabilities: 'Full orchestration available'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleHealthCheck(env: Env): Promise<Response> {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      openai: { status: 'unknown', lastCheck: null },
      anthropic: { status: 'unknown', lastCheck: null }
    },
    database: { status: 'unknown' },
    cache: { status: 'unknown' }
  };

  try {
    // Test OpenAI
    const openaiTest = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY}` }
    });
    health.providers.openai.status = openaiTest.ok ? 'healthy' : 'unhealthy';
    health.providers.openai.lastCheck = new Date().toISOString();
  } catch (error) {
    health.providers.openai.status = 'error';
  }

  try {
    // Test Anthropic (simple request)
    const anthropicTest = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Test' }]
      })
    });
    health.providers.anthropic.status = anthropicTest.ok ? 'healthy' : 'unhealthy';
    health.providers.anthropic.lastCheck = new Date().toISOString();
  } catch (error) {
    health.providers.anthropic.status = 'error';
  }

  try {
    // Test database
    await env.PERFORMANCE_DB.prepare('SELECT 1').first();
    health.database.status = 'healthy';
  } catch (error) {
    health.database.status = 'error';
  }

  try {
    // Test cache
    await env.MODEL_CACHE.get('health_check');
    health.cache.status = 'healthy';
  } catch (error) {
    health.cache.status = 'error';
  }

  const overallHealthy = health.providers.openai.status === 'healthy' && 
                        health.providers.anthropic.status === 'healthy';
  
  health.status = overallHealthy ? 'healthy' : 'degraded';

  return new Response(JSON.stringify(health), {
    status: overallHealthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function storePerformanceData(result: LLMResponse, request: TaskRequest, env: Env): Promise<void> {
  try {
    await env.PERFORMANCE_DB.prepare(`
      INSERT INTO performance_logs (
        timestamp, task_type, complexity, priority, provider, model,
        processing_time, token_count, cost, quality_score, success
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      new Date().toISOString(),
      request.type,
      request.complexity,
      request.priority,
      result.provider,
      result.model,
      result.metrics.processingTime,
      result.metrics.tokenCount,
      result.metrics.cost,
      result.metrics.qualityScore,
      result.success ? 1 : 0
    ).run();
  } catch (error) {
    console.error('Failed to store performance data:', error);
  }
}

async function trackTaskAnalytics(request: TaskRequest, result: LLMResponse, env: Env): Promise<void> {
  try {
    await env.ANALYTICS.writeDataPoint({
      indexes: [request.type, request.complexity, result.provider],
      blobs: [result.model, request.priority],
      doubles: [
        result.metrics.processingTime,
        result.metrics.cost,
        result.metrics.qualityScore,
        result.metrics.tokenCount
      ],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}

async function trackEnhancementAnalytics(workerType: string, originalResponse: string, enhancedResult: LLMResponse, env: Env): Promise<void> {
  try {
    await env.ANALYTICS.writeDataPoint({
      indexes: ['enhancement', workerType, enhancedResult.provider],
      blobs: [enhancedResult.model, 'worker_enhancement'],
      doubles: [
        originalResponse.length,
        enhancedResult.content.length,
        enhancedResult.metrics.qualityScore,
        enhancedResult.metrics.processingTime
      ],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to track enhancement analytics:', error);
  }
}

async function getAnalyticsFromDatabase(env: Env): Promise<any> {
  try {
    const results = await env.PERFORMANCE_DB.prepare(`
      SELECT 
        provider,
        COUNT(*) as total_requests,
        AVG(processing_time) as avg_processing_time,
        SUM(cost) as total_cost,
        AVG(quality_score) as avg_quality_score,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate
      FROM performance_logs 
      WHERE timestamp > datetime('now', '-7 days')
      GROUP BY provider
    `).all();

    return {
      weekly_summary: results.results,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get database analytics:', error);
    return { error: 'Database analytics unavailable' };
  }
}

function generateInsights(analytics: any, dbAnalytics: any): string[] {
  const insights = [];
  
  if (analytics.providerPerformance?.openai && analytics.providerPerformance?.anthropic) {
    const openai = analytics.providerPerformance.openai;
    const anthropic = analytics.providerPerformance.anthropic;
    
    if (openai.qualityScore > anthropic.qualityScore) {
      insights.push('OpenAI models showing higher average quality scores');
    } else {
      insights.push('Anthropic models showing higher average quality scores');
    }
    
    if (openai.cost < anthropic.cost) {
      insights.push('OpenAI providing better cost efficiency');
    } else {
      insights.push('Anthropic providing better cost efficiency');
    }
  }
  
  if (analytics.totalCost > 100) {
    insights.push('High API usage detected - consider optimization');
  }
  
  return insights;
}

function generateRecommendations(analytics: any): string[] {
  const recommendations = [];
  
  if (analytics.totalCost > 50) {
    recommendations.push('Consider using more cost-effective models for simple tasks');
  }
  
  if (analytics.averageProcessingTime > 5000) {
    recommendations.push('Switch to faster models for time-sensitive tasks');
  }
  
  recommendations.push('Monitor quality scores and adjust model selection accordingly');
  recommendations.push('Use caching for repeated similar tasks');
  
  return recommendations;
}