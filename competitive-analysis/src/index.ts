/**
 * Code24 Platform - Competitive Analysis Worker
 * Analyzes competitor sites and strategies for market intelligence
 */

interface Env {
  DB_MAIN: D1Database;
  METADATA: KVNamespace;
  CACHE: KVNamespace;
  COMPETITOR_DATA: R2Bucket;
  OUTBOUND_WORKER: Fetcher;
  ANALYTICS_DATASET: AnalyticsEngineDataset;
}

interface CompetitorSite {
  url: string;
  industry: string;
  businessType: string;
  primaryGoal: string;
}

interface CompetitorAnalysis {
  url: string;
  domain: string;
  seoAnalysis: {
    titleTags: string[];
    metaDescriptions: string[];
    keywords: string[];
    headingStructure: Record<string, string[]>;
    schemaMarkup: string[];
  };
  designAnalysis: {
    colorScheme: string[];
    typography: string[];
    layout: string;
    ctaButtons: Array<{text: string, color: string, position: string}>;
    heroSection: string;
  };
  contentStrategy: {
    mainTopics: string[];
    contentLength: number;
    readabilityScore: number;
    socialProof: string[];
    testimonials: number;
  };
  performanceMetrics: {
    loadTime: number;
    mobileOptimized: boolean;
    pageSpeedScore: number;
    coreWebVitals: Record<string, number>;
  };
  marketingTactics: {
    popups: boolean;
    exitIntent: boolean;
    emailCapture: boolean;
    socialMedia: string[];
    pricingStrategy: string;
  };
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
        case '/analyze-competitor':
          return await analyzeCompetitor(request, env, corsHeaders);
        
        case '/analyze-industry':
          return await analyzeIndustry(request, env, corsHeaders);
        
        case '/get-competitor-insights':
          return await getCompetitorInsights(request, env, corsHeaders);
        
        case '/benchmark-site':
          return await benchmarkAgainstCompetitors(request, env, corsHeaders);
        
        case '/health':
          return new Response('Competitive Analysis Worker is healthy', { headers: corsHeaders });
        
