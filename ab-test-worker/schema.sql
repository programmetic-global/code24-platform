-- Test Assignments Table (tracks which visitors see which variant)
CREATE TABLE IF NOT EXISTS test_assignments (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    variant TEXT NOT NULL CHECK (variant IN ('control', 'variant')),
    assigned_at DATETIME NOT NULL,
    UNIQUE(test_id, visitor_id)
);

-- Test Results Table (conversion events for each test)
CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    session_id TEXT,
    variant TEXT NOT NULL CHECK (variant IN ('control', 'variant')),
    converted BOOLEAN NOT NULL DEFAULT false,
    conversion_value REAL DEFAULT 0,
    conversion_type TEXT,
    page_url TEXT,
    created_at DATETIME NOT NULL
);

-- Applied Optimizations Table (winning variants that have been implemented)
CREATE TABLE IF NOT EXISTS applied_optimizations (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    optimization_type TEXT NOT NULL,
    original_content TEXT NOT NULL,
    optimized_content TEXT NOT NULL,
    improvement_percentage REAL NOT NULL,
    test_id TEXT NOT NULL,
    applied_at DATETIME NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reverted', 'superseded')),
    reverted_at DATETIME,
    revert_reason TEXT
);

-- Test Performance Metrics (daily aggregated metrics for each test)
CREATE TABLE IF NOT EXISTS test_daily_metrics (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    date DATE NOT NULL,
    control_visitors INTEGER DEFAULT 0,
    variant_visitors INTEGER DEFAULT 0,
    control_conversions INTEGER DEFAULT 0,
    variant_conversions INTEGER DEFAULT 0,
    control_conversion_rate REAL DEFAULT 0,
    variant_conversion_rate REAL DEFAULT 0,
    improvement_percentage REAL DEFAULT 0,
    confidence_level REAL DEFAULT 0,
    is_significant BOOLEAN DEFAULT false,
    created_at DATETIME NOT NULL,
    UNIQUE(test_id, date)
);

-- Test Hypotheses Table (tracks predictions vs actual results)
CREATE TABLE IF NOT EXISTS test_hypotheses (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    predicted_improvement REAL NOT NULL,
    actual_improvement REAL,
    hypothesis_confirmed BOOLEAN,
    confidence_in_prediction REAL NOT NULL,
    created_at DATETIME NOT NULL,
    evaluated_at DATETIME
);

-- Statistical Significance Log (tracks when tests reach significance)
CREATE TABLE IF NOT EXISTS significance_log (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    reached_at DATETIME NOT NULL,
    control_sample_size INTEGER NOT NULL,
    variant_sample_size INTEGER NOT NULL,
    control_conversion_rate REAL NOT NULL,
    variant_conversion_rate REAL NOT NULL,
    improvement_percentage REAL NOT NULL,
    confidence_level REAL NOT NULL,
    p_value REAL NOT NULL,
    z_score REAL NOT NULL,
    action_taken TEXT CHECK (action_taken IN ('declared_winner', 'continued_test', 'stopped_test')),
    created_at DATETIME NOT NULL
);

-- Test Configuration Templates (reusable test setups)
CREATE TABLE IF NOT EXISTS test_templates (
    id TEXT PRIMARY KEY,
    template_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    test_type TEXT NOT NULL,
    description TEXT NOT NULL,
    traffic_split JSON NOT NULL,
    min_sample_size INTEGER NOT NULL,
    expected_runtime_days INTEGER NOT NULL,
    success_rate REAL DEFAULT 0,
    avg_improvement REAL DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_assignments_test ON test_assignments(test_id);
CREATE INDEX IF NOT EXISTS idx_test_assignments_visitor ON test_assignments(visitor_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_variant ON test_results(test_id, variant);
CREATE INDEX IF NOT EXISTS idx_applied_optimizations_site ON applied_optimizations(site_id, status);
CREATE INDEX IF NOT EXISTS idx_test_daily_metrics_test_date ON test_daily_metrics(test_id, date);
CREATE INDEX IF NOT EXISTS idx_significance_log_test ON significance_log(test_id, reached_at);
CREATE INDEX IF NOT EXISTS idx_test_templates_type ON test_templates(business_type, goal_type, test_type);