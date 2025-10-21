/**
 * Code24 Multi-LLM Orchestration System
 * Intelligently routes tasks to optimal AI models for maximum performance
 * OpenAI + Anthropic + Model Selection Intelligence
 */

interface LLMProvider {
  name: 'openai' | 'anthropic' | 'hybrid';
  models: string[];
  strengths: string[];
  costPerToken: number;
  speedRating: number;
  qualityRating: number;
}

interface TaskRequest {
  type: 'brand' | 'design' | 'development' | 'content' | 'analysis' | 'optimization';
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  priority: 'speed' | 'quality' | 'cost' | 'balanced';
  context: {
    businessType?: string;
    industry?: string;
    targetAudience?: string;
    requirements?: string[];
  };
  content: string;
  metadata?: {
    expectedOutputLength?: number;
    creativityLevel?: number;
    technicalDepth?: number;
  };
}

interface LLMResponse {
  success: boolean;
  content: string;
  model: string;
  provider: string;
  metrics: {
    processingTime: number;
    tokenCount: number;
    cost: number;
    qualityScore: number;
  };
  reasoning?: string;
  alternatives?: string[];
}

class MultiLLMOrchestrator {
  private openaiApiKey: string;
  private anthropicApiKey: string;
  private providers: Map<string, LLMProvider>;
  private performanceHistory: Map<string, any[]>;

  constructor(openaiKey: string, anthropicKey: string) {
    this.openaiApiKey = openaiKey;
    this.anthropicApiKey = anthropicKey;
    this.providers = new Map();
    this.performanceHistory = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set('openai', {
      name: 'openai',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      strengths: ['coding', 'analysis', 'structured_output', 'api_integration', 'technical_writing'],
      costPerToken: 0.00003,
      speedRating: 9,
      qualityRating: 9
    });

    this.providers.set('anthropic', {
      name: 'anthropic',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
      strengths: ['creative_writing', 'brand_strategy', 'complex_reasoning', 'ethical_analysis', 'long_form_content'],
      costPerToken: 0.000015,
      speedRating: 8,
      qualityRating: 10
    });
  }

