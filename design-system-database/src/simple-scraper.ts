import axios from 'axios';
import * as cheerio from 'cheerio';
import { DesignSystemDatabase } from './database';
import { DesignComponent, ComponentType, ComponentCategory, ComponentSource, DesignStyle } from './types';
import { generateId, extractTags, analyzeComplexity, scoreAesthetics, detectStyle } from './utils';

export class SimpleUIverseScraper {
  private db: DesignSystemDatabase;
  private baseUrl = 'https://uiverse.io';

  constructor(database: DesignSystemDatabase) {
    this.db = database;
  }

  async scrapeComponents(maxComponents: number = 100): Promise<void> {
    console.log(`🚀 Starting to scrape ${maxComponents} components from UIverse...`);
    
    let scraped = 0;
    let page = 1;
    
    while (scraped < maxComponents) {
      try {
        console.log(`📄 Scraping page ${page}...`);
        
        // Get the main page HTML
        const response = await axios.get(`${this.baseUrl}/all`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 15000
        });

        const $ = cheerio.load(response.data);
        
        // Extract component URLs from the page
        const componentLinks: string[] = [];
        $('a[href*="/elements/"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href && !componentLinks.includes(href)) {
            componentLinks.push(href);
          }
        });

        console.log(`Found ${componentLinks.length} component links on page ${page}`);
        
        if (componentLinks.length === 0) {
          console.log('No more components found, stopping...');
          break;
        }

        // Scrape each component
        for (const link of componentLinks) {
          if (scraped >= maxComponents) break;
          
          try {
            await this.delay(1000 + Math.random() * 2000); // Rate limiting
            const component = await this.scrapeComponent(link);
            
            if (component) {
              await this.db.insertComponent(component);
              scraped++;
              console.log(`✅ [${scraped}/${maxComponents}] Scraped: ${component.name}`);
            }
          } catch (error) {
            console.warn(`⚠️  Failed to scrape ${link}:`, error.message);
            continue;
          }
        }

        page++;
        
