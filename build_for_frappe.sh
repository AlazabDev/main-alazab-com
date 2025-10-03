#!/bin/bash

# Build script for Frappe deployment
# This script builds the React frontend and copies it to Frappe's public directory

set -e  # Exit on error

echo "================================"
echo "Building Alazab Shop for Frappe"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "alazab_shop/hooks.py" ]; then
    echo -e "${RED}Error: Must run from project root directory${NC}"
    exit 1
fi

# Step 1: Install frontend dependencies
echo -e "\n${YELLOW}Step 1/4: Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for the first time..."
    npm install
else
    echo "Dependencies already installed, skipping..."
fi

# Step 2: Build the React app
echo -e "\n${YELLOW}Step 2/4: Building React application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Step 3: Copy built files to Frappe public directory
echo -e "\n${YELLOW}Step 3/4: Copying built files to Frappe...${NC}"
cd ..

# Create target directory if it doesn't exist
mkdir -p alazab_shop/public/dist

# Remove old build files
rm -rf alazab_shop/public/dist/*

# Copy new build files
cp -r frontend/dist/* alazab_shop/public/dist/

echo -e "${GREEN}✓ Files copied successfully${NC}"

# Step 4: Create symbolic links for easier access
echo -e "\n${YELLOW}Step 4/4: Creating symbolic links...${NC}"
cd alazab_shop/public

# Remove old symlink if exists
if [ -L "assets" ]; then
    rm assets
fi

# Create new symlink
ln -sf dist/assets assets

echo -e "${GREEN}✓ Symbolic links created${NC}"

# Back to root
cd ../..

# Display summary
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Built files location:"
echo "  • alazab_shop/public/dist/"
echo ""
echo "Next steps:"
echo "  1. If not already added to bench:"
echo "     ${YELLOW}bench get-app /path/to/alazab_shop${NC}"
echo ""
echo "  2. Install the app:"
echo "     ${YELLOW}bench --site [your-site] install-app alazab_shop${NC}"
echo ""
echo "  3. Clear cache and restart:"
echo "     ${YELLOW}bench --site [your-site] clear-cache${NC}"
echo "     ${YELLOW}bench restart${NC}"
echo ""
echo "  4. Access your app at:"
echo "     ${YELLOW}http://[your-site]/alazab-dashboard${NC}"
echo ""
