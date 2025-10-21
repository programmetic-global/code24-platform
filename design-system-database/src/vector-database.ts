import { Pool } from 'pg';
import { DesignComponent } from './types';

export interface VectorSearchResult {
  component: DesignComponent;
  similarity: number;
  distance: number;
}

export interface ComponentEmbedding {
  component_id: string;
  embedding: number[];
  metadata: {
    type: string;
    style: string;
    tags: string[];
    aesthetic_score: number;
  };
}

export class VectorDatabase {
  private pool: Pool;
  private embeddingDimension: number = 1536; // OpenAI ada-002 dimension

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initializeVectorTables(): Promise<void> {
    try {
      // Create vector extension if available
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector');

      // Create embeddings table with vector support
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS component_embeddings (
          id SERIAL PRIMARY KEY,
          component_id TEXT REFERENCES components(id) ON DELETE CASCADE,
          embedding vector(${this.embeddingDimension}),
          embedding_text TEXT, -- Fallback for when vector extension is not available
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(component_id)
        )
      `);

      // Create vector index for fast similarity search
      await this.pool.query(`
        CREATE INDEX IF NOT EXISTS idx_component_embeddings_vector 
        ON component_embeddings USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
      `);

      console.log('✅ Vector database tables initialized');
    } catch (error) {
      console.warn('⚠️  Vector extension not available, using fallback text storage');
      
      // Fallback table without vector types
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS component_embeddings (
          id SERIAL PRIMARY KEY,
          component_id TEXT REFERENCES components(id) ON DELETE CASCADE,
          embedding_text TEXT, -- Store as JSON string
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(component_id)
        )
      `);
    }
  }

  async storeEmbedding(componentId: string, embedding: number[], metadata: any): Promise<void> {
    try {
      // Try to store as vector first
      await this.pool.query(`
        INSERT INTO component_embeddings (component_id, embedding, metadata)
        VALUES ($1, $2::vector, $3)
        ON CONFLICT (component_id) DO UPDATE SET
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          created_at = NOW()
      `, [componentId, `[${embedding.join(',')}]`, JSON.stringify(metadata)]);
    } catch (error) {
      // Fallback to text storage
      await this.pool.query(`
        INSERT INTO component_embeddings (component_id, embedding_text, metadata)
        VALUES ($1, $2, $3)
        ON CONFLICT (component_id) DO UPDATE SET
          embedding_text = EXCLUDED.embedding_text,
          metadata = EXCLUDED.metadata,
          created_at = NOW()
      `, [componentId, JSON.stringify(embedding), JSON.stringify(metadata)]);
    }
  }

  async findSimilarComponents(
    queryEmbedding: number[], 
    limit: number = 10, 
    threshold: number = 0.7
  ): Promise<VectorSearchResult[]> {
    try {
      // Try vector similarity search first
      const query = `
        SELECT 
          c.*,
          ce.metadata,
          1 - (ce.embedding <=> $1::vector) as similarity
        FROM component_embeddings ce
        JOIN components c ON c.id = ce.component_id
        WHERE 1 - (ce.embedding <=> $1::vector) > $2
        ORDER BY ce.embedding <=> $1::vector
        LIMIT $3
      `;
      
      const result = await this.pool.query(query, [
        `[${queryEmbedding.join(',')}]`,
        threshold,
        limit
      ]);

      return result.rows.map(row => ({
        component: this.mapRowToComponent(row),
        similarity: row.similarity,
        distance: 1 - row.similarity
      }));

    } catch (error) {
      console.warn('Vector search failed, using fallback text-based search');
      return this.fallbackTextSearch(queryEmbedding, limit);
    }
  }

  private async fallbackTextSearch(
    queryEmbedding: number[], 
    limit: number
  ): Promise<VectorSearchResult[]> {
    // Simple text-based similarity using metadata
    const query = `
      SELECT 
        c.*,
        ce.metadata,
        ce.embedding_text
      FROM component_embeddings ce
      JOIN components c ON c.id = ce.component_id
      ORDER BY c.aesthetic_score DESC
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    
    return result.rows.map(row => {
      // Calculate simple similarity based on metadata overlap
      let metadata = {};
      try {
        metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
      } catch (e) {
        metadata = {};
      }
      const similarity = this.calculateMetadataSimilarity(queryEmbedding, metadata);
      
      return {
        component: this.mapRowToComponent(row),
        similarity,
        distance: 1 - similarity
      };
    });
  }

  private calculateMetadataSimilarity(queryEmbedding: number[], metadata: any): number {
    // Simple similarity based on component features
    let similarity = 0.5; // Base similarity

    // This is a placeholder - in real implementation, you'd use actual embedding similarity
    // For now, we'll use metadata features
    if (metadata.aesthetic_score > 80) similarity += 0.2;
    if (metadata.tags && metadata.tags.includes('modern')) similarity += 0.1;
    if (metadata.style === 'modern') similarity += 0.1;

    return Math.min(similarity, 1.0);
  }

  async searchByText(
    searchText: string,
    filters: {
      type?: string;
      style?: string;
      minAestheticScore?: number;
    } = {},
    limit: number = 20
  ): Promise<DesignComponent[]> {
    let query = `
      SELECT c.* FROM components c
      LEFT JOIN component_embeddings ce ON c.id = ce.component_id
      WHERE (
        c.name ILIKE $1 OR 
        c.description ILIKE $1 OR 
        $2 = ANY(c.tags)
      )
    `;
    
    const values: any[] = [`%${searchText}%`, searchText.toLowerCase()];
    let paramIndex = 3;

    if (filters.type) {
      query += ` AND c.type = $${paramIndex++}`;
      values.push(filters.type);
    }

    if (filters.style) {
      query += ` AND c.style = $${paramIndex++}`;
      values.push(filters.style);
    }

    if (filters.minAestheticScore) {
      query += ` AND c.aesthetic_score >= $${paramIndex++}`;
      values.push(filters.minAestheticScore);
    }

    query += ` ORDER BY c.aesthetic_score DESC, c.usage_count DESC LIMIT $${paramIndex}`;
    values.push(limit);

    const result = await this.pool.query(query, values);
    return result.rows.map(this.mapRowToComponent);
  }

  async findComponentsByStyle(
    targetStyle: string, 
    limit: number = 15
  ): Promise<DesignComponent[]> {
    const query = `
      SELECT c.* FROM components c
      WHERE c.style = $1
      ORDER BY c.aesthetic_score DESC, c.conversion_rate DESC NULLS LAST
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [targetStyle, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  async findTrendingComponents(
    timeframe: string = '7d',
    limit: number = 20
  ): Promise<DesignComponent[]> {
    const query = `
      SELECT c.*, 
        COUNT(ce.component_id) as embedding_count,
        AVG(c.aesthetic_score) as avg_score
      FROM components c
      LEFT JOIN component_embeddings ce ON c.id = ce.component_id
      WHERE c.created_at >= NOW() - INTERVAL $1
      GROUP BY c.id
      ORDER BY embedding_count DESC, avg_score DESC
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [timeframe, limit]);
    return result.rows.map(this.mapRowToComponent);
  }

  async generateComponentEmbedding(component: DesignComponent): Promise<number[]> {
    // Create a text representation of the component for embedding
    const text = this.componentToText(component);
    
    // In a real implementation, you'd call OpenAI API here
    // For now, we'll generate a mock embedding based on component features
    return this.generateMockEmbedding(component);
  }

  private componentToText(component: DesignComponent): string {
    return [
      component.name,
      component.description,
      component.type,
      component.style,
      component.tags.join(' '),
      `complexity:${component.complexity}`,
      `aesthetic:${component.metrics.aesthetic_score}`,
      component.industries.join(' ')
    ].join(' ');
  }

  private generateMockEmbedding(component: DesignComponent): number[] {
    // Generate deterministic mock embedding based on component features
    const seed = this.hashString(component.id);
    const embedding: number[] = [];
    
    for (let i = 0; i < this.embeddingDimension; i++) {
      // Use component features to influence embedding values
      let value = Math.sin(seed + i) * 0.5;
      
      // Add component-specific influences
      if (component.type === 'button') value += 0.1;
      if (component.style === 'modern') value += 0.05;
      if (component.metrics.aesthetic_score > 80) value += 0.05;
      
      embedding.push(value);
    }
    
    // Normalize to unit vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
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

  async getEmbeddingStats(): Promise<{
    total_embeddings: number;
    avg_similarity_searches: number;
    top_searched_types: Array<{ type: string; count: number }>;
  }> {
    const [totalResult, typeResult] = await Promise.all([
      this.pool.query('SELECT COUNT(*) as total FROM component_embeddings'),
      this.pool.query(`
        SELECT c.type, COUNT(*) as count 
        FROM component_embeddings ce
        JOIN components c ON c.id = ce.component_id
        GROUP BY c.type
        ORDER BY count DESC
        LIMIT 10
      `)
    ]);

    return {
      total_embeddings: parseInt(totalResult.rows[0].total),
      avg_similarity_searches: 0, // Would track this in analytics
      top_searched_types: typeResult.rows.map(r => ({
        type: r.type,
        count: parseInt(r.count)
      }))
    };
  }
}