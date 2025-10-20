/**
 * Code24 Platform - Self-Learning Builder Worker
 * Creates adaptive websites that learn from user behavior and competition
 */

interface Env {
  DB_MAIN: D1Database;
  METADATA: KVNamespace;
  CACHE: KVNamespace;
  LEARNING_DATA: R2Bucket;
  GENERATED_SITES: R2Bucket;
  COMPETITIVE_ANALYSIS: Fetcher;
  AI_CONTENT_WORKER: Fetcher;
  ANALYTICS_DATASET: AnalyticsEngineDataset;
}

interface LearningProfile {
  siteId: string;
  industry: string;
  businessType: string;
  targetAudience: string;
  primaryGoal: string;
  competitorInsights: any;
  performanceHistory: any[];
  userBehaviorPatterns: any;
  adaptationRules: any[];
}

interface SiteGenerationRequest {
  businessName: string;
  businessType: string;
  industry: string;
  primaryGoal: string;
  targetAudience: string;
  competitorUrls?: string[];
  learningEnabled: boolean;
  adaptationFrequency: 'daily' | 'weekly' | 'monthly';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (url.pathname) {
        case '/generate-learning-site':
          return await generateLearningSite(request, env, corsHeaders);
        
        case '/adapt-site':
          return await adaptSiteBasedOnLearning(request, env, corsHeaders);
        
        case '/analyze-user-behavior':
          return await analyzeUserBehavior(request, env, corsHeaders);
        
        case '/get-learning-insights':
          return await getLearningInsights(request, env, corsHeaders);
        
        case '/update-adaptation-rules':
          return await updateAdaptationRules(request, env, corsHeaders);
        
        case '/health':
          return new Response('Self-Learning Builder Worker is healthy', { headers: corsHeaders });
        
        default:
          return new Response('Self-Learning Builder Worker\\n\\nEndpoints:\\n- POST /generate-learning-site\\n- POST /adapt-site\\n- POST /analyze-user-behavior\\n- GET /get-learning-insights\\n- POST /update-adaptation-rules\\n- GET /health', { 
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
          });
      }
    } catch (error) {
      console.error('Self-Learning Builder Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  },

  // Cron trigger for automatic site adaptation
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Running self-learning adaptation cycle...');
    
    try {
      // Get all sites with learning enabled
      const learningSites = await env.DB_MAIN.prepare(`
        SELECT id, primary_domain, business_type, primary_goal 
        FROM sites 
        WHERE status = 'active' 
        AND (subdomain LIKE '%learning%' OR subdomain LIKE '%adaptive%')
      `).all();

      if (!learningSites.results) return;

      // Adapt each learning site based on accumulated data
      for (const site of learningSites.results) {
        await ctx.waitUntil(performAutomaticAdaptation(site, env));
      }

      console.log(`Self-learning adaptation completed for ${learningSites.results.length} sites`);
    } catch (error) {
      console.error('Scheduled adaptation failed:', error);
    }
  },
};

