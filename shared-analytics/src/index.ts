import { sanitizeResponse } from '../../shared/security-utils';

export interface Env {
  DB_MAIN: D1Database;
  DB_ANALYTICS: D1Database;
  ANALYTICS_STORAGE: R2Bucket;
  AI: any;
  // All optimization workers
  SEO_OPTIMIZER: Fetcher;
  CONVERSION_OPTIMIZER: Fetcher;
  PERFORMANCE_MONITOR: Fetcher;
  CROSS_SITE_LEARNING: Fetcher;
  SITE_BUILDER: Fetcher;
}

interface UnifiedAnalytics {
  site_id: string;
  date: string;
  metrics: {
    performance: PerformanceMetrics;
    conversion: ConversionMetrics;
    seo: SEOMetrics;
    cross_site_learning: LearningMetrics;
  };
  optimization_opportunities: number;
  network_intelligence_score: number;
  competitive_position: string;
}

interface PerformanceMetrics {
  overall_score: number;
  core_web_vitals: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    ttfb: number;
  };
  real_time_alerts: number;
  optimizations_applied: number;
}

interface ConversionMetrics {
  conversion_score: number;
  psychology_tactics_active: number;
  goal_alignment_score: number;
  opportunities_identified: number;
  ab_tests_running: number;
}

interface SEOMetrics {
  seo_score: number;
  geo_optimization_level: number;
  brand_mention_potential: number;
  ai_engine_readiness: number;
  keyword_rankings: any[];
}

interface LearningMetrics {
  patterns_applied: number;
  network_intelligence_used: number;
  cross_industry_insights: number;
  learning_acceleration: number;
  confidence_score: number;
}

