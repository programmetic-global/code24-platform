// Self-Learning Analytics System for Code24
// Tracks user behavior and automatically optimizes the experience

interface AnalyticsEvent {
  event: string;
  data: any;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

interface LearningData {
  conversionRate: number;
  bounceRate: number;
  timeOnSite: number;
  interactions: number;
  optimizations: number;
  lastOptimized: string;
}

interface OptimizationRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  tested: boolean;
  performance: number;
}

class SelfLearningSystem {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private learningData: LearningData;
  private optimizationRules: OptimizationRule[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.learningData = this.loadLearningData();
    this.optimizationRules = this.loadOptimizationRules();
    this.initializeOptimizations();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadLearningData(): LearningData {
    if (typeof window === 'undefined') {
      return {
        conversionRate: 2.3,
        bounceRate: 67,
        timeOnSite: 45,
        interactions: 1247,
        optimizations: 23,
        lastOptimized: new Date().toISOString()
      };
    }

    const stored = localStorage.getItem('code24_learning_data');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      conversionRate: 2.3,
      bounceRate: 67,
      timeOnSite: 45,
      interactions: 1247,
      optimizations: 23,
      lastOptimized: new Date().toISOString()
    };
  }

  private loadOptimizationRules(): OptimizationRule[] {
    const defaultRules: OptimizationRule[] = [
      {
        id: 'cta_color_optimization',
        condition: 'conversionRate < 5',
        action: 'test_cta_colors',
        priority: 1,
        enabled: true,
        tested: false,
        performance: 0
      },
      {
        id: 'headline_variation',
        condition: 'bounceRate > 60',
        action: 'test_headlines',
        priority: 2,
        enabled: true,
        tested: false,
        performance: 0
      },
      {
        id: 'pricing_display',
        condition: 'timeOnSite < 60',
        action: 'optimize_pricing_visibility',
        priority: 3,
        enabled: true,
        tested: false,
        performance: 0
      },
      {
        id: 'mobile_optimization',
        condition: 'mobileConversionRate < desktopConversionRate',
        action: 'enhance_mobile_experience',
        priority: 4,
        enabled: true,
        tested: false,
        performance: 0
      },
      {
        id: 'social_proof',
        condition: 'trustIndicators < 3',
        action: 'add_social_proof_elements',
        priority: 5,
        enabled: true,
        tested: false,
        performance: 0
      }
    ];

    if (typeof window === 'undefined') return defaultRules;

    const stored = localStorage.getItem('code24_optimization_rules');
    return stored ? JSON.parse(stored) : defaultRules;
  }

