-- SEO Audits Table (tracks SEO audit runs)
CREATE TABLE IF NOT EXISTS seo_audits (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    url TEXT NOT NULL,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('technical', 'content', 'performance', 'full')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    issues_found INTEGER DEFAULT 0,
    seo_score INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- SEO Issues Table (identified SEO problems)
CREATE TABLE IF NOT EXISTS seo_issues (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('meta_tags', 'headings', 'images', 'internal_links', 'schema', 'performance', 'content', 'geo', 'ai_optimization', 'brand_mention')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'important', 'moderate', 'minor')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    current_value TEXT,
    recommended_value TEXT NOT NULL,
    impact TEXT NOT NULL,
    effort TEXT NOT NULL CHECK (effort IN ('low', 'medium', 'high')),
    estimated_improvement TEXT NOT NULL,
    geo_relevance INTEGER DEFAULT 0 CHECK (geo_relevance >= 0 AND geo_relevance <= 100),
    brand_mention_potential INTEGER DEFAULT 0 CHECK (brand_mention_potential >= 0 AND brand_mention_potential <= 100),
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'optimizing', 'resolved', 'ignored')),
    created_at DATETIME NOT NULL,
    resolved_at DATETIME
);

-- SEO Optimizations Table (optimization implementations)
CREATE TABLE IF NOT EXISTS seo_optimizations (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    issue_id TEXT NOT NULL,
    optimization_type TEXT NOT NULL,
    original_content TEXT,
    optimized_content TEXT NOT NULL,
    implementation TEXT DEFAULT 'pending' CHECK (implementation IN ('automatic', 'manual', 'pending')),
    expected_impact TEXT NOT NULL,
    actual_impact TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implemented', 'testing', 'reverted')),
    created_at DATETIME NOT NULL,
    implemented_at DATETIME,
    reverted_at DATETIME
);

-- Keyword Rankings Table (SEO performance tracking)
CREATE TABLE IF NOT EXISTS keyword_rankings (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    keyword TEXT NOT NULL,
    position INTEGER,
    previous_position INTEGER,
    search_volume INTEGER,
    competition TEXT CHECK (competition IN ('low', 'medium', 'high')),
    url TEXT,
    search_engine TEXT DEFAULT 'google',
    country_code TEXT DEFAULT 'US',
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, keyword, search_engine, created_at)
);

-- Technical SEO Scores Table (daily technical SEO health)
CREATE TABLE IF NOT EXISTS technical_seo_scores (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    date DATE NOT NULL,
    overall_score INTEGER NOT NULL,
    meta_tags_score INTEGER DEFAULT 0,
    headings_score INTEGER DEFAULT 0,
    images_score INTEGER DEFAULT 0,
    internal_links_score INTEGER DEFAULT 0,
    schema_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    crawl_errors INTEGER DEFAULT 0,
    mobile_friendly BOOLEAN DEFAULT true,
    page_speed_score INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, date)
);

-- SEO Recommendations Table (AI-generated recommendations)
CREATE TABLE IF NOT EXISTS seo_recommendations (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    implementation_difficulty TEXT NOT NULL CHECK (implementation_difficulty IN ('easy', 'medium', 'hard')),
    expected_impact TEXT NOT NULL,
    confidence_score REAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    recommendation_data JSON,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implementing', 'completed', 'rejected')),
    created_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- Schema Markup Table (structured data tracking)
CREATE TABLE IF NOT EXISTS schema_markup (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    schema_type TEXT NOT NULL, -- Organization, LocalBusiness, Product, etc.
    schema_data JSON NOT NULL,
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning')),
    validation_errors JSON,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE(site_id, page_url, schema_type)
);

-- Internal Links Table (internal linking structure)
CREATE TABLE IF NOT EXISTS internal_links (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    anchor_text TEXT NOT NULL,
    link_type TEXT DEFAULT 'standard' CHECK (link_type IN ('standard', 'navigation', 'footer', 'breadcrumb')),
    discovered_at DATETIME NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'broken', 'redirect'))
);

-- SEO Content Analysis Table (content quality metrics)
CREATE TABLE IF NOT EXISTS seo_content_analysis (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    keyword_density REAL DEFAULT 0,
    readability_score INTEGER DEFAULT 0,
    content_freshness_days INTEGER DEFAULT 0,
    duplicate_content_percentage REAL DEFAULT 0,
    h1_count INTEGER DEFAULT 0,
    h2_count INTEGER DEFAULT 0,
    h3_count INTEGER DEFAULT 0,
    image_count INTEGER DEFAULT 0,
    images_with_alt INTEGER DEFAULT 0,
    internal_links_count INTEGER DEFAULT 0,
    external_links_count INTEGER DEFAULT 0,
    analyzed_at DATETIME NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_audits_site_status ON seo_audits(site_id, status);
CREATE INDEX IF NOT EXISTS idx_seo_issues_site_severity ON seo_issues(site_id, severity, status);
CREATE INDEX IF NOT EXISTS idx_seo_optimizations_site_status ON seo_optimizations(site_id, status);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_site_date ON keyword_rankings(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_technical_seo_scores_site_date ON technical_seo_scores(site_id, date);
CREATE INDEX IF NOT EXISTS idx_seo_recommendations_site_priority ON seo_recommendations(site_id, priority, status);
CREATE INDEX IF NOT EXISTS idx_schema_markup_site ON schema_markup(site_id, validation_status);
CREATE INDEX IF NOT EXISTS idx_internal_links_site ON internal_links(site_id, status);
CREATE INDEX IF NOT EXISTS idx_seo_content_analysis_site ON seo_content_analysis(site_id, analyzed_at);