interface PlatformIntelligence {
  total_sites: number;
  total_optimizations: number;
  network_learning_velocity: number;
  top_performing_patterns: any[];
  industry_benchmarks: any[];
  success_rate: number;
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
      if (request.method === 'GET' && url.pathname === '/unified-dashboard') {
        const site_id = url.searchParams.get('site_id');
        const timeframe = url.searchParams.get('timeframe') || '30d';

        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const unifiedData = await generateUnifiedDashboard(site_id, timeframe, env);

        return sanitizeResponse(new Response(JSON.stringify(unifiedData), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/platform-intelligence') {
        const platformData = await generatePlatformIntelligence(env);

        return sanitizeResponse(new Response(JSON.stringify(platformData), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'POST' && url.pathname === '/trigger-optimization') {
        const { site_id, optimization_type, trigger_reason } = await request.json();
        
        if (!site_id || !optimization_type) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const result = await triggerCrossWorkerOptimization(site_id, optimization_type, trigger_reason, env);

        return sanitizeResponse(new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/optimization-impact') {
        const site_id = url.searchParams.get('site_id');
        const days = parseInt(url.searchParams.get('days') || '30');

        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const impact = await calculateOptimizationImpact(site_id, days, env);

        return sanitizeResponse(new Response(JSON.stringify(impact), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'POST' && url.pathname === '/daily-intelligence') {
        const dailyIntelligence = await processDailyIntelligence(env);

        return sanitizeResponse(new Response(JSON.stringify(dailyIntelligence), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/competitive-analysis') {
        const site_id = url.searchParams.get('site_id');
        
        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const analysis = await generateCompetitiveAnalysis(site_id, env);

        return sanitizeResponse(new Response(JSON.stringify(analysis), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      return new Response('Shared Analytics System - Ready', { status: 200 });

    } catch (error) {
      console.error('Shared analytics error:', error);
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
// UNIFIED ANALYTICS INTELLIGENCE PLATFORM
// =================================================================

async function generateUnifiedDashboard(siteId: string, timeframe: string, env: Env): Promise<UnifiedAnalytics> {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  // Gather metrics from all optimization workers
  const [performanceMetrics, conversionMetrics, seoMetrics, learningMetrics] = await Promise.all([
    getPerformanceMetrics(siteId, startDate, env),
    getConversionMetrics(siteId, startDate, env),
    getSEOMetrics(siteId, startDate, env),
    getLearningMetrics(siteId, startDate, env)
  ]);

  // Calculate unified scores
  const networkIntelligenceScore = calculateNetworkIntelligenceScore(
    performanceMetrics, conversionMetrics, seoMetrics, learningMetrics
  );

  const competitivePosition = await calculateCompetitivePosition(siteId, env);
  const totalOpportunities = await countOptimizationOpportunities(siteId, env);

  return {
    site_id: siteId,
    date: new Date().toISOString().split('T')[0],
    metrics: {
      performance: performanceMetrics,
      conversion: conversionMetrics,
      seo: seoMetrics,
      cross_site_learning: learningMetrics
    },
    optimization_opportunities: totalOpportunities,
    network_intelligence_score: networkIntelligenceScore,
    competitive_position: competitivePosition
  };
}

async function getPerformanceMetrics(siteId: string, startDate: string, env: Env): Promise<PerformanceMetrics> {
  // Get latest Core Web Vitals
  const vitals = await env.DB_ANALYTICS.prepare(`
    SELECT fcp, lcp, cls, fid, ttfb 
    FROM core_web_vitals 
    WHERE site_id = ? AND created_at >= ?
    ORDER BY created_at DESC 
    LIMIT 1
  `).bind(siteId, startDate).first();

  // Get performance score and optimizations
  const [scoreResult, optimizationsResult, alertsResult] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT performance_score 
      FROM performance_audits 
      WHERE site_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).bind(siteId).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM performance_optimizations 
      WHERE site_id = ? AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM performance_issues 
      WHERE site_id = ? AND type = 'real_time_monitoring' AND created_at >= ?
    `).bind(siteId, startDate).first()
  ]);

  return {
    overall_score: scoreResult?.performance_score || 75,
    core_web_vitals: {
      fcp: vitals?.fcp || 1200,
      lcp: vitals?.lcp || 2000,
      cls: vitals?.cls || 0.05,
      fid: vitals?.fid || 100,
      ttfb: vitals?.ttfb || 400
    },
    real_time_alerts: alertsResult?.count || 0,
    optimizations_applied: optimizationsResult?.count || 0
  };
}

async function getConversionMetrics(siteId: string, startDate: string, env: Env): Promise<ConversionMetrics> {
  const [scoreResult, tacticsResult, opportunitiesResult, testsResult, alignmentResult] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT conversion_score 
      FROM conversion_audits 
      WHERE site_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).bind(siteId).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM conversion_opportunities 
      WHERE site_id = ? AND psychology_principle IS NOT NULL AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM conversion_opportunities 
      WHERE site_id = ? AND status = 'identified' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM conversion_experiments 
      WHERE site_id = ? AND status = 'running' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT AVG(conversion_goal_alignment) as avg_alignment 
      FROM conversion_opportunities 
      WHERE site_id = ? AND conversion_goal_alignment IS NOT NULL AND created_at >= ?
    `).bind(siteId, startDate).first()
  ]);

  return {
    conversion_score: scoreResult?.conversion_score || 70,
    psychology_tactics_active: tacticsResult?.count || 0,
    goal_alignment_score: alignmentResult?.avg_alignment || 75,
    opportunities_identified: opportunitiesResult?.count || 0,
    ab_tests_running: testsResult?.count || 0
  };
}

async function getSEOMetrics(siteId: string, startDate: string, env: Env): Promise<SEOMetrics> {
  const [scoreResult, geoResult, brandResult, aiResult, keywordsResult] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT seo_score 
      FROM seo_audits 
      WHERE site_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).bind(siteId).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM seo_issues 
      WHERE site_id = ? AND type = 'geo' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT AVG(brand_mention_potential) as avg_potential 
      FROM seo_issues 
      WHERE site_id = ? AND brand_mention_potential IS NOT NULL AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM seo_issues 
      WHERE site_id = ? AND type = 'ai_optimization' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT * 
      FROM keyword_rankings 
      WHERE site_id = ? AND created_at >= ? 
      ORDER BY position ASC 
      LIMIT 10
    `).bind(siteId, startDate).all()
  ]);

  return {
    seo_score: scoreResult?.seo_score || 75,
    geo_optimization_level: (geoResult?.count || 0) > 0 ? 85 : 0,
    brand_mention_potential: brandResult?.avg_potential || 60,
    ai_engine_readiness: (aiResult?.count || 0) > 0 ? 80 : 0,
    keyword_rankings: keywordsResult?.results || []
  };
}

async function getLearningMetrics(siteId: string, startDate: string, env: Env): Promise<LearningMetrics> {
  const [patternsResult, networkResult, insightsResult, accelerationResult, confidenceResult] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM learning_insights 
      WHERE site_id = ? AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM learning_insights 
      WHERE site_id = ? AND insight_type = 'universal_pattern' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM learning_insights 
      WHERE site_id = ? AND insight_type = 'industry_pattern' AND created_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT learning_velocity_trend 
      FROM learning_acceleration 
      ORDER BY date DESC 
      LIMIT 1
    `).bind().first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT AVG(confidence) as avg_confidence 
      FROM learning_insights 
      WHERE site_id = ? AND created_at >= ?
    `).bind(siteId, startDate).first()
  ]);

  const accelerationScore = accelerationResult?.learning_velocity_trend === 'accelerating' ? 90 : 
                           accelerationResult?.learning_velocity_trend === 'stable' ? 70 : 50;

  return {
    patterns_applied: patternsResult?.count || 0,
    network_intelligence_used: networkResult?.count || 0,
    cross_industry_insights: insightsResult?.count || 0,
    learning_acceleration: accelerationScore,
    confidence_score: confidenceResult?.avg_confidence || 75
  };
}

async function generatePlatformIntelligence(env: Env): Promise<PlatformIntelligence> {
  const [sitesResult, optimizationsResult, patternsResult, successResult] = await Promise.all([
    env.DB_MAIN.prepare('SELECT COUNT(*) as count FROM sites WHERE status = "active"').first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as total FROM (
        SELECT id FROM seo_optimizations 
        UNION ALL 
        SELECT id FROM conversion_opportunities 
        UNION ALL 
        SELECT id FROM performance_optimizations
      )
    `).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT pattern_type, COUNT(*) as frequency, AVG(confidence_score) as avg_confidence
      FROM cross_site_patterns 
      GROUP BY pattern_type 
      ORDER BY frequency DESC 
      LIMIT 5
    `).all(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT 
        COUNT(CASE WHEN implementation_success = true THEN 1 END) * 100.0 / COUNT(*) as success_rate
      FROM pattern_effectiveness
    `).first()
  ]);

  // Calculate learning velocity
  const learningVelocity = await env.DB_ANALYTICS.prepare(`
    SELECT AVG(new_patterns_discovered + patterns_improved) as velocity
    FROM learning_acceleration 
    WHERE date >= date('now', '-7 days')
  `).first();

  // Get industry benchmarks
  const benchmarks = await env.DB_ANALYTICS.prepare(`
    SELECT industry, metric_type, benchmark_value, percentile_90
    FROM industry_benchmarks 
    ORDER BY industry, metric_type
    LIMIT 20
  `).all();

  return {
    total_sites: sitesResult?.count || 0,
    total_optimizations: optimizationsResult?.total || 0,
    network_learning_velocity: learningVelocity?.velocity || 0,
    top_performing_patterns: patternsResult?.results || [],
    industry_benchmarks: benchmarks?.results || [],
    success_rate: successResult?.success_rate || 0
  };
}

async function triggerCrossWorkerOptimization(siteId: string, optimizationType: string, triggerReason: string, env: Env): Promise<any> {
  const results = [];

  try {
    // Get site information
    const site = await env.DB_MAIN.prepare('SELECT * FROM sites WHERE id = ?').bind(siteId).first();
    
    if (!site) {
      return { error: 'Site not found' };
    }

    // Trigger appropriate workers based on optimization type
    if (optimizationType === 'full' || optimizationType === 'seo') {
      const seoResult = await env.SEO_OPTIMIZER.fetch('https://seo-optimizer/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteId,
          url: `https://${site.primary_domain}`,
          auditType: 'full',
          priority: 'high'
        })
      });
      
      if (seoResult.ok) {
        results.push({ worker: 'seo', status: 'triggered', result: await seoResult.json() });
      }
    }

    if (optimizationType === 'full' || optimizationType === 'conversion') {
      const conversionResult = await env.CONVERSION_OPTIMIZER.fetch('https://conversion-optimizer/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteId,
          goalType: site.primary_goal,
          auditType: 'complete',
          timeframe: '30d'
        })
      });
      
      if (conversionResult.ok) {
        results.push({ worker: 'conversion', status: 'triggered', result: await conversionResult.json() });
      }
    }

    if (optimizationType === 'full' || optimizationType === 'performance') {
      const performanceResult = await env.PERFORMANCE_MONITOR.fetch('https://performance-monitor/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          audit_type: 'full',
          urls: [`https://${site.primary_domain}`]
        })
      });
      
      if (performanceResult.ok) {
        results.push({ worker: 'performance', status: 'triggered', result: await performanceResult.json() });
      }
    }

    // Always get cross-site learning insights
    const learningResult = await env.CROSS_SITE_LEARNING.fetch('https://cross-site-learning/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: siteId,
        analysis_type: 'full'
      })
    });
    
    if (learningResult.ok) {
      results.push({ worker: 'learning', status: 'triggered', result: await learningResult.json() });
    }

    // Log the optimization trigger
    await env.DB_ANALYTICS.prepare(`
      INSERT INTO optimization_triggers 
      (id, site_id, trigger_type, trigger_reason, workers_triggered, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'completed', ?)
    `).bind(
      await generateId(), siteId, optimizationType, triggerReason,
      results.length, new Date().toISOString()
    ).run();

    return {
      success: true,
      optimization_type: optimizationType,
      workers_triggered: results.length,
      results: results
    };

  } catch (error) {
    console.error('Cross-worker optimization failed:', error);
    return {
      success: false,
      error: 'Failed to trigger optimization',
      message: (error as Error).message
    };
  }
}

