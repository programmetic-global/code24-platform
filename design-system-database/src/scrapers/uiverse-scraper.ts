import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { DesignComponent, ComponentType, ComponentCategory, ComponentSource, DesignStyle, ScrapingSession } from '../types';
import { DesignSystemDatabase } from '../database';
import { generateId, extractTags, analyzeComplexity, scoreAesthetics, detectStyle } from '../utils';

export class UIverseScraper {
  private browser: puppeteer.Browser | null = null;
  private db: DesignSystemDatabase;
  private session: ScrapingSession;

  constructor(database: DesignSystemDatabase) {
    this.db = database;
    this.session = {
      id: generateId(),
      source: ComponentSource.UIVERSE,
      started_at: new Date(),
      total_components: 0,
      successful_scrapes: 0,
      failed_scrapes: 0,
      errors: [],
      status: 'running'
    };
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    await this.db.recordScrapingSession(this.session);
    console.log(`🚀 Started UIverse scraping session: ${this.session.id}`);
  }

  async scrapeComponents(maxComponents: number = 1000): Promise<void> {
    if (!this.browser) {
      throw new Error('Scraper not initialized. Call initialize() first.');
    }

    try {
      const page = await this.browser.newPage();
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      
      // Navigate to UIverse
      console.log('📊 Navigating to UIverse.io...');
      await page.goto('https://uiverse.io/all', { waitUntil: 'networkidle2' });

      // Get component links
      const componentLinks = await this.extractComponentLinks(page, maxComponents);
      this.session.total_components = componentLinks.length;

      console.log(`🔍 Found ${componentLinks.length} components to scrape`);

      // Scrape each component
      for (let i = 0; i < componentLinks.length; i++) {
        const link = componentLinks[i];
        console.log(`📦 Scraping component ${i + 1}/${componentLinks.length}: ${link}`);

        try {
          const component = await this.scrapeComponent(page, link);
          if (component) {
            await this.db.insertComponent(component);
            this.session.successful_scrapes++;
            console.log(`✅ Successfully scraped: ${component.name}`);
          }
        } catch (error) {
          this.session.failed_scrapes++;
          this.session.errors.push(`Failed to scrape ${link}: ${error}`);
          console.error(`❌ Failed to scrape ${link}:`, error);
        }

        // Rate limiting
        await this.delay(Math.random() * 2000 + 1000);

        // Update session periodically
        if (i % 10 === 0) {
          await this.updateSession();
        }
      }

      await page.close();
      
      this.session.status = 'completed';
      this.session.completed_at = new Date();
      await this.updateSession();

      console.log(`🎉 Scraping completed! ${this.session.successful_scrapes}/${this.session.total_components} components scraped`);

    } catch (error) {
      this.session.status = 'failed';
      this.session.errors.push(`Scraping failed: ${error}`);
      await this.updateSession();
      throw error;
    }
  }