async function generateLearningSite(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json();
    const generateRequest: SiteGenerationRequest = body;

    if (!generateRequest.businessName || !generateRequest.businessType) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Business name and type are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 1. Analyze competitors for initial insights
    const competitorInsights = await gatherCompetitorInsights(generateRequest, env);
    
    // 2. Generate initial site based on competitive analysis
    const siteStructure = await generateInitialSiteStructure(generateRequest, competitorInsights, env);
    
    // 3. Create learning profile
    const learningProfile = await createLearningProfile(generateRequest, competitorInsights, env);
    
    // 4. Generate site content and design
    const generatedSite = await generateAdaptiveSiteContent(siteStructure, learningProfile, env);
    
    // 5. Store site and learning configuration
    const siteId = crypto.randomUUID();
    const subdomain = generateLearningSubdomain(generateRequest.businessName);
    
    await storeSiteInDatabase(siteId, subdomain, generateRequest, learningProfile, env);
    await storeLearningProfile(siteId, learningProfile, env);
    await storeGeneratedSite(siteId, generatedSite, env);

    // 6. Track generation in analytics
    env.ANALYTICS_DATASET.writeDataPoint({
      timestamp: new Date().toISOString(),
      action: 'learning_site_generated',
      siteId,
      businessType: generateRequest.businessType,
      industry: generateRequest.industry,
      learningEnabled: generateRequest.learningEnabled,
      competitorCount: generateRequest.competitorUrls?.length || 0
    });

    return new Response(JSON.stringify({
      success: true,
      siteId,
      subdomain,
      siteUrl: `https://${subdomain}.staging.code24.dev`,
      learningProfile: {
        adaptationFrequency: generateRequest.adaptationFrequency,
        competitorInsights: competitorInsights.summary,
        initialOptimizations: learningProfile.adaptationRules.length
      },
      generatedFeatures: Object.keys(generatedSite.features),
      nextAdaptation: calculateNextAdaptationTime(generateRequest.adaptationFrequency),
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Learning site generation failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate learning site',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function gatherCompetitorInsights(request: SiteGenerationRequest, env: Env): Promise<any> {
  try {
    // Call competitive analysis worker
    const competitorResponse = await env.COMPETITIVE_ANALYSIS.fetch(new Request('https://competitive-analysis/analyze-industry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        industry: request.industry,
        businessType: request.businessType,
        competitorUrls: request.competitorUrls || []
      })
    }));

    if (competitorResponse.ok) {
      const competitorData = await competitorResponse.json();
      return competitorData.analysis;
    }
  } catch (error) {
    console.error('Failed to gather competitor insights:', error);
  }

  // Fallback to mock data
  return {
    marketTrends: ['Mobile-first design', 'Fast loading times', 'Personalization'],
    topKeywords: [`${request.businessType} services`, `professional ${request.industry}`],
    commonDesignPatterns: ['Hero with CTA', 'Social proof', 'Contact forms'],
    averageMetrics: { pageSpeed: 2.5, conversionRate: 2.8, bounceRate: 45 },
    summary: 'Basic competitive analysis with industry standards'
  };
}

async function generateInitialSiteStructure(request: SiteGenerationRequest, insights: any, env: Env): Promise<any> {
  return {
    pages: [
      {
        name: 'home',
        sections: ['hero', 'features', 'testimonials', 'cta'],
        adaptable: ['hero-headline', 'cta-button', 'feature-order']
      },
      {
        name: 'about',
        sections: ['story', 'team', 'values'],
        adaptable: ['story-focus', 'team-presentation']
      },
      {
        name: 'services',
        sections: ['service-list', 'pricing', 'comparison'],
        adaptable: ['pricing-display', 'service-order']
      },
      {
        name: 'contact',
        sections: ['contact-form', 'location', 'social'],
        adaptable: ['form-fields', 'contact-methods']
      }
    ],
    globalElements: {
      navigation: ['home', 'about', 'services', 'contact'],
      footer: ['links', 'social', 'contact-info'],
      adaptable: ['nav-style', 'footer-layout']
    },
    designSystem: {
      colorScheme: generateColorScheme(request.businessType),
      typography: selectTypography(insights.commonDesignPatterns),
      layout: 'responsive-grid'
    }
  };
}

async function createLearningProfile(request: SiteGenerationRequest, insights: any, env: Env): Promise<LearningProfile> {
  return {
    siteId: '', // Will be set later
    industry: request.industry,
    businessType: request.businessType,
    targetAudience: request.targetAudience,
    primaryGoal: request.primaryGoal,
    competitorInsights: insights,
    performanceHistory: [],
    userBehaviorPatterns: {
      sessionDuration: 0,
      bounceRate: 0,
      conversionPaths: [],
      popularSections: [],
      devicePreferences: {},
      timeOnPage: {}
    },
    adaptationRules: generateInitialAdaptationRules(request, insights)
  };
}

function generateInitialAdaptationRules(request: SiteGenerationRequest, insights: any): any[] {
  return [
    {
      id: 'conversion-optimization',
      trigger: 'low_conversion_rate',
      condition: 'conversion_rate < 2.0',
      actions: ['test_cta_variants', 'simplify_forms', 'add_urgency'],
      priority: 90,
      enabled: true
    },
    {
      id: 'engagement-improvement',
      trigger: 'high_bounce_rate',
      condition: 'bounce_rate > 60',
      actions: ['improve_hero_message', 'add_engaging_content', 'optimize_loading'],
      priority: 80,
      enabled: true
    },
    {
      id: 'mobile-optimization',
      trigger: 'mobile_performance_low',
      condition: 'mobile_score < 70',
      actions: ['simplify_mobile_nav', 'reduce_mobile_content', 'optimize_mobile_images'],
      priority: 85,
      enabled: true
    },
    {
      id: 'competitor-advantage',
      trigger: 'competitor_outperforming',
      condition: 'performance_below_industry_average',
      actions: ['adopt_competitor_strategies', 'differentiate_value_prop', 'improve_social_proof'],
      priority: 75,
      enabled: true
    }
  ];
}

