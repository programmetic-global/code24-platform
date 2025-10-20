import { sanitizeResponse } from '../../shared/security-utils';

export interface Env {
  DB_MAIN: D1Database;
  DB_ANALYTICS: D1Database;
  LEARNING_STORAGE: R2Bucket;
  AI: any;
}

interface CrossSiteLearning {
  id: string;
  pattern_type: 'design' | 'conversion' | 'content' | 'performance' | 'seo' | 'psychology';
  industry: string;
  pattern_data: any;
  success_metrics: any;
  confidence_score: number;
  sites_contributing: number;
  last_updated: string;
}

interface LearningInsight {
  id: string;
  site_id: string;
  insight_type: string;
  source_pattern_id: string;
  recommendation: string;
  expected_impact: string;
  confidence: number;
  implementation_priority: number;
  cross_site_evidence: any;
}

interface NetworkIntelligence {
  pattern: string;
  frequency: number;
  success_rate: number;
  industries: string[];
  average_improvement: number;
  confidence_level: number;
}

async function generateId(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      if (request.method === 'POST' && url.pathname === '/analyze') {
        const { site_id, analysis_type = 'full' } = await request.json();
        
        if (!site_id) {
          return new Response(JSON.stringify({ error: 'Missing site_id' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Get site information
        const site = await env.DB_MAIN.prepare(
          'SELECT * FROM sites WHERE id = ?'
        ).bind(site_id).first();

        if (!site) {
          return new Response(JSON.stringify({ error: 'Site not found' }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Analyze cross-site patterns and generate insights
        const insights = await analyzeCrossSitePatterns(site, analysis_type, env);
        
        // Store insights
        for (const insight of insights) {
          await env.DB_ANALYTICS.prepare(`
            INSERT INTO learning_insights 
            (id, site_id, insight_type, source_pattern_id, recommendation, expected_impact, confidence, implementation_priority, cross_site_evidence, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            insight.id, site_id, insight.insight_type, insight.source_pattern_id,
            insight.recommendation, insight.expected_impact, insight.confidence,
            insight.implementation_priority, JSON.stringify(insight.cross_site_evidence),
            new Date().toISOString()
          ).run();
        }

        return sanitizeResponse(new Response(JSON.stringify({
          success: true,
          insights_generated: insights.length,
          insights: insights.slice(0, 10) // Return top 10 insights
        }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/patterns') {
        const industry = url.searchParams.get('industry');
        const pattern_type = url.searchParams.get('type');
        const min_confidence = parseFloat(url.searchParams.get('min_confidence') || '70');

        let query = `
          SELECT * FROM cross_site_patterns 
          WHERE confidence_score >= ?
        `;
        const params = [min_confidence];

        if (industry) {
          query += ' AND industry = ?';
          params.push(industry);
        }

        if (pattern_type) {
          query += ' AND pattern_type = ?';
          params.push(pattern_type);
        }

        query += ' ORDER BY confidence_score DESC, sites_contributing DESC LIMIT 50';

        const patterns = await env.DB_ANALYTICS.prepare(query).bind(...params).all();

        return sanitizeResponse(new Response(JSON.stringify(patterns.results), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'POST' && url.pathname === '/learn') {
        const { site_id, optimization_result } = await request.json();
        
        if (!site_id || !optimization_result) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Process new learning from optimization result
        await processNewLearning(site_id, optimization_result, env);

        return sanitizeResponse(new Response(JSON.stringify({ 
          success: true,
          message: 'Learning processed and integrated into network intelligence'
        }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/insights') {
        const site_id = url.searchParams.get('site_id');
        const insight_type = url.searchParams.get('type');

        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        let query = `
          SELECT * FROM learning_insights 
          WHERE site_id = ?
        `;
        const params = [site_id];

        if (insight_type) {
          query += ' AND insight_type = ?';
          params.push(insight_type);
        }

        query += ' ORDER BY implementation_priority DESC, confidence DESC LIMIT 20';

        const insights = await env.DB_ANALYTICS.prepare(query).bind(...params).all();

        return sanitizeResponse(new Response(JSON.stringify(insights.results), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'POST' && url.pathname === '/network-intelligence') {
        const networkIntelligence = await generateNetworkIntelligence(env);
        
        return sanitizeResponse(new Response(JSON.stringify(networkIntelligence), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      return new Response('Cross-Site Learning Worker - Ready', { status: 200 });

    } catch (error) {
      console.error('Cross-site learning error:', error);
      return sanitizeResponse(new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: (error as Error).message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  }
};

// =================================================================
// CROSS-SITE LEARNING INTELLIGENCE (PRD Network Effects)
// =================================================================

async function analyzeCrossSitePatterns(site: any, analysisType: string, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // 1. Industry-specific pattern analysis
  const industryInsights = await analyzeIndustryPatterns(site, env);
  insights.push(...industryInsights);

  // 2. Goal-type pattern analysis
  const goalInsights = await analyzeGoalTypePatterns(site, env);
  insights.push(...goalInsights);

  // 3. Cross-industry successful patterns
  const crossIndustryInsights = await analyzeCrossIndustryPatterns(site, env);
  insights.push(...crossIndustryInsights);

  // 4. Performance optimization patterns
  const performanceInsights = await analyzePerformancePatterns(site, env);
  insights.push(...performanceInsights);

  // 5. Conversion psychology patterns
  const psychologyInsights = await analyzePsychologyPatterns(site, env);
  insights.push(...psychologyInsights);

  // Sort by implementation priority and confidence
  return insights.sort((a, b) => 
    (b.implementation_priority * b.confidence) - (a.implementation_priority * a.confidence)
  );
}

async function analyzeIndustryPatterns(site: any, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // Get successful patterns from similar businesses
  const industryPatterns = await env.DB_ANALYTICS.prepare(`
    SELECT pattern_type, pattern_data, success_metrics, confidence_score, sites_contributing
    FROM cross_site_patterns 
    WHERE industry = ? AND confidence_score >= 80
    ORDER BY confidence_score DESC, sites_contributing DESC
    LIMIT 10
  `).bind(site.business_type).all();

  for (const pattern of industryPatterns.results) {
    const patternData = JSON.parse(pattern.pattern_data);
    const successMetrics = JSON.parse(pattern.success_metrics);

    insights.push({
      id: await generateId(),
      site_id: site.id,
      insight_type: 'industry_pattern',
      source_pattern_id: pattern.id || await generateId(),
      recommendation: generateIndustryRecommendation(patternData, site.business_type),
      expected_impact: `${successMetrics.average_improvement}% improvement based on ${pattern.sites_contributing} similar sites`,
      confidence: pattern.confidence_score,
      implementation_priority: calculatePriority(pattern.confidence_score, pattern.sites_contributing),
      cross_site_evidence: {
        pattern_type: pattern.pattern_type,
        sites_tested: pattern.sites_contributing,
        success_rate: successMetrics.success_rate,
        industry: site.business_type,
        evidence_strength: 'high'
      }
    });
  }

  return insights;
}

async function analyzeGoalTypePatterns(site: any, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // Get patterns that worked for sites with similar goals
  const goalPatterns = await env.DB_ANALYTICS.prepare(`
    SELECT cp.*, COUNT(co.id) as successful_applications
    FROM cross_site_patterns cp
    LEFT JOIN conversion_opportunities co ON co.type = cp.pattern_type
    WHERE cp.pattern_data LIKE '%' || ? || '%'
    AND cp.confidence_score >= 75
    GROUP BY cp.id
    ORDER BY successful_applications DESC, cp.confidence_score DESC
    LIMIT 8
  `).bind(site.primary_goal).all();

  for (const pattern of goalPatterns.results) {
    const patternData = JSON.parse(pattern.pattern_data);

    insights.push({
      id: await generateId(),
      site_id: site.id,
      insight_type: 'goal_optimization',
      source_pattern_id: pattern.id || await generateId(),
      recommendation: generateGoalRecommendation(patternData, site.primary_goal),
      expected_impact: `Optimized for ${site.primary_goal} goals - ${pattern.successful_applications} successful implementations`,
      confidence: pattern.confidence_score,
      implementation_priority: calculatePriority(pattern.confidence_score, pattern.successful_applications),
      cross_site_evidence: {
        pattern_type: pattern.pattern_type,
        goal_alignment: site.primary_goal,
        successful_applications: pattern.successful_applications,
        evidence_strength: 'medium'
      }
    });
  }

  return insights;
}

async function analyzeCrossIndustryPatterns(site: any, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // Find universally successful patterns across all industries
  const universalPatterns = await env.DB_ANALYTICS.prepare(`
    SELECT pattern_type, pattern_data, success_metrics, 
           AVG(confidence_score) as avg_confidence, 
           COUNT(DISTINCT industry) as industries_count,
           SUM(sites_contributing) as total_sites
    FROM cross_site_patterns 
    WHERE confidence_score >= 70
    GROUP BY pattern_type, pattern_data
    HAVING industries_count >= 3 AND total_sites >= 20
    ORDER BY avg_confidence DESC, total_sites DESC
    LIMIT 6
  `).bind().all();

  for (const pattern of universalPatterns.results) {
    const patternData = JSON.parse(pattern.pattern_data);
    const successMetrics = JSON.parse(pattern.success_metrics);

    insights.push({
      id: await generateId(),
      site_id: site.id,
      insight_type: 'universal_pattern',
      source_pattern_id: await generateId(),
      recommendation: generateUniversalRecommendation(patternData, pattern.pattern_type),
      expected_impact: `Universal pattern - proven across ${pattern.industries_count} industries, ${pattern.total_sites} sites`,
      confidence: pattern.avg_confidence,
      implementation_priority: calculatePriority(pattern.avg_confidence, pattern.total_sites / 10),
      cross_site_evidence: {
        pattern_type: pattern.pattern_type,
        industries_proven: pattern.industries_count,
        total_sites_tested: pattern.total_sites,
        universality_score: pattern.industries_count * 10,
        evidence_strength: 'very_high'
      }
    });
  }

  return insights;
}

async function analyzePerformancePatterns(site: any, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // Get performance optimization patterns that worked
  const performancePatterns = await env.DB_ANALYTICS.prepare(`
    SELECT optimization_type, expected_improvement, actual_improvement, implementation, COUNT(*) as usage_count
    FROM performance_optimizations po
    JOIN performance_issues pi ON po.issue_id = pi.id
    WHERE po.status = 'implemented' AND po.actual_improvement IS NOT NULL
    GROUP BY optimization_type, implementation
    HAVING usage_count >= 5
    ORDER BY AVG(CAST(SUBSTR(actual_improvement, 1, INSTR(actual_improvement, '%') - 1) AS REAL)) DESC
    LIMIT 8
  `).bind().all();

  for (const pattern of performancePatterns.results) {
    insights.push({
      id: await generateId(),
      site_id: site.id,
      insight_type: 'performance_optimization',
      source_pattern_id: await generateId(),
      recommendation: `Implement ${pattern.optimization_type} optimization using ${pattern.implementation} approach`,
      expected_impact: `${pattern.expected_improvement} based on ${pattern.usage_count} successful implementations`,
      confidence: Math.min(95, 60 + (pattern.usage_count * 5)), // Confidence based on usage
      implementation_priority: calculatePriority(70, pattern.usage_count),
      cross_site_evidence: {
        optimization_type: pattern.optimization_type,
        implementation_method: pattern.implementation,
        successful_uses: pattern.usage_count,
        average_improvement: pattern.expected_improvement,
        evidence_strength: 'high'
      }
    });
  }

  return insights;
}

async function analyzePsychologyPatterns(site: any, env: Env): Promise<LearningInsight[]> {
  const insights: LearningInsight[] = [];

  // Get psychology tactics that worked across sites
  const psychologyPatterns = await env.DB_ANALYTICS.prepare(`
    SELECT psychology_principle, emotional_trigger, type, 
           AVG(conversion_goal_alignment) as avg_alignment,
           COUNT(*) as usage_count
    FROM conversion_opportunities 
    WHERE psychology_principle IS NOT NULL 
    AND status IN ('completed', 'testing')
    AND conversion_goal_alignment >= 70
    GROUP BY psychology_principle, emotional_trigger, type
    HAVING usage_count >= 3
    ORDER BY avg_alignment DESC, usage_count DESC
    LIMIT 6
  `).bind().all();

  for (const pattern of psychologyPatterns.results) {
    insights.push({
      id: await generateId(),
      site_id: site.id,
      insight_type: 'psychology_optimization',
      source_pattern_id: await generateId(),
      recommendation: `Apply ${pattern.psychology_principle} using ${pattern.type} tactics targeting ${pattern.emotional_trigger}`,
      expected_impact: `${Math.round(pattern.avg_alignment)}% goal alignment based on psychology principles`,
      confidence: Math.min(90, 50 + (pattern.usage_count * 10)),
      implementation_priority: calculatePriority(pattern.avg_alignment, pattern.usage_count),
      cross_site_evidence: {
        psychology_principle: pattern.psychology_principle,
        emotional_trigger: pattern.emotional_trigger,
        tactic_type: pattern.type,
        successful_applications: pattern.usage_count,
        average_alignment: pattern.avg_alignment,
        evidence_strength: 'medium'
      }
    });
  }

  return insights;
}

async function processNewLearning(siteId: string, optimizationResult: any, env: Env): Promise<void> {
  // Extract learnings from optimization results
  const site = await env.DB_MAIN.prepare('SELECT * FROM sites WHERE id = ?').bind(siteId).first();
  
  if (!site) return;

  // Update or create cross-site pattern
  const patternId = await generateId();
  const patternData = {
    optimization_type: optimizationResult.type,
    implementation_details: optimizationResult.implementation,
    context: {
      business_type: site.business_type,
      goal_type: site.primary_goal,
      site_characteristics: optimizationResult.site_context
    }
  };

  const successMetrics = {
    improvement_percentage: optimizationResult.improvement,
    confidence_level: optimizationResult.confidence,
    implementation_effort: optimizationResult.effort,
    success_rate: optimizationResult.success ? 100 : 0,
    average_improvement: optimizationResult.improvement
  };

  // Check if similar pattern exists
  const existingPattern = await env.DB_ANALYTICS.prepare(`
    SELECT id, sites_contributing, success_metrics 
    FROM cross_site_patterns 
    WHERE pattern_type = ? AND industry = ?
    AND pattern_data LIKE '%' || ? || '%'
    LIMIT 1
  `).bind(
    optimizationResult.type,
    site.business_type,
    optimizationResult.implementation
  ).first();

  if (existingPattern) {
    // Update existing pattern
    const currentMetrics = JSON.parse(existingPattern.success_metrics);
    const newSitesCount = existingPattern.sites_contributing + 1;
    const updatedMetrics = {
      ...currentMetrics,
      average_improvement: (currentMetrics.average_improvement + optimizationResult.improvement) / 2,
      success_rate: ((currentMetrics.success_rate * existingPattern.sites_contributing) + (optimizationResult.success ? 100 : 0)) / newSitesCount
    };

    await env.DB_ANALYTICS.prepare(`
      UPDATE cross_site_patterns 
      SET sites_contributing = ?, success_metrics = ?, last_updated = ?,
          confidence_score = ?
      WHERE id = ?
    `).bind(
      newSitesCount,
      JSON.stringify(updatedMetrics),
      new Date().toISOString(),
      Math.min(95, 50 + (newSitesCount * 3)), // Increase confidence with more data
      existingPattern.id
    ).run();
  } else {
    // Create new pattern
    await env.DB_ANALYTICS.prepare(`
      INSERT INTO cross_site_patterns 
      (id, pattern_type, industry, pattern_data, success_metrics, confidence_score, sites_contributing, created_at, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).bind(
      patternId,
      optimizationResult.type,
      site.business_type,
      JSON.stringify(patternData),
      JSON.stringify(successMetrics),
      optimizationResult.confidence || 75,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();
  }
}

async function generateNetworkIntelligence(env: Env): Promise<NetworkIntelligence[]> {
  const intelligence = await env.DB_ANALYTICS.prepare(`
    SELECT 
      pattern_type as pattern,
      COUNT(*) as frequency,
      AVG(CAST(JSON_EXTRACT(success_metrics, '$.success_rate') AS REAL)) as success_rate,
      GROUP_CONCAT(DISTINCT industry) as industries,
      AVG(CAST(JSON_EXTRACT(success_metrics, '$.average_improvement') AS REAL)) as average_improvement,
      AVG(confidence_score) as confidence_level
    FROM cross_site_patterns 
    WHERE confidence_score >= 70
    GROUP BY pattern_type
    HAVING frequency >= 3
    ORDER BY success_rate DESC, frequency DESC
  `).bind().all();

  return intelligence.results.map(row => ({
    pattern: row.pattern,
    frequency: row.frequency,
    success_rate: row.success_rate || 0,
    industries: row.industries ? row.industries.split(',') : [],
    average_improvement: row.average_improvement || 0,
    confidence_level: row.confidence_level || 0
  }));
}

// Helper functions
function generateIndustryRecommendation(patternData: any, businessType: string): string {
  const recommendations = {
    'dental': `Based on ${businessType} industry patterns: ${patternData.optimization_type} has proven effective for patient acquisition`,
    'restaurant': `Restaurant industry insight: ${patternData.optimization_type} improves customer engagement and reservations`,
    'saas': `SaaS optimization: ${patternData.optimization_type} increases trial-to-paid conversion rates`,
    'ecommerce': `E-commerce pattern: ${patternData.optimization_type} reduces cart abandonment and increases sales`,
    'default': `Industry-specific optimization: ${patternData.optimization_type} shows strong results for ${businessType} businesses`
  };

  return recommendations[businessType] || recommendations.default;
}

function generateGoalRecommendation(patternData: any, goalType: string): string {
  const goalRecommendations = {
    'sales': `Sales optimization: ${patternData.optimization_type} directly increases purchase conversion rates`,
    'leads': `Lead generation: ${patternData.optimization_type} improves contact form submissions and inquiries`,
    'signups': `Signup conversion: ${patternData.optimization_type} reduces friction in registration process`,
    'bookings': `Booking optimization: ${patternData.optimization_type} increases appointment scheduling completion`,
    'default': `Goal-aligned optimization: ${patternData.optimization_type} supports ${goalType} objectives`
  };

  return goalRecommendations[goalType] || goalRecommendations.default;
}

function generateUniversalRecommendation(patternData: any, patternType: string): string {
  return `Universal best practice: ${patternData.optimization_type || patternType} has proven successful across multiple industries and goal types. This optimization consistently delivers results regardless of business context.`;
}

function calculatePriority(confidence: number, contributingFactor: number): number {
  // Priority score from 1-10 based on confidence and supporting evidence
  const baseScore = (confidence / 100) * 5; // 0-5 from confidence
  const evidenceBonus = Math.min(5, contributingFactor / 5); // 0-5 from evidence
  return Math.round(baseScore + evidenceBonus);
}