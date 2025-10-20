-- Conversion Audits Table (tracks conversion audit runs)
CREATE TABLE IF NOT EXISTS conversion_audits (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('sales', 'leads', 'signups', 'bookings', 'traffic', 'awareness')),
    audit_type TEXT NOT NULL CHECK (audit_type IN ('funnel', 'elements', 'flow', 'complete')),
    timeframe TEXT NOT NULL CHECK (timeframe IN ('7d', '30d', '90d')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    opportunities_found INTEGER DEFAULT 0,
    conversion_score INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- Conversion Opportunities Table (optimization opportunities identified)
CREATE TABLE IF NOT EXISTS conversion_opportunities (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cta_optimization', 'form_optimization', 'flow_improvement', 'urgency_tactics', 'social_proof', 'value_proposition', 'scarcity_tactics', 'authority_indicators', 'reciprocity_triggers', 'commitment_consistency')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    current_state TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    expected_impact TEXT NOT NULL,
    implementation_effort TEXT NOT NULL CHECK (implementation_effort IN ('low', 'medium', 'high')),
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    priority INTEGER NOT NULL,
    psychology_principle TEXT,
    emotional_trigger TEXT,
    conversion_goal_alignment INTEGER DEFAULT 0 CHECK (conversion_goal_alignment >= 0 AND conversion_goal_alignment <= 100),
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'implementing', 'testing', 'completed', 'rejected')),
    created_at DATETIME NOT NULL,
    implemented_at DATETIME
);

-- Conversion Strategies Table (optimization strategy implementations)
CREATE TABLE IF NOT EXISTS conversion_strategies (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    strategy_type TEXT NOT NULL,
    tactics_json JSON NOT NULL,
    expected_lift REAL NOT NULL,
    actual_lift REAL,
    test_duration INTEGER NOT NULL, -- days
    implementation TEXT NOT NULL CHECK (implementation IN ('immediate', 'ab_test', 'staged')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'testing', 'implemented', 'paused', 'completed')),
    test_id TEXT, -- Reference to A/B test
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- Conversion Funnel Analysis Table (funnel step performance)
CREATE TABLE IF NOT EXISTS conversion_funnel_steps (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    funnel_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    page_url TEXT,
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    dropoff_rate REAL DEFAULT 0,
    average_time_seconds REAL DEFAULT 0,
    issues_identified JSON,
    optimization_suggestions JSON,
    date_analyzed DATE NOT NULL,
    created_at DATETIME NOT NULL
);

-- Element Performance Table (individual element conversion tracking)
CREATE TABLE IF NOT EXISTS element_performance (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    element_type TEXT NOT NULL CHECK (element_type IN ('cta_button', 'form', 'link', 'image', 'video')),
    element_id TEXT NOT NULL,
    element_text TEXT,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    click_rate REAL DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    date_tracked DATE NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, page_url, element_id, date_tracked)
);

-- Psychology Tactics Table (conversion psychology implementations)
CREATE TABLE IF NOT EXISTS psychology_tactics (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    tactic_type TEXT NOT NULL CHECK (tactic_type IN ('urgency', 'scarcity', 'social_proof', 'authority', 'reciprocity', 'commitment')),
    element_location TEXT NOT NULL,
    original_content TEXT,
    optimized_content TEXT NOT NULL,
    psychology_principle TEXT NOT NULL,
    expected_impact REAL NOT NULL,
    actual_impact REAL,
    implementation_date DATETIME,
    test_results JSON,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'testing', 'active', 'paused', 'removed')),
    created_at DATETIME NOT NULL
);

-- Conversion Goals Table (site-specific conversion definitions)
CREATE TABLE IF NOT EXISTS conversion_goals (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    goal_name TEXT NOT NULL,
    goal_type TEXT NOT NULL,
    trigger_events JSON NOT NULL, -- List of events that constitute this goal
    value_per_conversion REAL DEFAULT 0,
    target_rate REAL, -- Target conversion rate
    current_rate REAL DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    weight REAL DEFAULT 1.0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- User Journey Paths Table (common user flow analysis)
CREATE TABLE IF NOT EXISTS user_journey_paths (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    path_sequence TEXT NOT NULL, -- JSON array of page URLs
    frequency INTEGER DEFAULT 1,
    conversion_rate REAL DEFAULT 0,
    average_duration_seconds REAL DEFAULT 0,
    dropoff_points JSON, -- Points where users commonly exit
    optimization_opportunities JSON,
    last_seen DATE NOT NULL,
    created_at DATETIME NOT NULL
);

-- Conversion Experiments Table (A/B test results for conversion tactics)
CREATE TABLE IF NOT EXISTS conversion_experiments (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    strategy_id TEXT NOT NULL,
    experiment_name TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    control_description TEXT NOT NULL,
    variant_description TEXT NOT NULL,
    success_metric TEXT NOT NULL,
    control_conversions INTEGER DEFAULT 0,
    variant_conversions INTEGER DEFAULT 0,
    control_visitors INTEGER DEFAULT 0,
    variant_visitors INTEGER DEFAULT 0,
    statistical_significance REAL DEFAULT 0,
    confidence_level REAL DEFAULT 0,
    winner TEXT CHECK (winner IN ('control', 'variant', 'inconclusive')),
    lift_percentage REAL DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    status TEXT DEFAULT 'running' CHECK (status IN ('draft', 'running', 'completed', 'paused', 'stopped')),
    created_at DATETIME NOT NULL
);

-- Heatmap Data Table (click and scroll heatmap analysis)
CREATE TABLE IF NOT EXISTS heatmap_data (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    element_selector TEXT NOT NULL,
    x_coordinate INTEGER NOT NULL,
    y_coordinate INTEGER NOT NULL,
    click_count INTEGER DEFAULT 0,
    scroll_depth REAL DEFAULT 0,
    attention_time REAL DEFAULT 0,
    date_collected DATE NOT NULL,
    created_at DATETIME NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversion_audits_site_status ON conversion_audits(site_id, status);
CREATE INDEX IF NOT EXISTS idx_conversion_opportunities_site_severity ON conversion_opportunities(site_id, severity, status);
CREATE INDEX IF NOT EXISTS idx_conversion_strategies_site_status ON conversion_strategies(site_id, status);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_site_funnel ON conversion_funnel_steps(site_id, funnel_id, step_order);
CREATE INDEX IF NOT EXISTS idx_element_performance_site_date ON element_performance(site_id, date_tracked);
CREATE INDEX IF NOT EXISTS idx_psychology_tactics_site_type ON psychology_tactics(site_id, tactic_type, status);
CREATE INDEX IF NOT EXISTS idx_conversion_goals_site ON conversion_goals(site_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_user_journey_site ON user_journey_paths(site_id, last_seen);
CREATE INDEX IF NOT EXISTS idx_conversion_experiments_site ON conversion_experiments(site_id, status);
CREATE INDEX IF NOT EXISTS idx_heatmap_data_site_page ON heatmap_data(site_id, page_url, date_collected);