import { Pool } from 'pg';
import { DesignSystemDatabase } from './database';
import { VectorDatabase } from './vector-database';
import { DesignComponent, ComponentType, ComponentSource, DesignStyle } from './types';
import { generateId, scoreAesthetics, analyzeComplexity, detectStyle, extractTags } from './utils';

export interface OnboardingSiteData {
  site_id: string;
  domain: string;
  industry: string;
  business_type: 'startup' | 'enterprise' | 'agency' | 'ecommerce' | 'saas' | 'personal';
  primary_goal: 'conversion' | 'leads' | 'engagement' | 'sales' | 'brand_awareness';
  analyzed_at: Date;
  metrics: {
    initial_conversion_rate?: number;
    bounce_rate?: number;
    page_load_time?: number;
    mobile_score?: number;
    accessibility_score?: number;
  };
}

export interface ComponentPerformanceData {
  component_id: string;
  site_id: string;
  placement: 'hero' | 'above_fold' | 'below_fold' | 'footer';
  conversion_impact: number; // Percentage change
  engagement_metrics: {
    click_through_rate: number;
    time_on_element: number;
    scroll_depth_at_element: number;
    interaction_rate: number;
  };
  a_b_test_data?: {
    variant_a_performance: number;
    variant_b_performance: number;
    confidence_level: number;
    sample_size: number;
  };
  recorded_at: Date;
}

export interface LearningInsight {
  insight_type: 'component_performance' | 'industry_trend' | 'design_pattern' | 'conversion_optimization';
  confidence_score: number; // 0-100
  impact_score: number; // 0-100
  description: string;
  data_points: number;
  discovered_at: Date;
  actionable_recommendation: string;
}

export class ContinuousLearningSystem {
  private pool: Pool;
  private db: DesignSystemDatabase;
  private vectorDb: VectorDatabase;

  constructor(pool: Pool, db: DesignSystemDatabase, vectorDb: VectorDatabase) {
    this.pool = pool;
    this.db = db;
    this.vectorDb = vectorDb;
  }

