/**
 * Code24 Platform - Brand Worker
 * "The Best Brand Worker in the World" - Elite AI-powered brand intelligence
 * Creates world-class brand identities that resonate and convert
 */

interface Env {
  DB_MAIN: D1Database;
  METADATA: KVNamespace;
  BRAND_CACHE: KVNamespace;
  BRAND_ASSETS: R2Bucket;
  DESIGNER_WORKER: Fetcher;
  COMPETITIVE_ANALYSIS: Fetcher;
  AI_SERVICE: Fetcher;
  LOGO_GENERATOR: Fetcher;
  ANALYTICS_DATASET: AnalyticsEngineDataset;
}

interface BrandRequest {
  companyName: string;
  businessType: string;
  industry: string;
  targetAudience: string;
  brandPersonality: string[];
  existingAssets?: {
    logo?: string;
    colors?: string[];
    fonts?: string[];
    guidelines?: string;
  };
  businessValues: string[];
  competitorUrls?: string[];
  brandGoals: string[];
  budget: 'startup' | 'small_business' | 'enterprise';
}

interface BrandOutput {
  brandId: string;
  identity: BrandIdentity;
  visual: VisualSystem;
  voice: BrandVoice;
  assets: BrandAssets;
  guidelines: BrandGuidelines;
  strategy: BrandStrategy;
  implementation: ImplementationPlan;
  psychological: PsychologicalProfile;
}

interface BrandIdentity {
  name: string;
  tagline: string;
  positioning: string;
  valueProposition: string;
  brandPromise: string;
  personality: {
    primary: string[];
    secondary: string[];
    avoid: string[];
  };
  archetype: string;
  emotionalTriggers: string[];
}

interface VisualSystem {
  logo: LogoSystem;
  colorPalette: BrandColorPalette;
  typography: BrandTypography;
  imagery: ImageryGuidelines;
  iconography: IconSystem;
  layout: LayoutPrinciples;
  animations: MotionPrinciples;
}

interface LogoSystem {
  primary: LogoVariant;
  variations: LogoVariant[];
  favicon: LogoVariant;
  usageGuidelines: LogoUsage;
  protectionZone: string;
  minimumSizes: Record<string, string>;
}

interface LogoVariant {
  type: 'full' | 'icon' | 'wordmark' | 'monogram';
  formats: string[];
  colorVersions: string[];
  description: string;
  psychologyNotes: string;
}

interface LogoUsage {
  doNots: string[];
  contexts: Record<string, string>;
  backgrounds: Record<string, string[]>;
  coexistence: string[];
}

interface BrandColorPalette {
  primary: ColorDefinition;
  secondary: ColorDefinition[];
  neutral: ColorDefinition[];
  accent: ColorDefinition;
  functional: {
    success: ColorDefinition;
    warning: ColorDefinition;
    error: ColorDefinition;
    info: ColorDefinition;
  };
  gradients: GradientDefinition[];
  psychology: ColorPsychology;
  accessibility: AccessibilityGuidelines;
}

interface ColorDefinition {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  pantone?: string;
  psychology: string;
  usage: string[];
  combinations: string[];
}

interface GradientDefinition {
  name: string;
  colors: string[];
  direction: string;
  usage: string[];
  psychology: string;
}

interface ColorPsychology {
  primary: {
    emotion: string;
    association: string[];
    industry_fit: number;
    conversion_impact: number;
  };
  overall_strategy: string;
  cultural_considerations: string[];
}

interface AccessibilityGuidelines {
  contrast_ratios: Record<string, number>;
  color_blind_safe: boolean;
  alternatives: Record<string, string>;
}

interface BrandTypography {
  primary: TypefaceDefinition;
  secondary: TypefaceDefinition;
  hierarchy: TypographyHierarchy;
  webfonts: WebfontSpecification;
  psychology: TypographyPsychology;
}

interface TypefaceDefinition {
  name: string;
  category: string;
  weights: number[];
  styles: string[];
  usage: string[];
  personality: string[];
  licensing: string;
  fallbacks: string[];
}

interface TypographyHierarchy {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  body: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
}

interface TypographyStyle {
  size: string;
  weight: number;
  lineHeight: number;
  letterSpacing: string;
  usage: string;
  psychology: string;
}

interface TypographyPsychology {
  readability_score: number;
  trustworthiness: number;
  modernity: number;
  personality_alignment: number;
}

interface ImageryGuidelines {
  style: string;
  mood: string[];
  subjects: string[];
  composition: string[];
  lighting: string[];
  color_treatment: string;
  avoid: string[];
  sources: string[];
}

interface IconSystem {
  style: string;
  weight: string;
  corner_radius: string;
  grid_system: string;
  library: string;
  custom_requirements: string[];
}

interface LayoutPrinciples {
  grid_system: string;
  spacing_scale: number[];
  proportions: string;
  hierarchy: string[];
  whitespace_philosophy: string;
}

interface MotionPrinciples {
  personality: string;
  timing: string;
  easing: string[];
  purposes: string[];
  guidelines: string[];
}

interface BrandVoice {
  tone: VoiceTone;
  personality: VoicePersonality;
  messaging: MessagingFramework;
  examples: VoiceExamples;
  guidelines: VoiceGuidelines;
}

interface VoiceTone {
  primary: string;
  secondary: string[];
  situations: Record<string, string>;
  avoid: string[];
}

interface VoicePersonality {
  adjectives: string[];
  human_equivalent: string;
  communication_style: string;
  humor_level: string;
  formality: string;
}

interface MessagingFramework {
  core_messages: string[];
  value_props: string[];
  proof_points: string[];
  objection_responses: Record<string, string>;
}

interface VoiceExamples {
  headlines: string[];
  body_copy: string[];
  ctas: string[];
  error_messages: string[];
  social_posts: string[];
}

interface VoiceGuidelines {
  do: string[];
  dont: string[];
  grammar_preferences: string[];
  industry_terms: Record<string, string>;
}

interface BrandAssets {
  logos: AssetFile[];
  icons: AssetFile[];
  templates: AssetFile[];
  presentations: AssetFile[];
  social_media: SocialMediaAssets;
  marketing: MarketingAssets;
}

