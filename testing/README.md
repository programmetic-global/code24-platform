# Code24 Platform Testing Suite

Comprehensive testing and validation system for the Code24 platform integration.

## Overview

This testing suite ensures all Code24 workers integrate properly and the platform is ready for deployment. It includes integration tests, load tests, security validation, and deployment readiness checks.

## Test Components

### 🔄 Integration Tests (`integration-tests.ts`)
- **Worker Health Tests** - Verify all workers are responding
- **Cross-Worker Communication** - Test service bindings and data flow
- **End-to-End Workflow** - Test complete Build → Optimize pipeline
- **Analytics Integration** - Verify unified dashboard and intelligence
- **Database Connectivity** - Validate schema and connections

### ⚡ Load Tests
- **Concurrent Worker Calls** - Test multiple simultaneous requests
- **Database Connection Pool** - Validate connection handling under load
- **Cross-Worker Latency** - Measure inter-worker communication speed

### 🔒 Security Tests
- **Header Sanitization** - Verify sensitive headers are removed
- **Input Validation** - Test SQL injection and XSS protection
- **Authentication Security** - Validate worker-to-worker auth
- **Rate Limiting** - Ensure DDoS protection is active

### 🚀 Deployment Validation (`deployment-validation.ts`)
- **Worker Configuration** - Validate wrangler.toml settings
- **Database Schema** - Check all tables and indexes
- **Security Configuration** - Verify infrastructure obfuscation
- **Performance Settings** - Validate optimization settings
- **Integration Dependencies** - Check service bindings

## Quick Start

### Install Dependencies
```bash
cd testing
npm install
```

### Run All Tests (Local)
```bash
npm test
```

### Run Specific Test Types
```bash
# Integration tests only
npm run test:integration

# Database validation
npm run test:database

# Security tests
npm run test:security

# Deployment readiness
npx tsx deployment-validation.ts staging
```

### Run Tests for Different Environments
```bash
# Local development
npm run test:local

# Staging environment
npm run test:staging

# Production (integration tests only)
npm run test:production
```

## Test Environments

### Local Development
- **Base URL**: `http://localhost:8787`
- **Workers**: Individual localhost ports (8788-8793)
- **Database**: Local SQLite files
- **Purpose**: Development and debugging

### Staging
- **Base URL**: `https://staging.code24.dev`
- **Workers**: `https://{worker}-staging.code24.dev`
- **Database**: Staging D1 databases
- **Purpose**: Pre-production validation

### Production
- **Base URL**: `https://app.code24.dev`
- **Workers**: `https://{worker}.code24.dev`
- **Database**: Production D1 databases
- **Purpose**: Production health checks (limited tests)

## Worker Integration Flow

```
Site Builder (Build Product)
├── Calls SEO Optimizer → GEO optimization
├── Calls Conversion Optimizer → Psychology tactics
├── Calls Performance Monitor → Real-time setup
└── Calls Cross-Site Learning → Industry patterns

Shared Analytics (Orchestrator)
├── Aggregates data from all workers
├── Triggers cross-worker optimizations
├── Provides unified intelligence dashboard
└── Monitors platform health
```

## Database Schema Validation

The test suite validates these database schemas:

### Main Database
- `sites` - Site records and configuration
- `users` - User accounts and permissions
- `subscriptions` - Billing and plan information

### Analytics Database
- **SEO**: `seo_audits`, `seo_issues`, `seo_optimizations`
- **Conversion**: `conversion_audits`, `conversion_opportunities`, `psychology_tactics`
- **Performance**: `performance_audits`, `core_web_vitals`, `performance_optimizations`
- **Learning**: `cross_site_patterns`, `learning_insights`, `network_performance`

## Security Validation

### Infrastructure Obfuscation
✅ Cloudflare Worker headers removed  
✅ Server information hidden  
✅ Custom security headers added  
✅ Error messages sanitized  

### Input Security
✅ SQL injection prevention  
✅ XSS protection implemented  
✅ CSRF tokens validated  
✅ Rate limiting active  

### Inter-Worker Security
✅ Service-to-service authentication  
✅ Token validation  
✅ Network isolation  

## Performance Testing

### Load Test Scenarios
- **10 concurrent worker calls** - Validates handling of simultaneous requests
- **20 database connections** - Tests connection pool under load
- **Cross-worker latency** - Measures communication delays

### Performance Thresholds
- **Worker Response Time**: < 1000ms
- **Database Query Time**: < 100ms
- **Cross-Worker Latency**: < 200ms
- **Success Rate**: > 95%

## Deployment Readiness

Before deploying to production, ensure:

1. **All integration tests pass** ✅
2. **Load tests within thresholds** ✅
3. **Security validation complete** ✅
4. **Database schemas deployed** ✅
5. **Worker configurations validated** ✅
6. **Service bindings configured** ✅
7. **Monitoring and alerting active** ✅

## Test Reports

Test results include:
- **Success/failure rates**
- **Performance metrics**
- **Detailed error information**
- **Deployment recommendations**
- **Security compliance status**

## Continuous Integration

For CI/CD pipelines:

```bash
# Quick CI tests (integration + security)
npm run test:ci

# Full validation before deployment
npm run test:staging && npx tsx deployment-validation.ts staging
```

## Troubleshooting

### Common Issues

**Worker Health Failures**
- Check worker deployment status
- Verify network connectivity
- Review wrangler.toml configuration

**Database Connection Errors**
- Validate D1 database IDs
- Check binding configurations
- Verify schema migrations

**Cross-Worker Communication Failures**
- Review service bindings in wrangler.toml
- Check worker authentication
- Validate network routing

**Performance Issues**
- Review worker resource limits
- Check database query performance
- Analyze cross-worker latency

## Support

For testing issues or questions:
1. Check test output for specific error messages
2. Review worker logs in Cloudflare dashboard
3. Validate configuration against working examples
4. Run individual test components to isolate issues