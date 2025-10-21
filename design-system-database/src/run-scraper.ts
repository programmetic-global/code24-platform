import dotenv from 'dotenv';
import { DesignSystemDatabase } from './database';
import { SimpleUIverseScraper } from './simple-scraper';

dotenv.config();

async function runScraper() {
  console.log('🚀 Starting UIverse component scraper...');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'code24_design_system',
    user: process.env.DB_USER || 'danielfogmark',
    password: process.env.DB_PASSWORD || '',
    ssl: false
  };

  try {
    // Initialize database
    console.log('📊 Connecting to database...');
    const db = new DesignSystemDatabase(dbConfig);
    await db.initialize();
    
    // Initialize scraper
    console.log('🎨 Initializing scraper...');
    const scraper = new SimpleUIverseScraper(db);
    
    // Start scraping
    const maxComponents = parseInt(process.env.MAX_COMPONENTS || '50');
    console.log(`🔍 Starting to scrape ${maxComponents} components...`);
    
    await scraper.scrapeComponents(maxComponents);
    
    // Get final stats
    console.log('📈 Getting final database stats...');
    const stats = await db.getComponentStats();
    
    console.log('\n🎉 Scraping completed! Final Stats:');
    console.log(`📦 Total Components: ${stats.total}`);
    console.log(`🎨 Average Aesthetic Score: ${stats.avgAestheticScore.toFixed(1)}/100`);
    console.log(`🏷️  Top Tags:`, stats.topTags.slice(0, 5).map(t => `${t.tag} (${t.count})`).join(', '));
    console.log(`📊 Components by Source:`, stats.bySource);
    console.log(`🎭 Components by Type:`, stats.byType);
    
    await db.close();
    console.log('\n✅ Scraper completed successfully!');
    
  } catch (error) {
    console.error('❌ Scraper failed:', error);
    process.exit(1);
  }
}

runScraper();