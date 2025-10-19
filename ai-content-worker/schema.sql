-- Content Optimization Jobs Table
CREATE TABLE IF NOT EXISTS content_optimization_jobs (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    optimization_type TEXT NOT NULL CHECK (optimization_type IN ('headlines', 'cta_buttons', 'descriptions', 'full_page', 'seo_content')),
    current_content TEXT NOT NULL,
    business_type TEXT NOT NULL,
    primary_goal TEXT NOT NULL,
    performance_data JSON,
    target_audience TEXT,
    brand_voice TEXT DEFAULT 'professional' CHECK (brand_voice IN ('professional', 'friendly', 'authoritative', 'casual', 'technical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    selected_variation TEXT,
    created_at DATETIME NOT NULL,
    completed_at DATETIME,
    created_from_trigger TEXT
);

-- Content Variations Table (AI-generated alternatives)
CREATE TABLE IF NOT EXISTS content_variations (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    reasoning TEXT NOT NULL,
    expected_improvement TEXT NOT NULL,
    test_results JSON,
    performance_score REAL DEFAULT 0,
    is_winner BOOLEAN DEFAULT false,
    created_at DATETIME NOT NULL
);

-- A/B Tests Table (for testing content variations)
CREATE TABLE IF NOT EXISTS ab_tests (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    test_type TEXT NOT NULL,
    control_content TEXT NOT NULL,
    variant_content TEXT NOT NULL,
    traffic_split JSON NOT NULL, -- {"control": 50, "variant": 50}
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    winner_variant TEXT CHECK (winner_variant IN ('control', 'variant')),
    confidence_level REAL,
    statistical_significance REAL,
    control_conversions INTEGER DEFAULT 0,
    variant_conversions INTEGER DEFAULT 0,
    control_visitors INTEGER DEFAULT 0,
    variant_visitors INTEGER DEFAULT 0,
    improvement_percentage REAL,
    created_from_job TEXT,
    expected_improvement TEXT,
    actual_improvement REAL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- Content Performance History
CREATE TABLE IF NOT EXISTS content_performance_history (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_hash TEXT NOT NULL, -- Hash of content for deduplication
    content_text TEXT NOT NULL,
    date_active DATE NOT NULL,
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    engagement_score REAL DEFAULT 0,
    bounce_rate REAL DEFAULT 0,
    avg_time_on_page REAL DEFAULT 0,
    created_at DATETIME NOT NULL
);

-- AI Model Performance Tracking
CREATE TABLE IF NOT EXISTS ai_model_performance (
    id TEXT PRIMARY KEY,
    model_name TEXT NOT NULL,
    optimization_type TEXT NOT NULL,
    business_type TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    predicted_improvement REAL NOT NULL,
    actual_improvement REAL,
    accuracy_score REAL,
    confidence_score REAL NOT NULL,
    job_id TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    measured_at DATETIME
);

-- Content Templates (successful patterns for reuse)
CREATE TABLE IF NOT EXISTS content_templates (
    id TEXT PRIMARY KEY,
    template_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    business_type TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    template_content TEXT NOT NULL,
    success_rate REAL DEFAULT 0,
    avg_improvement REAL DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_jobs_site_status ON content_optimization_jobs(site_id, status);
CREATE INDEX IF NOT EXISTS idx_content_variations_job ON content_variations(job_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_site_status ON ab_tests(site_id, status);
CREATE INDEX IF NOT EXISTS idx_content_performance_site_date ON content_performance_history(site_id, date_active);
CREATE INDEX IF NOT EXISTS idx_ai_performance_model ON ai_model_performance(model_name, optimization_type);
CREATE INDEX IF NOT EXISTS idx_content_templates_type ON content_templates(content_type, business_type, goal_type);