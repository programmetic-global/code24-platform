#!/bin/bash

# Code24 Full Platform Deployment Script
# Deploys Elite Workers + React Frontend for complete staging.code24.dev

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}

echo -e "${PURPLE}🎯 Deploying Complete Code24 Platform${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Target: ${YELLOW}${ENVIRONMENT}.code24.dev${NC}"
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

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites met${NC}"
echo ""

# Phase 1: Deploy Elite Workers
echo -e "${PURPLE}🚀 PHASE 1: Deploying Elite Workers${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

if ./deploy-elite-workers.sh $ENVIRONMENT; then
    echo -e "${GREEN}✅ Elite Workers deployed successfully${NC}"
else
    echo -e "${RED}❌ Elite Workers deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}⏱️ Waiting for Elite Workers to stabilize...${NC}"
sleep 10

# Phase 2: Deploy Frontend
echo -e "${PURPLE}🚀 PHASE 2: Deploying React Frontend${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cd staging-frontend

if ./deploy.sh $ENVIRONMENT; then
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
    cd ..
else
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    cd ..
    exit 1
fi

# Phase 3: Full Platform Testing
echo -e "${PURPLE}🧪 PHASE 3: Full Platform Testing${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

PLATFORM_URL="https://${ENVIRONMENT}.code24.dev"

echo -e "${BLUE}Testing Platform Components...${NC}"

# Test Frontend
echo -e "${BLUE}🌐 Testing Frontend...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/" || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend: Online${NC}"
else
    echo -e "${RED}❌ Frontend: HTTP $FRONTEND_STATUS${NC}"
fi

# Test Elite Workers
echo -e "${BLUE}🎨 Testing Brand Worker...${NC}"
BRAND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/elite/brand/" || echo "000")
if [ "$BRAND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Brand Worker: Online${NC}"
else
    echo -e "${RED}❌ Brand Worker: HTTP $BRAND_STATUS${NC}"
fi

echo -e "${BLUE}👷 Testing Designer Worker...${NC}"
DESIGN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/elite/design/" || echo "000")
if [ "$DESIGN_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Designer Worker: Online${NC}"
else
    echo -e "${RED}❌ Designer Worker: HTTP $DESIGN_STATUS${NC}"
fi

echo -e "${BLUE}🏆 Testing Developer Worker...${NC}"
DEVELOP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PLATFORM_URL}/elite/develop/" || echo "000")
if [ "$DEVELOP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Developer Worker: Online${NC}"
else
    echo -e "${RED}❌ Developer Worker: HTTP $DEVELOP_STATUS${NC}"
fi

# Test API Integration
echo -e "${BLUE}🔗 Testing API Integration...${NC}"
if [ "$BRAND_STATUS" = "200" ] && [ "$DESIGN_STATUS" = "200" ] && [ "$DEVELOP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ All Elite Workers responding - API integration ready${NC}"
    
    # Run a live demo test
    echo -e "${BLUE}🎯 Running Live Demo Test...${NC}"
    DEMO_RESULT=$(curl -s -X POST "${PLATFORM_URL}/elite/brand/analyze" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://staging.code24.dev", "companyName": "Code24"}' \
        -w "%{http_code}" -o /dev/null || echo "000")
    
    if [ "$DEMO_RESULT" = "200" ]; then
        echo -e "${GREEN}✅ Live Demo: Working${NC}"
    else
        echo -e "${YELLOW}⚠️ Live Demo: HTTP $DEMO_RESULT (Workers may need time to initialize)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Some Elite Workers offline - Frontend will show status${NC}"
fi

echo ""
echo -e "${PURPLE}🎉 Code24 Platform Deployment Complete!${NC}"
echo -e "${PURPLE}════════════════════════════════════════════${NC}"
echo ""

# Calculate overall status
TOTAL_SERVICES=4
ONLINE_SERVICES=0

[ "$FRONTEND_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$BRAND_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$DESIGN_STATUS" = "200" ] && ((ONLINE_SERVICES++))
[ "$DEVELOP_STATUS" = "200" ] && ((ONLINE_SERVICES++))

PLATFORM_HEALTH=$((ONLINE_SERVICES * 100 / TOTAL_SERVICES))

echo -e "${GREEN}📊 Platform Health: ${PLATFORM_HEALTH}% (${ONLINE_SERVICES}/${TOTAL_SERVICES} services)${NC}"
echo ""

echo -e "${GREEN}🌟 Revolutionary Code24 Platform Live:${NC}"
echo ""
echo -e "${BLUE}🌐 Main Platform${NC}"
echo -e "   💫 Modern React application with Elite Workers integration"
echo -e "   📍 ${PLATFORM_URL}"
echo ""
echo -e "${BLUE}🎨 Elite Workers${NC}"
echo -e "   💫 Brand Worker - World-class brand intelligence"
echo -e "   📍 ${PLATFORM_URL}/elite/brand/*"
echo ""
echo -e "   💫 Designer Worker - Trendy, conversion-optimized design"
echo -e "   📍 ${PLATFORM_URL}/elite/design/*"
echo ""
echo -e "   💫 Developer Worker - Enterprise-grade development"
echo -e "   📍 ${PLATFORM_URL}/elite/develop/*"
echo ""

if [ "$PLATFORM_HEALTH" -ge 75 ]; then
    echo -e "${GREEN}🚀 Platform Ready for Demo and Testing!${NC}"
    echo ""
    echo -e "${PURPLE}📋 Try These Live Demos:${NC}"
    echo ""
    echo -e "${BLUE}Brand Analysis:${NC}"
    echo "curl -X POST '${PLATFORM_URL}/elite/brand/analyze' \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"url\": \"${PLATFORM_URL}\", \"companyName\": \"Code24\"}'"
    echo ""
    echo -e "${BLUE}Design Creation:${NC}"
    echo "curl -X POST '${PLATFORM_URL}/elite/design/create' \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"businessType\": \"saas\", \"industry\": \"technology\", \"targetAudience\": \"developers\", \"primaryGoal\": \"signups\"}'"
    echo ""
    echo -e "${BLUE}Code Analysis:${NC}"
    echo "curl -X POST '${PLATFORM_URL}/elite/develop/analyze' \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"codebase\": \"staging.code24.dev\", \"language\": \"typescript\"}'"
    echo ""
    echo -e "${GREEN}✨ This is what makes Code24 impossible to compete with!${NC}"
else
    echo -e "${YELLOW}⚠️ Some services need attention. Check logs and redeploy if needed.${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "Deploy Elite Workers only: ./deploy-elite-workers.sh ${ENVIRONMENT}"
echo "Deploy Frontend only: ./staging-frontend/deploy.sh ${ENVIRONMENT}"
echo "Full platform redeploy: ./deploy-full-platform.sh ${ENVIRONMENT}"
echo ""