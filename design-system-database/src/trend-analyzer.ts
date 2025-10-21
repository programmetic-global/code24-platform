import { Pool } from 'pg';
import { DesignComponent, TrendAnalysis, DesignStyle, ComponentType } from './types';
import { VectorDatabase } from './vector-database';

export interface TrendMetrics {
  trend_id: string;
  name: string;
  popularity_score: number;
  growth_rate: number;
  component_count: number;
  avg_aesthetic_score: number;
  top_components: DesignComponent[];
  emerging_patterns: string[];
}

export interface DesignTrend {
  pattern: string;
  frequency: number;
  growth_over_time: number[];
  related_components: string[];
  aesthetic_impact: number;
  conversion_impact?: number;
}

export class TrendAnalyzer {
  private pool: Pool;
  private vectorDb: VectorDatabase;

  constructor(pool: Pool, vectorDb: VectorDatabase) {
    this.pool = pool;
    this.vectorDb = vectorDb;
  }

  async analyzeTrends(timeframe: string = '30d'): Promise<TrendMetrics[]> {
    console.log(`🔍 Analyzing design trends for the last ${timeframe}...`);

    const trends: TrendMetrics[] = [];

    // Analyze style trends
    const styleTrends = await this.analyzeStyleTrends(timeframe);
    trends.push(...styleTrends);

    // Analyze component type trends
    const typeTrends = await this.analyzeComponentTypeTrends(timeframe);
    trends.push(...typeTrends);

    // Analyze emerging patterns
    const patternTrends = await this.analyzeEmergingPatterns(timeframe);
    trends.push(...patternTrends);

    // Analyze color and aesthetic trends
    const aestheticTrends = await this.analyzeAestheticTrends(timeframe);
    trends.push(...aestheticTrends);

    return trends.sort((a, b) => b.popularity_score - a.popularity_score);
  }

  private async analyzeStyleTrends(timeframe: string): Promise<TrendMetrics[]> {
    const query = `
      SELECT 
        style,
        COUNT(*) as component_count,
        AVG(aesthetic_score) as avg_aesthetic_score,
        AVG(conversion_rate) as avg_conversion_rate
      FROM components 
      WHERE created_at >= NOW() - INTERVAL $1
      GROUP BY style
      HAVING COUNT(*) >= 3
      ORDER BY component_count DESC, avg_aesthetic_score DESC
    `;

    const result = await this.pool.query(query, [timeframe]);
    const trends: TrendMetrics[] = [];

    for (const row of result.rows) {
      const topComponents = await this.getTopComponentsByStyle(row.style, 5);
      const emergingPatterns = await this.findEmergingPatterns(row.style);

      trends.push({
        trend_id: `style_${row.style}`,
        name: `${row.style.charAt(0).toUpperCase() + row.style.slice(1)} Design Style`,
        popularity_score: this.calculatePopularityScore(
          row.component_count,
          row.avg_aesthetic_score,
          row.avg_conversion_rate
        ),
        growth_rate: await this.calculateGrowthRate(row.style, 'style', timeframe),
        component_count: parseInt(row.component_count),
        avg_aesthetic_score: parseFloat(row.avg_aesthetic_score),
        top_components: topComponents,
        emerging_patterns: emergingPatterns
      });
    }

    return trends;
  }

  private async analyzeComponentTypeTrends(timeframe: string): Promise<TrendMetrics[]> {
    const query = `
      SELECT 
        type,
        COUNT(*) as component_count,
        AVG(aesthetic_score) as avg_aesthetic_score,
        AVG(conversion_rate) as avg_conversion_rate
      FROM components 
      WHERE created_at >= NOW() - INTERVAL $1
      GROUP BY type
      HAVING COUNT(*) >= 2
      ORDER BY component_count DESC
    `;

    const result = await this.pool.query(query, [timeframe]);
    const trends: TrendMetrics[] = [];

    for (const row of result.rows) {
      const topComponents = await this.getTopComponentsByType(row.type, 5);
      const emergingPatterns = await this.findEmergingPatterns(row.type);

      trends.push({
        trend_id: `type_${row.type}`,
        name: `${row.type.charAt(0).toUpperCase() + row.type.slice(1)} Components`,
        popularity_score: this.calculatePopularityScore(
          row.component_count,
          row.avg_aesthetic_score,
          row.avg_conversion_rate
        ),
        growth_rate: await this.calculateGrowthRate(row.type, 'type', timeframe),
        component_count: parseInt(row.component_count),
        avg_aesthetic_score: parseFloat(row.avg_aesthetic_score),
        top_components: topComponents,
        emerging_patterns: emergingPatterns
      });
    }

    return trends;
  }

