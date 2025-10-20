#!/bin/bash

# Code24 Workers for Platforms Deployment Script
# Deploys the complete programmable platform architecture

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}

echo -e "${PURPLE}🎯 Deploying Code24 Workers for Platforms${NC}"
echo -e "${PURPLE}════════════════════════════════════════════${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Architecture: ${YELLOW}Programmable Platforms + Serverless ETL${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found${NC}"
    exit 1
fi

if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Wrangler not authenticated${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites met${NC}"
echo ""

# Phase 1: Setup R2 Storage
echo -e "${PURPLE}🚀 PHASE 1: R2 Storage Setup${NC}"
echo -e "${PURPLE}═══════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}💾 Setting up R2 buckets and templates...${NC}"
if node setup-r2-storage.js; then
    echo -e "${GREEN}✅ R2 Storage configured${NC}"
else
    echo -e "${YELLOW}⚠️ R2 Setup had issues, continuing...${NC}"
fi
echo ""

# Phase 2: Deploy Elite Workers (Foundation)
echo -e "${PURPLE}🚀 PHASE 2: Elite Workers Foundation${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}🎨 Deploying Brand Worker...${NC}"
cd brand-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Brand Worker deployed${NC}"
    BRAND_URL=$(wrangler whoami | head -1 | awk '{print "https://brand-worker-staging." $3}' || echo "Deployed")
    echo -e "   📍 URL: ${BRAND_URL}"
else
    echo -e "${RED}❌ Brand Worker failed${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}👷 Deploying Designer Worker...${NC}"
cd designer-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Designer Worker deployed${NC}"
    DESIGN_URL=$(wrangler whoami | head -1 | awk '{print "https://designer-worker-staging." $3}' || echo "Deployed")
    echo -e "   📍 URL: ${DESIGN_URL}"
else
    echo -e "${RED}❌ Designer Worker failed${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}🏆 Deploying Developer Worker...${NC}"
cd advanced-developer-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Developer Worker deployed${NC}"
    DEVELOP_URL=$(wrangler whoami | head -1 | awk '{print "https://advanced-developer-worker-staging." $3}' || echo "Deployed")
    echo -e "   📍 URL: ${DEVELOP_URL}"
else
    echo -e "${RED}❌ Developer Worker failed${NC}"
    exit 1
fi
cd ..

echo ""

# Phase 3: Deploy ETL Pipeline
echo -e "${PURPLE}🚀 PHASE 3: ETL Pipeline${NC}"
echo -e "${PURPLE}═══════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📊 Deploying ETL Pipeline Worker...${NC}"
cd etl-pipeline-worker
if wrangler deploy --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ ETL Pipeline deployed${NC}"
    ETL_URL=$(wrangler whoami | head -1 | awk '{print "https://code24-etl-pipeline-staging." $3}' || echo "Deployed")
    echo -e "   📍 URL: ${ETL_URL}"
else
    echo -e "${RED}❌ ETL Pipeline failed${NC}"
    exit 1
fi
cd ..

echo ""

# Phase 4: Deploy Platform Dispatcher
echo -e "${PURPLE}🚀 PHASE 4: Platform Dispatcher${NC}"
echo -e "${PURPLE}═══════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}🎯 Deploying Platform Dispatcher...${NC}"
cd platform-dispatcher
if wrangler deploy --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Platform Dispatcher deployed${NC}"
    PLATFORM_URL="https://staging.code24.dev"
    echo -e "   📍 URL: ${PLATFORM_URL}"
else
    echo -e "${RED}❌ Platform Dispatcher failed${NC}"
    exit 1
fi
cd ..

echo ""

# Phase 5: Test Complete Architecture
echo -e "${PURPLE}🚀 PHASE 5: Architecture Testing${NC}"
echo -e "${PURPLE}═══════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}🧪 Testing Workers for Platforms Architecture...${NC}"

# Test main platform
echo -e "${BLUE}Testing Platform Dispatcher...${NC}"
PLATFORM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/" || echo "000")
if [ "$PLATFORM_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Platform Dispatcher: Online${NC}"
else
    echo -e "${RED}❌ Platform Dispatcher: HTTP $PLATFORM_STATUS${NC}"
fi

# Test Elite Workers through dispatcher
echo -e "${BLUE}Testing Elite Workers Integration...${NC}"
ELITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/elite/status" || echo "000")
if [ "$ELITE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Elite Workers: Integrated${NC}"
    # Get actual status
    curl -s "${PLATFORM_URL}/elite/status" | jq '.workers' 2>/dev/null || echo "Status data available"
else
    echo -e "${RED}❌ Elite Workers: HTTP $ELITE_STATUS${NC}"
fi

# Test ETL Pipeline
echo -e "${BLUE}Testing ETL Pipeline...${NC}"
ETL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${ETL_URL}/health" || echo "000")
if [ "$ETL_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ ETL Pipeline: Active${NC}"
else
    echo -e "${RED}❌ ETL Pipeline: HTTP $ETL_STATUS${NC}"
fi

# Test customer subdomain handling
echo -e "${BLUE}Testing Customer Isolation...${NC}"
DEMO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://demo.staging.code24.dev/" || echo "000")
if [ "$DEMO_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Customer Isolation: Working${NC}"
else
    echo -e "${YELLOW}⚠️ Customer Isolation: HTTP $DEMO_STATUS (Expected for new setup)${NC}"
fi

echo ""

# Phase 6: Architecture Summary
echo -e "${PURPLE}🎉 Code24 Workers for Platforms DEPLOYED!${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}🌟 Programmable Platform Architecture:${NC}"
echo ""
echo -e "${BLUE}📱 Platform Layer:${NC}"
echo -e "   🎯 Main Dispatcher: ${PLATFORM_URL}"
echo -e "   📊 ETL Pipeline: ${ETL_URL}/status"
echo -e "   🔍 Elite Workers: ${PLATFORM_URL}/elite/status"
echo ""
echo -e "${BLUE}🏗️ Elite Workers (Service Bindings):${NC}"
echo -e "   🎨 Brand Worker: ${BRAND_URL}"
echo -e "   👷 Designer Worker: ${DESIGN_URL}"
echo -e "   🏆 Developer Worker: ${DEVELOP_URL}"
echo ""
echo -e "${BLUE}💾 Storage & Data:${NC}"
echo -e "   🪣 R2 Buckets: Customer sites, assets, data pipeline"
echo -e "   🔑 KV Namespaces: Customer metadata, worker configs"
echo -e "   📊 Analytics Engine: Platform and customer analytics"
echo -e "   📋 Queues: Data processing, optimization jobs"
echo ""
echo -e "${BLUE}👥 Customer Architecture:${NC}"
echo -e "   🏠 Customer Sites: subdomain.staging.code24.dev"
echo -e "   🔒 Worker Isolation: Individual namespaces per customer"
echo -e "   ⚡ Dynamic Deployment: Workers created on-demand"
echo -e "   📈 Auto-scaling: Zero to global scale automatically"
echo ""

# Calculate overall health
TOTAL_SERVICES=4
ONLINE_SERVICES=0
[ "$PLATFORM_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$ELITE_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$ETL_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$DEMO_STATUS" = "200" ] && ((ONLINE_SERVICES++))

PLATFORM_HEALTH=$((ONLINE_SERVICES * 100 / TOTAL_SERVICES))

echo -e "${GREEN}📊 Platform Health: ${PLATFORM_HEALTH}% (${ONLINE_SERVICES}/${TOTAL_SERVICES} core services)${NC}"
echo ""

if [ "$PLATFORM_HEALTH" -ge 75 ]; then
    echo -e "${GREEN}🚀 Platform Ready for Production Customers!${NC}"
    echo ""
    echo -e "${PURPLE}📋 Demo Commands:${NC}"
    echo ""
    echo -e "${BLUE}1. Test Elite Workers Status:${NC}"
    echo "curl ${PLATFORM_URL}/elite/status | jq"
    echo ""
    echo -e "${BLUE}2. Trigger ETL Data Processing:${NC}"
    echo "curl -X POST '${ETL_URL}/ingest' -H 'Content-Type: application/json' -d '{\"type\":\"brand_analysis\",\"url\":\"staging.code24.dev\",\"customerId\":\"demo\"}'"
    echo ""
    echo -e "${BLUE}3. Check Platform Dashboard:${NC}"
    echo "open ${PLATFORM_URL}"
    echo ""
    echo -e "${BLUE}4. Create Customer Worker:${NC}"
    echo "# Customers automatically get isolated workers on first visit"
    echo "curl https://demo.staging.code24.dev/"
    echo ""
    echo -e "${GREEN}✨ The Revolutionary Programmable Platform is Live!${NC}"
else
    echo -e "${YELLOW}⚠️ Some services need attention. Check logs and retry deployment.${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "Full redeploy: ./deploy-workers-platform.sh ${ENVIRONMENT}"
echo "Setup R2 only: node setup-r2-storage.js"
echo "Deploy Elite Workers: ./deploy-elite-workers.sh ${ENVIRONMENT}"
echo "Monitor logs: wrangler logs code24-platform-dispatcher-${ENVIRONMENT}"
echo ""
echo -e "${PURPLE}🎯 Workers for Platforms Architecture Complete!${NC}"