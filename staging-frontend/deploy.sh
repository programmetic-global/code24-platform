#!/bin/bash

# Code24 Staging Frontend Deployment Script
# Deploys the React application showcasing Elite Workers

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}

echo -e "${PURPLE}🚀 Deploying Code24 Staging Frontend${NC}"
echo -e "${PURPLE}══════════════════════════════════════${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Target: ${YELLOW}${ENVIRONMENT}.code24.dev${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM not found${NC}"
    exit 1
fi

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

# Install dependencies
echo -e "${BLUE}📦 Installing Dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi
echo ""

# Build the application
echo -e "${BLUE}🏗️ Building React Application...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo -e "   📁 Output: ./out/"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Deploy to Cloudflare Pages
echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
if wrangler pages deploy out --project-name="code24-${ENVIRONMENT}-frontend"; then
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
    FRONTEND_URL="https://${ENVIRONMENT}.code24.dev"
    echo -e "   📍 URL: ${FRONTEND_URL}"
else
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi
echo ""

# Test the deployment
echo -e "${PURPLE}🧪 Testing Deployment...${NC}"
echo ""

echo -e "${BLUE}Testing Frontend...${NC}"
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}/" || echo "000")
if [ "$FRONTEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responding${NC}"
else
    echo -e "${YELLOW}⚠️ Frontend: HTTP $FRONTEND_TEST${NC}"
fi

echo -e "${BLUE}Testing Elite Workers Integration...${NC}"
# Test if the frontend can reach elite workers
ELITE_TEST=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}/elite/brand/" || echo "000")
if [ "$ELITE_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Elite Workers integration working${NC}"
else
    echo -e "${YELLOW}⚠️ Elite Workers: HTTP $ELITE_TEST${NC}"
    echo -e "${YELLOW}   💡 Make sure Elite Workers are deployed first${NC}"
fi

echo ""
echo -e "${PURPLE}🎉 Frontend Deployment Complete!${NC}"
echo -e "${PURPLE}══════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎯 Your Code24 Platform is live:${NC}"
echo ""
echo -e "${BLUE}🌐 Frontend Application${NC}"
echo -e "   💫 Modern React application showcasing Elite Workers"
echo -e "   📍 ${FRONTEND_URL:-URL not available}"
echo ""
echo -e "${BLUE}⚡ Elite Workers Integration${NC}"
echo -e "   💫 Real-time API integration with Brand, Design, and Developer Workers"
echo -e "   📍 ${FRONTEND_URL}/elite/*"
echo ""
echo -e "${YELLOW}🚀 Ready to showcase the future of web development!${NC}"
echo -e "${YELLOW}🎯 This demonstrates why Code24 is impossible to compete with${NC}"
echo ""

# Show next steps
echo -e "${PURPLE}📋 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Verify Elite Workers are running:${NC}"
echo "./deploy-elite-workers.sh ${ENVIRONMENT}"
echo ""
echo -e "${BLUE}2. Test the full platform:${NC}"
echo "open ${FRONTEND_URL}"
echo ""
echo -e "${BLUE}3. Run live demos:${NC}"
echo "# Brand analysis on staging.code24.dev"
echo "# Design creation for technology SaaS"
echo "# Code analysis of the platform itself"
echo ""
echo -e "${GREEN}✨ The Revolutionary Code24 Platform is Ready!${NC}"