  private async analyzeEmergingPatterns(timeframe: string): Promise<TrendMetrics[]> {
    // Analyze tag combinations that are trending
    const query = `
      SELECT 
        tag,
        COUNT(*) as frequency,
        AVG(aesthetic_score) as avg_aesthetic_score
      FROM components c, unnest(tags) as tag
      WHERE c.created_at >= NOW() - INTERVAL $1
      GROUP BY tag
      HAVING COUNT(*) >= 3
      ORDER BY frequency DESC, avg_aesthetic_score DESC
      LIMIT 10
    `;

    const result = await this.pool.query(query, [timeframe]);
    const trends: TrendMetrics[] = [];

    for (const row of result.rows) {
      const relatedComponents = await this.getComponentsByTag(row.tag, 5);
      
      trends.push({
        trend_id: `pattern_${row.tag}`,
        name: `"${row.tag}" Design Pattern`,
        popularity_score: this.calculatePopularityScore(
          row.frequency,
          row.avg_aesthetic_score,
          null
        ),
        growth_rate: await this.calculateTagGrowthRate(row.tag, timeframe),
        component_count: parseInt(row.frequency),
        avg_aesthetic_score: parseFloat(row.avg_aesthetic_score),
        top_components: relatedComponents,
        emerging_patterns: [row.tag]
      });
    }

    return trends;
  }

  private async analyzeAestheticTrends(timeframe: string): Promise<TrendMetrics[]> {
    // Analyze high-performing aesthetic patterns
    const query = `
      SELECT 
        CASE 
          WHEN aesthetic_score >= 90 THEN 'premium'
          WHEN aesthetic_score >= 80 THEN 'high-quality'
          WHEN aesthetic_score >= 70 THEN 'good'
          ELSE 'basic'
        END as aesthetic_tier,
        COUNT(*) as component_count,
        AVG(aesthetic_score) as avg_aesthetic_score,
        AVG(conversion_rate) as avg_conversion_rate
      FROM components 
      WHERE created_at >= NOW() - INTERVAL $1
      GROUP BY aesthetic_tier
      ORDER BY avg_aesthetic_score DESC
    `;

    const result = await this.pool.query(query, [timeframe]);
    const trends: TrendMetrics[] = [];

    for (const row of result.rows) {
      if (row.aesthetic_tier === 'basic') continue; // Skip basic quality

      const topComponents = await this.getTopComponentsByAestheticTier(row.aesthetic_tier, 5);
      
      trends.push({
        trend_id: `aesthetic_${row.aesthetic_tier}`,
        name: `${row.aesthetic_tier.charAt(0).toUpperCase() + row.aesthetic_tier.slice(1)} Aesthetic`,
        popularity_score: this.calculatePopularityScore(
          row.component_count,
          row.avg_aesthetic_score,
          row.avg_conversion_rate
        ),
        growth_rate: await this.calculateAestheticGrowthRate(row.aesthetic_tier, timeframe),
        component_count: parseInt(row.component_count),
        avg_aesthetic_score: parseFloat(row.avg_aesthetic_score),
        top_components: topComponents,
        emerging_patterns: [`${row.aesthetic_tier}-quality`]
      });
    }

    return trends;
  }

  private calculatePopularityScore(
    componentCount: number,
    avgAestheticScore: number,
    avgConversionRate?: number
  ): number {
    let score = 0;

    // Component count contribution (0-40 points)
    score += Math.min(componentCount * 2, 40);

    // Aesthetic score contribution (0-30 points)
    score += (avgAestheticScore / 100) * 30;

    // Conversion rate contribution (0-30 points)
    if (avgConversionRate) {
      score += Math.min(avgConversionRate * 6, 30);
    } else {
      score += 15; // Default bonus for patterns without conversion data
    }

    return Math.min(score, 100);
  }

  private async calculateGrowthRate(
    value: string,
    field: 'style' | 'type',
    timeframe: string
  ): Promise<number> {
    // Calculate growth rate by comparing current period vs previous period
    const currentQuery = `
      SELECT COUNT(*) as current_count
      FROM components 
      WHERE ${field} = $1 AND created_at >= NOW() - INTERVAL $2
    `;

    const previousQuery = `
      SELECT COUNT(*) as previous_count
      FROM components 
      WHERE ${field} = $1 
        AND created_at >= NOW() - INTERVAL $2 * 2
        AND created_at < NOW() - INTERVAL $2
    `;

    const [currentResult, previousResult] = await Promise.all([
      this.pool.query(currentQuery, [value, timeframe]),
      this.pool.query(previousQuery, [value, timeframe])
    ]);

    const currentCount = parseInt(currentResult.rows[0].current_count);
    const previousCount = parseInt(previousResult.rows[0].previous_count);

    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    
    return ((currentCount - previousCount) / previousCount) * 100;
  }