async function generateAdaptiveSiteContent(structure: any, profile: LearningProfile, env: Env): Promise<any> {
  // In real implementation, this would call AI content worker
  return {
    content: {
      hero: {
        headline: `Professional ${profile.businessType} Services - ${profile.targetAudience}`,
        subheadline: `Achieve your ${profile.primaryGoal} goals with our expert solutions`,
        cta: 'Get Started Today',
        variants: [
          { headline: `Top-Rated ${profile.businessType} Solutions`, cta: 'Learn More' },
          { headline: `Transform Your ${profile.primaryGoal} Results`, cta: 'Start Now' }
        ]
      },
      features: generateFeatureContent(profile),
      testimonials: generateTestimonials(profile),
      forms: generateAdaptiveForms(profile)
    },
    features: {
      adaptiveHero: true,
      ctaOptimization: true,
      personalizedContent: true,
      behaviorTracking: true,
      competitorMonitoring: true,
      autoTesting: true
    },
    trackingCode: generateTrackingCode(profile.siteId),
    adaptationScripts: generateAdaptationScripts(profile.adaptationRules)
  };
}

function generateFeatureContent(profile: LearningProfile): any[] {
  const baseFeatures = [
    {
      title: `Expert ${profile.businessType}`,
      description: `Professional solutions tailored for ${profile.targetAudience}`,
      adaptable: true
    },
    {
      title: 'Proven Results',
      description: `Help you achieve your ${profile.primaryGoal} objectives`,
      adaptable: true
    },
    {
      title: '24/7 Support',
      description: 'Always here when you need assistance',
      adaptable: false
    }
  ];

  return baseFeatures;
}

function generateTestimonials(profile: LearningProfile): any[] {
  return [
    {
      text: `Amazing ${profile.businessType} service! Exactly what we needed for our ${profile.primaryGoal}.`,
      author: 'Sarah Johnson',
      company: 'Tech Solutions Inc.',
      adaptable: true
    },
    {
      text: `Professional team that understands ${profile.targetAudience} needs.`,
      author: 'Mike Chen',
      company: 'Growth Partners',
      adaptable: true
    }
  ];
}

function generateAdaptiveForms(profile: LearningProfile): any {
  return {
    contact: {
      fields: ['name', 'email', 'message'],
      variants: [
        { fields: ['name', 'email', 'phone', 'message'] },
        { fields: ['email', 'message'] }
      ],
      adaptationTrigger: 'form_abandonment_rate > 50'
    },
    newsletter: {
      fields: ['email'],
      variants: [
        { fields: ['email', 'interests'] },
        { fields: ['name', 'email'] }
      ],
      adaptationTrigger: 'signup_rate < 3'
    }
  };
}

function generateTrackingCode(siteId: string): string {
  return `
// Self-Learning Site Tracking
(function() {
  const siteId = '${siteId}';
  const trackingData = {
    pageViews: [],
    interactions: [],
    conversions: [],
    sessionStart: Date.now()
  };

  // Track user behavior
  function trackEvent(event, data) {
    trackingData[event + 's'] = trackingData[event + 's'] || [];
    trackingData[event + 's'].push({
      timestamp: Date.now(),
      ...data
    });
  }

  // Send data to learning system
  function sendLearningData() {
    fetch('/api/learning-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, data: trackingData })
    });
  }

  // Auto-send every 30 seconds
  setInterval(sendLearningData, 30000);
  window.addEventListener('beforeunload', sendLearningData);
})();
`;
}

function generateAdaptationScripts(rules: any[]): string {
  return `
// Site Adaptation Engine
const adaptationRules = ${JSON.stringify(rules)};

function checkAdaptationRules() {
  // Check each rule and apply adaptations
  adaptationRules.forEach(rule => {
    if (rule.enabled && evaluateCondition(rule.condition)) {
      applyAdaptation(rule.actions);
    }
  });
}

// Check rules every minute
setInterval(checkAdaptationRules, 60000);
`;
}

