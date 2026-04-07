#!/bin/bash
# ============================================================
#  PAUSEnPAY — Dependency Installer & Dev Server Launcher
#  Run: chmod +x install.sh && ./install.sh
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo ""
echo -e "${PURPLE}██████╗  █████╗ ██╗   ██╗███████╗███████╗"
echo -e "${PURPLE}██╔══██╗██╔══██╗██║   ██║██╔════╝██╔════╝"
echo -e "${PURPLE}██████╔╝███████║██║   ██║███████╗█████╗  "
echo -e "${PURPLE}██╔═══╝ ██╔══██║██║   ██║╚════██║██╔══╝  "
echo -e "${PURPLE}██║     ██║  ██║╚██████╔╝███████║███████╗"
echo -e "${PURPLE}╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝"
echo -e "${BLUE}         ██████╗ ██╗   ██╗"
echo -e "${BLUE}         ██╔══██╗██║   ██║"
echo -e "${BLUE}         ██████╔╝███████╔╝"
echo -e "${BLUE}         ██╔══██╗╚════██╔╝"
echo -e "${BLUE}         ██████╔╝     ██║ "
echo -e "${BLUE}         ╚═════╝      ╚═╝ ${NC}"
echo ""
echo -e "${GREEN}  Behavioral AI • Impulse Spending Prevention${NC}"
echo -e "${YELLOW}  ─────────────────────────────────────────${NC}"
echo ""

# Check Node.js
echo -e "${BLUE}[1/4] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"

# Check npm
echo -e "${BLUE}[2/4] Checking npm...${NC}"
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION found${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}[3/4] Installing dependencies...${NC}"
echo -e "${YELLOW}  Installing React 18, Framer Motion, Recharts, Zustand...${NC}"
npm install

echo ""
echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
echo ""

# Summary of what was installed
echo -e "${PURPLE}📦 Installed packages:${NC}"
echo "  • react ^18.2.0           — UI framework"
echo "  • react-router-dom ^6.22  — Client-side routing"
echo "  • framer-motion ^11.0.8   — Animations & transitions"
echo "  • recharts ^2.12.2        — Data visualization charts"
echo "  • lucide-react ^0.344.0   — Icon library"
echo "  • zustand ^4.5.2          — Lightweight state management"
echo "  • date-fns ^3.3.1         — Date utilities"
echo "  • clsx ^2.1.0             — Conditional classnames"
echo "  • vite ^5.1.4             — Build tool (dev server)"
echo ""

# Launch dev server
echo -e "${BLUE}[4/4] Starting PAUSEnPAY dev server...${NC}"
echo -e "${YELLOW}  Open: http://localhost:5173${NC}"
echo ""
npm run start
