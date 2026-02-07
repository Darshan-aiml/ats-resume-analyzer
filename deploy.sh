#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying ATS Resume Analyzer to Vercel${NC}\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo -e "${BLUE}Installing Vercel CLI globally...${NC}\n"
    npm install -g vercel
fi

# Test build first
echo -e "${BLUE}📦 Testing production build...${NC}\n"
npm run build

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Build successful!${NC}\n"
else
    echo -e "\n${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}\n"
vercel --prod

echo -e "\n${GREEN}✨ Deployment complete!${NC}"
echo -e "${BLUE}Don't forget to set your environment variable:${NC}"
echo -e "vercel env add VITE_GEMINI_API_KEY"
