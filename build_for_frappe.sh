#!/bin/bash

# Build script for Frappe deployment

echo "Building Azab Shop Revive for Frappe..."

# Install dependencies
npm install

# Build using Frappe-specific config
npm run build:frappe

# Copy built files to public directory
mkdir -p azab_shop_revive/public/dist
cp -r dist/* azab_shop_revive/public/dist/

# Create symbolic links for assets
cd azab_shop_revive/public
ln -sf ../../dist assets

echo "Build completed successfully!"
echo "Files are ready for Frappe Bench deployment."