async function storeSiteInDatabase(siteId: string, subdomain: string, request: SiteGenerationRequest, profile: LearningProfile, env: Env): Promise<void> {
  await env.DB_MAIN.prepare(`
    INSERT INTO sites (id, business_name, business_type, primary_domain, subdomain, primary_goal, 
                      status, performance_score, conversion_score, seo_score, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    siteId,
    request.businessName,
    request.businessType,
    `${subdomain}.staging.code24.dev`,
    subdomain,
    request.primaryGoal,
    'active',
    75, // Initial scores
    75,
    75,
    new Date().toISOString(),
    new Date().toISOString()
  ).run();
}

async function storeLearningProfile(siteId: string, profile: LearningProfile, env: Env): Promise<void> {
  profile.siteId = siteId;
  
  await env.METADATA.put(`learning_profile:${siteId}`, JSON.stringify(profile));
  
  // Also store in R2 for historical tracking
  const storageKey = `learning-profiles/${siteId}/${new Date().toISOString()}.json`;
  await env.LEARNING_DATA.put(storageKey, JSON.stringify(profile));
}

async function storeGeneratedSite(siteId: string, generatedSite: any, env: Env): Promise<void> {
  const siteKey = `sites/${siteId}/current.json`;
  await env.GENERATED_SITES.put(siteKey, JSON.stringify(generatedSite));
}

function generateLearningSubdomain(businessName: string): string {
  const sanitized = businessName.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${sanitized}-learning-${Math.random().toString(36).substr(2, 4)}`;
}

function generateColorScheme(businessType: string): string[] {
  const schemes = {
    'technology': ['#1e3a8a', '#3b82f6', '#e5e7eb', '#ffffff'],
    'healthcare': ['#065f46', '#059669', '#f0fdf4', '#ffffff'],
    'finance': ['#1e40af', '#2563eb', '#f8fafc', '#ffffff'],
    'retail': ['#dc2626', '#ef4444', '#fef2f2', '#ffffff'],
    'consulting': ['#374151', '#6b7280', '#f9fafb', '#ffffff']
  };
  
  return schemes[businessType as keyof typeof schemes] || schemes.consulting;
}

function selectTypography(designPatterns: string[]): string[] {
  return ['Inter', 'system-ui', 'sans-serif'];
}

function calculateNextAdaptationTime(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
  }
  return now.toISOString();
}

async function adaptSiteBasedOnLearning(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Implementation for real-time site adaptation
  try {
    const body = await request.json();
    const { siteId, adaptationType = 'auto' } = body;

    const learningProfile = await env.METADATA.get(`learning_profile:${siteId}`, { type: 'json' });
    if (!learningProfile) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Learning profile not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const adaptationResult = await performAutomaticAdaptation({ id: siteId }, env);

    return new Response(JSON.stringify({
      success: true,
      siteId,
      adaptationResult,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to adapt site',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function performAutomaticAdaptation(site: any, env: Env): Promise<any> {
  try {
    const siteId = site.id;
    
    // Get learning profile
    const profile = await env.METADATA.get(`learning_profile:${siteId}`, { type: 'json' });
    if (!profile) return { success: false, error: 'No learning profile found' };

    // Simulate learning and adaptation
    const adaptations = [
      { type: 'hero_optimization', change: 'Updated headline based on user engagement' },
      { type: 'cta_improvement', change: 'Modified button text for better conversion' },
      { type: 'content_personalization', change: 'Adjusted content for target audience' }
    ];

    // Track adaptation
    env.ANALYTICS_DATASET.writeDataPoint({
      timestamp: new Date().toISOString(),
      siteId,
      action: 'automatic_adaptation',
      adaptationCount: adaptations.length
    });

    return {
      success: true,
      adaptations,
      nextAdaptation: calculateNextAdaptationTime('weekly')
    };

  } catch (error) {
    console.error(`Failed to adapt site ${site.id}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function analyzeUserBehavior(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Placeholder for user behavior analysis
  return new Response(JSON.stringify({
    success: true,
    message: 'User behavior analysis endpoint - to be implemented'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getLearningInsights(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Placeholder for learning insights
  return new Response(JSON.stringify({
    success: true,
    message: 'Learning insights endpoint - to be implemented'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateAdaptationRules(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Placeholder for adaptation rules update
  return new Response(JSON.stringify({
    success: true,
    message: 'Adaptation rules update endpoint - to be implemented'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}