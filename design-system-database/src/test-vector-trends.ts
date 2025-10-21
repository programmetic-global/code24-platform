import dotenv from 'dotenv';
import { DesignSystemDatabase } from './database';
import { VectorDatabase } from './vector-database';
import { TrendAnalyzer } from './trend-analyzer';
import { DesignComponent, ComponentType, ComponentCategory, ComponentSource, DesignStyle } from './types';
import { generateId } from './utils';

dotenv.config();

async function testVectorAndTrends() {
  console.log('🧪 Testing Vector Database and Trend Analysis...');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'code24_design_system',
    user: process.env.DB_USER || 'danielfogmark',
    password: process.env.DB_PASSWORD || '',
    ssl: false
  };

  try {
    // Initialize components
    const db = new DesignSystemDatabase(dbConfig);
    await db.initialize();
    
    const vectorDb = new VectorDatabase(db['pool']);
    await vectorDb.initializeVectorTables();
    
    const trendAnalyzer = new TrendAnalyzer(db['pool'], vectorDb);

    // Create diverse test components for trend analysis
    console.log('\n📦 Creating diverse test components...');
    
    const testComponents: DesignComponent[] = [
      // Modern Glassmorphism Trend
      {
        id: generateId(),
        name: 'Glass Card Modern',
        type: ComponentType.CARD,
        category: ComponentCategory.DISPLAY,
        source: ComponentSource.CUSTOM,
        html_code: '<div class="glass-card"><h3>Modern Card</h3></div>',
        css_code: 'backdrop-filter: blur(10px); background: rgba(255,255,255,0.1);',
        js_code: '',
        preview_url: 'https://example.com/glass1',
        preview_image: '',
        description: 'Modern glassmorphism card with blur effects',
        tags: ['glass', 'modern', 'blur', 'transparency'],
        style: DesignStyle.GLASSMORPHISM,
        complexity: 4,
        mobile_optimized: true,
        accessibility_score: 85,
        metrics: { aesthetic_score: 92, performance_score: 88, usage_count: 15 },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 8,
        industries: ['saas', 'tech', 'startup'],
        frameworks: ['react', 'vue']
      },
      {
        id: generateId(),
        name: 'Glass Hero Section',
        type: ComponentType.HERO,
        category: ComponentCategory.LAYOUT,
        source: ComponentSource.CUSTOM,
        html_code: '<section class="glass-hero"><h1>Welcome</h1></section>',
        css_code: 'backdrop-filter: blur(15px); background: rgba(0,0,0,0.1);',
        js_code: '',
        preview_url: 'https://example.com/glass2',
        preview_image: '',
        description: 'Glassmorphism hero section with modern design',
        tags: ['glass', 'hero', 'modern', 'landing'],
        style: DesignStyle.GLASSMORPHISM,
        complexity: 5,
        mobile_optimized: true,
        accessibility_score: 88,
        metrics: { aesthetic_score: 95, performance_score: 85, usage_count: 22 },
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 12,
        industries: ['agency', 'portfolio'],
        frameworks: ['nextjs', 'react']
      },
      
      // Gradient Button Trend
      {
        id: generateId(),
        name: 'Gradient CTA Button',
        type: ComponentType.BUTTON,
        category: ComponentCategory.INTERACTION,
        source: ComponentSource.CUSTOM,
        html_code: '<button class="gradient-cta">Get Started</button>',
        css_code: 'background: linear-gradient(45deg, #667eea, #764ba2);',
        js_code: '',
        preview_url: 'https://example.com/gradient1',
        preview_image: '',
        description: 'High-converting gradient call-to-action button',
        tags: ['gradient', 'cta', 'button', 'conversion'],
        style: DesignStyle.GRADIENT,
        complexity: 3,
        mobile_optimized: true,
        accessibility_score: 90,
        metrics: { aesthetic_score: 89, performance_score: 92, usage_count: 45, conversion_rate: 4.2 },
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 25,
        industries: ['ecommerce', 'saas'],
        frameworks: ['vanilla', 'tailwind']
      },
      {
        id: generateId(),
        name: 'Animated Gradient Card',
        type: ComponentType.CARD,
        category: ComponentCategory.DISPLAY,
        source: ComponentSource.CUSTOM,
        html_code: '<div class="animated-gradient-card"><h3>Premium</h3></div>',
        css_code: 'background: linear-gradient(45deg, #f093fb, #f5576c); animation: gradient 3s ease infinite;',
        js_code: '',
        preview_url: 'https://example.com/gradient2',
        preview_image: '',
        description: 'Animated gradient card with smooth transitions',
        tags: ['gradient', 'animation', 'card', 'premium'],
        style: DesignStyle.GRADIENT,
        complexity: 6,
        mobile_optimized: true,
        accessibility_score: 82,
        metrics: { aesthetic_score: 91, performance_score: 80, usage_count: 18 },
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 9,
        industries: ['agency', 'portfolio'],
        frameworks: ['css3', 'tailwind']
      },

      // Minimal Design Trend
      {
        id: generateId(),
        name: 'Clean Minimal Card',
        type: ComponentType.CARD,
        category: ComponentCategory.DISPLAY,
        source: ComponentSource.CUSTOM,
        html_code: '<div class="minimal-card"><h3>Simple</h3></div>',
        css_code: 'background: white; border: 1px solid #eee; padding: 24px;',
        js_code: '',
        preview_url: 'https://example.com/minimal1',
        preview_image: '',
        description: 'Clean minimal card design',
        tags: ['minimal', 'clean', 'simple', 'professional'],
        style: DesignStyle.MINIMAL,
        complexity: 2,
        mobile_optimized: true,
        accessibility_score: 95,
        metrics: { aesthetic_score: 78, performance_score: 98, usage_count: 35 },
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 20,
        industries: ['corporate', 'finance'],
        frameworks: ['bootstrap', 'vanilla']
      },

      // Dark Mode Trend
      {
        id: generateId(),
        name: 'Dark Hero Section',
        type: ComponentType.HERO,
        category: ComponentCategory.LAYOUT,
        source: ComponentSource.CUSTOM,
        html_code: '<section class="dark-hero"><h1>Dark Mode</h1></section>',
        css_code: 'background: #1a1a1a; color: white; padding: 60px;',
        js_code: '',
        preview_url: 'https://example.com/dark1',
        preview_image: '',
        description: 'Modern dark mode hero section',
        tags: ['dark', 'hero', 'modern', 'contrast'],
        style: DesignStyle.DARK,
        complexity: 3,
        mobile_optimized: true,
        accessibility_score: 90,
        metrics: { aesthetic_score: 87, performance_score: 95, usage_count: 28 },
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updated_at: new Date(),
        scraped_at: new Date(),
        tested_sites: 14,
        industries: ['gaming', 'tech'],
        frameworks: ['react', 'tailwind']
      }
    ];

    // Insert all test components
    for (const component of testComponents) {
      await db.insertComponent(component);
      
      // Generate and store embeddings
      const embedding = await vectorDb.generateComponentEmbedding(component);
      await vectorDb.storeEmbedding(component.id, embedding, {
        type: component.type,
        style: component.style,
        tags: component.tags,
        aesthetic_score: component.metrics.aesthetic_score
      });
    }

    console.log(`✅ Created ${testComponents.length} test components with embeddings`);

    // Test Vector Search
    console.log('\n🔍 Testing Vector Similarity Search...');
    
    const queryComponent = testComponents[0]; // Use first glassmorphism component
    const queryEmbedding = await vectorDb.generateComponentEmbedding(queryComponent);
    
    const similarComponents = await vectorDb.findSimilarComponents(queryEmbedding, 3, 0.5);
    console.log(`Found ${similarComponents.length} similar components to "${queryComponent.name}"`);
    
    similarComponents.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.component.name} (${result.similarity.toFixed(3)} similarity)`);
    });

    // Test Text Search
    console.log('\n🔎 Testing Text Search...');
    const searchResults = await vectorDb.searchByText('gradient button', {
      minAestheticScore: 80
    }, 5);
    console.log(`Found ${searchResults.length} components matching "gradient button"`);
    searchResults.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.name} (${comp.metrics.aesthetic_score}/100)`);
    });

    // Test Trend Analysis
    console.log('\n📈 Testing Trend Analysis...');
    const trends = await trendAnalyzer.analyzeTrends('30d');
    console.log(`Identified ${trends.length} design trends:`);
    
    trends.slice(0, 5).forEach((trend, i) => {
      console.log(`  ${i + 1}. ${trend.name}`);
      console.log(`     Popularity: ${trend.popularity_score.toFixed(1)}/100`);
      console.log(`     Growth: ${trend.growth_rate.toFixed(1)}%`);
      console.log(`     Components: ${trend.component_count}`);
      console.log(`     Avg Quality: ${trend.avg_aesthetic_score.toFixed(1)}/100`);
      console.log('');
    });

    // Test Breaking Trends
    console.log('\n🚀 Testing Breaking Trends Detection...');
    const breakingTrends = await trendAnalyzer.detectBreakingTrends(30);
    console.log(`Found ${breakingTrends.length} breaking trends with >30% growth:`);
    
    breakingTrends.forEach((trend, i) => {
      console.log(`  ${i + 1}. ${trend.name} (+${trend.growth_rate.toFixed(1)}% growth)`);
    });

    // Test Trend Predictions
    if (trends.length > 0) {
      console.log('\n🔮 Testing Trend Prediction...');
      const prediction = await trendAnalyzer.predictTrendTrajectory(trends[0].trend_id);
      console.log(`Prediction for "${prediction.trend.name}":`);
      console.log(`  Next 30d Growth: ${prediction.prediction.next_30d_growth.toFixed(1)}%`);
      console.log(`  Market Impact: ${prediction.prediction.market_impact}`);
      console.log(`  Confidence: ${prediction.prediction.confidence_score}/100`);
      console.log(`  Recommendation: ${prediction.prediction.recommendation}`);
    }

    // Generate Full Trend Report
    console.log('\n📊 Generating Trend Report...');
    const report = await trendAnalyzer.generateTrendReport();
    console.log(`\nTrend Report Summary:`);
    console.log(report.summary);
    console.log(`\nTop Recommendations:`);
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });

    // Test Vector Database Stats
    console.log('\n📈 Vector Database Statistics...');
    const vectorStats = await vectorDb.getEmbeddingStats();
    console.log(`Total Embeddings: ${vectorStats.total_embeddings}`);
    console.log(`Top Component Types:`, vectorStats.top_searched_types.slice(0, 3));

    await db.close();
    console.log('\n🎉 All vector database and trend analysis tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testVectorAndTrends();