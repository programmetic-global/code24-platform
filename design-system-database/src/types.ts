export interface DesignComponent {
  id: string;
  name: string;
  type: ComponentType;
  category: ComponentCategory;
  source: ComponentSource;
  html_code: string;
  css_code: string;
  js_code?: string;
  preview_url: string;
  preview_image?: string;
  description: string;
  tags: string[];
  style: DesignStyle;
  complexity: number; // 1-10
  mobile_optimized: boolean;
  accessibility_score: number; // 1-100
  
  // Metrics
  metrics: ComponentMetrics;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  scraped_at: Date;
  tested_sites: number;
  industries: string[];
  frameworks: string[];
}

export interface ComponentMetrics {
  conversion_rate?: number;
  engagement_score?: number;
  aesthetic_score: number; // 1-100
  performance_score: number; // 1-100
  user_rating?: number; // 1-5
  usage_count: number;
  avg_load_time?: number;
  bounce_rate_impact?: number;
}

export enum ComponentType {
  HERO = 'hero',
  BUTTON = 'button',
  CARD = 'card',
  FORM = 'form',
  NAVIGATION = 'navigation',
  FOOTER = 'footer',
  MODAL = 'modal',
  GALLERY = 'gallery',
  PRICING = 'pricing',
  TESTIMONIAL = 'testimonial',
  CTA = 'cta',
  LAYOUT = 'layout',
  ANIMATION = 'animation',
  LOADING = 'loading',
  ERROR = 'error',
  CHART = 'chart',
  TABLE = 'table',
  LIST = 'list',
  MENU = 'menu',
  BREADCRUMB = 'breadcrumb',
  PAGINATION = 'pagination',
  SLIDER = 'slider',
  ACCORDION = 'accordion',
  TAB = 'tab',
  TOOLTIP = 'tooltip',
  BADGE = 'badge',
  ALERT = 'alert',
  PROGRESS = 'progress',
  CALENDAR = 'calendar',
  SEARCH = 'search',
  FILTER = 'filter',
  SOCIAL = 'social'
}

export enum ComponentCategory {
  LAYOUT = 'layout',
  INTERACTION = 'interaction',
  DISPLAY = 'display',
  INPUT = 'input',
  FEEDBACK = 'feedback',
  NAVIGATION = 'navigation',
  MEDIA = 'media',
  UTILITY = 'utility'
}

export enum ComponentSource {
  UIVERSE = 'uiverse.io',
  TAILWIND_UI = 'tailwindui.com',
  SHADCN = 'ui.shadcn.com',
  DRIBBBLE = 'dribbble.com',
  AWWWARDS = 'awwwards.com',
  CODEPEN = 'codepen.io',
  CUSTOM = 'custom'
}

export enum DesignStyle {
  MODERN = 'modern',
  MINIMAL = 'minimal',
  GLASSMORPHISM = 'glassmorphism',
  NEUMORPHISM = 'neumorphism',
  GRADIENT = 'gradient',
  DARK = 'dark',
  LIGHT = 'light',
  COLORFUL = 'colorful',
  MONOCHROME = 'monochrome',
  RETRO = 'retro',
  FUTURISTIC = 'futuristic',
  ORGANIC = 'organic',
  GEOMETRIC = 'geometric',
  BRUTALIST = 'brutalist',
  ELEGANT = 'elegant'
}

export interface ScrapingSession {
  id: string;
  source: ComponentSource;
  started_at: Date;
  completed_at?: Date;
  total_components: number;
  successful_scrapes: number;
  failed_scrapes: number;
  errors: string[];
  status: 'running' | 'completed' | 'failed' | 'paused';
}

export interface ComponentAnalysis {
  component_id: string;
  analysis_type: 'conversion' | 'aesthetic' | 'performance' | 'accessibility';
  score: number;
  details: Record<string, any>;
  analyzed_at: Date;
  analyzer_version: string;
}

export interface TrendAnalysis {
  id: string;
  trend_name: string;
  description: string;
  popularity_score: number; // 1-100
  growth_rate: number; // percentage
  detected_at: Date;
  components_count: number;
  related_tags: string[];
  source_insights: Record<ComponentSource, number>;
}