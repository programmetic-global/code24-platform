/**
 * Elite Worker Multi-LLM Integration Demo
 * Shows how Elite Workers can use the Multi-LLM orchestrator for enhanced intelligence
 */

export default {
  async fetch(request: Request): Promise<Response> {
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
      if (url.pathname === '/demo/brand-strategy' && request.method === 'POST') {
        return await handleBrandStrategyDemo(request);
      }

      if (url.pathname === '/demo/design-concept' && request.method === 'POST') {
        return await handleDesignConceptDemo(request);
      }

      if (url.pathname === '/demo/development-plan' && request.method === 'POST') {
        return await handleDevelopmentPlanDemo(request);
      }

      // Default endpoint showing capabilities
      return new Response(JSON.stringify({
        service: 'Elite Worker Multi-LLM Integration Demo',
        status: 'online',
        message: '🚀 Demonstrating Multi-LLM orchestration with Code24 Elite Workers',
        capabilities: [
          'Multi-LLM brand strategy generation',
          'AI-orchestrated design concepts', 
          'Intelligent development planning',
          'Real-time model selection optimization'
        ],
        endpoints: [
          'POST /demo/brand-strategy - Generate brand strategy using optimal AI model',
          'POST /demo/design-concept - Create design concepts with Multi-LLM',
          'POST /demo/development-plan - Generate development plans via AI orchestration'
        ],
        integration: {
          multiLLMOrchestrator: 'https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev',
          providers: ['OpenAI GPT-4o', 'Anthropic Claude-3.5-Sonnet'],
          intelligentSelection: true
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Demo error:', error);
      return new Response(JSON.stringify({
        error: 'Demo service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleBrandStrategyDemo(request: Request): Promise<Response> {
  try {
    const { companyName, businessType, industry, challenge } = await request.json();

    // Create Multi-LLM task for brand strategy
    const multiLLMRequest = {
      type: 'brand',
      complexity: 'expert',
      priority: 'quality',
      context: {
        businessType: businessType || 'saas',
        industry: industry || 'technology',
        targetAudience: 'business owners'
      },
      content: `You are the world's best brand strategist working for Code24. Create a comprehensive brand strategy for ${companyName || 'the client company'}.

Business Context:
- Business Type: ${businessType || 'SaaS platform'}
- Industry: ${industry || 'Technology'}
- Challenge: ${challenge || 'Standing out in a competitive market'}

Create a strategic brand positioning that:
1. Differentiates from competitors
2. Resonates with target audience
3. Drives emotional connection
4. Supports business growth
5. Creates competitive moat

Provide specific, actionable recommendations with clear reasoning.`,
      metadata: {
        expectedOutputLength: 2000,
        creativityLevel: 0.8
      }
    };

    // Call Multi-LLM orchestrator
    const response = await fetch('https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(multiLLMRequest)
    });

    if (!response.ok) {
      throw new Error(`Multi-LLM request failed: ${response.status}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      demo: 'Brand Strategy via Multi-LLM Orchestration',
      company: companyName || 'Client Company',
      aiOrchestration: {
        selectedModel: result.modelSelection,
        performance: result.performance,
        reasoning: 'Optimal model automatically selected for expert brand strategy'
      },
      brandStrategy: {
        content: result.result.content,
        qualityScore: result.result.metrics?.qualityScore || 'N/A',
        processingTime: result.result.metrics?.processingTime || 'N/A'
      },
      enhancement: {
        traditionalApproach: 'Single AI model, manual selection, generic output',
        code24Approach: 'Multi-LLM orchestration, intelligent selection, optimized quality',
        advantage: 'Automatically uses best AI for each specific task type'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Brand strategy demo failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      demo: 'Brand Strategy Demo',
      error: 'Multi-LLM orchestration temporarily unavailable',
      fallback: {
        message: 'This would normally use intelligent AI selection for optimal brand strategy',
        demonstration: `${companyName || 'Your company'} brand strategy would be generated using the best available AI model automatically selected based on task complexity and requirements.`
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDesignConceptDemo(request: Request): Promise<Response> {
  try {
    const { projectName, designType, style } = await request.json();

    const multiLLMRequest = {
      type: 'design',
      complexity: 'medium',
      priority: 'quality',
      context: {
        businessType: 'creative',
        industry: 'design',
        targetAudience: 'business clients'
      },
      content: `Create innovative design concepts for ${projectName || 'the client project'}.

Design Requirements:
- Design Type: ${designType || 'Website design'}
- Style Preference: ${style || 'Modern and professional'}
- Goal: Stand out from competition while maintaining usability

Provide detailed design concepts including:
1. Visual direction and mood
2. Color palette recommendations with psychology
3. Typography choices and hierarchy
4. Layout principles and user flow
5. Conversion optimization elements

Focus on creating designs that are both beautiful and effective for business goals.`,
      metadata: {
        expectedOutputLength: 1500,
        creativityLevel: 0.9
      }
    };

    const response = await fetch('https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(multiLLMRequest)
    });

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      demo: 'Design Concepts via Multi-LLM Orchestration',
      project: projectName || 'Client Project',
      aiOrchestration: {
        selectedModel: result.modelSelection,
        performance: result.performance,
        reasoning: 'Creative design tasks routed to models with strongest visual thinking'
      },
      designConcepts: {
        content: result.result?.content || 'Multi-LLM processing in progress',
        qualityScore: result.result?.metrics?.qualityScore || 'Calculating',
        processingTime: result.result?.metrics?.processingTime || 'In progress'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      demo: 'Design Concepts Demo',
      error: 'Multi-LLM orchestration demo unavailable',
      demonstration: `${projectName || 'Your project'} design concepts would be generated using AI models optimized for creative visual thinking.`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDevelopmentPlanDemo(request: Request): Promise<Response> {
  try {
    const { projectName, technology, complexity } = await request.json();

    const multiLLMRequest = {
      type: 'development',
      complexity: complexity || 'complex',
      priority: 'quality',
      context: {
        businessType: 'technology',
        industry: 'software',
        targetAudience: 'developers'
      },
      content: `Create a comprehensive development plan for ${projectName || 'the software project'}.

Technical Requirements:
- Technology Stack: ${technology || 'Modern web technologies'}
- Complexity Level: ${complexity || 'Complex enterprise application'}
- Goal: Scalable, maintainable, high-performance solution

Provide detailed development strategy including:
1. Architecture recommendations
2. Technology stack selection with reasoning
3. Development phases and timeline
4. Performance optimization strategy
5. Security considerations
6. Testing and deployment approach

Focus on creating a plan that ensures project success and long-term maintainability.`,
      metadata: {
        expectedOutputLength: 2000,
        creativityLevel: 0.5
      }
    };

    const response = await fetch('https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(multiLLMRequest)
    });

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      demo: 'Development Planning via Multi-LLM Orchestration',
      project: projectName || 'Software Project',
      aiOrchestration: {
        selectedModel: result.modelSelection,
        performance: result.performance,
        reasoning: 'Development tasks routed to models with strongest technical reasoning'
      },
      developmentPlan: {
        content: result.result?.content || 'Multi-LLM processing in progress',
        qualityScore: result.result?.metrics?.qualityScore || 'Calculating',
        processingTime: result.result?.metrics?.processingTime || 'In progress'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      demo: 'Development Planning Demo',
      error: 'Multi-LLM orchestration demo unavailable',
      demonstration: `${projectName || 'Your project'} development plan would be generated using AI models optimized for technical analysis.`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}