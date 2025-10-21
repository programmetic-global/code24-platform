import { Pool, PoolConfig } from 'pg';
import { DesignComponent, ComponentAnalysis, ScrapingSession, TrendAnalysis } from './types';

export class DesignSystemDatabase {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async initialize(): Promise<void> {
    try {
      // Try to enable pgvector extension (optional for now)
      try {
        await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log('✅ pgvector extension enabled');
      } catch (error) {
        console.log('⚠️  pgvector extension not available, continuing without vector search');
      }
      
      // Create tables
      await this.createTables();
      
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const queries = [
      // Components table
      `CREATE TABLE IF NOT EXISTS components (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        source TEXT NOT NULL,
        html_code TEXT NOT NULL,
        css_code TEXT NOT NULL,
        js_code TEXT,
        preview_url TEXT NOT NULL,
        preview_image TEXT,
        description TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        style TEXT NOT NULL,
        complexity INTEGER CHECK (complexity >= 1 AND complexity <= 10),
        mobile_optimized BOOLEAN DEFAULT false,
        accessibility_score INTEGER CHECK (accessibility_score >= 1 AND accessibility_score <= 100),
        
        -- Metrics
        conversion_rate DECIMAL(5,2),
        engagement_score DECIMAL(5,2),
        aesthetic_score INTEGER CHECK (aesthetic_score >= 1 AND aesthetic_score <= 100),
        performance_score INTEGER CHECK (performance_score >= 1 AND performance_score <= 100),
        user_rating DECIMAL(3,2) CHECK (user_rating >= 1 AND user_rating <= 5),
        usage_count INTEGER DEFAULT 0,
        avg_load_time DECIMAL(6,2),
        bounce_rate_impact DECIMAL(5,2),
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tested_sites INTEGER DEFAULT 0,
        industries TEXT[] DEFAULT '{}',
        frameworks TEXT[] DEFAULT '{}'
      )`,

      // Vector embeddings for similarity search (optional - requires pgvector)
      `CREATE TABLE IF NOT EXISTS component_embeddings (
        component_id TEXT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        embedding_text TEXT, -- Store as text for now, can convert to vector later
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // Component analysis history
      `CREATE TABLE IF NOT EXISTS component_analysis (
        id SERIAL PRIMARY KEY,
        component_id TEXT REFERENCES components(id) ON DELETE CASCADE,
        analysis_type TEXT NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        details JSONB,
        analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        analyzer_version TEXT NOT NULL
      )`,

      // Scraping sessions
      `CREATE TABLE IF NOT EXISTS scraping_sessions (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        total_components INTEGER DEFAULT 0,
        successful_scrapes INTEGER DEFAULT 0,
        failed_scrapes INTEGER DEFAULT 0,
        errors TEXT[] DEFAULT '{}',
        status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused'))
      )`,

      // Trend analysis
      `CREATE TABLE IF NOT EXISTS trend_analysis (
        id TEXT PRIMARY KEY,
        trend_name TEXT NOT NULL,
        description TEXT NOT NULL,
        popularity_score INTEGER CHECK (popularity_score >= 1 AND popularity_score <= 100),
        growth_rate DECIMAL(5,2),
        detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        components_count INTEGER DEFAULT 0,
        related_tags TEXT[] DEFAULT '{}',
        source_insights JSONB
      )`,

      // Component performance tracking
      `CREATE TABLE IF NOT EXISTS component_performance (
        id SERIAL PRIMARY KEY,
        component_id TEXT REFERENCES components(id) ON DELETE CASCADE,
        website_url TEXT NOT NULL,
        conversion_before DECIMAL(5,2),
        conversion_after DECIMAL(5,2),
        improvement_percentage DECIMAL(5,2),
        test_duration_days INTEGER,
        traffic_volume INTEGER,
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_components_type ON components(type)',
      'CREATE INDEX IF NOT EXISTS idx_components_category ON components(category)',
      'CREATE INDEX IF NOT EXISTS idx_components_source ON components(source)',
      'CREATE INDEX IF NOT EXISTS idx_components_style ON components(style)',
      'CREATE INDEX IF NOT EXISTS idx_components_tags ON components USING GIN(tags)',
      'CREATE INDEX IF NOT EXISTS idx_components_industries ON components USING GIN(industries)',
      'CREATE INDEX IF NOT EXISTS idx_components_aesthetic_score ON components(aesthetic_score DESC)',
      'CREATE INDEX IF NOT EXISTS idx_components_conversion_rate ON components(conversion_rate DESC)',
      'CREATE INDEX IF NOT EXISTS idx_component_analysis_type ON component_analysis(analysis_type)',
      'CREATE INDEX IF NOT EXISTS idx_component_performance_improvement ON component_performance(improvement_percentage DESC)'
    ];

    for (const index of indexes) {
      await this.pool.query(index);
    }
  }

  async insertComponent(component: DesignComponent): Promise<void> {
    const query = `
      INSERT INTO components (
        id, name, type, category, source, html_code, css_code, js_code,
        preview_url, preview_image, description, tags, style, complexity,
        mobile_optimized, accessibility_score, conversion_rate, engagement_score,
        aesthetic_score, performance_score, user_rating, usage_count,
        avg_load_time, bounce_rate_impact, tested_sites, industries, frameworks
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      ) ON CONFLICT (id) DO UPDATE SET
        updated_at = NOW(),
        name = EXCLUDED.name,
        html_code = EXCLUDED.html_code,
        css_code = EXCLUDED.css_code,
        js_code = EXCLUDED.js_code,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        aesthetic_score = EXCLUDED.aesthetic_score,
        performance_score = EXCLUDED.performance_score
    `;

    const values = [
      component.id, component.name, component.type, component.category,
      component.source, component.html_code, component.css_code, component.js_code,
      component.preview_url, component.preview_image, component.description,
      component.tags, component.style, component.complexity, component.mobile_optimized,
      component.accessibility_score, component.metrics.conversion_rate,
      component.metrics.engagement_score, component.metrics.aesthetic_score,
      component.metrics.performance_score, component.metrics.user_rating,
      component.metrics.usage_count, component.metrics.avg_load_time,
      component.metrics.bounce_rate_impact, component.tested_sites,
      component.industries, component.frameworks
    ];

    await this.pool.query(query, values);
  }

  async getComponentsByType(type: string, limit: number = 50): Promise<DesignComponent[]> {
    const query = `
      SELECT * FROM components 
      WHERE type = $1 
      ORDER BY aesthetic_score DESC, conversion_rate DESC NULLS LAST
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [type, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  async getTopPerformingComponents(limit: number = 20): Promise<DesignComponent[]> {
    const query = `
      SELECT * FROM components 
      WHERE conversion_rate IS NOT NULL 
      ORDER BY conversion_rate DESC, aesthetic_score DESC
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  async searchComponents(filters: {
    type?: string;
    category?: string;
    style?: string;
    tags?: string[];
    industries?: string[];
    minAestheticScore?: number;
    minConversionRate?: number;
  }, limit: number = 50): Promise<DesignComponent[]> {
    let query = 'SELECT * FROM components WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.type) {
      query += ` AND type = $${paramIndex++}`;
      values.push(filters.type);
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex++}`;
      values.push(filters.category);
    }

    if (filters.style) {
      query += ` AND style = $${paramIndex++}`;
      values.push(filters.style);
    }

    if (filters.tags && filters.tags.length > 0) {
      query += ` AND tags && $${paramIndex++}`;
      values.push(filters.tags);
    }

    if (filters.industries && filters.industries.length > 0) {
      query += ` AND industries && $${paramIndex++}`;
      values.push(filters.industries);
    }

    if (filters.minAestheticScore) {
      query += ` AND aesthetic_score >= $${paramIndex++}`;
      values.push(filters.minAestheticScore);
    }

    if (filters.minConversionRate) {
      query += ` AND conversion_rate >= $${paramIndex++}`;
      values.push(filters.minConversionRate);
    }

    query += ` ORDER BY aesthetic_score DESC, conversion_rate DESC NULLS LAST LIMIT $${paramIndex}`;
    values.push(limit);

    const result = await this.pool.query(query, values);
    return result.rows.map(this.mapRowToComponent);
  }

  async recordScrapingSession(session: ScrapingSession): Promise<void> {
    const query = `
      INSERT INTO scraping_sessions (
        id, source, started_at, completed_at, total_components,
        successful_scrapes, failed_scrapes, errors, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        completed_at = EXCLUDED.completed_at,
        total_components = EXCLUDED.total_components,
        successful_scrapes = EXCLUDED.successful_scrapes,
        failed_scrapes = EXCLUDED.failed_scrapes,
        errors = EXCLUDED.errors,
        status = EXCLUDED.status
    `;

    const values = [
      session.id, session.source, session.started_at, session.completed_at,
      session.total_components, session.successful_scrapes, session.failed_scrapes,
      session.errors, session.status
    ];

    await this.pool.query(query, values);
  }

  async getComponentStats(): Promise<{
    total: number;
    bySource: Record<string, number>;
    byType: Record<string, number>;
    avgAestheticScore: number;
    topTags: Array<{ tag: string; count: number }>;
  }> {
    const [totalResult, sourceResult, typeResult, avgScoreResult, tagsResult] = await Promise.all([
      this.pool.query('SELECT COUNT(*) as total FROM components'),
      this.pool.query('SELECT source, COUNT(*) as count FROM components GROUP BY source ORDER BY count DESC'),
      this.pool.query('SELECT type, COUNT(*) as count FROM components GROUP BY type ORDER BY count DESC'),
      this.pool.query('SELECT AVG(aesthetic_score) as avg_score FROM components WHERE aesthetic_score IS NOT NULL'),
      this.pool.query(`
        SELECT tag, COUNT(*) as count 
        FROM components, unnest(tags) as tag 
        GROUP BY tag 
        ORDER BY count DESC 
        LIMIT 10
      `)
    ]);

    return {
      total: parseInt(totalResult.rows[0].total),
      bySource: Object.fromEntries(sourceResult.rows.map(r => [r.source, parseInt(r.count)])),
      byType: Object.fromEntries(typeResult.rows.map(r => [r.type, parseInt(r.count)])),
      avgAestheticScore: parseFloat(avgScoreResult.rows[0].avg_score) || 0,
      topTags: tagsResult.rows.map(r => ({ tag: r.tag, count: parseInt(r.count) }))
    };
  }

  private mapRowToComponent(row: any): DesignComponent {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      source: row.source,
      html_code: row.html_code,
      css_code: row.css_code,
      js_code: row.js_code,
      preview_url: row.preview_url,
      preview_image: row.preview_image,
      description: row.description,
      tags: row.tags || [],
      style: row.style,
      complexity: row.complexity,
      mobile_optimized: row.mobile_optimized,
      accessibility_score: row.accessibility_score,
      metrics: {
        conversion_rate: row.conversion_rate,
        engagement_score: row.engagement_score,
        aesthetic_score: row.aesthetic_score,
        performance_score: row.performance_score,
        user_rating: row.user_rating,
        usage_count: row.usage_count || 0,
        avg_load_time: row.avg_load_time,
        bounce_rate_impact: row.bounce_rate_impact
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
      scraped_at: row.scraped_at,
      tested_sites: row.tested_sites || 0,
      industries: row.industries || [],
      frameworks: row.frameworks || []
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}