-- Performance Audits Table (tracks performance audit runs)
CREATE TABLE IF NOT EXISTS performance_audits (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('speed', 'core_vitals', 'resource', 'full')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    issues_found INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- Performance Issues Table (identified performance problems)
CREATE TABLE IF NOT EXISTS performance_issues (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fcp', 'lcp', 'cls', 'fid', 'ttfb', 'resource_size', 'image_optimization', 'caching')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    current_value TEXT NOT NULL,
    target_value TEXT NOT NULL,
    impact TEXT NOT NULL,
    effort TEXT NOT NULL CHECK (effort IN ('low', 'medium', 'high')),
    potential_improvement TEXT NOT NULL,
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'optimizing', 'resolved', 'monitoring')),
    created_at DATETIME NOT NULL,
    resolved_at DATETIME
);

-- Performance Optimizations Table (optimization implementations)
CREATE TABLE IF NOT EXISTS performance_optimizations (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    issue_id TEXT NOT NULL,
    optimization_type TEXT NOT NULL,
    implementation TEXT NOT NULL CHECK (implementation IN ('automatic', 'manual', 'cdn', 'server')),
    expected_improvement TEXT NOT NULL,
    actual_improvement TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implemented', 'testing', 'reverted')),
    created_at DATETIME NOT NULL,
    implemented_at DATETIME,
    updated_at DATETIME
);

-- Core Web Vitals Table (daily Core Web Vitals measurements)
CREATE TABLE IF NOT EXISTS core_web_vitals (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    fcp REAL NOT NULL, -- First Contentful Paint (ms)
    lcp REAL NOT NULL, -- Largest Contentful Paint (ms)
    cls REAL NOT NULL, -- Cumulative Layout Shift
    fid REAL NOT NULL, -- First Input Delay (ms)
    ttfb REAL NOT NULL, -- Time to First Byte (ms)
    date_measured DATE NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, page_url, date_measured)
);

-- Performance Metrics Table (comprehensive performance tracking)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('speed_index', 'interactive', 'total_blocking_time', 'resource_count', 'transfer_size')),
    value REAL NOT NULL,
    threshold_status TEXT CHECK (threshold_status IN ('good', 'needs_improvement', 'poor')),
    date_measured DATE NOT NULL,
    created_at DATETIME NOT NULL
);

-- Resource Analysis Table (individual resource performance)
CREATE TABLE IF NOT EXISTS resource_analysis (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    resource_url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('script', 'stylesheet', 'image', 'font', 'video', 'audio', 'document')),
    size_bytes INTEGER NOT NULL,
    load_time_ms REAL NOT NULL,
    blocking BOOLEAN DEFAULT false,
    optimization_potential TEXT,
    recommended_action TEXT,
    analyzed_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Performance Budgets Table (performance targets and monitoring)
CREATE TABLE IF NOT EXISTS performance_budgets (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_type TEXT NOT NULL, -- homepage, product, checkout, etc.
    metric_name TEXT NOT NULL,
    target_value REAL NOT NULL,
    warning_threshold REAL NOT NULL,
    current_value REAL DEFAULT 0,
    status TEXT DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'warning', 'exceeded', 'met')),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE(site_id, page_type, metric_name)
);

-- Performance Trends Table (historical performance data)
CREATE TABLE IF NOT EXISTS performance_trends (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    date DATE NOT NULL,
    overall_score INTEGER NOT NULL,
    fcp_avg REAL DEFAULT 0,
    lcp_avg REAL DEFAULT 0,
    cls_avg REAL DEFAULT 0,
    fid_avg REAL DEFAULT 0,
    ttfb_avg REAL DEFAULT 0,
    pages_analyzed INTEGER DEFAULT 1,
    critical_issues INTEGER DEFAULT 0,
    high_issues INTEGER DEFAULT 0,
    medium_issues INTEGER DEFAULT 0,
    low_issues INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, date)
);

-- Performance Recommendations Table (AI-generated optimization suggestions)
CREATE TABLE IF NOT EXISTS performance_recommendations (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    implementation_guide TEXT NOT NULL,
    expected_impact TEXT NOT NULL,
    effort_estimate TEXT NOT NULL CHECK (effort_estimate IN ('low', 'medium', 'high')),
    confidence_score REAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    recommendation_data JSON,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implementing', 'completed', 'rejected')),
    created_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- Image Optimization Table (image-specific performance tracking)
CREATE TABLE IF NOT EXISTS image_optimization (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    optimized_size INTEGER,
    format_original TEXT NOT NULL,
    format_optimized TEXT,
    has_alt_text BOOLEAN DEFAULT false,
    has_lazy_loading BOOLEAN DEFAULT false,
    has_dimensions BOOLEAN DEFAULT false,
    compression_ratio REAL,
    optimization_status TEXT DEFAULT 'pending' CHECK (optimization_status IN ('pending', 'optimized', 'failed', 'skipped')),
    analyzed_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Caching Analysis Table (caching strategy effectiveness)
CREATE TABLE IF NOT EXISTS caching_analysis (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    resource_url TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    cache_control_header TEXT,
    expires_header TEXT,
    etag_present BOOLEAN DEFAULT false,
    last_modified_present BOOLEAN DEFAULT false,
    cache_hit_rate REAL DEFAULT 0,
    recommended_cache_duration INTEGER, -- seconds
    current_cache_duration INTEGER, -- seconds
    optimization_impact TEXT,
    analyzed_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_audits_site_status ON performance_audits(site_id, status);
CREATE INDEX IF NOT EXISTS idx_performance_issues_site_severity ON performance_issues(site_id, severity, status);
CREATE INDEX IF NOT EXISTS idx_performance_optimizations_site_status ON performance_optimizations(site_id, status);
CREATE INDEX IF NOT EXISTS idx_core_web_vitals_site_date ON core_web_vitals(site_id, date_measured);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_site_date ON performance_metrics(site_id, date_measured);
CREATE INDEX IF NOT EXISTS idx_resource_analysis_site_page ON resource_analysis(site_id, page_url, analyzed_at);
CREATE INDEX IF NOT EXISTS idx_performance_budgets_site ON performance_budgets(site_id, status);
CREATE INDEX IF NOT EXISTS idx_performance_trends_site_date ON performance_trends(site_id, date);
CREATE INDEX IF NOT EXISTS idx_performance_recommendations_site_priority ON performance_recommendations(site_id, priority, status);
CREATE INDEX IF NOT EXISTS idx_image_optimization_site_status ON image_optimization(site_id, optimization_status);
CREATE INDEX IF NOT EXISTS idx_caching_analysis_site ON caching_analysis(site_id, analyzed_at);