// Design Database Scraper - Main Collection Script
// Collects cutting-edge 2025 web design data from award-winning sites

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

// Database structure
const DB_PATH = './design-database';
const SOURCES = {
  awwwards: 'https://www.awwwards.com/websites/',
  behance: 'https://www.behance.net/search/projects',
  dribbble: 'https://dribbble.com/shots/popular/web-design',
  webflow: 'https://webflow.com/made-in-webflow',
  framer: 'https://www.framer.com/templates'
};

// Key 2025 design trends to capture
const DESIGN_TRENDS_2025 = [
  'bold-typography',
  'vivid-glow',
  'dark-mode-neon',
  '3d-elements',
  'organic-shapes',
  'micro-interactions',
  'bento-box-layout',
  'glassmorphism',
  'neumorphism',
  'retro-nostalgic',
  'anti-design',
  'claymorphism',
  'custom-illustrations',
  'parallax-scrolling',
  'full-screen-hero'
];

// Initialize database structure
async function initDatabase() {
  const dirs = [
    `${DB_PATH}/trends/2025`,
    `${DB_PATH}/industry-specific/saas`,
    `${DB_PATH}/industry-specific/ecommerce`,
    `${DB_PATH}/industry-specific/agency`,
    `${DB_PATH}/award-winners/awwwards`,
    `${DB_PATH}/award-winners/webflow`,
    `${DB_PATH}/component-library/buttons`,
    `${DB_PATH}/component-library/heroes`,
    `${DB_PATH}/component-library/navigation`,
    `${DB_PATH}/screenshots`,
    `${DB_PATH}/assets`,
    `${DB_PATH}/metadata`
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }

  console.log('✅ Database structure initialized');
}

// Extract color palette from a page
async function extractColorPalette(page) {
  return await page.evaluate(() => {
    const colors = new Set();
    
    // Get computed styles from all elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      
      // Extract colors
      const props = ['color', 'backgroundColor', 'borderColor'];
      props.forEach(prop => {
        const value = styles[prop];
        if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
          colors.add(value);
        }
      });
    });

    // Convert to hex and return top colors
    const hexColors = Array.from(colors)
      .map(color => {
        // Convert rgb/rgba to hex
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1]).toString(16).padStart(2, '0');
          const g = parseInt(match[2]).toString(16).padStart(2, '0');
          const b = parseInt(match[3]).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        }
        return color;
      })
      .slice(0, 10); // Top 10 colors

    return hexColors;
  });
}

// Extract typography information
async function extractTypography(page) {
  return await page.evaluate(() => {
    const fonts = new Set();
    const sizes = new Set();
    const weights = new Set();

    // Check headings and important text
    const selectors = ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', '.hero', '.title'];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        fonts.add(styles.fontFamily);
        sizes.add(styles.fontSize);
        weights.add(styles.fontWeight);
      });
    });

    return {
      families: Array.from(fonts).slice(0, 5),
      sizes: Array.from(sizes).slice(0, 10),
      weights: Array.from(weights)
    };
  });
}

// Detect layout patterns
async function extractLayout(page) {
  return await page.evaluate(() => {
    const body = document.body;
    const main = document.querySelector('main') || body;
    
    // Detect grid usage
    const gridElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const styles = window.getComputedStyle(el);
      return styles.display === 'grid';
    }).length;

    // Detect flexbox usage
    const flexElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const styles = window.getComputedStyle(el);
      return styles.display === 'flex';
    }).length;

    // Get max width
    const container = document.querySelector('.container, main, [class*="container"]');
    const maxWidth = container ? window.getComputedStyle(container).maxWidth : 'none';

    return {
      hasGrid: gridElements > 0,
      hasFlex: flexElements > 0,
      gridCount: gridElements,
      flexCount: flexElements,
      maxWidth: maxWidth,
      bodyWidth: body.clientWidth
    };
  });
}

// Detect animations and interactions
async function detectAnimations(page) {
  return await page.evaluate(() => {
    const animations = [];

    // Check for CSS animations
    const animatedElements = document.querySelectorAll('[style*="animation"], [class*="animate"]');
    if (animatedElements.length > 0) {
      animations.push('css-animations');
    }

    // Check for common animation libraries
    const libraries = [
      { name: 'GSAP', check: () => window.gsap },
      { name: 'Framer Motion', check: () => document.querySelector('[data-framer-name]') },
      { name: 'AOS', check: () => document.querySelector('[data-aos]') },
      { name: 'Three.js', check: () => window.THREE }
    ];

    libraries.forEach(lib => {
      if (lib.check()) {
        animations.push(lib.name.toLowerCase().replace(/\s+/g, '-'));
      }
    });

    return animations;
  });
}

// Identify design trends present
async function identifyTrends(page) {
  return await page.evaluate((trends) => {
    const detected = [];

    // Check for glassmorphism
    const glassElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const styles = window.getComputedStyle(el);
      return styles.backdropFilter && styles.backdropFilter.includes('blur');
    });
    if (glassElements.length > 0) detected.push('glassmorphism');

    // Check for 3D elements
    const canvas = document.querySelector('canvas');
    if (canvas) detected.push('3d-elements');

    // Check for dark mode
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    if (bodyBg && bodyBg.includes('rgb') && parseInt(bodyBg.match(/\d+/)[0]) < 50) {
      detected.push('dark-mode');
    }

    // Check for parallax
    const parallaxElements = document.querySelectorAll('[class*="parallax"]');
    if (parallaxElements.length > 0) detected.push('parallax-scrolling');

    // Check for custom cursor
    if (document.body.style.cursor && document.body.style.cursor !== 'auto') {
      detected.push('custom-cursor');
    }

    return detected;
  }, DESIGN_TRENDS_2025);
}