async function calculateOptimizationImpact(siteId: string, days: number, env: Env): Promise<any> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [seoImpact, conversionImpact, performanceImpact] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as optimizations, 
             AVG(CAST(SUBSTR(estimated_improvement, 1, INSTR(estimated_improvement, '%') - 1) AS REAL)) as avg_improvement
      FROM seo_optimizations 
      WHERE site_id = ? AND status = 'implemented' AND implemented_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as opportunities,
             AVG(confidence) as avg_confidence
      FROM conversion_opportunities 
      WHERE site_id = ? AND status = 'completed' AND implemented_at >= ?
    `).bind(siteId, startDate).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as optimizations,
             AVG(CAST(SUBSTR(expected_improvement, 1, INSTR(expected_improvement, '%') - 1) AS REAL)) as avg_improvement
      FROM performance_optimizations 
      WHERE site_id = ? AND status = 'implemented' AND implemented_at >= ?
    `).bind(siteId, startDate).first()
  ]);

  // Calculate overall impact score
  const totalOptimizations = (seoImpact?.optimizations || 0) + 
                            (conversionImpact?.opportunities || 0) + 
                            (performanceImpact?.optimizations || 0);

  const weightedImpact = ((seoImpact?.avg_improvement || 0) * 0.3) +
                        ((conversionImpact?.avg_confidence || 0) * 0.4) +
                        ((performanceImpact?.avg_improvement || 0) * 0.3);

  return {
    period_days: days,
    total_optimizations: totalOptimizations,
    impact_breakdown: {
      seo: {
        optimizations: seoImpact?.optimizations || 0,
        average_improvement: seoImpact?.avg_improvement || 0
      },
      conversion: {
        opportunities: conversionImpact?.opportunities || 0,
        average_confidence: conversionImpact?.avg_confidence || 0
      },
      performance: {
        optimizations: performanceImpact?.optimizations || 0,
        average_improvement: performanceImpact?.avg_improvement || 0
      }
    },
    overall_impact_score: Math.round(weightedImpact),
    optimization_velocity: Math.round(totalOptimizations / days * 7) // per week
  };
}

