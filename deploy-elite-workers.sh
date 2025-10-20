#!/bin/bash

# Code24 Elite Workers Deployment Script
# Deploys the creative & strategic AI workers that make Code24 revolutionary

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}

echo -e "${PURPLE}🎯 Deploying Code24 Elite Workers${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
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

echo -e "${GREEN}✅ Prerequisites met${NC}"
echo ""

# Deploy Elite Workers in order
echo -e "${PURPLE}🚀 Deploying Elite Worker Trinity...${NC}"
echo ""

# 1. Brand Worker (First - provides identity foundation)
echo -e "${BLUE}🎨 Deploying Brand Worker - 'Best Brand Worker in the World'${NC}"
cd brand-worker
if npm run build 2>/dev/null || true; then
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Brand Worker deployed successfully${NC}"
        BRAND_WORKER_URL="https://${ENVIRONMENT}.code24.dev/elite/brand"
        echo -e "   📍 Endpoint: ${BRAND_WORKER_URL}"
    else
        echo -e "${RED}❌ Brand Worker deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No build script found, deploying source directly${NC}"
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Brand Worker deployed successfully${NC}"
    else
        echo -e "${RED}❌ Brand Worker deployment failed${NC}"
        exit 1
    fi
fi
cd ..
echo ""

# 2. Designer Worker (Second - uses brand foundation)
echo -e "${BLUE}👷 Deploying Designer Worker - 'Best Designer in the World'${NC}"
cd designer-worker
if npm run build 2>/dev/null || true; then
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Designer Worker deployed successfully${NC}"
        DESIGNER_WORKER_URL="https://${ENVIRONMENT}.code24.dev/elite/design"
        echo -e "   📍 Endpoint: ${DESIGNER_WORKER_URL}"
    else
        echo -e "${RED}❌ Designer Worker deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No build script found, deploying source directly${NC}"
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Designer Worker deployed successfully${NC}"
    else
        echo -e "${RED}❌ Designer Worker deployment failed${NC}"
        exit 1
    fi
fi
cd ..
echo ""

# 3. Advanced Developer Worker (Third - implements brand + design)
echo -e "${BLUE}🏆 Deploying Advanced Developer Worker - 'Best Web Developer in the World'${NC}"
cd advanced-developer-worker
if npm run build 2>/dev/null || true; then
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Advanced Developer Worker deployed successfully${NC}"
        DEVELOPER_WORKER_URL="https://${ENVIRONMENT}.code24.dev/elite/develop"
        echo -e "   📍 Endpoint: ${DEVELOPER_WORKER_URL}"
    else
        echo -e "${RED}❌ Advanced Developer Worker deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No build script found, deploying source directly${NC}"
    if wrangler deploy --env $ENVIRONMENT; then
        echo -e "${GREEN}✅ Advanced Developer Worker deployed successfully${NC}"
    else
        echo -e "${RED}❌ Advanced Developer Worker deployment failed${NC}"
        exit 1
    fi
fi
cd ..
echo ""

# Test Elite Workers
echo -e "${PURPLE}🧪 Testing Elite Workers...${NC}"
echo ""

# Test Brand Worker
echo -e "${BLUE}Testing Brand Worker...${NC}"
BRAND_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://${ENVIRONMENT}.code24.dev/elite/brand/" || echo "000")
if [ "$BRAND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Brand Worker responding${NC}"
else
    echo -e "${YELLOW}⚠️  Brand Worker: HTTP $BRAND_TEST${NC}"
fi

# Test Designer Worker  
echo -e "${BLUE}Testing Designer Worker...${NC}"
DESIGNER_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://${ENVIRONMENT}.code24.dev/elite/design/" || echo "000")
if [ "$DESIGNER_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Designer Worker responding${NC}"
else
    echo -e "${YELLOW}⚠️  Designer Worker: HTTP $DESIGNER_TEST${NC}"
fi

# Test Developer Worker
echo -e "${BLUE}Testing Advanced Developer Worker...${NC}"
DEVELOPER_TEST=$(curl -s -o /dev/null -w "%{http_code}" "https://${ENVIRONMENT}.code24.dev/elite/develop/" || echo "000")
if [ "$DEVELOPER_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Advanced Developer Worker responding${NC}"
else
    echo -e "${YELLOW}⚠️  Advanced Developer Worker: HTTP $DEVELOPER_TEST${NC}"
fi

echo ""
echo -e "${PURPLE}🎉 Elite Workers Deployment Complete!${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎯 The Creative & Strategic AI that makes Code24 revolutionary:${NC}"
echo ""
echo -e "${BLUE}🎨 Brand Worker${NC} - Elite brand intelligence"
echo -e "   💫 Creates world-class brand identities"
echo -e "   📍 ${BRAND_WORKER_URL:-Endpoint not available}"
echo ""
echo -e "${BLUE}👷 Designer Worker${NC} - Elite design intelligence"  
echo -e "   💫 Creates trendy, conversion-optimized designs"
echo -e "   📍 ${DESIGNER_WORKER_URL:-Endpoint not available}"
echo ""
echo -e "${BLUE}🏆 Advanced Developer Worker${NC} - Elite development intelligence"
echo -e "   💫 Creates enterprise-grade code architecture"
echo -e "   📍 ${DEVELOPER_WORKER_URL:-Endpoint not available}"
echo ""
echo -e "${YELLOW}🚀 Ready to test on ${ENVIRONMENT}.code24.dev${NC}"
echo -e "${YELLOW}🎯 These Elite Workers are what make Code24 impossible to compete with${NC}"
echo ""

# Show usage examples
echo -e "${PURPLE}📋 Usage Examples:${NC}"
echo ""
echo -e "${BLUE}Brand Analysis:${NC}"
echo "curl -X POST 'https://${ENVIRONMENT}.code24.dev/elite/brand/analyze' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"url\": \"https://${ENVIRONMENT}.code24.dev\", \"companyName\": \"Code24\"}'"
echo ""
echo -e "${BLUE}Design Creation:${NC}"
echo "curl -X POST 'https://${ENVIRONMENT}.code24.dev/elite/design/create' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"businessType\": \"saas\", \"industry\": \"technology\", \"targetAudience\": \"developers\", \"primaryGoal\": \"signups\"}'"
echo ""
echo -e "${BLUE}Code Analysis:${NC}"
echo "curl -X POST 'https://${ENVIRONMENT}.code24.dev/elite/develop/analyze' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"codebase\": \"staging.code24.dev\", \"language\": \"html\"}'"
echo ""
echo -e "${GREEN}✨ The Elite Workers are now ready to revolutionize websites!${NC}"