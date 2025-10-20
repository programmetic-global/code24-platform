-- Code24 Platform Initial Database Setup
-- Migration 001: Core platform tables

-- Main Database Tables
CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    primary_domain TEXT UNIQUE NOT NULL,
    primary_goal TEXT CHECK (primary_goal IN ('sales', 'leads', 'signups', 'bookings', 'traffic', 'awareness')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'building')),
    performance_score INTEGER DEFAULT 75 CHECK (performance_score >= 0 AND performance_score <= 100),
    conversion_score INTEGER DEFAULT 75 CHECK (conversion_score >= 0 AND conversion_score <= 100),
    seo_score INTEGER DEFAULT 75 CHECK (seo_score >= 0 AND seo_score <= 100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agency')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at DATETIME NOT NULL,
    last_login DATETIME
);

CREATE TABLE IF NOT EXISTS user_sites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (site_id) REFERENCES sites(id),
    UNIQUE(user_id, site_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'professional', 'agency', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
    current_period_start DATETIME NOT NULL,
    current_period_end DATETIME NOT NULL,
    sites_limit INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS optimization_triggers (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    trigger_reason TEXT NOT NULL,
    workers_triggered INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at DATETIME NOT NULL,
    completed_at DATETIME,
    FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sites_business_type ON sites(business_type);
CREATE INDEX IF NOT EXISTS idx_sites_primary_goal ON sites(primary_goal);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sites_user_id ON user_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sites_site_id ON user_sites(site_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_triggers_site_id ON optimization_triggers(site_id);

-- Insert default data
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, created_at) 
VALUES ('admin-001', 'admin@code24.dev', '$2b$10$dummy.hash.for.demo', 'Code24 Admin', 'admin', datetime('now'));