  private async calculateTagGrowthRate(tag: string, timeframe: string): Promise<number> {
    const currentQuery = `
      SELECT COUNT(*) as current_count
      FROM components 
      WHERE $1 = ANY(tags) AND created_at >= NOW() - INTERVAL $2
    `;

    const previousQuery = `
      SELECT COUNT(*) as previous_count
      FROM components 
      WHERE $1 = ANY(tags)
        AND created_at >= NOW() - INTERVAL $2 * 2
        AND created_at < NOW() - INTERVAL $2
    `;

    const [currentResult, previousResult] = await Promise.all([
      this.pool.query(currentQuery, [tag, timeframe]),
      this.pool.query(previousQuery, [tag, timeframe])
    ]);

    const currentCount = parseInt(currentResult.rows[0].current_count);
    const previousCount = parseInt(previousResult.rows[0].previous_count);

    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    
    return ((currentCount - previousCount) / previousCount) * 100;
  }

  private async calculateAestheticGrowthRate(tier: string, timeframe: string): Promise<number> {
    const scoreRange = this.getAestheticScoreRange(tier);
    
    const currentQuery = `
      SELECT COUNT(*) as current_count
      FROM components 
      WHERE aesthetic_score >= $1 AND aesthetic_score < $2 
        AND created_at >= NOW() - INTERVAL $3
    `;

    const previousQuery = `
      SELECT COUNT(*) as previous_count
      FROM components 
      WHERE aesthetic_score >= $1 AND aesthetic_score < $2
        AND created_at >= NOW() - INTERVAL $3 * 2
        AND created_at < NOW() - INTERVAL $3
    `;

    const [currentResult, previousResult] = await Promise.all([
      this.pool.query(currentQuery, [scoreRange.min, scoreRange.max, timeframe]),
      this.pool.query(previousQuery, [scoreRange.min, scoreRange.max, timeframe])
    ]);

    const currentCount = parseInt(currentResult.rows[0].current_count);
    const previousCount = parseInt(previousResult.rows[0].previous_count);

    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    
    return ((currentCount - previousCount) / previousCount) * 100;
  }

  private getAestheticScoreRange(tier: string): { min: number; max: number } {
    switch (tier) {
      case 'premium': return { min: 90, max: 100 };
      case 'high-quality': return { min: 80, max: 90 };
      case 'good': return { min: 70, max: 80 };
      default: return { min: 0, max: 70 };
    }
  }

  private async getTopComponentsByStyle(style: string, limit: number): Promise<DesignComponent[]> {
    return this.vectorDb.findComponentsByStyle(style, limit);
  }