        // Break if we didn't find enough new components
        if (componentLinks.length < 10) {
          console.log('Reached end of available components');
          break;
        }
        
      } catch (error) {
        console.error(`❌ Failed to fetch page ${page}:`, error.message);
        break;
      }
    }

    console.log(`🎉 Scraping completed! ${scraped} components added to database.`);
  }

  private async scrapeComponent(path: string): Promise<DesignComponent | null> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        timeout: 8000
      });

      const $ = cheerio.load(response.data);
      
      // Extract component information
      const title = $('h1').first().text().trim() || 
                   $('[data-testid="title"]').text().trim() || 
                   $('title').text().replace(' | Uiverse.io', '').trim() ||
                   'Untitled Component';

      const description = $('meta[name="description"]').attr('content') || 
                         $('p').first().text().trim() || 
                         'UI component from Uiverse.io';

      // Try to find code blocks
      let htmlCode = '';
      let cssCode = '';
      let jsCode = '';

      // Look for code in various formats
      $('pre, code, .code-block').each((i, el) => {
        const codeText = $(el).text();
        
        if (codeText.includes('<') && codeText.includes('>')) {
          htmlCode += codeText + '\n';
        }
        
        if (codeText.includes('{') && (codeText.includes('color:') || codeText.includes('background:') || codeText.includes('padding:'))) {
          cssCode += codeText + '\n';
        }
        
        if (codeText.includes('function') || codeText.includes('addEventListener') || codeText.includes('document.')) {
          jsCode += codeText + '\n';
        }
      });

      // Fallback: try to extract from script tags or other elements
      if (!htmlCode && !cssCode) {
        $('script[type="text/plain"], .hljs, .language-html, .language-css').each((i, el) => {
          const content = $(el).text();
          if (content.includes('<') && content.includes('>')) {
            htmlCode += content + '\n';
          }
          if (content.includes('{') && content.includes(':')) {
            cssCode += content + '\n';
          }
        });
      }

      // Generate fallback code if none found
      if (!htmlCode && !cssCode) {
        htmlCode = `<div class="uiverse-component">
  <h3>${title}</h3>
  <p>${description}</p>
</div>`;
        
        cssCode = `.uiverse-component {
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}`;
      }

      // Extract tags from various sources
      const tags: string[] = [];
      $('meta[name="keywords"]').attr('content')?.split(',').forEach(tag => {
        tags.push(tag.trim().toLowerCase());
      });
      
      // Add tags based on URL and content
      if (path.includes('button')) tags.push('button');
      if (path.includes('card')) tags.push('card');
      if (path.includes('form')) tags.push('form');
      if (path.includes('nav')) tags.push('navigation');
      if (cssCode.includes('gradient')) tags.push('gradient');
      if (cssCode.includes('animation')) tags.push('animation');
      if (cssCode.includes('hover')) tags.push('hover');

      // Detect component type and style
      const type = this.detectComponentType(htmlCode, cssCode, title, tags);
      const category = this.detectComponentCategory(type);
      const style = detectStyle(cssCode);
      const complexity = analyzeComplexity(htmlCode, cssCode, jsCode);
      const aestheticScore = scoreAesthetics(htmlCode, cssCode);
      const allTags = extractTags(htmlCode, cssCode, tags);

      const component: DesignComponent = {
        id: generateId(),
        name: title,
        type,
        category,
        source: ComponentSource.UIVERSE,
        html_code: htmlCode.trim(),
        css_code: cssCode.trim(),
        js_code: jsCode.trim(),
        preview_url: url,
        preview_image: '',
        description,
        tags: allTags,
        style,
        complexity,
        mobile_optimized: this.checkMobileOptimization(cssCode),
        accessibility_score: this.assessAccessibility(htmlCode),
        metrics: {
          aesthetic_score: aestheticScore,
          performance_score: this.assessPerformance(htmlCode, cssCode, jsCode),
          usage_count: 0
        },
        created_at: new Date(),
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 0,
        industries: this.inferIndustries(allTags, description),
        frameworks: this.detectFrameworks(htmlCode, cssCode, jsCode)
      };

      return component;

    } catch (error) {
      throw new Error(`Failed to scrape component: ${error.message}`);
    }
  }

  private detectComponentType(html: string, css: string, title: string, tags: string[]): ComponentType {
    const content = (html + css + title + tags.join(' ')).toLowerCase();
    
    if (content.includes('button') || content.includes('btn')) return ComponentType.BUTTON;
    if (content.includes('card') || content.includes('box')) return ComponentType.CARD;
    if (content.includes('form') || content.includes('input')) return ComponentType.FORM;
    if (content.includes('hero') || content.includes('banner')) return ComponentType.HERO;
    if (content.includes('nav') || content.includes('menu')) return ComponentType.NAVIGATION;
    if (content.includes('footer')) return ComponentType.FOOTER;
    if (content.includes('modal') || content.includes('popup')) return ComponentType.MODAL;
    if (content.includes('gallery') || content.includes('carousel')) return ComponentType.GALLERY;
    if (content.includes('pricing') || content.includes('price')) return ComponentType.PRICING;
    if (content.includes('testimonial') || content.includes('review')) return ComponentType.TESTIMONIAL;
    if (content.includes('cta') || content.includes('call-to-action')) return ComponentType.CTA;
    if (content.includes('loading') || content.includes('spinner')) return ComponentType.LOADING;
    if (content.includes('animation') || content.includes('animate')) return ComponentType.ANIMATION;
    
    return ComponentType.CARD; // Default fallback
  }

  private detectComponentCategory(type: ComponentType): ComponentCategory {
    const categoryMap: Record<ComponentType, ComponentCategory> = {
      [ComponentType.HERO]: ComponentCategory.LAYOUT,
      [ComponentType.BUTTON]: ComponentCategory.INTERACTION,
      [ComponentType.CARD]: ComponentCategory.DISPLAY,
      [ComponentType.FORM]: ComponentCategory.INPUT,
      [ComponentType.NAVIGATION]: ComponentCategory.NAVIGATION,
      [ComponentType.FOOTER]: ComponentCategory.LAYOUT,
      [ComponentType.MODAL]: ComponentCategory.FEEDBACK,
      [ComponentType.GALLERY]: ComponentCategory.MEDIA,
      [ComponentType.PRICING]: ComponentCategory.DISPLAY,
      [ComponentType.TESTIMONIAL]: ComponentCategory.DISPLAY,
      [ComponentType.CTA]: ComponentCategory.INTERACTION,
      [ComponentType.LAYOUT]: ComponentCategory.LAYOUT,
      [ComponentType.ANIMATION]: ComponentCategory.UTILITY,
      [ComponentType.LOADING]: ComponentCategory.FEEDBACK,
      [ComponentType.ERROR]: ComponentCategory.FEEDBACK,
      [ComponentType.CHART]: ComponentCategory.DISPLAY,
      [ComponentType.TABLE]: ComponentCategory.DISPLAY,
      [ComponentType.LIST]: ComponentCategory.DISPLAY,
      [ComponentType.MENU]: ComponentCategory.NAVIGATION,
      [ComponentType.BREADCRUMB]: ComponentCategory.NAVIGATION,
      [ComponentType.PAGINATION]: ComponentCategory.NAVIGATION,
      [ComponentType.SLIDER]: ComponentCategory.INTERACTION,
      [ComponentType.ACCORDION]: ComponentCategory.INTERACTION,
      [ComponentType.TAB]: ComponentCategory.NAVIGATION,
      [ComponentType.TOOLTIP]: ComponentCategory.FEEDBACK,
      [ComponentType.BADGE]: ComponentCategory.DISPLAY,
      [ComponentType.ALERT]: ComponentCategory.FEEDBACK,
      [ComponentType.PROGRESS]: ComponentCategory.FEEDBACK,
      [ComponentType.CALENDAR]: ComponentCategory.INPUT,
      [ComponentType.SEARCH]: ComponentCategory.INPUT,
      [ComponentType.FILTER]: ComponentCategory.INPUT,
      [ComponentType.SOCIAL]: ComponentCategory.INTERACTION
    };

    return categoryMap[type] || ComponentCategory.DISPLAY;
  }

  private checkMobileOptimization(css: string): boolean {
    return css.includes('@media') && 
           (css.includes('max-width') || css.includes('min-width'));
  }

  private assessAccessibility(html: string): number {
    let score = 50; // Base score
    
    if (html.includes('alt=')) score += 10;
    if (html.includes('aria-')) score += 15;
    if (html.includes('role=')) score += 10;
    if (html.includes('tabindex=')) score += 5;
    if (html.includes('label')) score += 10;
    
    return Math.min(score, 100);
  }

  private assessPerformance(html: string, css: string, js: string): number {
    let score = 80; // Base score
    
    // Penalize for complex CSS
    if (css.length > 2000) score -= 10;
    if (css.includes('box-shadow')) score -= 5;
    if (css.includes('filter:')) score -= 5;
    
    // Penalize for heavy JavaScript
    if (js.length > 1000) score -= 15;
    
    // Reward for modern CSS
    if (css.includes('flexbox') || css.includes('grid')) score += 10;
    if (css.includes('transform')) score += 5;
    
    return Math.max(score, 1);
  }

  private inferIndustries(tags: string[], description: string): string[] {
    const content = (tags.join(' ') + ' ' + description).toLowerCase();
    const industries: string[] = [];
    
    if (content.includes('ecommerce') || content.includes('shop')) industries.push('ecommerce');
    if (content.includes('saas') || content.includes('software')) industries.push('saas');
    if (content.includes('finance') || content.includes('bank')) industries.push('finance');
    if (content.includes('health') || content.includes('medical')) industries.push('healthcare');
    if (content.includes('education') || content.includes('learning')) industries.push('education');
    if (content.includes('real estate') || content.includes('property')) industries.push('real-estate');
    if (content.includes('restaurant') || content.includes('food')) industries.push('food');
    if (content.includes('travel') || content.includes('hotel')) industries.push('travel');
    if (content.includes('agency') || content.includes('creative')) industries.push('agency');
    if (content.includes('portfolio') || content.includes('personal')) industries.push('portfolio');
    
    return industries.length > 0 ? industries : ['general'];
  }

  private detectFrameworks(html: string, css: string, js: string): string[] {
    const content = html + css + js;
    const frameworks: string[] = [];
    
    if (content.includes('tailwind') || css.includes('tw-')) frameworks.push('tailwind');
    if (content.includes('bootstrap') || css.includes('btn-')) frameworks.push('bootstrap');
    if (content.includes('mui') || content.includes('material')) frameworks.push('material-ui');
    if (content.includes('chakra')) frameworks.push('chakra-ui');
    if (content.includes('antd')) frameworks.push('ant-design');
    
    return frameworks.length > 0 ? frameworks : ['vanilla'];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}