        default:
          return new Response('Competitive Analysis Worker\\n\\nEndpoints:\\n- POST /analyze-competitor\\n- POST /analyze-industry\\n- POST /get-competitor-insights\\n- POST /benchmark-site\\n- GET /health', { 
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
          });
      }
    } catch (error) {
      console.error('Competitive Analysis Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  },
};

async function analyzeCompetitor(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json();
    const { url: competitorUrl, industry, businessType } = body;

    if (!competitorUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Competitor URL is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check cache first
    const cacheKey = `competitor:${btoa(competitorUrl)}`;
    const cachedAnalysis = await env.CACHE.get(cacheKey, { type: 'json' });
    
    if (cachedAnalysis) {
      return new Response(JSON.stringify({
        success: true,
        competitor: competitorUrl,
        analysis: cachedAnalysis,
        cached: true,
        timestamp: new Date().toISOString()
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Perform competitive analysis
    const analysis = await performCompetitorAnalysis(competitorUrl, env);
    
    // Cache the results for 24 hours
    await env.CACHE.put(cacheKey, JSON.stringify(analysis), {
      expirationTtl: 86400
    });

    // Store in R2 for historical tracking
    const timestamp = new Date().toISOString();
    const storageKey = `competitors/${new URL(competitorUrl).hostname}/${timestamp}.json`;
    await env.COMPETITOR_DATA.put(storageKey, JSON.stringify({
      url: competitorUrl,
      industry,
      businessType,
      analysis,
      timestamp
    }));

    // Track analytics
    env.ANALYTICS_DATASET.writeDataPoint({
      timestamp,
      action: 'competitor_analyzed',
      competitorDomain: new URL(competitorUrl).hostname,
      industry: industry || 'unknown',
      businessType: businessType || 'unknown'
    });

    return new Response(JSON.stringify({
      success: true,
      competitor: competitorUrl,
      analysis,
      cached: false,
      timestamp
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Competitor analysis failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to analyze competitor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function performCompetitorAnalysis(url: string, env: Env): Promise<CompetitorAnalysis> {
  // In a real implementation, this would scrape and analyze the competitor site
  // For now, we'll return realistic mock data
  
  const domain = new URL(url).hostname;
  
  return {
    url,
    domain,
    seoAnalysis: {
      titleTags: [
        `Best ${domain.split('.')[0]} Services | Professional Solutions`,
        `${domain.split('.')[0]} - Leading Industry Expert`
      ],
      metaDescriptions: [
        `Discover premium ${domain.split('.')[0]} services with proven results. Get started today!`,
        `Professional ${domain.split('.')[0]} solutions for businesses. Trusted by thousands.`
      ],
      keywords: generateIndustryKeywords(domain),
      headingStructure: {
        h1: [`Welcome to ${domain}`, 'Professional Services'],
        h2: ['Our Services', 'Why Choose Us', 'Client Results'],
        h3: ['Service 1', 'Service 2', 'Service 3']
      },
      schemaMarkup: ['Organization', 'LocalBusiness', 'BreadcrumbList']
    },
    designAnalysis: {
      colorScheme: ['#1f2937', '#3b82f6', '#ffffff', '#f9fafb'],
      typography: ['Inter', 'Roboto', 'Arial'],
      layout: 'modern-grid',
      ctaButtons: [
        { text: 'Get Started', color: '#3b82f6', position: 'hero' },
        { text: 'Learn More', color: '#6b7280', position: 'secondary' },
        { text: 'Contact Us', color: '#059669', position: 'footer' }
      ],
      heroSection: 'video-background'
    },
    contentStrategy: {
      mainTopics: generateContentTopics(domain),
      contentLength: Math.floor(Math.random() * 2000) + 800,
      readabilityScore: Math.floor(Math.random() * 20) + 70,
      socialProof: ['Client logos', 'Testimonials', 'Case studies', 'Review badges'],
      testimonials: Math.floor(Math.random() * 10) + 5
    },
    performanceMetrics: {
      loadTime: Math.random() * 3 + 1,
      mobileOptimized: Math.random() > 0.2,
      pageSpeedScore: Math.floor(Math.random() * 30) + 70,
      coreWebVitals: {
        lcp: Math.random() * 2 + 1,
        fid: Math.random() * 100 + 50,
        cls: Math.random() * 0.1
      }
    },
    marketingTactics: {
      popups: Math.random() > 0.5,
      exitIntent: Math.random() > 0.7,
      emailCapture: Math.random() > 0.3,
      socialMedia: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].filter(() => Math.random() > 0.5),
      pricingStrategy: ['tiered', 'custom', 'freemium'][Math.floor(Math.random() * 3)]
    }
  };
}

function generateIndustryKeywords(domain: string): string[] {
  const baseKeywords = [
    `${domain.split('.')[0]} services`,
    `professional ${domain.split('.')[0]}`,
    `best ${domain.split('.')[0]} company`,
    `${domain.split('.')[0]} solutions`,
    `expert ${domain.split('.')[0]}`,
    `${domain.split('.')[0]} consulting`,
    `top ${domain.split('.')[0]} provider`,
    `reliable ${domain.split('.')[0]}`
  ];
  
  return baseKeywords.slice(0, Math.floor(Math.random() * 5) + 3);
}

function generateContentTopics(domain: string): string[] {
  const topicTemplates = [
    'How to choose the right service',
    'Benefits of professional solutions',
    'Industry best practices',
    'Common mistakes to avoid',
    'Cost-effective strategies',
    'Latest trends and innovations',
    'Case studies and success stories',
    'Frequently asked questions'
  ];
  
  return topicTemplates.slice(0, Math.floor(Math.random() * 4) + 4);
}

async function analyzeIndustry(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json();
    const { industry, businessType, competitorUrls = [] } = body;

    if (!industry) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Industry is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check for cached industry analysis
    const cacheKey = `industry:${industry}:${businessType}`;
    const cachedAnalysis = await env.CACHE.get(cacheKey, { type: 'json' });
    
    if (cachedAnalysis) {
      return new Response(JSON.stringify({
        success: true,
        industry,
        businessType,
        analysis: cachedAnalysis,
        cached: true
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Analyze multiple competitors or use default industry data
    const industryAnalysis = await performIndustryAnalysis(industry, businessType, competitorUrls, env);
    
    // Cache for 12 hours
    await env.CACHE.put(cacheKey, JSON.stringify(industryAnalysis), {
      expirationTtl: 43200
    });

    return new Response(JSON.stringify({
      success: true,
      industry,
      businessType,
      analysis: industryAnalysis,
      cached: false,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to analyze industry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function performIndustryAnalysis(industry: string, businessType: string, competitorUrls: string[], env: Env): Promise<any> {
  return {
    industry,
    businessType,
    marketTrends: [
      'Increased focus on mobile-first design',
      'Growing importance of page speed',
      'Rise of video content marketing',
      'Emphasis on personalization',
      'Integration of AI-powered features'
    ],
    commonDesignPatterns: [
      'Hero sections with clear value propositions',
      'Social proof prominently displayed',
      'Simple, intuitive navigation',
      'Strong call-to-action buttons',
      'Mobile-responsive layouts'
    ],
    topKeywords: generateIndustryKeywords(industry),
    averageMetrics: {
      pageSpeed: Math.random() * 2 + 2,
      conversionRate: Math.random() * 3 + 1,
      bounceRate: Math.random() * 30 + 40,
      sessionDuration: Math.random() * 180 + 120
    },
    competitorCount: competitorUrls.length || Math.floor(Math.random() * 50) + 10,
    opportunities: [
      'Underutilized semantic search optimization',
      'Limited use of interactive elements',
      'Opportunity for better mobile UX',
      'Potential for improved loading speeds',
      'Gap in local SEO optimization'
    ],
    threats: [
      'Increasing competition in digital space',
      'Rising customer acquisition costs',
      'Changing consumer behavior patterns',
      'New market entrants with innovative approaches'
    ]
  };
}

async function getCompetitorInsights(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json();
    const { industry, businessType, myUrl } = body;

    // Get historical competitor data from R2
    const competitorInsights = await gatherCompetitorInsights(industry, businessType, env);

    return new Response(JSON.stringify({
      success: true,
      industry,
      businessType,
      insights: competitorInsights,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get competitor insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function gatherCompetitorInsights(industry: string, businessType: string, env: Env): Promise<any> {
  // In real implementation, this would analyze stored competitor data
  return {
    topPerformingStrategies: [
      'Clear value proposition in hero section',
      'Multiple contact options available',
      'Client testimonials prominently featured',
      'Fast-loading, mobile-optimized design',
      'Strong social media presence'
    ],
    commonMistakes: [
      'Slow page load times',
      'Unclear navigation structure',
      'Missing or weak call-to-action',
      'Poor mobile experience',
      'Lack of social proof'
    ],
    emergingTrends: [
      'AI-powered chatbots for customer service',
      'Interactive pricing calculators',
      'Video testimonials and case studies',
      'Personalized content recommendations',
      'Progressive web app features'
    ],
    benchmarkMetrics: {
      averagePageSpeed: Math.random() * 2 + 2,
      averageConversionRate: Math.random() * 3 + 1,
      averageSEOScore: Math.random() * 20 + 70,
      averageUserSatisfaction: Math.random() * 1.5 + 3.5
    }
  };
}

async function benchmarkAgainstCompetitors(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json();
    const { siteUrl, industry, businessType } = body;

    if (!siteUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Site URL is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get site data from database
    const site = await env.DB_MAIN.prepare(`
      SELECT * FROM sites WHERE primary_domain = ? OR subdomain = ?
    `).bind(siteUrl, siteUrl.split('.')[0]).first();

    if (!site) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Site not found in database'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get industry benchmarks
    const industryData = await performIndustryAnalysis(industry || site.business_type, businessType, [], env);
    const competitorInsights = await gatherCompetitorInsights(industry || site.business_type, businessType, env);

    // Compare site performance
    const benchmark = {
      yourSite: {
        performanceScore: site.performance_score,
        conversionScore: site.conversion_score,
        seoScore: site.seo_score
      },
      industryAverage: industryData.averageMetrics,
      competitorBenchmarks: competitorInsights.benchmarkMetrics,
      recommendations: generateBenchmarkRecommendations(site, industryData, competitorInsights),
      competitivePosition: calculateCompetitivePosition(site, industryData)
    };

    return new Response(JSON.stringify({
      success: true,
      siteUrl,
      industry: industry || site.business_type,
      benchmark,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to benchmark site',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

function generateBenchmarkRecommendations(site: any, industryData: any, competitorInsights: any): string[] {
  const recommendations = [];
  
  if (site.performance_score < industryData.averageMetrics.pageSpeed * 20) {
    recommendations.push('Improve page speed to match industry standards');
  }
  
  if (site.conversion_score < competitorInsights.benchmarkMetrics.averageConversionRate * 20) {
    recommendations.push('Optimize conversion funnel based on competitor analysis');
  }
  
  if (site.seo_score < competitorInsights.benchmarkMetrics.averageSEOScore) {
    recommendations.push('Enhance SEO strategy using competitor keyword insights');
  }
  
  recommendations.push(...competitorInsights.topPerformingStrategies.slice(0, 2));
  
  return recommendations;
}

function calculateCompetitivePosition(site: any, industryData: any): string {
  const avgScore = (site.performance_score + site.conversion_score + site.seo_score) / 3;
  const industryAvg = 75; // Approximate industry average
  
  if (avgScore >= industryAvg + 15) return 'Leader';
  if (avgScore >= industryAvg + 5) return 'Above Average';
  if (avgScore >= industryAvg - 5) return 'Average';
  if (avgScore >= industryAvg - 15) return 'Below Average';
  return 'Needs Improvement';
}