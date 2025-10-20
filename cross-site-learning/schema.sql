-- Cross-Site Learning Patterns Table (network intelligence patterns)
CREATE TABLE IF NOT EXISTS cross_site_patterns (
    id TEXT PRIMARY KEY,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('design', 'conversion', 'content', 'performance', 'seo', 'psychology')),
    industry TEXT NOT NULL,
    pattern_data JSON NOT NULL,
    success_metrics JSON NOT NULL,
    confidence_score REAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    sites_contributing INTEGER DEFAULT 1,
    created_at DATETIME NOT NULL,
    last_updated DATETIME NOT NULL
);

-- Learning Insights Table (site-specific insights from network intelligence)
CREATE TABLE IF NOT EXISTS learning_insights (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('industry_pattern', 'goal_optimization', 'universal_pattern', 'performance_optimization', 'psychology_optimization')),
    source_pattern_id TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    expected_impact TEXT NOT NULL,
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    implementation_priority INTEGER NOT NULL CHECK (implementation_priority >= 1 AND implementation_priority <= 10),
    cross_site_evidence JSON NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implementing', 'completed', 'rejected')),
    created_at DATETIME NOT NULL,
    implemented_at DATETIME
);

-- Network Performance Table (overall network intelligence metrics)
CREATE TABLE IF NOT EXISTS network_performance (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    total_sites INTEGER NOT NULL,
    total_patterns INTEGER NOT NULL,
    average_confidence REAL NOT NULL,
    top_performing_industry TEXT,
    top_performing_pattern TEXT,
    network_learning_velocity REAL NOT NULL, -- Patterns learned per day
    cross_pollination_rate REAL NOT NULL, -- Success rate of cross-industry patterns
    created_at DATETIME NOT NULL,
    UNIQUE(date)
);

-- Pattern Effectiveness Table (tracks how patterns perform when applied)
CREATE TABLE IF NOT EXISTS pattern_effectiveness (
    id TEXT PRIMARY KEY,
    pattern_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    applied_at DATETIME NOT NULL,
    before_metrics JSON,
    after_metrics JSON,
    improvement_percentage REAL,
    implementation_success BOOLEAN DEFAULT false,
    feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
    notes TEXT,
    measured_at DATETIME,
    created_at DATETIME NOT NULL
);

-- Industry Benchmarks Table (performance benchmarks by industry)
CREATE TABLE IF NOT EXISTS industry_benchmarks (
    id TEXT PRIMARY KEY,
    industry TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('conversion_rate', 'performance_score', 'seo_score', 'engagement_rate')),
    benchmark_value REAL NOT NULL,
    percentile_25 REAL NOT NULL,
    percentile_50 REAL NOT NULL,
    percentile_75 REAL NOT NULL,
    percentile_90 REAL NOT NULL,
    sample_size INTEGER NOT NULL,
    last_calculated DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE(industry, metric_type)
);

-- Goal Type Patterns Table (patterns specific to conversion goals)
CREATE TABLE IF NOT EXISTS goal_type_patterns (
    id TEXT PRIMARY KEY,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('sales', 'leads', 'signups', 'bookings', 'traffic', 'awareness')),
    optimization_type TEXT NOT NULL,
    pattern_data JSON NOT NULL,
    success_rate REAL NOT NULL CHECK (success_rate >= 0 AND success_rate <= 100),
    average_improvement REAL NOT NULL,
    sites_tested INTEGER NOT NULL,
    industries_proven JSON, -- Array of industries where this pattern worked
    confidence_level REAL NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Cross-Site AB Test Results Table (aggregated test results across network)
CREATE TABLE IF NOT EXISTS cross_site_ab_results (
    id TEXT PRIMARY KEY,
    test_hypothesis TEXT NOT NULL,
    industry TEXT,
    goal_type TEXT,
    test_type TEXT NOT NULL,
    sites_tested INTEGER NOT NULL,
    total_visitors INTEGER NOT NULL,
    control_conversion_rate REAL NOT NULL,
    variant_conversion_rate REAL NOT NULL,
    lift_percentage REAL NOT NULL,
    statistical_significance REAL NOT NULL,
    confidence_interval_lower REAL NOT NULL,
    confidence_interval_upper REAL NOT NULL,
    winner TEXT CHECK (winner IN ('control', 'variant', 'inconclusive')),
    pattern_created_id TEXT, -- Links to cross_site_patterns if successful
    aggregated_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Network Intelligence Cache Table (cached intelligence queries for performance)
CREATE TABLE IF NOT EXISTS network_intelligence_cache (
    id TEXT PRIMARY KEY,
    cache_key TEXT NOT NULL UNIQUE,
    query_type TEXT NOT NULL,
    result_data JSON NOT NULL,
    confidence_score REAL NOT NULL,
    sites_contributing INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Pattern Evolution Table (tracks how patterns change over time)
CREATE TABLE IF NOT EXISTS pattern_evolution (
    id TEXT PRIMARY KEY,
    pattern_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    changes_made JSON NOT NULL,
    reason_for_change TEXT NOT NULL,
    confidence_before REAL NOT NULL,
    confidence_after REAL NOT NULL,
    sites_contributing_before INTEGER NOT NULL,
    sites_contributing_after INTEGER NOT NULL,
    performance_impact REAL, -- Improvement from pattern evolution
    evolved_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
);

-- Learning Acceleration Table (tracks how quickly the network learns)
CREATE TABLE IF NOT EXISTS learning_acceleration (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    new_patterns_discovered INTEGER DEFAULT 0,
    patterns_improved INTEGER DEFAULT 0,
    cross_industry_discoveries INTEGER DEFAULT 0,
    failed_patterns_retired INTEGER DEFAULT 0,
    average_pattern_maturity_days REAL DEFAULT 0,
    network_intelligence_score REAL NOT NULL,
    learning_velocity_trend TEXT CHECK (learning_velocity_trend IN ('accelerating', 'stable', 'decelerating')),
    created_at DATETIME NOT NULL,
    UNIQUE(date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cross_site_patterns_industry_type ON cross_site_patterns(industry, pattern_type, confidence_score);
CREATE INDEX IF NOT EXISTS idx_learning_insights_site_priority ON learning_insights(site_id, implementation_priority, confidence);
CREATE INDEX IF NOT EXISTS idx_pattern_effectiveness_pattern_success ON pattern_effectiveness(pattern_id, implementation_success);
CREATE INDEX IF NOT EXISTS idx_industry_benchmarks_industry_metric ON industry_benchmarks(industry, metric_type);
CREATE INDEX IF NOT EXISTS idx_goal_type_patterns_goal_success ON goal_type_patterns(goal_type, success_rate);
CREATE INDEX IF NOT EXISTS idx_cross_site_ab_results_industry_goal ON cross_site_ab_results(industry, goal_type, winner);
CREATE INDEX IF NOT EXISTS idx_network_intelligence_cache_key ON network_intelligence_cache(cache_key, expires_at);
CREATE INDEX IF NOT EXISTS idx_pattern_evolution_pattern_version ON pattern_evolution(pattern_id, version);
CREATE INDEX IF NOT EXISTS idx_learning_acceleration_date ON learning_acceleration(date, network_intelligence_score);