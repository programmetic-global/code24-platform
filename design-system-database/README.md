# Code24 Design System Database

🎨 **The world's most comprehensive design component database with AI-powered analysis and trend detection.**

## Features

- **UIverse.io Scraper**: Automatically extracts 5,000+ modern UI components
- **PostgreSQL + Vector Search**: Advanced similarity matching and component discovery  
- **AI Analysis**: Automatic aesthetic scoring, complexity analysis, and style detection
- **Component Metrics**: Track conversion rates, performance scores, and usage analytics
- **Trend Detection**: Identify emerging design patterns and popular styles
- **Multi-Source Support**: Extensible architecture for Tailwind UI, shadcn/ui, Dribbble, etc.

## Quick Start

### 1. Setup Database

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb code24_design_system

# Install pgvector extension
psql code24_design_system -c "CREATE EXTENSION vector;"
```

### 2. Install Dependencies

```bash
cd design-system-database
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run the Scraper

```bash
# Start scraping UIverse.io (default: 100 components)
npm run dev scrape

# Scrape more components
MAX_COMPONENTS=1000 npm run dev scrape
```

### 5. Explore the Database

```bash
# View statistics
npm run dev stats

# Search components
npm run dev search
```

## Database Schema

### Components Table
```sql
- id: Unique component identifier
- name: Component name/title
- type: ComponentType (hero, button, card, etc.)
- category: ComponentCategory (layout, interaction, etc.)
- source: ComponentSource (uiverse.io, etc.)
- html_code: HTML source code
- css_code: CSS source code
- js_code: JavaScript code (optional)
- preview_url: Original component URL
- preview_image: Base64 screenshot
- description: Component description
- tags: Searchable tags array
- style: DesignStyle (modern, minimal, glassmorphism, etc.)
- complexity: 1-10 complexity score
- mobile_optimized: Boolean flag
- accessibility_score: 1-100 accessibility rating
- aesthetic_score: 1-100 AI aesthetic rating
- performance_score: 1-100 performance rating
- conversion_rate: Measured conversion impact
- usage_count: How many times used
- tested_sites: Number of sites tested on
- industries: Applicable industries
- frameworks: Compatible frameworks
```

### Vector Embeddings
```sql
- component_id: Links to components.id
- embedding: 1536-dimension vector for similarity search
```

## Component Types

The database categorizes components into these types:

- **Layout**: `hero`, `footer`, `layout`
- **Interaction**: `button`, `cta`, `slider`, `accordion`, `tab`
- **Display**: `card`, `gallery`, `pricing`, `testimonial`, `chart`, `table`
- **Input**: `form`, `calendar`, `search`, `filter`
- **Navigation**: `navigation`, `menu`, `breadcrumb`, `pagination`
- **Feedback**: `modal`, `loading`, `error`, `alert`, `tooltip`, `progress`
- **Media**: `gallery`, `carousel`, `video`
- **Utility**: `animation`, `badge`, `social`

## Style Classification

AI automatically detects these design styles:

- **Modern**: Clean, contemporary design
- **Minimal**: Simple, stripped-down aesthetics
- **Glassmorphism**: Frosted glass effects with backdrop-filter
- **Neumorphism**: Soft, extruded design with subtle shadows
- **Gradient**: Colorful gradient backgrounds
- **Dark/Light**: Theme-specific components
- **Brutalist**: Sharp, high-contrast design
- **Elegant**: Refined, sophisticated styling

## API Usage

### Search Components

```typescript
import { DesignSystemDatabase } from './src/database';

const db = new DesignSystemDatabase(dbConfig);

// Find hero components with modern style
const heroes = await db.searchComponents({
  type: 'hero',
  style: 'modern',
  minAestheticScore: 80,
  industries: ['saas', 'tech']
});

// Get top performing buttons
const buttons = await db.getComponentsByType('button', 20);

// Find similar components
const similar = await db.searchComponents({
  tags: ['gradient', 'animation'],
  minConversionRate: 3.0
});
```

### Component Analysis

```typescript
// Analyze component aesthetics
const score = scoreAesthetics(html, css); // Returns 1-100

// Detect design style  
const style = detectStyle(css); // Returns DesignStyle enum

// Calculate complexity
const complexity = analyzeComplexity(html, css, js); // Returns 1-10

// Extract semantic tags
const tags = extractTags(html, css, existingTags);
```

## Advanced Features

### Vector Similarity Search

Components are embedded using OpenAI's text-embedding-ada-002 for semantic similarity:

```sql
SELECT c.*, 1 - (ce.embedding <=> query_embedding) as similarity
FROM components c
JOIN component_embeddings ce ON c.id = ce.component_id
ORDER BY ce.embedding <=> query_embedding
LIMIT 10;
```

### Performance Tracking

Track real-world component performance:

```typescript
await db.recordComponentPerformance({
  component_id: 'comp_123',
  website_url: 'https://example.com',
  conversion_before: 2.3,
  conversion_after: 4.1,
  improvement_percentage: 78.3,
  test_duration_days: 30,
  traffic_volume: 10000
});
```

### Trend Analysis

Detect emerging design trends:

```typescript
const trends = await db.analyzeTrends({
  timeframe: '30d',
  minComponents: 10,
  minGrowthRate: 0.2
});
```

## Integration with Code24

This database powers Code24's AI workers:

1. **Design Worker**: Selects optimal components based on industry, goals, and performance data
2. **Brand Worker**: Matches components to brand aesthetics and style guidelines  
3. **Trend Worker**: Identifies cutting-edge patterns for competitive advantage
4. **Performance Worker**: Chooses components with proven conversion impact

## Data Sources

### Current Sources
- ✅ **UIverse.io**: 5,000+ modern components
- 🔄 **Tailwind UI**: Premium component library (planned)
- 🔄 **shadcn/ui**: Popular React components (planned)
- 🔄 **Dribbble**: Design inspiration (planned)
- 🔄 **Awwwards**: Award-winning sites (planned)

### Extending Sources

Add new scrapers by implementing the base scraper interface:

```typescript
class CustomScraper extends BaseScraper {
  async scrapeComponents(maxComponents: number): Promise<void> {
    // Implementation
  }
}
```

## Performance Metrics

### Database Specifications
- **Storage**: ~1GB per 10,000 components
- **Query Speed**: <50ms for similarity search
- **Indexing**: Optimized for type, style, and performance queries
- **Scalability**: Handles 100,000+ components efficiently

### Scraping Performance
- **UIverse.io**: ~2-3 components/second (rate limited)
- **Screenshot Generation**: 400x300px PNG previews
- **Error Handling**: Robust retry logic and session tracking
- **Memory Usage**: <512MB during scraping

## Production Deployment

### Database Hosting
- **Recommended**: Railway, Supabase, or AWS RDS
- **Requirements**: PostgreSQL 13+ with pgvector extension
- **Resources**: 2GB RAM, 20GB storage minimum

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
MAX_COMPONENTS=5000
SCRAPING_DELAY_MS=1500
SCREENSHOT_ENABLED=true
```

### Monitoring
- Scraping session logs in `scraping_sessions` table
- Component quality metrics tracked over time
- Performance analytics per component type
- Trend detection alerts for emerging patterns

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npm run migrate
```

### Adding Component Types
```typescript
export enum ComponentType {
  // Add new types here
  NEW_TYPE = 'new_type'
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new scrapers or analysis features
4. Submit a pull request

## License

MIT License - build amazing things! 🚀

---

**Built for Code24**: *The platform that creates learning websites, not static tombstones.*