  private async getTopComponentsByType(type: string, limit: number): Promise<DesignComponent[]> {
    const query = `
      SELECT * FROM components
      WHERE type = $1
      ORDER BY aesthetic_score DESC, conversion_rate DESC NULLS LAST
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [type, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  private async getComponentsByTag(tag: string, limit: number): Promise<DesignComponent[]> {
    const query = `
      SELECT * FROM components
      WHERE $1 = ANY(tags)
      ORDER BY aesthetic_score DESC, conversion_rate DESC NULLS LAST
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [tag, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  private async getTopComponentsByAestheticTier(tier: string, limit: number): Promise<DesignComponent[]> {
    const scoreRange = this.getAestheticScoreRange(tier);
    
    const query = `
      SELECT * FROM components
      WHERE aesthetic_score >= $1 AND aesthetic_score < $2
      ORDER BY aesthetic_score DESC, conversion_rate DESC NULLS LAST
      LIMIT $3
    `;
    
    const result = await this.pool.query(query, [scoreRange.min, scoreRange.max, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  private async findEmergingPatterns(filterValue: string): Promise<string[]> {
    // Find patterns that frequently co-occur with the filter value
    const query = `
      SELECT 
        unnest(tags) as pattern,
        COUNT(*) as frequency
      FROM components
      WHERE (style = $1 OR type = $1 OR $1 = ANY(tags))
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY pattern
      HAVING COUNT(*) >= 2
      ORDER BY frequency DESC
      LIMIT 5
    `;
    
    const result = await this.pool.query(query, [filterValue]);
    return result.rows.map(row => row.pattern).filter(p => p !== filterValue);
  }

  async detectBreakingTrends(minGrowthRate: number = 50): Promise<TrendMetrics[]> {
    const allTrends = await this.analyzeTrends('14d'); // Shorter timeframe for breaking trends
    
    return allTrends.filter(trend => 
      trend.growth_rate >= minGrowthRate && 
      trend.component_count >= 3
    );
  }

  async predictTrendTrajectory(trendId: string): Promise<{
    trend: TrendMetrics;
    prediction: {
      next_30d_growth: number;
      confidence_score: number;
      market_impact: 'low' | 'medium' | 'high';
      recommendation: string;
    };
  }> {
    const trends = await this.analyzeTrends('30d');
    const trend = trends.find(t => t.trend_id === trendId);
    
    if (!trend) {
      throw new Error(`Trend ${trendId} not found`);
    }

    // Simple prediction model based on current metrics
    const predicted_growth = trend.growth_rate * 0.8; // Assume some momentum loss
    const confidence = Math.min(trend.component_count * 10, 100);
    
    let market_impact: 'low' | 'medium' | 'high' = 'low';
    if (trend.popularity_score > 80) market_impact = 'high';
    else if (trend.popularity_score > 60) market_impact = 'medium';

    let recommendation = 'Monitor for further development';
    if (market_impact === 'high' && trend.growth_rate > 30) {
      recommendation = 'Strongly recommend adoption - high impact trend with strong growth';
    } else if (market_impact === 'medium' && trend.growth_rate > 20) {
      recommendation = 'Consider early adoption - emerging trend with good potential';
    }

    return {
      trend,
      prediction: {
        next_30d_growth: predicted_growth,
        confidence_score: confidence,
        market_impact,
        recommendation
      }
    };
  }

  async generateTrendReport(): Promise<{
    summary: string;
    top_trends: TrendMetrics[];
    breaking_trends: TrendMetrics[];
    recommendations: string[];
  }> {
    const [allTrends, breakingTrends] = await Promise.all([
      this.analyzeTrends('30d'),
      this.detectBreakingTrends(40)
    ]);

    const topTrends = allTrends.slice(0, 10);
    
    const recommendations = this.generateRecommendations(topTrends, breakingTrends);
    
    const summary = this.generateTrendSummary(topTrends, breakingTrends);

    return {
      summary,
      top_trends: topTrends,
      breaking_trends: breakingTrends,
      recommendations
    };
  }

  private generateRecommendations(topTrends: TrendMetrics[], breakingTrends: TrendMetrics[]): string[] {
    const recommendations: string[] = [];

    // Recommend high-performing styles
    const topStyle = topTrends.find(t => t.trend_id.startsWith('style_'));
    if (topStyle && topStyle.avg_aesthetic_score > 85) {
      recommendations.push(`Prioritize ${topStyle.name} - highest aesthetic scores (${topStyle.avg_aesthetic_score.toFixed(1)}/100)`);
    }

    // Recommend breaking trends
    if (breakingTrends.length > 0) {
      const breaking = breakingTrends[0];
      recommendations.push(`Early adoption opportunity: ${breaking.name} showing ${breaking.growth_rate.toFixed(1)}% growth`);
    }

    // Recommend component types
    const topType = topTrends.find(t => t.trend_id.startsWith('type_'));
    if (topType && topType.component_count > 5) {
      recommendations.push(`Focus on ${topType.name} - high demand with ${topType.component_count} components`);
    }

    return recommendations;
  }

  private generateTrendSummary(topTrends: TrendMetrics[], breakingTrends: TrendMetrics[]): string {
    const totalComponents = topTrends.reduce((sum, trend) => sum + trend.component_count, 0);
    const avgAesthetic = topTrends.reduce((sum, trend) => sum + trend.avg_aesthetic_score, 0) / topTrends.length;
    
    return `Analysis of ${totalComponents} components reveals ${topTrends.length} major trends with average aesthetic score of ${avgAesthetic.toFixed(1)}/100. ${breakingTrends.length} breaking trends identified with significant growth potential.`;
  }

  private mapRowToComponent(row: any): DesignComponent {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      source: row.source,
      html_code: row.html_code,
      css_code: row.css_code,
      js_code: row.js_code,
      preview_url: row.preview_url,
      preview_image: row.preview_image,
      description: row.description,
      tags: row.tags || [],
      style: row.style,
      complexity: row.complexity,
      mobile_optimized: row.mobile_optimized,
      accessibility_score: row.accessibility_score,
      metrics: {
        conversion_rate: row.conversion_rate,
        engagement_score: row.engagement_score,
        aesthetic_score: row.aesthetic_score,
        performance_score: row.performance_score,
        user_rating: row.user_rating,
        usage_count: row.usage_count || 0,
        avg_load_time: row.avg_load_time,
        bounce_rate_impact: row.bounce_rate_impact
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
      scraped_at: row.scraped_at,
      tested_sites: row.tested_sites || 0,
      industries: row.industries || [],
      frameworks: row.frameworks || []
    };
  }
}