  async processTask(request: TaskRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      // Step 1: Intelligent model selection
      const selectedModel = this.selectOptimalModel(request);
      
      // Step 2: Optimize prompt for selected model
      const optimizedPrompt = this.optimizePromptForModel(request, selectedModel);
      
      // Step 3: Execute with selected model
      const result = await this.executeWithModel(optimizedPrompt, selectedModel, request);
      
      // Step 4: Post-process and enhance if needed
      const enhancedResult = await this.enhanceResultIfNeeded(result, request);
      
      // Step 5: Track performance for learning
      this.trackPerformance(request, enhancedResult, Date.now() - startTime);
      
      return enhancedResult;
      
    } catch (error) {
      console.error('Multi-LLM orchestration failed:', error);
      
      // Fallback to alternative model
      return await this.executeFallback(request);
    }
  }

  private selectOptimalModel(request: TaskRequest): { provider: string; model: string; reasoning: string } {
    const taskModelMap = {
      'brand': {
        'simple': { provider: 'anthropic', model: 'claude-3-haiku-20240307', reasoning: 'Fast creative processing for basic brand tasks' },
        'medium': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Balanced creativity and analysis for brand strategy' },
        'complex': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Superior creative reasoning for complex brand challenges' },
        'expert': { provider: 'anthropic', model: 'claude-3-opus-20240229', reasoning: 'Maximum creative depth for expert brand work' }
      },
      'design': {
        'simple': { provider: 'openai', model: 'gpt-4o-mini', reasoning: 'Cost-effective for simple design specifications' },
        'medium': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Creative visual thinking for design concepts' },
        'complex': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Advanced creative reasoning for complex designs' },
        'expert': { provider: 'anthropic', model: 'claude-3-opus-20240229', reasoning: 'Peak creative intelligence for expert design work' }
      },
      'development': {
        'simple': { provider: 'openai', model: 'gpt-4o-mini', reasoning: 'Efficient code generation for simple tasks' },
        'medium': { provider: 'openai', model: 'gpt-4o', reasoning: 'Strong coding capabilities for medium complexity' },
        'complex': { provider: 'openai', model: 'gpt-4o', reasoning: 'Superior technical reasoning for complex development' },
        'expert': { provider: 'openai', model: 'gpt-4-turbo', reasoning: 'Maximum technical depth for expert development work' }
      },
      'content': {
        'simple': { provider: 'anthropic', model: 'claude-3-haiku-20240307', reasoning: 'Fast content generation with good quality' },
        'medium': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Balanced creativity and structure for content' },
        'complex': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Superior writing quality for complex content' },
        'expert': { provider: 'anthropic', model: 'claude-3-opus-20240229', reasoning: 'Peak writing intelligence for expert content' }
      },
      'analysis': {
        'simple': { provider: 'openai', model: 'gpt-4o-mini', reasoning: 'Efficient analysis for simple data' },
        'medium': { provider: 'openai', model: 'gpt-4o', reasoning: 'Strong analytical capabilities' },
        'complex': { provider: 'openai', model: 'gpt-4o', reasoning: 'Deep analytical reasoning for complex problems' },
        'expert': { provider: 'anthropic', model: 'claude-3-opus-20240229', reasoning: 'Maximum reasoning depth for expert analysis' }
      },
      'optimization': {
        'simple': { provider: 'openai', model: 'gpt-4o-mini', reasoning: 'Cost-effective optimization suggestions' },
        'medium': { provider: 'openai', model: 'gpt-4o', reasoning: 'Strong optimization logic and data analysis' },
        'complex': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', reasoning: 'Creative optimization approaches' },
        'expert': { provider: 'anthropic', model: 'claude-3-opus-20240229', reasoning: 'Deep strategic optimization thinking' }
      }
    };

    const selection = taskModelMap[request.type]?.[request.complexity] || taskModelMap['analysis']['medium'];
    
    // Adjust based on priority
    if (request.priority === 'speed' && selection.provider === 'anthropic') {
      selection.model = 'claude-3-haiku-20240307';
      selection.reasoning += ' (optimized for speed)';
    } else if (request.priority === 'cost' && selection.provider === 'openai') {
      selection.model = 'gpt-4o-mini';
      selection.reasoning += ' (optimized for cost)';
    }

    return selection;
  }

  private optimizePromptForModel(request: TaskRequest, modelSelection: any): string {
    const basePrompt = request.content;
    
    if (modelSelection.provider === 'anthropic') {
      // Anthropic models respond well to detailed context and reasoning requests
      return `${basePrompt}

Context: You are the world's best ${request.type} AI working for Code24, the revolutionary AI website platform. This task is ${request.complexity} complexity and should prioritize ${request.priority}.

Business Context: ${JSON.stringify(request.context)}

Please provide a comprehensive response that demonstrates expert-level thinking and creativity. Include your reasoning process and consider multiple perspectives.`;
      
    } else {
      // OpenAI models excel with structured, clear instructions
      return `${basePrompt}

Task Type: ${request.type}
Complexity: ${request.complexity}  
Priority: ${request.priority}
Context: ${JSON.stringify(request.context)}

Provide a detailed, well-structured response. Focus on practical implementation and technical accuracy.`;
    }
  }

  private async executeWithModel(prompt: string, modelSelection: any, request: TaskRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      if (modelSelection.provider === 'openai') {
        return await this.executeOpenAI(prompt, modelSelection.model, request);
      } else {
        return await this.executeAnthropic(prompt, modelSelection.model, request);
      }
    } catch (error) {
      console.error(`${modelSelection.provider} execution failed:`, error);
      throw error;
    }
  }

  private async executeOpenAI(prompt: string, model: string, request: TaskRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an expert ${request.type} AI for Code24, the world's most advanced AI website platform. Provide professional, actionable responses.`
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        temperature: request.type === 'brand' || request.type === 'design' ? 0.8 : 0.3,
        max_tokens: request.metadata?.expectedOutputLength || 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      content: data.choices[0].message.content,
      model: model,
      provider: 'openai',
      metrics: {
        processingTime,
        tokenCount: data.usage.total_tokens,
        cost: this.calculateCost('openai', data.usage.total_tokens),
        qualityScore: this.estimateQualityScore(data.choices[0].message.content, request)
      }
    };
  }

  private async executeAnthropic(prompt: string, model: string, request: TaskRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: request.metadata?.expectedOutputLength || 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: request.type === 'brand' || request.type === 'design' ? 0.8 : 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    // Estimate token count for Anthropic (they don't return usage in the same format)
    const estimatedTokens = Math.ceil(data.content[0].text.length / 4);
    
    return {
      success: true,
      content: data.content[0].text,
      model: model,
      provider: 'anthropic',
      metrics: {
        processingTime,
        tokenCount: estimatedTokens,
        cost: this.calculateCost('anthropic', estimatedTokens),
        qualityScore: this.estimateQualityScore(data.content[0].text, request)
      }
    };
  }

  private async enhanceResultIfNeeded(result: LLMResponse, request: TaskRequest): Promise<LLMResponse> {
    // For complex tasks, consider using a second model for review/enhancement
    if (request.complexity === 'expert' && request.priority === 'quality') {
      
      const enhancementPrompt = `Please review and enhance this ${request.type} response:

Original Response:
${result.content}

Provide an enhanced version that improves clarity, adds depth, and ensures it meets expert-level standards for a ${request.context.businessType} business in the ${request.context.industry} industry.`;

      // Use the opposite provider for enhancement
      const enhancementProvider = result.provider === 'openai' ? 'anthropic' : 'openai';
      const enhancementModel = this.selectOptimalModel({
        ...request,
        complexity: 'medium' // Use medium complexity for enhancement to control cost
      });

      try {
        const enhancement = await this.executeWithModel(
          enhancementPrompt, 
          { provider: enhancementProvider, model: enhancementModel.model },
          request
        );

        // Combine original and enhancement
        result.content = enhancement.content;
        result.metrics.cost += enhancement.metrics.cost;
        result.reasoning = `Enhanced using ${enhancementProvider} ${enhancementModel.model}`;
        
      } catch (error) {
        console.warn('Enhancement failed, using original result:', error);
      }
    }

    return result;
  }

  private async executeFallback(request: TaskRequest): Promise<LLMResponse> {
    // Simple fallback using most reliable model
    const fallbackModel = { provider: 'openai', model: 'gpt-4o-mini' };
    const simplifiedPrompt = `${request.content}

Please provide a helpful response for this ${request.type} request.`;

    try {
      return await this.executeWithModel(simplifiedPrompt, fallbackModel, request);
    } catch (error) {
      return {
        success: false,
        content: 'Multi-LLM service temporarily unavailable. Please try again.',
        model: 'fallback',
        provider: 'fallback',
        metrics: {
          processingTime: 0,
          tokenCount: 0,
          cost: 0,
          qualityScore: 0
        }
      };
    }
  }

  private calculateCost(provider: string, tokens: number): number {
    const rates = {
      'openai': 0.00003, // Rough average
      'anthropic': 0.000015 // Rough average
    };
    
    return tokens * (rates[provider] || 0.00003);
  }

  private estimateQualityScore(content: string, request: TaskRequest): number {
    // Simple quality estimation based on content characteristics
    let score = 0.5;
    
    // Length appropriateness
    if (content.length > 100 && content.length < 5000) score += 0.1;
    
    // Structure (paragraphs, lists, etc.)
    if (content.includes('\n') && content.includes('-')) score += 0.1;
    
    // Relevance to task type
    const taskKeywords = {
      'brand': ['brand', 'identity', 'values', 'positioning', 'audience'],
      'design': ['design', 'visual', 'layout', 'color', 'typography'],
      'development': ['code', 'function', 'implementation', 'technical'],
      'content': ['content', 'message', 'copy', 'text'],
      'analysis': ['analysis', 'data', 'insight', 'metrics'],
      'optimization': ['optimize', 'improve', 'enhance', 'performance']
    };
    
    const keywords = taskKeywords[request.type] || [];
    const keywordMatches = keywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    score += Math.min(keywordMatches * 0.05, 0.3);
    
    return Math.min(score, 1.0);
  }

  private trackPerformance(request: TaskRequest, result: LLMResponse, totalTime: number): void {
    const performanceData = {
      timestamp: new Date().toISOString(),
      taskType: request.type,
      complexity: request.complexity,
      priority: request.priority,
      provider: result.provider,
      model: result.model,
      metrics: result.metrics,
      totalTime,
      success: result.success
    };

    const key = `${request.type}_${request.complexity}`;
    if (!this.performanceHistory.has(key)) {
      this.performanceHistory.set(key, []);
    }
    
    this.performanceHistory.get(key)?.push(performanceData);
    
    // Keep only last 100 entries per task type
    const history = this.performanceHistory.get(key);
    if (history && history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  async getPerformanceAnalytics(): Promise<any> {
    const analytics = {
      totalRequests: 0,
      averageProcessingTime: 0,
      totalCost: 0,
      providerPerformance: {} as any,
      taskTypePerformance: {} as any
    };

    for (const [key, history] of this.performanceHistory) {
      analytics.totalRequests += history.length;
      
      history.forEach(entry => {
        analytics.totalCost += entry.metrics.cost;
        
        if (!analytics.providerPerformance[entry.provider]) {
          analytics.providerPerformance[entry.provider] = {
            requests: 0,
            averageTime: 0,
            cost: 0,
            qualityScore: 0
          };
        }
        
        const provider = analytics.providerPerformance[entry.provider];
        provider.requests++;
        provider.cost += entry.metrics.cost;
        provider.qualityScore += entry.metrics.qualityScore;
      });
    }

    // Calculate averages
    Object.keys(analytics.providerPerformance).forEach(provider => {
      const p = analytics.providerPerformance[provider];
      p.qualityScore = p.qualityScore / p.requests;
    });

    return analytics;
  }
}

export { MultiLLMOrchestrator, TaskRequest, LLMResponse };