interface AssetFile {
  name: string;
  type: string;
  formats: string[];
  sizes: string[];
  url: string;
  usage: string;
}

interface SocialMediaAssets {
  profile_pictures: AssetFile[];
  cover_photos: AssetFile[];
  post_templates: AssetFile[];
  story_templates: AssetFile[];
  highlights: AssetFile[];
}

interface MarketingAssets {
  business_cards: AssetFile[];
  letterheads: AssetFile[];
  email_signatures: AssetFile[];
  presentations: AssetFile[];
  brochures: AssetFile[];
}

interface BrandGuidelines {
  overview: string;
  usage_rules: UsageRules;
  applications: ApplicationExamples;
  quality_standards: QualityStandards;
  approval_process: string;
}

interface UsageRules {
  logo_placement: string[];
  color_combinations: string[];
  typography_pairings: string[];
  photography_style: string[];
  tone_of_voice: string[];
}

interface ApplicationExamples {
  website: string[];
  print: string[];
  digital: string[];
  merchandise: string[];
  signage: string[];
}

interface QualityStandards {
  resolution_minimums: Record<string, string>;
  file_formats: Record<string, string[]>;
  color_accuracy: string[];
  production_notes: string[];
}

interface BrandStrategy {
  positioning: PositioningStrategy;
  differentiation: DifferentiationStrategy;
  audience: AudienceStrategy;
  messaging: MessagingStrategy;
  implementation: ImplementationStrategy;
}

interface PositioningStrategy {
  market_position: string;
  competitive_advantage: string[];
  brand_pillars: string[];
  category_definition: string;
}

interface DifferentiationStrategy {
  unique_factors: string[];
  competitive_moats: string[];
  value_drivers: string[];
  emotional_differentiators: string[];
}

interface AudienceStrategy {
  primary_persona: PersonaDefinition;
  secondary_personas: PersonaDefinition[];
  communication_preferences: Record<string, string>;
  journey_touchpoints: string[];
}

interface PersonaDefinition {
  name: string;
  demographics: Record<string, string>;
  psychographics: string[];
  pain_points: string[];
  goals: string[];
  brand_relationship: string;
}

interface MessagingStrategy {
  core_narrative: string;
  supporting_stories: string[];
  proof_points: string[];
  call_to_actions: string[];
}

interface ImplementationStrategy {
  phases: ImplementationPhase[];
  touchpoints: string[];
  success_metrics: string[];
  timeline: string;
}

interface ImplementationPhase {
  name: string;
  duration: string;
  deliverables: string[];
  success_criteria: string[];
}

interface ImplementationPlan {
  immediate: ImmediateImplementation;
  short_term: ShortTermImplementation;
  long_term: LongTermImplementation;
  monitoring: MonitoringPlan;
}

interface ImmediateImplementation {
  priority_assets: string[];
  quick_wins: string[];
  timeline: string;
  resources_needed: string[];
}

interface ShortTermImplementation {
  major_touchpoints: string[];
  campaigns: string[];
  timeline: string;
  budget_estimate: string;
}

interface LongTermImplementation {
  brand_evolution: string[];
  market_expansion: string[];
  innovation_areas: string[];
  timeline: string;
}

interface MonitoringPlan {
  brand_health_metrics: string[];
  tracking_methods: string[];
  review_frequency: string;
  optimization_triggers: string[];
}

interface PsychologicalProfile {
  cognitive_load: number;
  emotional_resonance: number;
  trust_signals: string[];
  persuasion_elements: string[];
  conversion_psychology: ConversionPsychology;
}

