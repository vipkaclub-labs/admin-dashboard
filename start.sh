#!/usr/bin/env bash

# ==============================================================================
# KakaClub Admin Dashboard - Startup Script
# Next.js 14 App Router + pnpm
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BLUE}${BOLD}========================================${NC}"
echo -e "${BLUE}${BOLD}   KakaClub Admin Dashboard Launcher    ${NC}"
echo -e "${BLUE}${BOLD}========================================${NC}"

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 22+.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# 2. Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Attempting to enable via corepack...${NC}"
    if command -v corepack &> /dev/null; then
        corepack enable
        corepack prepare pnpm@latest --activate
    else
        echo -e "${YELLOW}Corepack not available. Installing pnpm globally via npm...${NC}"
        npm install -g pnpm
    fi
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v) detected${NC}"

# 3. Check environment file (.env)
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file. Please review your settings if needed.${NC}"
    else
        echo -e "${YELLOW}⚠️  Creating default .env file...${NC}"
        cat <<EOF > .env
NEXT_PUBLIC_API_BASE_URL=https://backend-api.vipka.club/api
EOF
        echo -e "${GREEN}✓ Created default .env (API: https://backend-api.vipka.club/api)${NC}"
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# 4. Check dependencies (node_modules)
if [ ! -d "node_modules" ] || [ "pnpm-lock.yaml" -nt "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies with pnpm...${NC}"
    pnpm install
fi

PORT="${PORT:-3001}"
MODE="${1:-dev}"

case "$MODE" in
    dev|start:dev)
        echo -e "${GREEN}${BOLD}🚀 Starting Admin Dashboard in development mode (http://localhost:${PORT})...${NC}"
        exec pnpm next dev -p "$PORT"
        ;;
    prod|start:prod)
        echo -e "${BLUE}🔨 Building production Next.js bundle...${NC}"
        pnpm build
        echo -e "${GREEN}${BOLD}🚀 Starting Admin Dashboard in production mode (http://localhost:${PORT})...${NC}"
        exec pnpm start
        ;;
    build)
        echo -e "${BLUE}🔨 Building production bundle...${NC}"
        pnpm build
        echo -e "${GREEN}✓ Build completed.${NC}"
        ;;
    check|typecheck)
        echo -e "${BLUE}🔍 Running TypeScript check...${NC}"
        pnpm typecheck
        ;;
    help|--help|-h)
        echo -e ""
        echo -e "Usage: ./start.sh [mode]"
        echo -e ""
        echo -e "Modes:"
        echo -e "  dev        (default) Start Next.js in development mode with hot-reload"
        echo -e "  prod       Build and start in Next.js production mode"
        echo -e "  build      Build Next.js production bundle"
        echo -e "  typecheck  Run TypeScript type checker"
        echo -e "  help       Show this help menu"
        echo -e ""
        ;;
    *)
        echo -e "${RED}❌ Unknown mode: $MODE${NC}"
        echo -e "Run ${BOLD}./start.sh help${NC} for available options."
        exit 1
        ;;
esac