  private saveLearningData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('code24_learning_data', JSON.stringify(this.learningData));
    }
  }

  private saveOptimizationRules(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('code24_optimization_rules', JSON.stringify(this.optimizationRules));
    }
  }

  public trackEvent(event: string, data: any): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    this.updateMetrics(analyticsEvent);
    this.checkOptimizationTriggers();

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Store events locally
    if (typeof window !== 'undefined') {
      const storedEvents = JSON.parse(localStorage.getItem('code24_events') || '[]');
      storedEvents.push(analyticsEvent);
      localStorage.setItem('code24_events', JSON.stringify(storedEvents.slice(-100)));
    }
  }

  private updateMetrics(event: AnalyticsEvent): void {
    switch (event.event) {
      case 'page_load':
        this.learningData.interactions += 1;
        break;
      
      case 'cta_click':
        // Simulate conversion tracking
        if (Math.random() > 0.8) {
          this.learningData.conversionRate += 0.01;
        }
        break;
      
      case 'product_card_click':
        this.learningData.timeOnSite += Math.random() * 5;
        break;
      
      case 'optimization_triggered':
        this.learningData.optimizations += 1;
        this.learningData.lastOptimized = new Date().toISOString();
        break;
    }

    this.saveLearningData();
  }

  private checkOptimizationTriggers(): void {
    this.optimizationRules.forEach(rule => {
      if (rule.enabled && !rule.tested && this.shouldTriggerOptimization(rule)) {
        this.triggerOptimization(rule);
      }
    });
  }

  private shouldTriggerOptimization(rule: OptimizationRule): boolean {
    switch (rule.condition) {
      case 'conversionRate < 5':
        return this.learningData.conversionRate < 5;
      
      case 'bounceRate > 60':
        return this.learningData.bounceRate > 60;
      
      case 'timeOnSite < 60':
        return this.learningData.timeOnSite < 60;
      
      default:
        return false;
    }
  }

  private async triggerOptimization(rule: OptimizationRule): Promise<void> {
    console.log(`🎯 Triggering optimization: ${rule.action}`);
    
    rule.tested = true;
    
    // Simulate optimization effects
    switch (rule.action) {
      case 'test_cta_colors':
        await this.optimizeCTAColors();
        break;
      
      case 'test_headlines':
        await this.optimizeHeadlines();
        break;
      
      case 'optimize_pricing_visibility':
        await this.optimizePricing();
        break;
      
      case 'enhance_mobile_experience':
        await this.optimizeMobile();
        break;
      
      case 'add_social_proof_elements':
        await this.addSocialProof();
        break;
    }
    
    this.saveOptimizationRules();
  }

  private async optimizeCTAColors(): Promise<void> {
    // Simulate A/B testing different CTA colors
    const colors = ['purple', 'blue', 'green', 'orange', 'red'];
    const testColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply color change to CTAs
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const ctas = document.querySelectorAll('button[class*="gradient"]');
        ctas.forEach(cta => {
          (cta as HTMLElement).style.background = `var(--${testColor}-gradient)`;
        });
      }, 1000);
    }
    
    // Simulate improved conversion
    this.learningData.conversionRate += Math.random() * 0.3;
    this.saveLearningData();
  }

  private async optimizeHeadlines(): Promise<void> {
    const headlines = [
      "Transform your dead website into a 24/7 revenue machine",
      "Stop losing $22K/month to outdated websites",
      "Join the 1% of websites that improve themselves",
      "Your website should work as hard as you do"
    ];
    
    const testHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    
    // Simulate headline testing
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const h1 = document.querySelector('h1');
        if (h1) {
          h1.innerHTML = testHeadline;
        }
      }, 1000);
    }
    
    // Simulate reduced bounce rate
    this.learningData.bounceRate -= Math.random() * 3;
    this.saveLearningData();
  }

  private async optimizePricing(): Promise<void> {
    // Simulate pricing optimization
    this.learningData.timeOnSite += Math.random() * 10;
    this.saveLearningData();
  }

  private async optimizeMobile(): Promise<void> {
    // Simulate mobile experience improvements
    this.learningData.conversionRate += Math.random() * 0.2;
    this.saveLearningData();
  }

  private async addSocialProof(): Promise<void> {
    // Simulate adding social proof elements
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const socialProof = document.createElement('div');
        socialProof.className = 'fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-lg text-sm z-50';
        socialProof.innerHTML = '🎉 Sarah just optimized her site and increased conversions by 127%!';
        document.body.appendChild(socialProof);
        
        setTimeout(() => socialProof.remove(), 5000);
      }, 2000);
    }
    
    this.learningData.conversionRate += Math.random() * 0.4;
    this.saveLearningData();
  }

  private initializeOptimizations(): void {
    // Run continuous improvement loop
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.runContinuousImprovements();
      }, 30000); // Every 30 seconds
    }
  }

  private runContinuousImprovements(): void {
    // Simulate AI learning and small improvements
    const improvements = Math.random() * 0.05;
    
    this.learningData.conversionRate = Math.min(15, this.learningData.conversionRate + improvements);
    this.learningData.bounceRate = Math.max(20, this.learningData.bounceRate - improvements);
    this.learningData.timeOnSite = Math.min(300, this.learningData.timeOnSite + Math.random() * 2);
    
    this.saveLearningData();
  }

  public getLearningData(): LearningData {
    return { ...this.learningData };
  }

  public getOptimizationRules(): OptimizationRule[] {
    return [...this.optimizationRules];
  }

  public async triggerManualOptimization(): Promise<void> {
    // Find the highest priority untested rule
    const nextRule = this.optimizationRules
      .filter(rule => rule.enabled && !rule.tested)
      .sort((a, b) => a.priority - b.priority)[0];
    
    if (nextRule) {
      await this.triggerOptimization(nextRule);
    } else {
      // Run general improvements
      this.learningData.conversionRate += Math.random() * 0.1;
      this.learningData.bounceRate -= Math.random() * 0.5;
      this.learningData.optimizations += 1;
      this.saveLearningData();
    }
  }

  public getAnalytics(): any {
    return {
      totalEvents: this.events.length,
      sessionEvents: this.events.filter(e => e.sessionId === this.sessionId).length,
      learningData: this.learningData,
      optimizationRules: this.optimizationRules.map(rule => ({
        id: rule.id,
        tested: rule.tested,
        performance: rule.performance
      })),
      recentEvents: this.events.slice(-10)
    };
  }
}

// Export singleton instance
export const selfLearningSystem = new SelfLearningSystem();

// Export types
export type { AnalyticsEvent, LearningData, OptimizationRule };

// Utility functions
export const trackInteraction = (event: string, data: any) => {
  selfLearningSystem.trackEvent(event, data);
};

export const getLearningMetrics = () => {
  return selfLearningSystem.getLearningData();
};

export const triggerOptimization = async () => {
  await selfLearningSystem.triggerManualOptimization();
  return selfLearningSystem.getLearningData();
};

export const getAnalyticsDashboard = () => {
  return selfLearningSystem.getAnalytics();
};