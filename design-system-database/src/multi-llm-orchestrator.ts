import { DesignSystemDatabase } from './database';
import { VectorDatabase } from './vector-database';
import { ContinuousLearningSystem } from './continuous-learning';
import { DesignComponent, ComponentType, DesignStyle } from './types';

export interface LLMProvider {
  name: string;
  model: string;
  endpoint: string;
  apiKey: string;
  capabilities: LLMCapability[];
  costPerToken: number;
  maxTokens: number;
  responseTime: number; // milliseconds
  qualityScore: number; // 1-10
}

export enum LLMCapability {
  CODE_GENERATION = 'code_generation',
  DESIGN_ANALYSIS = 'design_analysis',
  STRATEGIC_REASONING = 'strategic_reasoning',
  VISUAL_UNDERSTANDING = 'visual_understanding',
  SPEED_OPTIMIZATION = 'speed_optimization',
  COST_EFFICIENCY = 'cost_efficiency',
  PATTERN_RECOGNITION = 'pattern_recognition',
  CREATIVE_IDEATION = 'creative_ideation',
  TECHNICAL_PRECISION = 'technical_precision',
  CONTENT_GENERATION = 'content_generation'
}

export interface TaskContext {
  task_type: 'component_selection' | 'design_generation' | 'trend_analysis' | 'optimization' | 'quality_assessment';
  priority: 'low' | 'medium' | 'high' | 'critical';
  industry: string;
  business_goal: string;
  technical_requirements: string[];
  performance_targets: {
    conversion_rate?: number;
    load_time?: number;
    aesthetic_score?: number;
  };
  budget_constraints?: {
    max_cost_per_task?: number;
    max_response_time?: number;
  };
}

export interface LLMTask {
  id: string;
  context: TaskContext;
  prompt: string;
  selected_llm: LLMProvider;
  created_at: Date;
  completed_at?: Date;
  result?: any;
  cost: number;
  quality_score?: number;
  performance_metrics: {
    response_time: number;
    token_usage: number;
    success: boolean;
  };
}

export interface DesignWorkerSpecialization {
  worker_type: 'strategic_designer' | 'trend_analyst' | 'component_architect' | 'performance_optimizer' | 'brand_synthesizer';
  primary_llm: LLMProvider;
  fallback_llms: LLMProvider[];
  specialized_capabilities: LLMCapability[];
  quality_threshold: number;
  max_cost_per_task: number;
}

export class MultiLLMOrchestrator {
  private providers: Map<string, LLMProvider> = new Map();
  private designDb: DesignSystemDatabase;
  private vectorDb: VectorDatabase;
  private learningSystem: ContinuousLearningSystem;
  private taskHistory: LLMTask[] = [];

  constructor(
    designDb: DesignSystemDatabase,
    vectorDb: VectorDatabase,
    learningSystem: ContinuousLearningSystem
  ) {
    this.designDb = designDb;
    this.vectorDb = vectorDb;
    this.learningSystem = learningSystem;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Claude Sonnet 4 - Premium Strategic Intelligence
    this.providers.set('claude-sonnet-4', {
      name: 'Claude Sonnet 4',
      model: 'claude-3-5-sonnet-20241022',
      endpoint: 'https://api.anthropic.com/v1/messages',
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      capabilities: [
        LLMCapability.STRATEGIC_REASONING,
        LLMCapability.DESIGN_ANALYSIS,
        LLMCapability.PATTERN_RECOGNITION,
        LLMCapability.TECHNICAL_PRECISION,
        LLMCapability.CREATIVE_IDEATION
      ],
      costPerToken: 0.000015, // $15 per 1M tokens
      maxTokens: 200000,
      responseTime: 3000,
      qualityScore: 10
    });

    // GPT-4o - Parallel Processing & Vision
    this.providers.set('gpt-4o', {
      name: 'GPT-4o',
      model: 'gpt-4o',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.OPENAI_API_KEY || '',
      capabilities: [
        LLMCapability.VISUAL_UNDERSTANDING,
        LLMCapability.SPEED_OPTIMIZATION,
        LLMCapability.CODE_GENERATION,
        LLMCapability.PATTERN_RECOGNITION,
        LLMCapability.CONTENT_GENERATION
      ],
      costPerToken: 0.00001, // $10 per 1M tokens
      maxTokens: 128000,
      responseTime: 2000,
      qualityScore: 9
    });

    // Llama 3.1 70B - Cost-Effective High Volume
    this.providers.set('llama-3.1-70b', {
      name: 'Llama 3.1 70B',
      model: 'llama-3.1-70b-instruct',
      endpoint: 'https://api.together.xyz/v1/chat/completions',
      apiKey: process.env.TOGETHER_API_KEY || '',
      capabilities: [
        LLMCapability.CODE_GENERATION,
        LLMCapability.COST_EFFICIENCY,
        LLMCapability.SPEED_OPTIMIZATION,
        LLMCapability.PATTERN_RECOGNITION
      ],
      costPerToken: 0.0000009, // $0.9 per 1M tokens
      maxTokens: 32000,
      responseTime: 1500,
      qualityScore: 8
    });

    // Specialized Models
    this.providers.set('gpt-4-vision', {
      name: 'GPT-4 Vision',
      model: 'gpt-4-vision-preview',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.OPENAI_API_KEY || '',
      capabilities: [
        LLMCapability.VISUAL_UNDERSTANDING,
        LLMCapability.DESIGN_ANALYSIS,
        LLMCapability.CREATIVE_IDEATION
      ],
      costPerToken: 0.00003, // $30 per 1M tokens
      maxTokens: 4096,
      responseTime: 4000,
      qualityScore: 9
    });

    console.log(`✅ Initialized ${this.providers.size} LLM providers`);
  }

