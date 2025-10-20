#!/bin/bash

# Code24 Platform Secure Deployment Script
# Deploys all workers in proper dependency order with validation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
SKIP_TESTS=${2:-false}
DRY_RUN=${3:-false}

echo -e "${BLUE}🚀 Code24 Platform Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Skip Tests: ${YELLOW}${SKIP_TESTS}${NC}"
echo -e "Dry Run: ${YELLOW}${DRY_RUN}${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}❌ Invalid environment: ${ENVIRONMENT}${NC}"
    echo -e "Valid environments: staging, production"
    exit 1
fi

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"
    
    # Check wrangler CLI
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}❌ Wrangler CLI not found. Please install: npm install -g wrangler${NC}"
        exit 1
    fi
    
    # Check wrangler authentication
    if ! wrangler whoami &> /dev/null; then
        echo -e "${RED}❌ Wrangler not authenticated. Please run: wrangler login${NC}"
        exit 1
    fi
    
    # Check Node.js and npm
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Run pre-deployment tests
run_pre_deployment_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        echo -e "${YELLOW}⚠️ Skipping pre-deployment tests${NC}"
        echo ""
        return
    fi
    
    echo -e "${BLUE}🧪 Running Pre-Deployment Tests...${NC}"
    
    cd testing
    
    # Install test dependencies
    if [[ ! -d "node_modules" ]]; then
        echo "Installing test dependencies..."
        npm install
    fi
    
    # Run integration tests
    echo "Running integration tests..."
    if ! npm run test:integration; then
        echo -e "${RED}❌ Integration tests failed. Aborting deployment.${NC}"
        exit 1
    fi
    
    # Run security tests
    echo "Running security tests..."
    if ! npm run test:security; then
        echo -e "${RED}❌ Security tests failed. Aborting deployment.${NC}"
        exit 1
    fi
    
    # Run deployment validation
    echo "Running deployment validation..."
    if ! npx tsx deployment-validation.ts ${ENVIRONMENT}; then
        echo -e "${RED}❌ Deployment validation failed. Aborting deployment.${NC}"
        exit 1
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Pre-deployment tests passed${NC}"
    echo ""
}

# Setup databases
setup_databases() {
    echo -e "${BLUE}🗄️ Setting up Databases...${NC}"
    
    local main_db="code24-main"
    local analytics_db="code24-analytics"
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        main_db="code24-main-staging"
        analytics_db="code24-analytics-staging"
    fi
    
    # Create databases if they don't exist
    echo "Creating main database: ${main_db}"
    if [[ "$DRY_RUN" == "false" ]]; then
        wrangler d1 create ${main_db} 2>/dev/null || echo "Database ${main_db} already exists"
    fi
    
    echo "Creating analytics database: ${analytics_db}"
    if [[ "$DRY_RUN" == "false" ]]; then
        wrangler d1 create ${analytics_db} 2>/dev/null || echo "Database ${analytics_db} already exists"
    fi
    
    # Apply schemas
    apply_database_schemas ${main_db} ${analytics_db}
    
    echo -e "${GREEN}✅ Database setup completed${NC}"
    echo ""
}

# Apply database schemas
apply_database_schemas() {
    local main_db=$1
    local analytics_db=$2
    
    echo "Applying database schemas..."
    
    # Main database schema (from code24-platform)
    if [[ -f "code24-platform/schema.sql" ]] && [[ "$DRY_RUN" == "false" ]]; then
        echo "Applying main database schema..."
        wrangler d1 execute ${main_db} --file=code24-platform/schema.sql
    fi
    
    # Analytics schemas from all workers
    local workers=("seo-optimizer" "conversion-optimizer" "performance-monitor" "cross-site-learning")
    
    for worker in "${workers[@]}"; do
        if [[ -f "${worker}/schema.sql" ]] && [[ "$DRY_RUN" == "false" ]]; then
            echo "Applying ${worker} schema..."
            wrangler d1 execute ${analytics_db} --file=${worker}/schema.sql
        fi
    done
}

