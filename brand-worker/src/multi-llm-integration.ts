/**
 * Multi-LLM Integration for Brand Worker
 * Enhances brand strategy with intelligent model selection
 */

export interface MultLLMBrandRequest {
  companyName: string;
  businessType: string;
  industry: string;
  targetAudience: string;
  brandPersonality: string[];
  businessValues: string[];
  brandGoals: string[];
  competitorInfo?: string;
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  priority: 'speed' | 'quality' | 'cost' | 'balanced';
}

export interface EnhancedBrandResponse {
  success: boolean;
  brandStrategy: any;
  modelSelection: {
    provider: string;
    model: string;
    reasoning: string;
  };
  performance: {
    processingTime: number;
    cost: number;
    qualityScore: number;
  };
  enhancement?: {
    originalLength: number;
    enhancedLength: number;
    qualityImprovement: number;
  };
}

class MultLLMBrandIntegration {
  private multiLLMEndpoint: string;

  constructor(multiLLMEndpoint: string = 'https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev') {
    this.multiLLMEndpoint = multiLLMEndpoint;
  }

  async generateBrandStrategy(request: MultLLMBrandRequest): Promise<EnhancedBrandResponse> {
    try {
      // Create optimized task for Multi-LLM orchestrator
      const taskRequest = {
        type: 'brand',
        complexity: request.complexity,
        priority: request.priority,
        context: {
          businessType: request.businessType,
          industry: request.industry,
          targetAudience: request.targetAudience
        },
        content: this.buildBrandStrategyPrompt(request),
        metadata: {
          expectedOutputLength: this.getExpectedLength(request.complexity),
          creativityLevel: 0.8 // High creativity for brand work
        }
      };

      // Process with Multi-LLM orchestrator
      const response = await fetch(`${this.multiLLMEndpoint}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskRequest)
      });

      if (!response.ok) {
        throw new Error(`Multi-LLM request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          brandStrategy: this.parseBrandStrategy(result.result.content),
          modelSelection: result.modelSelection,
          performance: result.performance
        };
      } else {
        throw new Error('Multi-LLM processing failed');
      }

    } catch (error) {
      console.error('Multi-LLM brand strategy generation failed:', error);
      return this.generateFallbackStrategy(request);
    }
  }

  async enhanceBrandResponse(originalResponse: any, enhancementRequirements: any): Promise<EnhancedBrandResponse> {
    try {
      const enhancementRequest = {
        workerType: 'brand',
        originalResponse: JSON.stringify(originalResponse),
        enhancementRequest: {
          requirements: enhancementRequirements.requirements || 'Enhance brand strategy depth and actionability',
          context: enhancementRequirements.context || {}
        }
      };

      const response = await fetch(`${this.multiLLMEndpoint}/enhance-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhancementRequest)
      });

      if (!response.ok) {
        throw new Error(`Enhancement request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          brandStrategy: this.parseBrandStrategy(result.enhancedResponse),
          modelSelection: result.enhancement,
          performance: {
            processingTime: result.enhancement.processingTime,
            cost: 0, // Will be tracked by orchestrator
            qualityScore: result.enhancement.qualityImprovement
          },
          enhancement: result.comparison
        };
      } else {
        throw new Error('Enhancement processing failed');
      }

    } catch (error) {
      console.error('Brand response enhancement failed:', error);
      return {
        success: false,
        brandStrategy: originalResponse,
        modelSelection: { provider: 'fallback', model: 'fallback', reasoning: 'Enhancement failed' },
        performance: { processingTime: 0, cost: 0, qualityScore: 0 }
      };
    }
  }

  private buildBrandStrategyPrompt(request: MultLLMBrandRequest): string {
    return `You are the world's best brand strategist. Create a comprehensive brand strategy for ${request.companyName}.

Company Details:
- Business Type: ${request.businessType}
- Industry: ${request.industry}
- Target Audience: ${request.targetAudience}
- Brand Personality: ${request.brandPersonality.join(', ')}
- Business Values: ${request.businessValues.join(', ')}
- Brand Goals: ${request.brandGoals.join(', ')}

${request.competitorInfo ? `Competitive Context:\n${request.competitorInfo}\n` : ''}

Please provide a detailed brand strategy that includes:

1. **Brand Positioning Statement**
   - Unique value proposition
   - Competitive differentiation
   - Target audience alignment

2. **Brand Identity Framework**
   - Core brand values and how they translate to customer experience
   - Brand personality traits with specific behavioral examples
   - Brand archetype and psychological appeal

3. **Visual Identity Direction**
   - Color psychology recommendations with specific palettes
   - Typography personality and font recommendations
   - Logo concepts and visual style guidelines
   - Imagery style and photography direction

4. **Brand Voice & Messaging**
   - Tone of voice guidelines with examples
   - Key messaging pillars
   - Communication style for different channels
   - Do's and don'ts for brand communication

5. **Implementation Strategy**
   - Priority touchpoints for brand rollout
   - Timeline for brand implementation
   - Budget allocation recommendations
   - Success metrics and KPIs

6. **Competitive Analysis & Positioning**
   - How this brand will stand out in the market
   - Opportunities for category leadership
   - Defensive positioning against competitors

Focus on creating a brand that drives emotional connection, builds trust, and ultimately increases conversion rates and customer loyalty. Ensure all recommendations are actionable and specific to the ${request.industry} industry.`;
  }

  private getExpectedLength(complexity: string): number {
    const lengthMap = {
      'simple': 1000,
      'medium': 2000,
      'complex': 3000,
      'expert': 4000
    };
    return lengthMap[complexity] || 2000;
  }

  private parseBrandStrategy(content: string): any {
    // Parse the LLM response into structured brand strategy
    // This is a simplified parser - in production, would use more sophisticated parsing
    
    return {
      positioning: this.extractSection(content, 'Brand Positioning Statement'),
      identity: this.extractSection(content, 'Brand Identity Framework'),
      visual: this.extractSection(content, 'Visual Identity Direction'),
      voice: this.extractSection(content, 'Brand Voice & Messaging'),
      implementation: this.extractSection(content, 'Implementation Strategy'),
      competitive: this.extractSection(content, 'Competitive Analysis & Positioning'),
      fullStrategy: content,
      metadata: {
        generatedAt: new Date().toISOString(),
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200) // Assuming 200 WPM
      }
    };
  }

  private extractSection(content: string, sectionTitle: string): string {
    const regex = new RegExp(`${sectionTitle}[\\s\\S]*?(?=\\n\\d+\\.|\\n[A-Z][\\s\\S]*?:|$)`, 'i');
    const match = content.match(regex);
    return match ? match[0].trim() : '';
  }

  private generateFallbackStrategy(request: MultLLMBrandRequest): EnhancedBrandResponse {
    return {
      success: false,
      brandStrategy: {
        positioning: `${request.companyName} is positioned as a ${request.brandPersonality.join(' and ')} ${request.businessType} serving ${request.targetAudience} in the ${request.industry} industry.`,
        identity: 'Fallback brand identity - please use enhanced Multi-LLM service for detailed strategy',
        visual: 'Visual identity guidelines require enhanced AI processing',
        voice: 'Brand voice recommendations available with full service',
        implementation: 'Implementation strategy requires detailed analysis',
        competitive: 'Competitive analysis available with full Multi-LLM processing',
        fullStrategy: 'Enhanced brand strategy temporarily unavailable. Please retry with Multi-LLM service.',
        metadata: {
          generatedAt: new Date().toISOString(),
          wordCount: 50,
          readingTime: 1
        }
      },
      modelSelection: {
        provider: 'fallback',
        model: 'basic',
        reasoning: 'Multi-LLM service unavailable, using basic fallback'
      },
      performance: {
        processingTime: 1000,
        cost: 0,
        qualityScore: 0.3
      }
    };
  }

  async generateBrandAssets(brandStrategy: any, assetType: string): Promise<any> {
    try {
      const assetPrompt = this.buildAssetGenerationPrompt(brandStrategy, assetType);
      
      const taskRequest = {
        type: 'design',
        complexity: 'medium',
        priority: 'quality',
        context: {
          businessType: brandStrategy.businessType,
          industry: brandStrategy.industry
        },
        content: assetPrompt,
        metadata: {
          expectedOutputLength: 1500,
          creativityLevel: 0.9
        }
      };

      const response = await fetch(`${this.multiLLMEndpoint}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskRequest)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          assetType,
          specifications: result.result.content,
          modelUsed: result.modelSelection
        };
      }

      throw new Error('Asset generation failed');

    } catch (error) {
      console.error('Brand asset generation failed:', error);
      return {
        success: false,
        assetType,
        specifications: `${assetType} specifications require enhanced Multi-LLM processing`,
        error: error.message
      };
    }
  }

  private buildAssetGenerationPrompt(brandStrategy: any, assetType: string): string {
    const prompts = {
      'logo': `Based on this brand strategy, create detailed logo design specifications:
${brandStrategy.fullStrategy}

Provide specific guidance for:
- Logo concept and symbolism
- Typography recommendations
- Color specifications
- Variations (horizontal, vertical, icon)
- Usage guidelines`,

      'color_palette': `Based on this brand strategy, create a comprehensive color palette:
${brandStrategy.fullStrategy}

Provide:
- Primary colors with hex codes and psychology
- Secondary and accent colors
- Color combinations for different contexts
- Accessibility considerations`,

      'typography': `Based on this brand strategy, recommend typography system:
${brandStrategy.fullStrategy}

Include:
- Heading font recommendations with reasoning
- Body font recommendations
- Font pairings
- Hierarchy guidelines
- Usage examples`
    };

    return prompts[assetType] || `Generate ${assetType} specifications based on: ${brandStrategy.fullStrategy}`;
  }
}

export { MultLLMBrandIntegration };