import dotenv from 'dotenv';
import { DesignSystemDatabase } from './database';
import { DesignComponent, ComponentType, ComponentCategory, ComponentSource, DesignStyle } from './types';
import { generateId, scoreAesthetics, analyzeComplexity, detectStyle } from './utils';

dotenv.config();

async function testBasicFunctionality() {
  console.log('🧪 Testing basic database functionality...');

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
    const db = new DesignSystemDatabase(dbConfig);
    await db.initialize();
    
    // Create a test component
    const testComponent: DesignComponent = {
      id: generateId(),
      name: 'Test Gradient Button',
      type: ComponentType.BUTTON,
      category: ComponentCategory.INTERACTION,
      source: ComponentSource.CUSTOM,
      html_code: '<button class="gradient-btn">Click Me</button>',
      css_code: `.gradient-btn {
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .gradient-btn:hover {
        transform: translateY(-2px);
      }`,
      js_code: '',
      preview_url: 'https://example.com/test',
      preview_image: '',
      description: 'A beautiful gradient button with hover animation',
      tags: ['button', 'gradient', 'hover', 'animation'],
      style: DesignStyle.GRADIENT,
      complexity: 3,
      mobile_optimized: true,
      accessibility_score: 75,
      metrics: {
        aesthetic_score: 85,
        performance_score: 90,
        usage_count: 0
      },
      created_at: new Date(),
      updated_at: new Date(),
      scraped_at: new Date(),
      tested_sites: 0,
      industries: ['saas', 'tech'],
      frameworks: ['vanilla']
    };

    // Test AI analysis functions
    const htmlCode = testComponent.html_code;
    const cssCode = testComponent.css_code;
    
    console.log('\n🤖 Testing AI analysis functions:');
    console.log(`Aesthetic Score: ${scoreAesthetics(htmlCode, cssCode)}/100`);
    console.log(`Complexity: ${analyzeComplexity(htmlCode, cssCode)}/10`);
    console.log(`Detected Style: ${detectStyle(cssCode)}`);

    // Insert component
    console.log('\n📦 Inserting test component...');
    await db.insertComponent(testComponent);
    console.log('✅ Component inserted successfully');

    // Test searches
    console.log('\n🔍 Testing component searches...');
    
    const buttons = await db.getComponentsByType('button', 10);
    console.log(`Found ${buttons.length} button components`);
    
    const searchResults = await db.searchComponents({
      style: 'gradient',
      minAestheticScore: 80
    }, 5);
    console.log(`Found ${searchResults.length} gradient components with high aesthetic score`);

    // Get stats
    console.log('\n📊 Database statistics:');
    const stats = await db.getComponentStats();
    console.log(`Total components: ${stats.total}`);
    console.log(`Average aesthetic score: ${stats.avgAestheticScore.toFixed(1)}/100`);
    console.log(`Components by type:`, stats.byType);
    console.log(`Top tags:`, stats.topTags.slice(0, 3));

    // Create a few more test components
    console.log('\n📦 Adding more test components...');
    
    const moreComponents = [
      {
        ...testComponent,
        id: generateId(),
        name: 'Modern Card Component',
        type: ComponentType.CARD,
        category: ComponentCategory.DISPLAY,
        html_code: '<div class="modern-card"><h3>Title</h3><p>Content here</p></div>',
        css_code: `.modern-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 24px;
          margin: 16px;
        }`,
        style: DesignStyle.MODERN,
        tags: ['card', 'modern', 'shadow'],
        metrics: { ...testComponent.metrics, aesthetic_score: 92 }
      },
      {
        ...testComponent,
        id: generateId(),
        name: 'Glass Hero Section',
        type: ComponentType.HERO,
        category: ComponentCategory.LAYOUT,
        html_code: '<section class="glass-hero"><h1>Welcome</h1><p>Amazing content</p></section>',
        css_code: `.glass-hero {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 60px;
          text-align: center;
        }`,
        style: DesignStyle.GLASSMORPHISM,
        tags: ['hero', 'glass', 'blur', 'transparent'],
        metrics: { ...testComponent.metrics, aesthetic_score: 95 }
      }
    ];

    for (const comp of moreComponents) {
      await db.insertComponent(comp as DesignComponent);
    }

    // Final stats
    console.log('\n📈 Final statistics:');
    const finalStats = await db.getComponentStats();
    console.log(`Total components: ${finalStats.total}`);
    console.log(`Components by type:`, finalStats.byType);
    console.log(`Components by source:`, finalStats.bySource);

    await db.close();
    console.log('\n🎉 All tests passed! Database is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testBasicFunctionality();