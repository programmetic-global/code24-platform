-- Analytics Events Table (raw event storage)
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'conversion', 'interaction', 'form_submit', 'button_click')),
    event_category TEXT NOT NULL CHECK (event_category IN ('engagement', 'conversion', 'navigation')),
    goal_type TEXT CHECK (goal_type IN ('sales', 'leads', 'signups', 'bookings', 'traffic', 'awareness')),
    conversion_value REAL DEFAULT 0,
    is_conversion BOOLEAN DEFAULT false,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    event_data JSON,
    created_at DATETIME NOT NULL
);

-- Optimization Triggers Table (identifies when optimization is needed)
CREATE TABLE IF NOT EXISTS optimization_triggers (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('low_conversion', 'high_bounce', 'slow_performance', 'content_refresh')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    suggested_action TEXT NOT NULL,
    trigger_data JSON,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    assigned_worker TEXT,
    created_at DATETIME NOT NULL,
    processed_at DATETIME,
    completed_at DATETIME
);

-- Daily Analytics Aggregations (pre-computed daily metrics)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    date DATE NOT NULL,
    unique_visitors INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    total_conversion_value REAL DEFAULT 0,
    avg_session_duration REAL DEFAULT 0,
    bounce_rate REAL DEFAULT 0,
    created_at DATETIME NOT NULL,
    UNIQUE(site_id, date)
);

-- Performance Metrics Table (site performance tracking)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('load_time', 'fcp', 'lcp', 'cls', 'fid')),
    value REAL NOT NULL,
    url TEXT,
    user_agent TEXT,
    created_at DATETIME NOT NULL
);

-- A/B Test Results Table (optimization test outcomes)
CREATE TABLE IF NOT EXISTS ab_test_results (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    conversion_achieved BOOLEAN DEFAULT false,
    conversion_value REAL DEFAULT 0,
    created_at DATETIME NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_site_date ON analytics_events(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_optimization_triggers_site_status ON optimization_triggers(site_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_site_date ON daily_analytics(site_id, date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_site ON performance_metrics(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_site ON ab_test_results(site_id, test_name);