  async initializeLearningTables(): Promise<void> {
    const queries = [
      // Onboarding sites tracking
      `CREATE TABLE IF NOT EXISTS onboarding_sites (
        id TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        industry TEXT NOT NULL,
        business_type TEXT NOT NULL,
        primary_goal TEXT NOT NULL,
        analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        initial_conversion_rate DECIMAL(5,2),
        bounce_rate DECIMAL(5,2),
        page_load_time DECIMAL(6,2),
        mobile_score INTEGER,
        accessibility_score INTEGER,
        components_extracted INTEGER DEFAULT 0,
        learning_status TEXT DEFAULT 'active' CHECK (learning_status IN ('active', 'paused', 'completed'))
      )`,

      // Component performance tracking per site
      `CREATE TABLE IF NOT EXISTS component_performance (
        id SERIAL PRIMARY KEY,
        component_id TEXT REFERENCES components(id) ON DELETE CASCADE,
        site_id TEXT REFERENCES onboarding_sites(id) ON DELETE CASCADE,
        placement TEXT NOT NULL,
        conversion_impact DECIMAL(5,2),
        click_through_rate DECIMAL(5,2),
        time_on_element DECIMAL(6,2),
        scroll_depth_at_element DECIMAL(5,2),
        interaction_rate DECIMAL(5,2),
        ab_test_winner BOOLEAN,
        ab_test_confidence DECIMAL(5,2),
        ab_test_sample_size INTEGER,
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(component_id, site_id, placement)
      )`,

      // Learning insights derived from data
      `CREATE TABLE IF NOT EXISTS learning_insights (
        id SERIAL PRIMARY KEY,
        insight_type TEXT NOT NULL,
        confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
        impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
        description TEXT NOT NULL,
        data_points INTEGER DEFAULT 1,
        discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        actionable_recommendation TEXT NOT NULL,
        applied_to_components TEXT[] DEFAULT '{}',
        validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected'))
      )`,

      // Site-specific extracted components (before they become global)
      `CREATE TABLE IF NOT EXISTS extracted_components (
        id TEXT PRIMARY KEY,
        site_id TEXT REFERENCES onboarding_sites(id) ON DELETE CASCADE,
        original_html TEXT NOT NULL,
        original_css TEXT NOT NULL,
        original_js TEXT,
        cleaned_html TEXT,
        cleaned_css TEXT,
        cleaned_js TEXT,
        component_type TEXT,
        performance_score INTEGER,
        aesthetic_score INTEGER,
        uniqueness_score INTEGER, -- How unique compared to existing components
        promotion_status TEXT DEFAULT 'candidate' CHECK (promotion_status IN ('candidate', 'promoted', 'rejected')),
        extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // Cross-site learning patterns
      `CREATE TABLE IF NOT EXISTS learning_patterns (
        id SERIAL PRIMARY KEY,
        pattern_name TEXT NOT NULL,
        industry TEXT,
        business_type TEXT,
        component_types TEXT[],
        performance_indicators JSONB,
        sites_observed INTEGER DEFAULT 1,
        avg_improvement DECIMAL(5,2),
        confidence_level DECIMAL(5,2),
        pattern_data JSONB,
        discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }

    // Create indexes for performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_onboarding_sites_industry ON onboarding_sites(industry)',
      'CREATE INDEX IF NOT EXISTS idx_component_performance_impact ON component_performance(conversion_impact DESC)',
      'CREATE INDEX IF NOT EXISTS idx_learning_insights_score ON learning_insights(impact_score DESC, confidence_score DESC)',
      'CREATE INDEX IF NOT EXISTS idx_extracted_components_scores ON extracted_components(performance_score DESC, aesthetic_score DESC)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_improvement ON learning_patterns(avg_improvement DESC)'
    ];

    for (const index of indexes) {
      await this.pool.query(index);
    }

    console.log('✅ Continuous learning tables initialized');
  }

  async onboardNewSite(siteData: OnboardingSiteData): Promise<void> {
    const query = `
      INSERT INTO onboarding_sites (
        id, domain, industry, business_type, primary_goal,
        initial_conversion_rate, bounce_rate, page_load_time,
        mobile_score, accessibility_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        analyzed_at = NOW(),
        initial_conversion_rate = EXCLUDED.initial_conversion_rate,
        bounce_rate = EXCLUDED.bounce_rate,
        page_load_time = EXCLUDED.page_load_time,
        mobile_score = EXCLUDED.mobile_score,
        accessibility_score = EXCLUDED.accessibility_score
    `;

    await this.pool.query(query, [
      siteData.site_id,
      siteData.domain,
      siteData.industry,
      siteData.business_type,
      siteData.primary_goal,
      siteData.metrics.initial_conversion_rate,
      siteData.metrics.bounce_rate,
      siteData.metrics.page_load_time,
      siteData.metrics.mobile_score,
      siteData.metrics.accessibility_score
    ]);

    console.log(`📊 Onboarded site: ${siteData.domain} (${siteData.industry})`);
  }