  async selectOptimalLLM(context: TaskContext): Promise<LLMProvider> {
    const candidates = Array.from(this.providers.values());
    
    // Filter by required capabilities
    const capableProviders = candidates.filter(provider => {
      const requiredCapabilities = this.getRequiredCapabilities(context.task_type);
      return requiredCapabilities.every(cap => provider.capabilities.includes(cap));
    });

    if (capableProviders.length === 0) {
      throw new Error(`No LLM providers support required capabilities for ${context.task_type}`);
    }

    // Score each provider based on context
    const scoredProviders = capableProviders.map(provider => ({
      provider,
      score: this.calculateProviderScore(provider, context)
    }));

    // Sort by score (higher is better)
    scoredProviders.sort((a, b) => b.score - a.score);

    const selected = scoredProviders[0].provider;
    console.log(`🎯 Selected ${selected.name} for ${context.task_type} (score: ${scoredProviders[0].score.toFixed(2)})`);
    
    return selected;
  }

  private getRequiredCapabilities(taskType: string): LLMCapability[] {
    const capabilityMap: Record<string, LLMCapability[]> = {
      'component_selection': [LLMCapability.DESIGN_ANALYSIS, LLMCapability.PATTERN_RECOGNITION],
      'design_generation': [LLMCapability.CODE_GENERATION, LLMCapability.CREATIVE_IDEATION],
      'trend_analysis': [LLMCapability.PATTERN_RECOGNITION, LLMCapability.STRATEGIC_REASONING],
      'optimization': [LLMCapability.TECHNICAL_PRECISION, LLMCapability.CODE_GENERATION],
      'quality_assessment': [LLMCapability.DESIGN_ANALYSIS, LLMCapability.STRATEGIC_REASONING]
    };

    return capabilityMap[taskType] || [LLMCapability.STRATEGIC_REASONING];
  }

  private calculateProviderScore(provider: LLMProvider, context: TaskContext): number {
    let score = 0;

    // Base quality score (40% weight)
    score += provider.qualityScore * 4;

    // Priority-based adjustments
    if (context.priority === 'critical') {
      // For critical tasks, prioritize quality over cost
      score += provider.qualityScore * 2;
      score -= (provider.responseTime / 1000) * 2; // Penalize slow response
    } else if (context.priority === 'low') {
      // For low priority, optimize for cost
      score += (1 / provider.costPerToken) * 0.001; // Reward lower cost
      score -= provider.qualityScore * 0.5; // Less emphasis on quality
    }

    // Budget constraints
    if (context.budget_constraints?.max_cost_per_task) {
      const estimatedCost = provider.costPerToken * 1000; // Estimate 1000 tokens
      if (estimatedCost > context.budget_constraints.max_cost_per_task) {
        score -= 20; // Heavy penalty for budget overrun
      }
    }

    // Response time constraints
    if (context.budget_constraints?.max_response_time) {
      if (provider.responseTime > context.budget_constraints.max_response_time) {
        score -= 15; // Penalty for being too slow
      }
    }

    // Capability match bonus
    const requiredCaps = this.getRequiredCapabilities(context.task_type);
    const matchingCaps = requiredCaps.filter(cap => provider.capabilities.includes(cap));
    score += (matchingCaps.length / requiredCaps.length) * 10;

    return score;
  }

  async executeDesignTask(
    taskType: string,
    prompt: string,
    context: TaskContext,
    componentContext?: DesignComponent[]
  ): Promise<any> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      // Select optimal LLM
      const selectedLLM = await this.selectOptimalLLM(context);

