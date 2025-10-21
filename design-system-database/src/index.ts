import dotenv from 'dotenv';
import { DesignSystemDatabase } from './database';
import { UIverseScraper } from './scrapers/uiverse-scraper';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🚀 Starting Code24 Design System Database initialization...');

  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'code24_design_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  try {
    // Initialize database
    console.log('📊 Connecting to database...');
    const db = new DesignSystemDatabase(dbConfig);
    await db.initialize();
    
    // Initialize UIverse scraper
    console.log('🎨 Initializing UIverse scraper...');
    const scraper = new UIverseScraper(db);
    await scraper.initialize();
    
    // Start scraping
    const maxComponents = parseInt(process.env.MAX_COMPONENTS || '100');
    console.log(`🔍 Starting to scrape ${maxComponents} components from UIverse...`);
    
    await scraper.scrapeComponents(maxComponents);
    
    // Get stats
    console.log('📈 Getting database stats...');
    const stats = await db.getComponentStats();
    
    console.log('\n🎉 Scraping completed! Database Stats:');
    console.log(`📦 Total Components: ${stats.total}`);
    console.log(`🎨 Average Aesthetic Score: ${stats.avgAestheticScore.toFixed(1)}/100`);
    console.log(`🏷️  Top Tags:`, stats.topTags.slice(0, 5).map(t => `${t.tag} (${t.count})`).join(', '));
    console.log(`📊 Components by Source:`, stats.bySource);
    console.log(`🎭 Components by Type:`, stats.byType);
    
    // Cleanup
    await scraper.close();
    await db.close();
    
    console.log('\n✅ All done! Design system database is ready.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'scrape':
    main();
    break;
  case 'stats':
    showStats();
    break;
  case 'search':
    searchComponents();
    break;
  default:
    console.log(`
🎨 Code24 Design System Database

Usage:
  npm run dev scrape   - Start scraping components
  npm run dev stats    - Show database statistics  
  npm run dev search   - Search components

Environment Variables:
  DB_HOST              - Database host (default: localhost)
  DB_PORT              - Database port (default: 5432)
  DB_NAME              - Database name (default: code24_design_system)
  DB_USER              - Database user (default: postgres)
  DB_PASSWORD          - Database password (default: postgres)
  DB_SSL               - Use SSL (default: false)
  MAX_COMPONENTS       - Max components to scrape (default: 100)
    `);
}

async function showStats() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'code24_design_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  try {
    const db = new DesignSystemDatabase(dbConfig);
    const stats = await db.getComponentStats();
    
    console.log('\n📊 Design System Database Statistics:');
    console.log('=====================================');
    console.log(`📦 Total Components: ${stats.total}`);
    console.log(`🎨 Average Aesthetic Score: ${stats.avgAestheticScore.toFixed(1)}/100`);
    
    console.log('\n🏷️  Top Tags:');
    stats.topTags.forEach((tag, i) => {
      console.log(`  ${i + 1}. ${tag.tag} (${tag.count} components)`);
    });
    
    console.log('\n📊 Components by Source:');
    Object.entries(stats.bySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`);
    });
    
    console.log('\n🎭 Components by Type:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    await db.close();
  } catch (error) {
    console.error('❌ Error getting stats:', error);
  }
}

async function searchComponents() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'code24_design_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  try {
    const db = new DesignSystemDatabase(dbConfig);
    
    // Example searches
    console.log('\n🔍 Top Performing Components:');
    const topComponents = await db.getTopPerformingComponents(5);
    topComponents.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.name} (${comp.type}) - Score: ${comp.metrics.aesthetic_score}/100`);
    });
    
    console.log('\n🎨 Hero Components:');
    const heroComponents = await db.getComponentsByType('hero', 5);
    heroComponents.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.name} - Style: ${comp.style} - Complexity: ${comp.complexity}/10`);
    });
    
    console.log('\n🔘 Button Components:');
    const buttonComponents = await db.getComponentsByType('button', 5);
    buttonComponents.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.name} - Style: ${comp.style} - Score: ${comp.metrics.aesthetic_score}/100`);
    });
    
    await db.close();
  } catch (error) {
    console.error('❌ Error searching components:', error);
  }
}