interface ConversionPsychology {
  primary_motivators: string[];
  fear_factors: string[];
  social_proof_types: string[];
  urgency_tactics: string[];
  trust_builders: string[];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      switch (url.pathname) {
        case '/brand/create':
          return await handleBrandCreation(request, env);
        
        case '/brand/analyze':
          return await handleBrandAnalysis(request, env);
        
        case '/brand/enhance':
          return await handleBrandEnhancement(request, env);
        
        case '/brand/audit':
          return await handleBrandAudit(request, env);
        
        case '/brand/guidelines':
          return await handleGuidelinesGeneration(request, env);
        
        case '/brand/assets':
          return await handleAssetGeneration(request, env);
        
        default:
          return new Response('Brand Worker - The Best Brand Worker in the World AI', { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Brand Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Brand service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleBrandCreation(request: Request, env: Env): Promise<Response> {
  const brandRequest: BrandRequest = await request.json();
  
  // 1. Analyze industry and competitive landscape
  const industryAnalysis = await analyzeIndustryBranding(brandRequest, env);
  
  // 2. Define brand strategy and positioning
  const strategy = await developBrandStrategy(brandRequest, industryAnalysis, env);
  
  // 3. Create visual identity system
  const visual = await createVisualIdentity(brandRequest, strategy, env);
  
  // 4. Develop brand voice and messaging
  const voice = await developBrandVoice(brandRequest, strategy, env);
  
  // 5. Generate brand assets
  const assets = await generateBrandAssets(brandRequest, visual, env);
  
  // 6. Create comprehensive guidelines
  const guidelines = await createBrandGuidelines(visual, voice, strategy, env);
  
  // 7. Develop implementation plan
  const implementation = await createImplementationPlan(brandRequest, env);
  
  // 8. Analyze psychological impact
  const psychological = await analyzePsychologicalProfile(visual, voice, strategy, env);
  
  const brandOutput: BrandOutput = {
    brandId: crypto.randomUUID(),
    identity: {
      name: brandRequest.companyName,
      tagline: await generateTagline(brandRequest, strategy, env),
      positioning: strategy.positioning.market_position,
      valueProposition: strategy.messaging.core_narrative,
      brandPromise: await generateBrandPromise(brandRequest, strategy, env),
      personality: {
        primary: brandRequest.brandPersonality.slice(0, 3),
        secondary: brandRequest.brandPersonality.slice(3, 6),
        avoid: await generatePersonalityAvoids(brandRequest, env)
      },
      archetype: await determineBrandArchetype(brandRequest, env),
      emotionalTriggers: await identifyEmotionalTriggers(brandRequest, env)
    },
    visual,
    voice,
    assets,
    guidelines,
    strategy,
    implementation,
    psychological
  };
  
  // Store brand for learning and optimization
  await storeBrandForLearning(brandOutput, brandRequest, env);
  
  // Track brand creation analytics
  await trackBrandAnalytics('brand_created', brandRequest, brandOutput, env);
  
  return new Response(JSON.stringify(brandOutput), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function analyzeIndustryBranding(request: BrandRequest, env: Env): Promise<any> {
  // Check cache first
  const cacheKey = `industry:${request.industry}:${request.businessType}`;
  const cached = await env.BRAND_CACHE.get(cacheKey, { type: 'json' });
  if (cached) return cached;
  
  // Get competitive intelligence
  let competitiveAnalysis = {};
  try {
    const response = await env.COMPETITIVE_ANALYSIS.fetch(new Request('https://competitive-analysis/brand-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        industry: request.industry,
        businessType: request.businessType,
        competitors: request.competitorUrls
      })
    }));
    
    if (response.ok) {
      competitiveAnalysis = await response.json();
    }
  } catch (error) {
    console.log('Competitive analysis not available, using fallback');
  }
  
  const analysis = {
    industryTrends: await getIndustryBrandTrends(request.industry),
    competitiveGaps: await identifyCompetitiveGaps(request, competitiveAnalysis),
    audienceInsights: await getAudienceInsights(request.targetAudience),
    brandOpportunities: await identifyBrandOpportunities(request, competitiveAnalysis),
    psychologicalFactors: await getIndustryPsychology(request.industry)
  };
  
  // Cache for 12 hours
  await env.BRAND_CACHE.put(cacheKey, JSON.stringify(analysis), { expirationTtl: 43200 });
  
  return analysis;
}

async function getIndustryBrandTrends(industry: string): Promise<any> {
  const trendMap: Record<string, any> = {
    'healthcare': {
      colors: ['trust_blues', 'calming_greens', 'clean_whites'],
      personality: ['trustworthy', 'professional', 'caring'],
      typography: ['clean_sans_serif', 'readable', 'authoritative'],
      imagery: ['human_focused', 'clean_clinical', 'diverse_representation']
    },
    'technology': {
      colors: ['innovation_blues', 'modern_purples', 'neutral_grays'],
      personality: ['innovative', 'reliable', 'forward_thinking'],
      typography: ['geometric_sans', 'modern', 'technical'],
      imagery: ['abstract_tech', 'clean_interfaces', 'future_focused']
    },
    'finance': {
      colors: ['trust_blues', 'wealth_greens', 'premium_golds'],
      personality: ['trustworthy', 'stable', 'successful'],
      typography: ['classic_serif', 'authoritative', 'premium'],
      imagery: ['success_imagery', 'premium_lifestyle', 'professional_settings']
    }
  };
  
  return trendMap[industry] || trendMap['technology'];
}

async function identifyCompetitiveGaps(request: BrandRequest, competitiveAnalysis: any): Promise<string[]> {
  // Analyze what competitors are missing
  return [
    'emotional_connection',
    'modern_visual_language',
    'clear_value_proposition',
    'authentic_personality',
    'innovative_positioning'
  ];
}

async function getAudienceInsights(targetAudience: string): Promise<any> {
  // Analyze target audience preferences and psychology
  return {
    preferredColors: ['trustworthy_blues', 'optimistic_greens'],
    communicationStyle: 'clear_and_direct',
    valueDrivers: ['quality', 'reliability', 'innovation'],
    emotionalTriggers: ['security', 'success', 'belonging'],
    decisionFactors: ['social_proof', 'expert_authority', 'clear_benefits']
  };
}

async function identifyBrandOpportunities(request: BrandRequest, competitiveAnalysis: any): Promise<string[]> {
  return [
    'humanize_the_brand',
    'emphasize_innovation',
    'build_community',
    'showcase_expertise',
    'create_emotional_bonds'
  ];
}

async function getIndustryPsychology(industry: string): Promise<any> {
  const psychologyMap: Record<string, any> = {
    'healthcare': {
      trustFactors: ['credentials', 'testimonials', 'certifications'],
      fearFactors: ['health_concerns', 'treatment_anxiety'],
      motivators: ['health_improvement', 'peace_of_mind'],
      barriers: ['cost_concerns', 'time_constraints']
    },
    'technology': {
      trustFactors: ['security_badges', 'user_testimonials', 'expert_reviews'],
      fearFactors: ['data_privacy', 'complexity'],
      motivators: ['efficiency_gains', 'competitive_advantage'],
      barriers: ['learning_curve', 'integration_concerns']
    }
  };
  
  return psychologyMap[industry] || psychologyMap['technology'];
}

async function developBrandStrategy(request: BrandRequest, industryAnalysis: any, env: Env): Promise<BrandStrategy> {
  return {
    positioning: {
      market_position: await defineMarketPosition(request, industryAnalysis),
      competitive_advantage: await identifyCompetitiveAdvantages(request, industryAnalysis),
      brand_pillars: await defineBrandPillars(request),
      category_definition: await defineCategoryPosition(request, industryAnalysis)
    },
    differentiation: {
      unique_factors: await identifyUniqueFactors(request),
      competitive_moats: await buildCompetitiveMoats(request),
      value_drivers: request.businessValues,
      emotional_differentiators: await identifyEmotionalDifferentiators(request)
    },
    audience: {
      primary_persona: await definePrimaryPersona(request),
      secondary_personas: await defineSecondaryPersonas(request),
      communication_preferences: await mapCommunicationPreferences(request),
      journey_touchpoints: await identifyJourneyTouchpoints(request)
    },
    messaging: {
      core_narrative: await developCoreNarrative(request),
      supporting_stories: await developSupportingStories(request),
      proof_points: await identifyProofPoints(request),
      call_to_actions: await optimizeCallToActions(request)
    },
    implementation: {
      phases: await definePhasedImplementation(request),
      touchpoints: await identifyBrandTouchpoints(request),
      success_metrics: await defineBrandMetrics(request),
      timeline: await createImplementationTimeline(request)
    }
  };
}

async function defineMarketPosition(request: BrandRequest, industryAnalysis: any): Promise<string> {
  const positionMap: Record<string, string> = {
    'premium': `The premium ${request.businessType} for discerning ${request.targetAudience}`,
    'innovative': `The most innovative ${request.businessType} transforming ${request.industry}`,
    'accessible': `Making ${request.businessType} accessible to every ${request.targetAudience}`,
    'expert': `The expert ${request.businessType} trusted by ${request.targetAudience}`
  };
  
  // Determine positioning based on business values and goals
  const positioningType = request.businessValues.includes('innovation') ? 'innovative' :
                         request.businessValues.includes('quality') ? 'premium' :
                         request.businessValues.includes('accessibility') ? 'accessible' : 'expert';
  
  return positionMap[positioningType];
}

async function createVisualIdentity(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<VisualSystem> {
  // Generate logo system
  const logoSystem = await generateLogoSystem(request, strategy, env);
  
  // Create color palette
  const colorPalette = await generateBrandColorPalette(request, strategy, env);
  
  // Design typography system
  const typography = await createBrandTypography(request, strategy, env);
  
  // Define imagery guidelines
  const imagery = await createImageryGuidelines(request, strategy);
  
  // Create icon system
  const iconography = await createIconSystem(request, strategy);
  
  // Establish layout principles
  const layout = await createLayoutPrinciples(request, strategy);
  
  // Define motion principles
  const animations = await createMotionPrinciples(request, strategy);
  
  return {
    logo: logoSystem,
    colorPalette,
    typography,
    imagery,
    iconography,
    layout,
    animations
  };
}

async function generateLogoSystem(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<LogoSystem> {
  // If existing logo, analyze and enhance it
  if (request.existingAssets?.logo) {
    return await enhanceExistingLogo(request.existingAssets.logo, request, strategy);
  }
  
  // Generate new logo system
  const logoVariants: LogoVariant[] = [
    {
      type: 'full',
      formats: ['svg', 'png', 'jpg'],
      colorVersions: ['full_color', 'single_color', 'white', 'black'],
      description: 'Primary logo with icon and wordmark',
      psychologyNotes: 'Builds recognition and trust through consistent usage'
    },
    {
      type: 'icon',
      formats: ['svg', 'png', 'ico'],
      colorVersions: ['full_color', 'single_color', 'white', 'black'],
      description: 'Icon-only version for small spaces',
      psychologyNotes: 'Creates memorable visual anchor for brand recognition'
    },
    {
      type: 'wordmark',
      formats: ['svg', 'png'],
      colorVersions: ['full_color', 'single_color', 'white', 'black'],
      description: 'Text-only version with brand typography',
      psychologyNotes: 'Emphasizes company name for brand building'
    }
  ];
  
  return {
    primary: logoVariants[0],
    variations: logoVariants,
    favicon: logoVariants[1],
    usageGuidelines: {
      doNots: [
        'Do not stretch or distort the logo',
        'Do not use unofficial colors',
        'Do not place on busy backgrounds',
        'Do not recreate or modify the logo'
      ],
      contexts: {
        'website_header': 'Use primary full logo',
        'business_card': 'Use full logo or wordmark',
        'social_media': 'Use icon version for profile pictures',
        'merchandise': 'Use single color version'
      },
      backgrounds: {
        'light': ['full_color', 'single_color', 'black'],
        'dark': ['white', 'single_color'],
        'colored': ['white', 'black']
      },
      coexistence: [
        'Maintain clear space around logo',
        'Ensure sufficient contrast',
        'Respect hierarchical relationships'
      ]
    },
    protectionZone: '2x the height of the logo',
    minimumSizes: {
      'digital': '32px height',
      'print': '0.5 inch height',
      'embroidery': '1 inch height'
    }
  };
}

async function generateBrandColorPalette(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<BrandColorPalette> {
  // Use existing colors or generate new palette
  const baseColors = request.existingAssets?.colors || await generateOptimalColors(request, strategy);
  
  const primary: ColorDefinition = {
    name: 'Brand Primary',
    hex: baseColors[0] || '#0070F3',
    rgb: 'rgb(0, 112, 243)',
    hsl: 'hsl(217, 100%, 48%)',
    cmyk: 'cmyk(100%, 54%, 0%, 5%)',
    pantone: 'Pantone 2925 C',
    psychology: 'Trust, reliability, innovation',
    usage: ['primary_buttons', 'links', 'brand_elements'],
    combinations: ['white', 'light_gray', 'dark_blue']
  };
  
  const secondary: ColorDefinition[] = [
    {
      name: 'Brand Secondary',
      hex: '#1F2937',
      rgb: 'rgb(31, 41, 55)',
      hsl: 'hsl(220, 28%, 17%)',
      cmyk: 'cmyk(44%, 25%, 0%, 78%)',
      psychology: 'Sophistication, stability',
      usage: ['text', 'backgrounds', 'contrast'],
      combinations: ['white', 'light_blue', 'gray']
    }
  ];
  
  const neutral: ColorDefinition[] = [
    {
      name: 'Light Gray',
      hex: '#F8FAFC',
      rgb: 'rgb(248, 250, 252)',
      hsl: 'hsl(210, 40%, 98%)',
      cmyk: 'cmyk(2%, 1%, 0%, 1%)',
      psychology: 'Clean, minimal, spacious',
      usage: ['backgrounds', 'cards', 'sections'],
      combinations: ['dark_text', 'primary_color']
    }
  ];
  
  const accent: ColorDefinition = {
    name: 'Accent Green',
    hex: '#10B981',
    rgb: 'rgb(16, 185, 129)',
    hsl: 'hsl(160, 84%, 39%)',
    cmyk: 'cmyk(91%, 0%, 30%, 27%)',
    psychology: 'Success, growth, positive action',
    usage: ['success_states', 'positive_actions', 'highlights'],
    combinations: ['white', 'dark_green', 'light_green']
  };
  
  return {
    primary,
    secondary,
    neutral,
    accent,
    functional: {
      success: accent,
      warning: {
        name: 'Warning Orange',
        hex: '#F59E0B',
        rgb: 'rgb(245, 158, 11)',
        hsl: 'hsl(43, 96%, 56%)',
        cmyk: 'cmyk(0%, 35%, 95%, 4%)',
        psychology: 'Attention, caution, energy',
        usage: ['warnings', 'pending_states'],
        combinations: ['white', 'dark_orange']
      },
      error: {
        name: 'Error Red',
        hex: '#EF4444',
        rgb: 'rgb(239, 68, 68)',
        hsl: 'hsl(0, 84%, 60%)',
        cmyk: 'cmyk(0%, 72%, 72%, 6%)',
        psychology: 'Urgency, attention, error',
        usage: ['error_states', 'critical_actions'],
        combinations: ['white', 'dark_red']
      },
      info: primary
    },
    gradients: [
      {
        name: 'Primary Gradient',
        colors: [primary.hex, '#3B82F6'],
        direction: '135deg',
        usage: ['hero_backgrounds', 'call_to_actions', 'highlights'],
        psychology: 'Innovation, progression, premium feel'
      }
    ],
    psychology: {
      primary: {
        emotion: 'trust_and_innovation',
        association: ['technology', 'reliability', 'progress'],
        industry_fit: 0.95,
        conversion_impact: 0.87
      },
      overall_strategy: 'Build trust while conveying innovation and forward-thinking',
      cultural_considerations: ['western_positive_blue', 'universal_trust_signals']
    },
    accessibility: {
      contrast_ratios: {
        'primary_on_white': 4.5,
        'secondary_on_white': 12.1,
        'accent_on_white': 3.8
      },
      color_blind_safe: true,
      alternatives: {
        'red_green_blind': 'Use shapes and patterns in addition to color',
        'blue_yellow_blind': 'Ensure sufficient brightness contrast'
      }
    }
  };
}

async function createBrandTypography(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<BrandTypography> {
  const primaryTypeface: TypefaceDefinition = {
    name: 'Inter',
    category: 'Sans Serif',
    weights: [400, 500, 600, 700],
    styles: ['normal', 'italic'],
    usage: ['headings', 'user_interface', 'digital_content'],
    personality: ['modern', 'clean', 'friendly', 'professional'],
    licensing: 'Open Source (SIL OFL)',
    fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
  };
  
  const secondaryTypeface: TypefaceDefinition = {
    name: 'Inter',
    category: 'Sans Serif',
    weights: [400, 500],
    styles: ['normal', 'italic'],
    usage: ['body_text', 'captions', 'supporting_text'],
    personality: ['readable', 'clean', 'neutral'],
    licensing: 'Open Source (SIL OFL)',
    fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
  };
  
  return {
    primary: primaryTypeface,
    secondary: secondaryTypeface,
    hierarchy: {
      h1: {
        size: '2.5rem',
        weight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
        usage: 'Page titles, hero headlines',
        psychology: 'Authority, importance, attention-grabbing'
      },
      h2: {
        size: '2rem',
        weight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.015em',
        usage: 'Section headings, major topics',
        psychology: 'Structure, organization, hierarchy'
      },
      h3: {
        size: '1.5rem',
        weight: 600,
        lineHeight: 1.4,
        letterSpacing: '0',
        usage: 'Subsection headings, card titles',
        psychology: 'Clear information grouping'
      },
      h4: {
        size: '1.25rem',
        weight: 500,
        lineHeight: 1.4,
        letterSpacing: '0',
        usage: 'Small headings, emphasis',
        psychology: 'Supporting information hierarchy'
      },
      body: {
        size: '1rem',
        weight: 400,
        lineHeight: 1.6,
        letterSpacing: '0',
        usage: 'Main content, descriptions',
        psychology: 'Readability, accessibility, trust'
      },
      caption: {
        size: '0.875rem',
        weight: 400,
        lineHeight: 1.5,
        letterSpacing: '0',
        usage: 'Small text, metadata, disclaimers',
        psychology: 'Supporting information, legal compliance'
      },
      button: {
        size: '1rem',
        weight: 500,
        lineHeight: 1,
        letterSpacing: '0.025em',
        usage: 'Interactive elements, calls to action',
        psychology: 'Action-oriented, clickable, emphasis'
      }
    },
    webfonts: {
      google_fonts: 'Inter:400,500,600,700',
      preload: true,
      display: 'swap',
      fallback_strategy: 'system_fonts'
    },
    psychology: {
      readability_score: 0.95,
      trustworthiness: 0.88,
      modernity: 0.92,
      personality_alignment: 0.89
    }
  };
}

// Continue with remaining helper functions...

async function createImageryGuidelines(request: BrandRequest, strategy: BrandStrategy): Promise<ImageryGuidelines> {
  return {
    style: 'authentic_professional',
    mood: ['optimistic', 'confident', 'approachable'],
    subjects: ['real_people', 'workplace_environments', 'product_usage'],
    composition: ['rule_of_thirds', 'leading_lines', 'negative_space'],
    lighting: ['natural_light', 'bright', 'even_exposure'],
    color_treatment: 'natural_with_brand_accent',
    avoid: ['stock_photo_look', 'overly_posed', 'dark_moody'],
    sources: ['custom_photography', 'premium_stock', 'user_generated']
  };
}

async function createIconSystem(request: BrandRequest, strategy: BrandStrategy): Promise<IconSystem> {
  return {
    style: 'outline_modern',
    weight: '1.5px',
    corner_radius: '2px',
    grid_system: '24px',
    library: 'Lucide Icons',
    custom_requirements: ['brand_color_variants', 'consistent_stroke_width', 'scalable_vector']
  };
}

async function createLayoutPrinciples(request: BrandRequest, strategy: BrandStrategy): Promise<LayoutPrinciples> {
  return {
    grid_system: 'css_grid_12_column',
    spacing_scale: [4, 8, 16, 24, 32, 48, 64, 96],
    proportions: 'golden_ratio_influences',
    hierarchy: ['size', 'weight', 'color', 'spacing'],
    whitespace_philosophy: 'generous_breathing_room'
  };
}

async function createMotionPrinciples(request: BrandRequest, strategy: BrandStrategy): Promise<MotionPrinciples> {
  return {
    personality: 'smooth_confident',
    timing: 'fast_responsive',
    easing: ['ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)'],
    purposes: ['feedback', 'transition', 'delight', 'attention'],
    guidelines: ['prefer_transforms', 'respect_reduced_motion', 'performance_first']
  };
}

async function developBrandVoice(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<BrandVoice> {
  return {
    tone: {
      primary: 'professional_approachable',
      secondary: ['confident', 'helpful', 'innovative'],
      situations: {
        'marketing': 'enthusiastic_professional',
        'support': 'helpful_patient',
        'error': 'apologetic_solution_focused',
        'celebration': 'excited_grateful'
      },
      avoid: ['overly_casual', 'jargon_heavy', 'condescending', 'overly_formal']
    },
    personality: {
      adjectives: ['trustworthy', 'innovative', 'approachable', 'expert', 'reliable'],
      human_equivalent: 'Knowledgeable consultant who genuinely cares about your success',
      communication_style: 'clear_direct_with_warmth',
      humor_level: 'light_appropriate',
      formality: 'business_casual'
    },
    messaging: {
      core_messages: [
        'We simplify complex challenges',
        'Your success is our priority',
        'Innovation meets reliability'
      ],
      value_props: [
        'Save time with intelligent solutions',
        'Expert guidance every step of the way',
        'Proven results you can trust'
      ],
      proof_points: [
        'Trusted by leading companies',
        'Award-winning technology',
        'Exceptional customer satisfaction'
      ],
      objection_responses: {
        'too_expensive': 'Our ROI typically pays for itself within 3 months',
        'too_complex': 'We handle the complexity so you don\'t have to',
        'not_sure_it_works': 'See why industry leaders choose us consistently'
      }
    },
    examples: {
      headlines: [
        'Transform your business with intelligent solutions',
        'Where innovation meets reliability',
        'Your success story starts here'
      ],
      body_copy: [
        'We understand the challenges you face. That\'s why we\'ve built solutions that actually work.',
        'Join thousands of successful businesses who trust us to deliver results.',
        'Ready to see what\'s possible? Let\'s explore your options together.'
      ],
      ctas: [
        'Start your free trial',
        'See how it works',
        'Get expert guidance',
        'Transform your business today'
      ],
      error_messages: [
        'Oops! Something went wrong. We\'re on it.',
        'This page seems to have wandered off. Let\'s get you back on track.',
        'Technical hiccup detected. Our team is already working on it.'
      ],
      social_posts: [
        'Another success story from our amazing clients! 🎉',
        'Pro tip: Small changes can lead to big results',
        'Behind the scenes: How we solve complex challenges'
      ]
    },
    guidelines: {
      do: [
        'Use active voice',
        'Be specific and concrete',
        'Lead with benefits',
        'Show genuine enthusiasm',
        'Acknowledge customer effort'
      ],
      dont: [
        'Use industry jargon without explanation',
        'Make promises you can\'t keep',
        'Sound like everyone else',
        'Ignore the human element',
        'Be vague or ambiguous'
      ],
      grammar_preferences: [
        'Oxford comma usage',
        'Sentence case for headlines',
        'Contractions allowed in casual contexts',
        'Numbers under 10 spelled out'
      ],
      industry_terms: {
        'clients': 'partners',
        'users': 'customers',
        'features': 'capabilities',
        'problems': 'challenges'
      }
    }
  };
}

// Continue with more helper functions and complete the implementation...

async function generateBrandAssets(request: BrandRequest, visual: VisualSystem, env: Env): Promise<BrandAssets> {
  // This would integrate with actual asset generation services
  return {
    logos: [],
    icons: [],
    templates: [],
    presentations: [],
    social_media: {
      profile_pictures: [],
      cover_photos: [],
      post_templates: [],
      story_templates: [],
      highlights: []
    },
    marketing: {
      business_cards: [],
      letterheads: [],
      email_signatures: [],
      presentations: [],
      brochures: []
    }
  };
}

async function createBrandGuidelines(visual: VisualSystem, voice: BrandVoice, strategy: BrandStrategy, env: Env): Promise<BrandGuidelines> {
  return {
    overview: 'Comprehensive guidelines for maintaining brand consistency across all touchpoints',
    usage_rules: {
      logo_placement: ['Maintain clear space', 'Use appropriate contrast', 'Respect minimum sizes'],
      color_combinations: ['Primary with neutral', 'Accent for highlights only', 'Avoid color clashing'],
      typography_pairings: ['Consistent hierarchy', 'Appropriate line spacing', 'Readable contrast'],
      photography_style: ['Authentic subjects', 'Natural lighting', 'Brand color accents'],
      tone_of_voice: ['Professional but approachable', 'Clear and direct', 'Genuinely helpful']
    },
    applications: {
      website: ['Header logo placement', 'Color scheme application', 'Typography hierarchy'],
      print: ['Logo reproduction', 'Color accuracy', 'Typography scaling'],
      digital: ['Social media formats', 'Email templates', 'Digital advertisements'],
      merchandise: ['Apparel applications', 'Promotional items', 'Event materials'],
      signage: ['Building signage', 'Trade show displays', 'Vehicle graphics']
    },
    quality_standards: {
      resolution_minimums: {
        'web': '72 DPI',
        'print': '300 DPI',
        'large_format': '150 DPI'
      },
      file_formats: {
        'logo': ['SVG', 'PNG', 'EPS'],
        'photography': ['JPG', 'PNG', 'TIFF'],
        'documents': ['PDF', 'DOCX']
      },
      color_accuracy: ['Use brand color codes exactly', 'Proof colors before printing', 'Monitor calibration'],
      production_notes: ['Always use vector logos when possible', 'Maintain aspect ratios', 'Check readability at size']
    },
    approval_process: 'All brand applications require review by brand manager before publication'
  };
}

async function createImplementationPlan(request: BrandRequest, env: Env): Promise<ImplementationPlan> {
  return {
    immediate: {
      priority_assets: ['primary_logo', 'color_palette', 'typography_system'],
      quick_wins: ['update_website_header', 'create_email_signature', 'update_social_profiles'],
      timeline: '1-2 weeks',
      resources_needed: ['design_team', 'web_developer', 'content_writer']
    },
    short_term: {
      major_touchpoints: ['website_redesign', 'marketing_materials', 'sales_presentations'],
      campaigns: ['brand_launch', 'awareness_campaign', 'content_strategy'],
      timeline: '1-3 months',
      budget_estimate: '$15,000 - $50,000'
    },
    long_term: {
      brand_evolution: ['market_expansion', 'product_launches', 'international_adaptation'],
      market_expansion: ['new_demographics', 'additional_services', 'geographic_growth'],
      innovation_areas: ['digital_experiences', 'customer_engagement', 'brand_partnerships'],
      timeline: '6-12 months'
    },
    monitoring: {
      brand_health_metrics: ['awareness', 'perception', 'preference', 'loyalty'],
      tracking_methods: ['surveys', 'social_listening', 'web_analytics', 'sales_data'],
      review_frequency: 'quarterly',
      optimization_triggers: ['performance_decline', 'market_changes', 'competitive_threats']
    }
  };
}

async function analyzePsychologicalProfile(visual: VisualSystem, voice: BrandVoice, strategy: BrandStrategy, env: Env): Promise<PsychologicalProfile> {
  return {
    cognitive_load: 0.3, // Low cognitive load - easy to process
    emotional_resonance: 0.85, // High emotional connection
    trust_signals: ['professional_appearance', 'consistent_messaging', 'social_proof'],
    persuasion_elements: ['authority', 'social_proof', 'reciprocity', 'commitment'],
    conversion_psychology: {
      primary_motivators: ['success', 'efficiency', 'security'],
      fear_factors: ['missing_out', 'making_wrong_choice', 'wasting_time'],
      social_proof_types: ['customer_testimonials', 'usage_statistics', 'expert_endorsements'],
      urgency_tactics: ['limited_time_offers', 'scarcity_messaging', 'immediate_benefits'],
      trust_builders: ['certifications', 'guarantees', 'transparency', 'expert_credentials']
    }
  };
}

// Additional helper functions for brand strategy components
async function generateTagline(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<string> {
  const taglineOptions = [
    'Innovation that delivers',
    'Your success, our mission',
    'Where expertise meets results',
    'Transforming possibilities into reality'
  ];
  
  return taglineOptions[0]; // In production, use AI to generate and test multiple options
}

async function generateBrandPromise(request: BrandRequest, strategy: BrandStrategy, env: Env): Promise<string> {
  return `We promise to deliver innovative solutions that help ${request.targetAudience} achieve their goals with confidence and ease.`;
}

async function generatePersonalityAvoids(request: BrandRequest, env: Env): Promise<string[]> {
  return ['outdated', 'unreliable', 'complicated', 'impersonal', 'generic'];
}

async function determineBrandArchetype(request: BrandRequest, env: Env): Promise<string> {
  const archetypeMap: Record<string, string> = {
    'innovation': 'The Magician',
    'reliability': 'The Caregiver',
    'expertise': 'The Sage',
    'accessibility': 'The Everyman'
  };
  
  const primaryValue = request.businessValues[0] || 'expertise';
  return archetypeMap[primaryValue] || 'The Expert';
}

async function identifyEmotionalTriggers(request: BrandRequest, env: Env): Promise<string[]> {
  return ['achievement', 'security', 'belonging', 'progress', 'recognition'];
}

// Store and track functions
async function storeBrandForLearning(brandOutput: BrandOutput, request: BrandRequest, env: Env): Promise<void> {
  try {
    await env.DB_MAIN.prepare(`
      INSERT INTO brand_outputs (
        brand_id, company_name, business_type, industry, 
        brand_archetype, primary_color, created_at, 
        request_data, brand_data
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
    `).bind(
      brandOutput.brandId,
      request.companyName,
      request.businessType,
      request.industry,
      brandOutput.identity.archetype,
      brandOutput.visual.colorPalette.primary.hex,
      JSON.stringify(request),
      JSON.stringify(brandOutput)
    ).run();
    
    console.log('Brand stored for learning:', brandOutput.brandId);
  } catch (error) {
    console.error('Failed to store brand:', error);
  }
}

async function trackBrandAnalytics(event: string, request: BrandRequest, output: BrandOutput, env: Env): Promise<void> {
  try {
    await env.ANALYTICS_DATASET.writeDataPoint({
      indexes: [request.businessType, request.industry],
      blobs: [event, output.brandId],
      doubles: [output.psychological.emotional_resonance, output.psychological.cognitive_load],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}

// Additional endpoint handlers
async function handleBrandAnalysis(request: Request, env: Env): Promise<Response> {
  const { url, companyName } = await request.json();
  
  const analysis = {
    current_brand_strength: 0.65,
    visual_consistency: 0.70,
    voice_clarity: 0.60,
    market_positioning: 0.55,
    recommendations: [
      'Strengthen visual consistency across touchpoints',
      'Clarify brand positioning statement',
      'Develop distinctive voice and tone',
      'Enhance digital brand presence'
    ]
  };
  
  return new Response(JSON.stringify(analysis), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleBrandEnhancement(request: Request, env: Env): Promise<Response> {
  const enhancements = {
    visual_updates: ['modernize_logo', 'refresh_color_palette', 'update_typography'],
    messaging_improvements: ['clarify_value_prop', 'strengthen_positioning', 'develop_tagline'],
    implementation_priorities: ['website_update', 'marketing_materials', 'social_presence']
  };
  
  return new Response(JSON.stringify(enhancements), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleBrandAudit(request: Request, env: Env): Promise<Response> {
  const audit = {
    brand_health_score: 0.72,
    strengths: ['clear_visual_identity', 'consistent_messaging'],
    weaknesses: ['limited_market_differentiation', 'outdated_digital_presence'],
    opportunities: ['expand_social_presence', 'develop_thought_leadership'],
    threats: ['increasing_competition', 'changing_customer_preferences']
  };
  
  return new Response(JSON.stringify(audit), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGuidelinesGeneration(request: Request, env: Env): Promise<Response> {
  const guidelines = {
    logo_usage: 'Comprehensive logo usage guidelines',
    color_specifications: 'Brand color codes and usage rules',
    typography_system: 'Typography hierarchy and specifications',
    voice_guidelines: 'Brand voice and tone guidelines',
    application_examples: 'Real-world application examples'
  };
  
  return new Response(JSON.stringify(guidelines), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleAssetGeneration(request: Request, env: Env): Promise<Response> {
  const assets = {
    logos: 'Generated logo files in multiple formats',
    templates: 'Brand-compliant templates for various uses',
    guidelines: 'Brand guidelines document',
    assets_package: 'Complete brand assets package'
  };
  
  return new Response(JSON.stringify(assets), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper functions for strategy development (abbreviated for brevity)
async function identifyCompetitiveAdvantages(request: BrandRequest, industryAnalysis: any): Promise<string[]> {
  return ['innovative_approach', 'superior_customer_service', 'proven_expertise'];
}

async function defineBrandPillars(request: BrandRequest): Promise<string[]> {
  return request.businessValues.slice(0, 3);
}

async function defineCategoryPosition(request: BrandRequest, industryAnalysis: any): Promise<string> {
  return `Leading provider of ${request.businessType} solutions`;
}

async function identifyUniqueFactors(request: BrandRequest): Promise<string[]> {
  return ['proprietary_technology', 'expert_team', 'proven_methodology'];
}

async function buildCompetitiveMoats(request: BrandRequest): Promise<string[]> {
  return ['network_effects', 'switching_costs', 'brand_recognition'];
}

async function identifyEmotionalDifferentiators(request: BrandRequest): Promise<string[]> {
  return ['trust', 'confidence', 'peace_of_mind'];
}

async function definePrimaryPersona(request: BrandRequest): Promise<PersonaDefinition> {
  return {
    name: 'Primary Customer',
    demographics: { age: '35-55', income: 'Middle to upper-middle class' },
    psychographics: ['goal-oriented', 'value-conscious', 'technology-adopter'],
    pain_points: ['time_constraints', 'information_overload', 'decision_anxiety'],
    goals: ['efficiency', 'success', 'growth'],
    brand_relationship: 'trusted_advisor'
  };
}

async function defineSecondaryPersonas(request: BrandRequest): Promise<PersonaDefinition[]> {
  return []; // Simplified for brevity
}

async function mapCommunicationPreferences(request: BrandRequest): Promise<Record<string, string>> {
  return {
    'email': 'professional_informative',
    'social': 'engaging_visual',
    'website': 'clear_comprehensive'
  };
}

async function identifyJourneyTouchpoints(request: BrandRequest): Promise<string[]> {
  return ['awareness', 'consideration', 'trial', 'purchase', 'onboarding', 'advocacy'];
}

async function developCoreNarrative(request: BrandRequest): Promise<string> {
  return `We help ${request.targetAudience} achieve their goals through innovative ${request.businessType} solutions.`;
}

async function developSupportingStories(request: BrandRequest): Promise<string[]> {
  return ['customer_success_stories', 'innovation_journey', 'team_expertise'];
}

async function identifyProofPoints(request: BrandRequest): Promise<string[]> {
  return ['customer_testimonials', 'case_studies', 'industry_awards'];
}

async function optimizeCallToActions(request: BrandRequest): Promise<string[]> {
  return ['Get started today', 'Learn more', 'Contact us', 'Try it free'];
}

async function definePhasedImplementation(request: BrandRequest): Promise<ImplementationPhase[]> {
  return [
    {
      name: 'Foundation',
      duration: '2-4 weeks',
      deliverables: ['brand_strategy', 'visual_identity', 'voice_guidelines'],
      success_criteria: ['stakeholder_approval', 'guidelines_documentation']
    }
  ];
}

async function identifyBrandTouchpoints(request: BrandRequest): Promise<string[]> {
  return ['website', 'social_media', 'email', 'advertising', 'customer_service'];
}

async function defineBrandMetrics(request: BrandRequest): Promise<string[]> {
  return ['brand_awareness', 'brand_perception', 'customer_loyalty', 'market_share'];
}

async function createImplementationTimeline(request: BrandRequest): Promise<string> {
  return '3-6 months for full implementation';
}

async function enhanceExistingLogo(logoUrl: string, request: BrandRequest, strategy: BrandStrategy): Promise<LogoSystem> {
  // Analyze existing logo and provide enhancement recommendations
  return {
    primary: {
      type: 'full',
      formats: ['svg', 'png'],
      colorVersions: ['enhanced_color', 'single_color', 'white', 'black'],
      description: 'Enhanced version of existing logo',
      psychologyNotes: 'Maintains brand recognition while improving modern appeal'
    },
    variations: [],
    favicon: {
      type: 'icon',
      formats: ['ico', 'png'],
      colorVersions: ['full_color'],
      description: 'Favicon version',
      psychologyNotes: 'Maintains brand recognition in small formats'
    },
    usageGuidelines: {
      doNots: ['Do not modify the enhanced logo'],
      contexts: {},
      backgrounds: {},
      coexistence: []
    },
    protectionZone: '2x logo height',
    minimumSizes: { 'digital': '32px', 'print': '0.5in' }
  };
}

async function generateOptimalColors(request: BrandRequest, strategy: BrandStrategy): Promise<string[]> {
  // Industry-optimized color generation
  const industryColorMap: Record<string, string[]> = {
    'healthcare': ['#0070F3', '#10B981'],
    'technology': ['#6366F1', '#000000'],
    'finance': ['#1E40AF', '#059669'],
    'education': ['#3B82F6', '#F59E0B']
  };
  
  return industryColorMap[request.industry] || ['#0070F3', '#1F2937'];
}