      // Enhance prompt with design intelligence
      const enhancedPrompt = await this.enhancePromptWithIntelligence(prompt, context, componentContext);

      // Execute task
      const result = await this.executeLLMTask(selectedLLM, enhancedPrompt, context);

      // Record performance
      const task: LLMTask = {
        id: taskId,
        context,
        prompt: enhancedPrompt,
        selected_llm: selectedLLM,
        created_at: new Date(),
        completed_at: new Date(),
        result,
        cost: this.calculateTaskCost(selectedLLM, result),
        performance_metrics: {
          response_time: Date.now() - startTime,
          token_usage: this.estimateTokenUsage(enhancedPrompt, result),
          success: true
        }
      };

      this.taskHistory.push(task);
      console.log(`✅ Completed ${taskType} task in ${task.performance_metrics.response_time}ms (Cost: $${task.cost.toFixed(4)})`);

      return result;

    } catch (error) {
      console.error(`❌ Task ${taskId} failed:`, error);
      throw error;
    }
  }

  private async enhancePromptWithIntelligence(
    basePrompt: string,
    context: TaskContext,
    componentContext?: DesignComponent[]
  ): Promise<string> {
    let enhancedPrompt = basePrompt;

    // Add design intelligence context
    if (context.task_type === 'component_selection') {
      const similarComponents = componentContext ? 
        await this.findSimilarComponents(componentContext[0]) : [];
      
      const trendingPatterns = await this.getTrendingPatterns(context.industry);
      
      enhancedPrompt += `\n\nDESIGN INTELLIGENCE CONTEXT:
Industry: ${context.industry}
Goal: ${context.business_goal}

Trending Patterns: ${trendingPatterns.join(', ')}
Similar High-Performing Components: ${similarComponents.length} found
Performance Targets: ${JSON.stringify(context.performance_targets)}

Use this intelligence to make optimal component selections.`;
    }

    // Add industry-specific insights
    const industryInsights = await this.getIndustryInsights(context.industry);
    if (industryInsights.length > 0) {
      enhancedPrompt += `\n\nINDUSTRY INSIGHTS:
${industryInsights.map(insight => `- ${insight.description}`).join('\n')}`;
    }

    return enhancedPrompt;
  }

  private async findSimilarComponents(component: DesignComponent): Promise<DesignComponent[]> {
    try {
      const embedding = await this.vectorDb.generateComponentEmbedding(component);
      const similar = await this.vectorDb.findSimilarComponents(embedding, 5, 0.7);
      return similar.map(s => s.component);
    } catch (error) {
      console.warn('Vector search failed, using fallback');
      return [];
    }
  }

  private async getTrendingPatterns(industry: string): Promise<string[]> {
    try {
      const components = await this.designDb.searchComponents({
        industries: [industry],
        minAestheticScore: 85
      }, 10);
      
      const patterns = new Set<string>();
      components.forEach(comp => {
        comp.tags.forEach(tag => patterns.add(tag));
      });
      
      return Array.from(patterns).slice(0, 5);
    } catch (error) {
      return ['modern', 'responsive', 'accessible'];
    }
  }

  private async getIndustryInsights(industry: string): Promise<any[]> {
    try {
      return await this.learningSystem.generateLearningInsights();
    } catch (error) {
      return [];
    }
  }

  private async executeLLMTask(provider: LLMProvider, prompt: string, context: TaskContext): Promise<any> {
    // Mock implementation - in real version, this would call actual LLM APIs
    console.log(`🔄 Executing task with ${provider.name}...`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, provider.responseTime));
    
    // Mock response based on task type
    switch (context.task_type) {
      case 'component_selection':
        return {
          selected_components: [
            { id: 'comp_123', type: 'hero', aesthetic_score: 92, reasoning: 'High conversion rate in similar industries' },
            { id: 'comp_456', type: 'cta', aesthetic_score: 89, reasoning: 'Gradient design trending +34% in tech sector' }
          ],
          confidence_score: 94,
          reasoning: `Selected components based on ${context.industry} industry performance data and current design trends.`
        };
        
      case 'design_generation':
        return {
          html_code: '<div class="modern-component">Generated by AI</div>',
          css_code: '.modern-component { background: linear-gradient(45deg, #667eea, #764ba2); }',
          design_rationale: 'Used gradient design pattern trending in current market',
          estimated_performance: { aesthetic_score: 88, conversion_lift: '+23%' }
        };
        
      case 'trend_analysis':
        return {
          trending_patterns: ['glassmorphism', 'gradient-buttons', 'minimal-cards'],
          growth_rates: ['+67%', '+34%', '+23%'],
          recommendations: ['Adopt glassmorphism for premium positioning', 'Use gradient CTAs for higher conversion'],
          confidence: 92
        };
        
      default:
        return { success: true, provider: provider.name };
    }
  }

  private calculateTaskCost(provider: LLMProvider, result: any): number {
    const estimatedTokens = 1000; // Simplified calculation
    return provider.costPerToken * estimatedTokens;
  }

  private estimateTokenUsage(prompt: string, result: any): number {
    return Math.ceil((prompt.length + JSON.stringify(result).length) / 4); // Rough estimate
  }

  async createSpecializedWorkers(): Promise<DesignWorkerSpecialization[]> {
    const workers: DesignWorkerSpecialization[] = [
      {
        worker_type: 'strategic_designer',
        primary_llm: this.providers.get('claude-sonnet-4')!,
        fallback_llms: [this.providers.get('gpt-4o')!],
        specialized_capabilities: [
          LLMCapability.STRATEGIC_REASONING,
          LLMCapability.DESIGN_ANALYSIS,
          LLMCapability.CREATIVE_IDEATION
        ],
        quality_threshold: 90,
        max_cost_per_task: 0.50
      },
      {
        worker_type: 'trend_analyst',
        primary_llm: this.providers.get('claude-sonnet-4')!,
        fallback_llms: [this.providers.get('gpt-4o')!, this.providers.get('llama-3.1-70b')!],
        specialized_capabilities: [
          LLMCapability.PATTERN_RECOGNITION,
          LLMCapability.STRATEGIC_REASONING
        ],
        quality_threshold: 85,
        max_cost_per_task: 0.30
      },
      {
        worker_type: 'component_architect',
        primary_llm: this.providers.get('gpt-4o')!,
        fallback_llms: [this.providers.get('llama-3.1-70b')!],
        specialized_capabilities: [
          LLMCapability.CODE_GENERATION,
          LLMCapability.TECHNICAL_PRECISION,
          LLMCapability.VISUAL_UNDERSTANDING
        ],
        quality_threshold: 88,
        max_cost_per_task: 0.25
      },
      {
        worker_type: 'performance_optimizer',
        primary_llm: this.providers.get('llama-3.1-70b')!,
        fallback_llms: [this.providers.get('gpt-4o')!],
        specialized_capabilities: [
          LLMCapability.CODE_GENERATION,
          LLMCapability.SPEED_OPTIMIZATION,
          LLMCapability.TECHNICAL_PRECISION
        ],
        quality_threshold: 82,
        max_cost_per_task: 0.15
      },
      {
        worker_type: 'brand_synthesizer',
        primary_llm: this.providers.get('gpt-4-vision')!,
        fallback_llms: [this.providers.get('claude-sonnet-4')!],
        specialized_capabilities: [
          LLMCapability.VISUAL_UNDERSTANDING,
          LLMCapability.CREATIVE_IDEATION,
          LLMCapability.DESIGN_ANALYSIS
        ],
        quality_threshold: 90,
        max_cost_per_task: 0.40
      }
    ];

    console.log(`🤖 Created ${workers.length} specialized AI workers`);
    return workers;
  }

  async getOrchestratorStats(): Promise<{
    total_tasks: number;
    avg_response_time: number;
    avg_cost: number;
    success_rate: number;
    provider_usage: Record<string, number>;
    cost_efficiency: number;
  }> {
    const totalTasks = this.taskHistory.length;
    
    if (totalTasks === 0) {
      return {
        total_tasks: 0,
        avg_response_time: 0,
        avg_cost: 0,
        success_rate: 0,
        provider_usage: {},
        cost_efficiency: 0
      };
    }

    const avgResponseTime = this.taskHistory.reduce((sum, task) => 
      sum + task.performance_metrics.response_time, 0) / totalTasks;
    
    const avgCost = this.taskHistory.reduce((sum, task) => sum + task.cost, 0) / totalTasks;
    
    const successfulTasks = this.taskHistory.filter(task => task.performance_metrics.success).length;
    const successRate = (successfulTasks / totalTasks) * 100;

    const providerUsage: Record<string, number> = {};
    this.taskHistory.forEach(task => {
      const provider = task.selected_llm.name;
      providerUsage[provider] = (providerUsage[provider] || 0) + 1;
    });

    return {
      total_tasks: totalTasks,
      avg_response_time: avgResponseTime,
      avg_cost: avgCost,
      success_rate: successRate,
      provider_usage: providerUsage,
      cost_efficiency: successRate / avgCost // Success per dollar
    };
  }
}