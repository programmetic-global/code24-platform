#!/bin/bash

# Code24 Simple Deployment Script
# Deploys Elite Workers + Frontend without complex routing

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}

echo -e "${PURPLE}🎯 Code24 Simple Deployment${NC}"
echo -e "${PURPLE}═══════════════════════════════════${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo ""

# Deploy Elite Workers with simple config
echo -e "${PURPLE}🚀 Deploying Elite Workers${NC}"
echo ""

# Brand Worker
echo -e "${BLUE}🎨 Deploying Brand Worker...${NC}"
cd brand-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Brand Worker deployed${NC}"
    BRAND_URL=$(wrangler whoami | head -1 | awk '{print "https://brand-worker-staging." $3}' || echo "Unknown")
    echo -e "   📍 URL: ${BRAND_URL}"
else
    echo -e "${RED}❌ Brand Worker failed${NC}"
fi
cd ..

# Designer Worker
echo -e "${BLUE}👷 Deploying Designer Worker...${NC}"
cd designer-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Designer Worker deployed${NC}"
    DESIGN_URL=$(wrangler whoami | head -1 | awk '{print "https://designer-worker-staging." $3}' || echo "Unknown")
    echo -e "   📍 URL: ${DESIGN_URL}"
else
    echo -e "${RED}❌ Designer Worker failed${NC}"
fi
cd ..

# Developer Worker
echo -e "${BLUE}🏆 Deploying Developer Worker...${NC}"
cd advanced-developer-worker
if wrangler deploy --config wrangler.simple.toml --env $ENVIRONMENT; then
    echo -e "${GREEN}✅ Developer Worker deployed${NC}"
    DEVELOP_URL=$(wrangler whoami | head -1 | awk '{print "https://advanced-developer-worker-staging." $3}' || echo "Unknown")
    echo -e "   📍 URL: ${DEVELOP_URL}"
else
    echo -e "${RED}❌ Developer Worker failed${NC}"
fi
cd ..

echo ""
echo -e "${PURPLE}🌐 Deploying Frontend${NC}"
echo ""

# Deploy Frontend
cd staging-frontend
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --silent

echo -e "${BLUE}🏗️ Building application...${NC}"
npm run build

echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
if wrangler pages deploy out --project-name="code24-staging-frontend" --compatibility-date="2023-10-16"; then
    echo -e "${GREEN}✅ Frontend deployed${NC}"
    FRONTEND_URL=$(wrangler pages project list | grep "code24-staging-frontend" | awk '{print $4}' || echo "https://code24-staging-frontend.pages.dev")
    echo -e "   📍 URL: ${FRONTEND_URL}"
else
    echo -e "${RED}❌ Frontend deployment failed${NC}"
fi
cd ..

echo ""
echo -e "${PURPLE}🎉 Deployment Complete!${NC}"
echo -e "${PURPLE}═══════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌟 Code24 Platform Deployed:${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC} ${FRONTEND_URL:-TBD}"
echo -e "${BLUE}Brand Worker:${NC} ${BRAND_URL:-TBD}"
echo -e "${BLUE}Designer Worker:${NC} ${DESIGN_URL:-TBD}"
echo -e "${BLUE}Developer Worker:${NC} ${DEVELOP_URL:-TBD}"
echo ""
echo -e "${YELLOW}🔧 Note: Workers are deployed on Cloudflare subdomains${NC}"
echo -e "${YELLOW}🔧 For custom domain routing, configure DNS and zones${NC}"
echo ""
echo -e "${GREEN}✨ The Revolutionary Code24 Platform is Live!${NC}"