async function processDailyIntelligence(env: Env): Promise<any> {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate daily metrics
  const [newPatterns, improvedPatterns, failedPatterns] = await Promise.all([
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM cross_site_patterns 
      WHERE DATE(created_at) = ?
    `).bind(today).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM pattern_evolution 
      WHERE DATE(evolved_at) = ?
    `).bind(today).first(),
    
    env.DB_ANALYTICS.prepare(`
      SELECT COUNT(*) as count 
      FROM pattern_effectiveness 
      WHERE DATE(applied_at) = ? AND implementation_success = false
    `).bind(today).first()
  ]);

  // Calculate network intelligence score
  const networkScore = await calculateDailyNetworkScore(env);
  
  // Determine learning trend
  const learningTrend = await calculateLearningTrend(env);

  // Store daily intelligence
  await env.DB_ANALYTICS.prepare(`
    INSERT OR REPLACE INTO learning_acceleration 
    (id, date, new_patterns_discovered, patterns_improved, failed_patterns_retired, 
     network_intelligence_score, learning_velocity_trend, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    await generateId(), today,
    newPatterns?.count || 0,
    improvedPatterns?.count || 0,
    failedPatterns?.count || 0,
    networkScore,
    learningTrend,
    new Date().toISOString()
  ).run();

  return {
    date: today,
    new_patterns_discovered: newPatterns?.count || 0,
    patterns_improved: improvedPatterns?.count || 0,
    failed_patterns_retired: failedPatterns?.count || 0,
    network_intelligence_score: networkScore,
    learning_velocity_trend: learningTrend,
    status: 'processed'
  };
}

// Helper functions
function calculateNetworkIntelligenceScore(performance: PerformanceMetrics, conversion: ConversionMetrics, seo: SEOMetrics, learning: LearningMetrics): number {
  const weights = {
    performance: 0.25,
    conversion: 0.30,
    seo: 0.25,
    learning: 0.20
  };

  const scores = {
    performance: performance.overall_score,
    conversion: conversion.conversion_score,
    seo: seo.seo_score,
    learning: learning.confidence_score
  };

  return Math.round(
    scores.performance * weights.performance +
    scores.conversion * weights.conversion +
    scores.seo * weights.seo +
    scores.learning * weights.learning
  );
}

async function calculateCompetitivePosition(siteId: string, env: Env): Promise<string> {
  const site = await env.DB_MAIN.prepare('SELECT * FROM sites WHERE id = ?').bind(siteId).first();
  
  if (!site) return 'unknown';

  // Get industry benchmarks
  const benchmarks = await env.DB_ANALYTICS.prepare(`
    SELECT percentile_25, percentile_50, percentile_75, percentile_90
    FROM industry_benchmarks 
    WHERE industry = ? AND metric_type = 'conversion_rate'
    LIMIT 1
  `).bind(site.business_type).first();

  if (!benchmarks) return 'no_data';

  const siteScore = (site.performance_score + site.conversion_score + site.seo_score) / 3;

  if (siteScore >= benchmarks.percentile_90) return 'top_10_percent';
  if (siteScore >= benchmarks.percentile_75) return 'top_25_percent';
  if (siteScore >= benchmarks.percentile_50) return 'above_average';
  if (siteScore >= benchmarks.percentile_25) return 'below_average';
  return 'bottom_25_percent';
}

async function countOptimizationOpportunities(siteId: string, env: Env): Promise<number> {
  const [seoCount, conversionCount, performanceCount] = await Promise.all([
    env.DB_ANALYTICS.prepare('SELECT COUNT(*) as count FROM seo_issues WHERE site_id = ? AND status = "identified"').bind(siteId).first(),
    env.DB_ANALYTICS.prepare('SELECT COUNT(*) as count FROM conversion_opportunities WHERE site_id = ? AND status = "identified"').bind(siteId).first(),
    env.DB_ANALYTICS.prepare('SELECT COUNT(*) as count FROM performance_issues WHERE site_id = ? AND status = "identified"').bind(siteId).first()
  ]);

  return (seoCount?.count || 0) + (conversionCount?.count || 0) + (performanceCount?.count || 0);
}

async function calculateDailyNetworkScore(env: Env): Promise<number> {
  const [sitesCount, patternsCount, successRate] = await Promise.all([
    env.DB_MAIN.prepare('SELECT COUNT(*) as count FROM sites WHERE status = "active"').first(),
    env.DB_ANALYTICS.prepare('SELECT COUNT(*) as count FROM cross_site_patterns WHERE confidence_score >= 70').first(),
    env.DB_ANALYTICS.prepare('SELECT AVG(CASE WHEN implementation_success = true THEN 100 ELSE 0 END) as rate FROM pattern_effectiveness').first()
  ]);

  // Score based on network size, pattern quality, and success rate
  const sizeScore = Math.min(100, (sitesCount?.count || 0) * 2); // 50 sites = 100 points
  const qualityScore = Math.min(100, (patternsCount?.count || 0) * 5); // 20 quality patterns = 100 points
  const successScore = successRate?.rate || 0;

  return Math.round((sizeScore * 0.3) + (qualityScore * 0.4) + (successScore * 0.3));
}

async function calculateLearningTrend(env: Env): Promise<string> {
  const recentVelocity = await env.DB_ANALYTICS.prepare(`
    SELECT AVG(new_patterns_discovered + patterns_improved) as recent_velocity
    FROM learning_acceleration 
    WHERE date >= date('now', '-7 days')
  `).first();

  const previousVelocity = await env.DB_ANALYTICS.prepare(`
    SELECT AVG(new_patterns_discovered + patterns_improved) as previous_velocity
    FROM learning_acceleration 
    WHERE date >= date('now', '-14 days') AND date < date('now', '-7 days')
  `).first();

  const recent = recentVelocity?.recent_velocity || 0;
  const previous = previousVelocity?.previous_velocity || 0;

  if (recent > previous * 1.1) return 'accelerating';
  if (recent < previous * 0.9) return 'decelerating';
  return 'stable';
}

async function generateCompetitiveAnalysis(siteId: string, env: Env): Promise<any> {
  const site = await env.DB_MAIN.prepare('SELECT * FROM sites WHERE id = ?').bind(siteId).first();
  
  if (!site) return { error: 'Site not found' };

  // Get industry performance data
  const industryStats = await env.DB_ANALYTICS.prepare(`
    SELECT 
      AVG(performance_score) as avg_performance,
      AVG(conversion_score) as avg_conversion,
      AVG(seo_score) as avg_seo,
      COUNT(*) as total_sites
    FROM sites 
    WHERE business_type = ? AND status = 'active'
  `).bind(site.business_type).first();

  // Get top performers in industry
  const topPerformers = await env.DB_ANALYTICS.prepare(`
    SELECT performance_score, conversion_score, seo_score
    FROM sites 
    WHERE business_type = ? AND status = 'active'
    ORDER BY (performance_score + conversion_score + seo_score) DESC
    LIMIT 5
  `).bind(site.business_type).all();

  return {
    site_performance: {
      performance_score: site.performance_score,
      conversion_score: site.conversion_score,
      seo_score: site.seo_score,
      overall_score: (site.performance_score + site.conversion_score + site.seo_score) / 3
    },
    industry_benchmarks: {
      average_performance: industryStats?.avg_performance || 0,
      average_conversion: industryStats?.avg_conversion || 0,
      average_seo: industryStats?.avg_seo || 0,
      total_competitors: industryStats?.total_sites || 0
    },
    competitive_position: await calculateCompetitivePosition(siteId, env),
    top_performers: topPerformers?.results || [],
    improvement_opportunities: await countOptimizationOpportunities(siteId, env)
  };
}