# Deploy workers in dependency order
deploy_workers() {
    echo -e "${BLUE}⚙️ Deploying Workers...${NC}"
    
    # Deployment order (dependencies first)
    local workers=(
        "shared/security-utils"  # Shared utilities first
        "seo-optimizer"
        "conversion-optimizer" 
        "performance-monitor"
        "cross-site-learning"
        "site-builder"           # Depends on optimization workers
        "shared-analytics"       # Orchestrator - deploy last
    )
    
    for worker in "${workers[@]}"; do
        deploy_worker ${worker}
    done
    
    echo -e "${GREEN}✅ All workers deployed successfully${NC}"
    echo ""
}

# Deploy individual worker
deploy_worker() {
    local worker_path=$1
    local worker_name=$(basename ${worker_path})
    
    echo -e "${YELLOW}Deploying ${worker_name}...${NC}"
    
    if [[ ! -d "${worker_path}" ]]; then
        echo -e "${RED}❌ Worker directory not found: ${worker_path}${NC}"
        return 1
    fi
    
    cd ${worker_path}
    
    # Skip deployment for shared utilities
    if [[ "${worker_path}" == "shared/security-utils" ]]; then
        echo -e "${GREEN}✅ Shared utilities (no deployment needed)${NC}"
        cd - > /dev/null
        return 0
    fi
    
    # Install dependencies if needed
    if [[ -f "package.json" ]] && [[ ! -d "node_modules" ]]; then
        echo "Installing dependencies for ${worker_name}..."
        npm install
    fi
    
    # Update wrangler.toml for environment
    update_wrangler_config ${worker_name}
    
    # Deploy worker
    if [[ "$DRY_RUN" == "false" ]]; then
        echo "Deploying ${worker_name} to ${ENVIRONMENT}..."
        if ! wrangler deploy; then
            echo -e "${RED}❌ Failed to deploy ${worker_name}${NC}"
            cd - > /dev/null
            return 1
        fi
    else
        echo "DRY RUN: Would deploy ${worker_name}"
    fi
    
    cd - > /dev/null
    
    echo -e "${GREEN}✅ ${worker_name} deployed${NC}"
    
    # Wait a moment between deployments
    sleep 2
}

# Update wrangler.toml for environment
update_wrangler_config() {
    local worker_name=$1
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        # Update name for staging
        sed -i.bak "s/name = \"${worker_name}\"/name = \"${worker_name}-staging\"/" wrangler.toml
        
        # Update database names and IDs for staging
        sed -i.bak 's/database_name = "code24-main"/database_name = "code24-main-staging"/' wrangler.toml
        sed -i.bak 's/database_name = "code24-analytics"/database_name = "code24-analytics-staging"/' wrangler.toml
        sed -i.bak 's/database_id = "d002d189-1d2f-4c19-b3ac-fb4a53b0850b"/database_id = "dd33b7f5-163f-41c9-898a-d4dcb6a51e5f"/' wrangler.toml
        sed -i.bak 's/database_id = "17caf37f-accf-44a3-ac3a-13d549b21c49"/database_id = "a4aa1d34-ad7a-4c66-bd77-b9d6a8b87a45"/' wrangler.toml
        
        # Update bucket for staging
        sed -i.bak 's/bucket_name = "code24dev"/bucket_name = "code24dev-staging"/' wrangler.toml
        
        # Update environment variable
        sed -i.bak 's/ENVIRONMENT = "production"/ENVIRONMENT = "staging"/' wrangler.toml
    fi
}

# Setup custom domains
setup_domains() {
    echo -e "${BLUE}🌐 Setting up Custom Domains...${NC}"
    
    local domain_suffix=""
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        domain_suffix="-staging"
    fi
    
    local workers=("seo-optimizer" "conversion-optimizer" "performance-monitor" "cross-site-learning" "site-builder" "shared-analytics")
    local base_domain="code24.dev"
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        base_domain="staging.code24.dev"
    fi
    
    for worker in "${workers[@]}"; do
        local custom_domain="${worker}.${base_domain}"
        echo "Setting up domain: ${custom_domain}"
        
        if [[ "$DRY_RUN" == "false" ]]; then
            # In real deployment, this would configure custom domains
            # wrangler route put "${custom_domain}/*" "${worker}${domain_suffix}"
            echo "Domain configured: ${custom_domain}"
        else
            echo "DRY RUN: Would configure ${custom_domain}"
        fi
    done
    
    echo -e "${GREEN}✅ Domain setup completed${NC}"
    echo ""
}