// Main scraper function
async function scrapeDesign(url, metadata = {}) {
  console.log(`🔍 Scraping: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate with timeout
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    console.log('  📊 Extracting data...');

    // Extract all design data
    const [colors, typography, layout, animations, trends] = await Promise.all([
      extractColorPalette(page),
      extractTypography(page),
      extractLayout(page),
      detectAnimations(page),
      identifyTrends(page)
    ]);

    // Capture screenshots
    const designId = url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const screenshotDir = `${DB_PATH}/screenshots/${designId}`;
    await fs.mkdir(screenshotDir, { recursive: true });

    console.log('  📸 Capturing screenshots...');

    // Desktop screenshot
    await page.screenshot({
      path: `${screenshotDir}/desktop-full.png`,
      fullPage: true
    });

    // Mobile screenshot
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: `${screenshotDir}/mobile-full.png`,
      fullPage: true
    });

    // Tablet screenshot
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({
      path: `${screenshotDir}/tablet-full.png`,
      fullPage: true
    });

    // Compile design data
    const designData = {
      id: designId,
      url: url,
      scrapedAt: new Date().toISOString(),
      metadata: metadata,
      colors: colors,
      typography: typography,
      layout: layout,
      animations: animations,
      trends: trends,
      screenshots: {
        desktop: `screenshots/${designId}/desktop-full.png`,
        mobile: `screenshots/${designId}/mobile-full.png`,
        tablet: `screenshots/${designId}/tablet-full.png`
      }
    };

    // Save design data
    const dataPath = `${DB_PATH}/metadata/${designId}.json`;
    await fs.writeFile(dataPath, JSON.stringify(designData, null, 2));

    console.log(`✅ Saved: ${designId}`);
    
    return designData;

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return null;
  } finally {
    await browser.close();
  }
}

// Scrape Awwwards Site of the Day winners
async function scrapeAwwwards(count = 50) {
  console.log('🏆 Scraping Awwwards winners...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.awwwards.com/websites/', {
      waitUntil: 'networkidle2'
    });

    // Extract winner URLs
    const winners = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/sites/"]'));
      return links.map(link => ({
        url: link.href,
        title: link.textContent.trim()
      })).slice(0, 50);
    });

    console.log(`Found ${winners.length} winners`);

    // Scrape each winner
    for (const winner of winners.slice(0, count)) {
      await scrapeDesign(winner.url, {
        source: 'awwwards',
        award: 'Site of the Day',
        title: winner.title
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  } catch (error) {
    console.error('Error scraping Awwwards:', error);
  } finally {
    await browser.close();
  }
}

// Scrape specific trending sites
async function scrapeTrendingSites() {
  const sites = [
    {
      url: 'https://base44.com',
      metadata: { source: 'trending', category: 'ai-builder', industry: 'saas' }
    },
    {
      url: 'https://www.framer.com',
      metadata: { source: 'trending', category: 'design-tool', industry: 'saas' }
    },
    {
      url: 'https://webflow.com',
      metadata: { source: 'trending', category: 'website-builder', industry: 'saas' }
    }
  ];

  for (const site of sites) {
    await scrapeDesign(site.url, site.metadata);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Generate database index
async function generateIndex() {
  console.log('📚 Generating database index...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const designs = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      designs.push(JSON.parse(content));
    }
  }

  // Create index
  const index = {
    totalDesigns: designs.length,
    lastUpdated: new Date().toISOString(),
    trends: {},
    industries: {},
    sources: {},
    designs: designs.map(d => ({
      id: d.id,
      url: d.url,
      trends: d.trends,
      source: d.metadata?.source
    }))
  };

  // Count trends
  designs.forEach(d => {
    d.trends?.forEach(trend => {
      index.trends[trend] = (index.trends[trend] || 0) + 1;
    });
    
    if (d.metadata?.industry) {
      index.industries[d.metadata.industry] = (index.industries[d.metadata.industry] || 0) + 1;
    }
    
    if (d.metadata?.source) {
      index.sources[d.metadata.source] = (index.sources[d.metadata.source] || 0) + 1;
    }
  });

  await fs.writeFile(
    `${DB_PATH}/metadata/index.json`,
    JSON.stringify(index, null, 2)
  );

  console.log('✅ Index generated');
  console.log(`   Total designs: ${index.totalDesigns}`);
  console.log(`   Trends tracked: ${Object.keys(index.trends).length}`);
}

// Main execution
async function main() {
  console.log('🚀 Starting Web Design Database Builder\n');
  
  // Initialize
  await initDatabase();
  
  // Scrape sources
  await scrapeTrendingSites();
  
  // Uncomment to scrape Awwwards (takes longer)
  // await scrapeAwwwards(20);
  
  // Generate index
  await generateIndex();
  
  console.log('\n✨ Database build complete!');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  scrapeDesign,
  scrapeAwwwards,
  scrapeTrendingSites,
  generateIndex,
  initDatabase
};