  async extractComponentFromSite(
    siteId: string, 
    htmlCode: string, 
    cssCode: string, 
    jsCode?: string
  ): Promise<string> {
    // Clean and analyze the component
    const cleanedHtml = this.cleanExtractedCode(htmlCode);
    const cleanedCss = this.cleanExtractedCode(cssCode);
    const cleanedJs = jsCode ? this.cleanExtractedCode(jsCode) : '';

    const type = this.detectComponentType(cleanedHtml, cleanedCss);
    const aestheticScore = scoreAesthetics(cleanedHtml, cleanedCss);
    const performanceScore = this.assessExtractedPerformance(cleanedHtml, cleanedCss, cleanedJs);
    const uniquenessScore = await this.calculateUniquenessScore(cleanedHtml, cleanedCss);

    const extractedId = generateId();

    const query = `
      INSERT INTO extracted_components (
        id, site_id, original_html, original_css, original_js,
        cleaned_html, cleaned_css, cleaned_js, component_type,
        performance_score, aesthetic_score, uniqueness_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    await this.pool.query(query, [
      extractedId, siteId, htmlCode, cssCode, jsCode,
      cleanedHtml, cleanedCss, cleanedJs, type,
      performanceScore, aestheticScore, uniquenessScore
    ]);

    // Auto-promote high-quality unique components
    if (aestheticScore >= 85 && uniquenessScore >= 70 && performanceScore >= 80) {
      await this.promoteComponentToGlobal(extractedId);
    }

    return extractedId;
  }

  async recordComponentPerformance(performanceData: ComponentPerformanceData): Promise<void> {
    const query = `
      INSERT INTO component_performance (
        component_id, site_id, placement, conversion_impact,
        click_through_rate, time_on_element, scroll_depth_at_element,
        interaction_rate, ab_test_winner, ab_test_confidence, ab_test_sample_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (component_id, site_id, placement) DO UPDATE SET
        conversion_impact = EXCLUDED.conversion_impact,
        click_through_rate = EXCLUDED.click_through_rate,
        time_on_element = EXCLUDED.time_on_element,
        scroll_depth_at_element = EXCLUDED.scroll_depth_at_element,
        interaction_rate = EXCLUDED.interaction_rate,
        ab_test_winner = EXCLUDED.ab_test_winner,
        ab_test_confidence = EXCLUDED.ab_test_confidence,
        ab_test_sample_size = EXCLUDED.ab_test_sample_size,
        recorded_at = NOW()
    `;

    await this.pool.query(query, [
      performanceData.component_id,
      performanceData.site_id,
      performanceData.placement,
      performanceData.conversion_impact,
      performanceData.engagement_metrics.click_through_rate,
      performanceData.engagement_metrics.time_on_element,
      performanceData.engagement_metrics.scroll_depth_at_element,
      performanceData.engagement_metrics.interaction_rate,
      performanceData.a_b_test_data?.variant_b_performance > performanceData.a_b_test_data?.variant_a_performance,
      performanceData.a_b_test_data?.confidence_level,
      performanceData.a_b_test_data?.sample_size
    ]);

    // Update global component metrics
    await this.updateGlobalComponentMetrics(performanceData.component_id);

    console.log(`📈 Recorded performance for component ${performanceData.component_id}: ${performanceData.conversion_impact}% impact`);
  }

  async generateLearningInsights(): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Insight 1: Top performing components by industry
    const industryInsights = await this.analyzeIndustryPerformance();
    insights.push(...industryInsights);

    // Insight 2: Emerging design patterns
    const patternInsights = await this.analyzeEmergingPatterns();
    insights.push(...patternInsights);

    // Insight 3: Conversion optimization opportunities
    const optimizationInsights = await this.analyzeOptimizationOpportunities();
    insights.push(...optimizationInsights);

    // Insight 4: Component placement effectiveness
    const placementInsights = await this.analyzePlacementEffectiveness();
    insights.push(...placementInsights);

    // Store insights in database
    for (const insight of insights) {
      await this.storeInsight(insight);
    }

    return insights;
  }

  private async analyzeIndustryPerformance(): Promise<LearningInsight[]> {
    const query = `
      SELECT 
        os.industry,
        c.type as component_type,
        COUNT(*) as usage_count,
        AVG(cp.conversion_impact) as avg_impact,
        AVG(c.aesthetic_score) as avg_aesthetic
      FROM component_performance cp
      JOIN components c ON cp.component_id = c.id
      JOIN onboarding_sites os ON cp.site_id = os.id
      WHERE cp.conversion_impact IS NOT NULL
      GROUP BY os.industry, c.type
      HAVING COUNT(*) >= 3 AND AVG(cp.conversion_impact) > 10
      ORDER BY avg_impact DESC
      LIMIT 10
    `;

    const result = await this.pool.query(query);
    const insights: LearningInsight[] = [];

    for (const row of result.rows) {
      insights.push({
        insight_type: 'component_performance',
        confidence_score: Math.min(row.usage_count * 10, 100),
        impact_score: Math.min(row.avg_impact * 5, 100),
        description: `${row.component_type} components perform exceptionally well in ${row.industry} industry with ${row.avg_impact.toFixed(1)}% average conversion improvement`,
        data_points: parseInt(row.usage_count),
        discovered_at: new Date(),
        actionable_recommendation: `Prioritize ${row.component_type} components for ${row.industry} websites. Focus on aesthetic scores above ${row.avg_aesthetic.toFixed(0)}/100.`
      });
    }

    return insights;
  }

  private async analyzeEmergingPatterns(): Promise<LearningInsight[]> {
    const query = `
      SELECT 
        unnest(c.tags) as pattern,
        COUNT(*) as frequency,
        AVG(cp.conversion_impact) as avg_impact,
        AVG(c.aesthetic_score) as avg_aesthetic
      FROM components c
      JOIN component_performance cp ON c.id = cp.component_id
      WHERE c.created_at >= NOW() - INTERVAL '30 days'
        AND cp.conversion_impact > 5
      GROUP BY pattern
      HAVING COUNT(*) >= 5 AND AVG(cp.conversion_impact) > 15
      ORDER BY frequency DESC, avg_impact DESC
      LIMIT 5
    `;

    const result = await this.pool.query(query);
    const insights: LearningInsight[] = [];

    for (const row of result.rows) {
      insights.push({
        insight_type: 'design_pattern',
        confidence_score: Math.min(row.frequency * 5, 100),
        impact_score: Math.min(row.avg_impact * 4, 100),
        description: `"${row.pattern}" design pattern is trending with ${row.avg_impact.toFixed(1)}% average conversion improvement across ${row.frequency} implementations`,
        data_points: parseInt(row.frequency),
        discovered_at: new Date(),
        actionable_recommendation: `Incorporate "${row.pattern}" patterns in new component designs. Target aesthetic score of ${row.avg_aesthetic.toFixed(0)}+ for maximum impact.`
      });
    }

    return insights;
  }

  private async analyzeOptimizationOpportunities(): Promise<LearningInsight[]> {
    const query = `
      SELECT 
        c.type,
        c.style,
        COUNT(*) as low_performers,
        AVG(c.aesthetic_score) as avg_aesthetic,
        AVG(cp.conversion_impact) as avg_impact
      FROM components c
      JOIN component_performance cp ON c.id = cp.component_id
      WHERE cp.conversion_impact < 5 AND c.aesthetic_score < 80
      GROUP BY c.type, c.style
      HAVING COUNT(*) >= 3
      ORDER BY low_performers DESC
      LIMIT 5
    `;

    const result = await this.pool.query(query);
    const insights: LearningInsight[] = [];

    for (const row of result.rows) {
      insights.push({
        insight_type: 'conversion_optimization',
        confidence_score: Math.min(row.low_performers * 15, 100),
        impact_score: Math.max(100 - row.avg_impact * 10, 20),
        description: `${row.type} components with ${row.style} style are underperforming with only ${row.avg_impact.toFixed(1)}% average conversion impact`,
        data_points: parseInt(row.low_performers),
        discovered_at: new Date(),
        actionable_recommendation: `Redesign ${row.type} components with ${row.style} style. Focus on improving aesthetic score above 80 and test modern alternatives.`
      });
    }

    return insights;
  }

  private async analyzePlacementEffectiveness(): Promise<LearningInsight[]> {
    const query = `
      SELECT 
        placement,
        c.type,
        COUNT(*) as usage_count,
        AVG(cp.conversion_impact) as avg_impact,
        AVG(cp.click_through_rate) as avg_ctr
      FROM component_performance cp
      JOIN components c ON cp.component_id = c.id
      WHERE cp.conversion_impact IS NOT NULL
      GROUP BY placement, c.type
      HAVING COUNT(*) >= 3
      ORDER BY avg_impact DESC
      LIMIT 8
    `;

    const result = await this.pool.query(query);
    const insights: LearningInsight[] = [];

    for (const row of result.rows) {
      insights.push({
        insight_type: 'component_performance',
        confidence_score: Math.min(row.usage_count * 12, 100),
        impact_score: Math.min(row.avg_impact * 6, 100),
        description: `${row.type} components perform best in ${row.placement} placement with ${row.avg_impact.toFixed(1)}% conversion impact and ${row.avg_ctr.toFixed(1)}% CTR`,
        data_points: parseInt(row.usage_count),
        discovered_at: new Date(),
        actionable_recommendation: `Place ${row.type} components in ${row.placement} position for maximum effectiveness. Expected CTR: ${row.avg_ctr.toFixed(1)}%.`
      });
    }

    return insights;
  }

  private async updateGlobalComponentMetrics(componentId: string): Promise<void> {
    const query = `
      UPDATE components 
      SET 
        conversion_rate = (
          SELECT AVG(conversion_impact) 
          FROM component_performance 
          WHERE component_id = $1 AND conversion_impact > 0
        ),
        usage_count = (
          SELECT COUNT(*) 
          FROM component_performance 
          WHERE component_id = $1
        ),
        updated_at = NOW()
      WHERE id = $1
    `;

    await this.pool.query(query, [componentId]);
  }

  private async promoteComponentToGlobal(extractedId: string): Promise<void> {
    // Get extracted component data
    const query = `
      SELECT ec.*, os.industry, os.business_type 
      FROM extracted_components ec
      JOIN onboarding_sites os ON ec.site_id = os.id
      WHERE ec.id = $1
    `;
    
    const result = await this.pool.query(query, [extractedId]);
    if (result.rows.length === 0) return;

    const extracted = result.rows[0];

    // Create global component
    const globalComponent: DesignComponent = {
      id: generateId(),
      name: `Extracted ${extracted.component_type} Component`,
      type: extracted.component_type,
      category: this.detectComponentCategory(extracted.component_type),
      source: ComponentSource.CUSTOM,
      html_code: extracted.cleaned_html,
      css_code: extracted.cleaned_css,
      js_code: extracted.cleaned_js || '',
      preview_url: '',
      preview_image: '',
      description: `High-performing component extracted from ${extracted.industry} industry site`,
      tags: extractTags(extracted.cleaned_html, extracted.cleaned_css, []),
      style: detectStyle(extracted.cleaned_css),
      complexity: analyzeComplexity(extracted.cleaned_html, extracted.cleaned_css, extracted.cleaned_js),
      mobile_optimized: this.checkMobileOptimization(extracted.cleaned_css),
      accessibility_score: extracted.performance_score,
      metrics: {
        aesthetic_score: extracted.aesthetic_score,
        performance_score: extracted.performance_score,
        usage_count: 0
      },
      created_at: new Date(),
      updated_at: new Date(),
      scraped_at: new Date(),
      tested_sites: 1,
      industries: [extracted.industry],
      frameworks: this.detectFrameworks(extracted.cleaned_html, extracted.cleaned_css, extracted.cleaned_js)
    };

    await this.db.insertComponent(globalComponent);

    // Update promotion status
    await this.pool.query(
      `UPDATE extracted_components SET promotion_status = 'promoted' WHERE id = $1`,
      [extractedId]
    );

    console.log(`🚀 Promoted component ${extractedId} to global database as ${globalComponent.id}`);
  }

  private cleanExtractedCode(code: string): string {
    return code
      .replace(/^\s+|\s+$/gm, '')
      .replace(/\n\s*\n/g, '\n')
      .replace(/\t/g, '  ')
      .trim();
  }

  private detectComponentType(html: string, css: string): ComponentType {
    const content = (html + css).toLowerCase();
    
    if (content.includes('button') || content.includes('btn')) return ComponentType.BUTTON;
    if (content.includes('card') || content.includes('box')) return ComponentType.CARD;
    if (content.includes('form') || content.includes('input')) return ComponentType.FORM;
    if (content.includes('hero') || content.includes('banner')) return ComponentType.HERO;
    if (content.includes('nav') || content.includes('menu')) return ComponentType.NAVIGATION;
    
    return ComponentType.CARD;
  }

  private detectComponentCategory(type: ComponentType): any {
    // Simplified category mapping
    const categoryMap = {
      [ComponentType.BUTTON]: 'interaction',
      [ComponentType.CARD]: 'display',
      [ComponentType.FORM]: 'input',
      [ComponentType.HERO]: 'layout',
      [ComponentType.NAVIGATION]: 'navigation'
    };
    
    return categoryMap[type] || 'display';
  }

  private assessExtractedPerformance(html: string, css: string, js: string): number {
    let score = 75;
    
    if (css.length > 3000) score -= 15;
    if (js.length > 2000) score -= 20;
    if (css.includes('flexbox') || css.includes('grid')) score += 10;
    if (html.includes('aria-')) score += 15;
    
    return Math.max(score, 10);
  }

  private async calculateUniquenessScore(html: string, css: string): Promise<number> {
    // Simple uniqueness calculation
    const content = html + css;
    const contentLength = content.length;
    const uniqueChars = new Set(content).size;
    
    return Math.min((uniqueChars / contentLength) * 200, 100);
  }

  private checkMobileOptimization(css: string): boolean {
    return css.includes('@media') && css.includes('max-width');
  }

  private detectFrameworks(html: string, css: string, js: string): string[] {
    const content = html + css + js;
    const frameworks: string[] = [];
    
    if (content.includes('tailwind') || css.includes('tw-')) frameworks.push('tailwind');
    if (content.includes('bootstrap')) frameworks.push('bootstrap');
    
    return frameworks.length > 0 ? frameworks : ['vanilla'];
  }

  private async storeInsight(insight: LearningInsight): Promise<void> {
    const query = `
      INSERT INTO learning_insights (
        insight_type, confidence_score, impact_score, description,
        data_points, actionable_recommendation
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `;

    await this.pool.query(query, [
      insight.insight_type,
      insight.confidence_score,
      insight.impact_score,
      insight.description,
      insight.data_points,
      insight.actionable_recommendation
    ]);
  }

  async getLearningStats(): Promise<{
    total_sites: number;
    total_extracted_components: number;
    promoted_components: number;
    avg_improvement: number;
    top_insights: LearningInsight[];
  }> {
    const [sitesResult, extractedResult, promotedResult, improvementResult] = await Promise.all([
      this.pool.query('SELECT COUNT(*) as total FROM onboarding_sites'),
      this.pool.query('SELECT COUNT(*) as total FROM extracted_components'),
      this.pool.query(`SELECT COUNT(*) as total FROM extracted_components WHERE promotion_status = 'promoted'`),
      this.pool.query('SELECT AVG(conversion_impact) as avg FROM component_performance WHERE conversion_impact > 0')
    ]);

    const insights = await this.generateLearningInsights();

    return {
      total_sites: parseInt(sitesResult.rows[0].total),
      total_extracted_components: parseInt(extractedResult.rows[0].total),
      promoted_components: parseInt(promotedResult.rows[0].total),
      avg_improvement: parseFloat(improvementResult.rows[0].avg) || 0,
      top_insights: insights.slice(0, 5)
    };
  }
}