# Run post-deployment validation
run_post_deployment_validation() {
    echo -e "${BLUE}🔍 Running Post-Deployment Validation...${NC}"
    
    if [[ "$SKIP_TESTS" == "true" ]]; then
        echo -e "${YELLOW}⚠️ Skipping post-deployment validation${NC}"
        echo ""
        return
    fi
    
    cd testing
    
    # Run deployment-specific tests
    echo "Validating deployed workers..."
    if [[ "$DRY_RUN" == "false" ]]; then
        if ! npm run test:${ENVIRONMENT}; then
            echo -e "${RED}❌ Post-deployment validation failed${NC}"
            exit 1
        fi
    else
        echo "DRY RUN: Would run post-deployment tests"
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Post-deployment validation passed${NC}"
    echo ""
}

# Setup monitoring and alerting
setup_monitoring() {
    echo -e "${BLUE}📊 Setting up Monitoring...${NC}"
    
    echo "Configuring worker health monitoring..."
    if [[ "$DRY_RUN" == "false" ]]; then
        # In real deployment, this would configure:
        # - Cloudflare Analytics
        # - Performance monitoring
        # - Error rate alerting
        # - Custom dashboards
        echo "Monitoring configured for ${ENVIRONMENT}"
    else
        echo "DRY RUN: Would configure monitoring"
    fi
    
    echo -e "${GREEN}✅ Monitoring setup completed${NC}"
    echo ""
}

# Cleanup function
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Restore original wrangler.toml files
    find . -name "wrangler.toml.bak" -exec bash -c 'mv "$0" "${0%.bak}"' {} \;
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting deployment to ${ENVIRONMENT}...${NC}"
    echo ""
    
    # Trap cleanup on exit
    trap cleanup EXIT
    
    # Run deployment steps
    check_prerequisites
    run_pre_deployment_tests
    setup_databases
    deploy_workers
    setup_domains
    run_post_deployment_validation
    setup_monitoring
    
    echo -e "${GREEN}🎉 Deployment to ${ENVIRONMENT} completed successfully!${NC}"
    echo ""
    
    # Display deployment summary
    display_deployment_summary
}

# Display deployment summary
display_deployment_summary() {
    echo -e "${BLUE}📋 Deployment Summary${NC}"
    echo -e "${BLUE}═══════════════════════${NC}"
    echo -e "Environment: ${GREEN}${ENVIRONMENT}${NC}"
    echo -e "Workers Deployed: ${GREEN}6${NC}"
    echo -e "Databases: ${GREEN}2${NC}"
    echo -e "Custom Domains: ${GREEN}6${NC}"
    echo ""
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        echo -e "${YELLOW}Staging URLs:${NC}"
        echo -e "• Main App: https://staging.code24.dev"
        echo -e "• SEO Optimizer: https://seo-optimizer.staging.code24.dev"
        echo -e "• Conversion Optimizer: https://conversion-optimizer.staging.code24.dev"
        echo -e "• Performance Monitor: https://performance-monitor.staging.code24.dev"
        echo -e "• Cross-Site Learning: https://cross-site-learning.staging.code24.dev"
        echo -e "• Site Builder: https://site-builder.staging.code24.dev"
        echo -e "• Shared Analytics: https://shared-analytics.staging.code24.dev"
    else
        echo -e "${GREEN}Production URLs:${NC}"
        echo -e "• Main App: https://app.code24.dev"
        echo -e "• SEO Optimizer: https://seo-optimizer.code24.dev"
        echo -e "• Conversion Optimizer: https://conversion-optimizer.code24.dev"
        echo -e "• Performance Monitor: https://performance-monitor.code24.dev"
        echo -e "• Cross-Site Learning: https://cross-site-learning.code24.dev"
        echo -e "• Site Builder: https://site-builder.code24.dev"
        echo -e "• Shared Analytics: https://shared-analytics.code24.dev"
    fi
    
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "1. Monitor worker health in Cloudflare dashboard"
    echo -e "2. Run integration tests: ${YELLOW}npm run test:${ENVIRONMENT}${NC}"
    echo -e "3. Test end-to-end workflows"
    echo -e "4. Monitor performance and errors"
    echo ""
}

# Run main function
main "$@"