  private async extractComponentLinks(page: puppeteer.Page, maxComponents: number): Promise<string[]> {
    const links: string[] = [];
    let currentPage = 1;
    
    while (links.length < maxComponents) {
      console.log(`📄 Extracting links from page ${currentPage}...`);
      
      // Wait for components to load
      await page.waitForSelector('[data-testid="card"]', { timeout: 10000 });
      
      // Extract component links from current page
      const pageLinks = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-testid="card"] a[href*="/elements/"]');
        return Array.from(cards).map(card => (card as HTMLAnchorElement).href);
      });

      links.push(...pageLinks);
      console.log(`Found ${pageLinks.length} components on page ${currentPage}`);

      // Try to navigate to next page
      const nextButton = await page.$('button[aria-label="Next page"]');
      if (nextButton && links.length < maxComponents) {
        await nextButton.click();
        await page.waitForTimeout(2000);
        currentPage++;
      } else {
        break;
      }
    }

    return links.slice(0, maxComponents);
  }

  private async scrapeComponent(page: puppeteer.Page, url: string): Promise<DesignComponent | null> {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract component data
    const componentData = await page.evaluate(() => {
      const titleElement = document.querySelector('h1, .title, [data-testid="title"]');
      const descriptionElement = document.querySelector('.description, [data-testid="description"], p');
      const codeElement = document.querySelector('pre code, .code-block, [data-testid="code"]');
      const tagsElements = document.querySelectorAll('.tag, .chip, [data-testid="tag"]');
      
      return {
        title: titleElement?.textContent?.trim() || '',
        description: descriptionElement?.textContent?.trim() || '',
        code: codeElement?.textContent?.trim() || '',
        tags: Array.from(tagsElements).map(el => el.textContent?.trim() || '').filter(Boolean),
        url: window.location.href
      };
    });

    if (!componentData.code) {
      throw new Error('No code found for component');
    }

    // Parse HTML/CSS/JS from code
    const { html, css, js } = this.parseCode(componentData.code);
    
    if (!html && !css) {
      throw new Error('No HTML or CSS content found');
    }

    // Generate component ID
    const id = generateId();
    
    // Analyze component
    const type = this.detectComponentType(html, css, componentData.tags);
    const category = this.detectComponentCategory(type);
    const style = detectStyle(css);
    const complexity = analyzeComplexity(html, css, js);
    const aestheticScore = scoreAesthetics(html, css);
    const tags = extractTags(html, css, componentData.tags);

    // Take screenshot for preview
    const previewImage = await this.takeScreenshot(page);

    const component: DesignComponent = {
      id,
      name: componentData.title || `Component ${id}`,
      type,
      category,
      source: ComponentSource.UIVERSE,
      html_code: html,
      css_code: css,
      js_code: js,
      preview_url: url,
      preview_image: previewImage,
      description: componentData.description || 'UIverse component',
      tags,
      style,
      complexity,
      mobile_optimized: this.checkMobileOptimization(css),
      accessibility_score: this.assessAccessibility(html),
      metrics: {
        aesthetic_score: aestheticScore,
        performance_score: this.assessPerformance(html, css, js),
        usage_count: 0
      },
      created_at: new Date(),
      updated_at: new Date(),
      scraped_at: new Date(),
      tested_sites: 0,
      industries: this.inferIndustries(tags, componentData.description),
      frameworks: this.detectFrameworks(html, css, js)
    };

    return component;
  }

  private parseCode(code: string): { html: string; css: string; js: string } {
    let html = '';
    let css = '';
    let js = '';

    // Try to extract HTML (look for HTML tags)
    const htmlMatch = code.match(/<[^>]+>/g);
    if (htmlMatch) {
      // Extract HTML content
      const htmlStart = code.indexOf('<');
      const htmlEnd = code.lastIndexOf('>') + 1;
      html = code.substring(htmlStart, htmlEnd);
    }

    // Try to extract CSS (look for CSS selectors and properties)
    const cssMatches = code.match(/([.#]?[\w-]+\s*{[^}]*})|(@[\w-]+[^{]*{[^}]*})/g);
    if (cssMatches) {
      css = cssMatches.join('\n');
    }

    // Try to extract JavaScript (look for function definitions, event handlers)
    const jsMatches = code.match(/(function[\s\S]*?}|[\w.]+\s*=\s*function[\s\S]*?}|document\.[\s\S]*?;)/g);
    if (jsMatches) {
      js = jsMatches.join('\n');
    }

    return { html: html.trim(), css: css.trim(), js: js.trim() };
  }

  private detectComponentType(html: string, css: string, tags: string[]): ComponentType {
    const content = (html + css + tags.join(' ')).toLowerCase();
    
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
           (css.includes('max-width') || css.includes('min-width')) &&
           (css.includes('mobile') || css.includes('responsive'));
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

  private async takeScreenshot(page: puppeteer.Page): Promise<string> {
    try {
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 400, height: 300 }
      });
      
      // Convert to base64 for storage
      return `data:image/png;base64,${screenshot.toString('base64')}`;
    } catch (error) {
      console.warn('Failed to take screenshot:', error);
      return '';
    }
  }

  private async updateSession(): Promise<void> {
    await this.db.recordScrapingSession(this.session);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}