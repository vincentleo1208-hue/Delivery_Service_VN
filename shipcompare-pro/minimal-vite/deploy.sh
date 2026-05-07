#!/bin/bash

# ShipCompare Pro - Minimal Vite Deployment Script
# This script helps you quickly start the development server or build for production

set -e

echo "🚢 ShipCompare Pro - Minimal Vite Setup"
echo "========================================"
echo ""

cd "$(dirname "$0")"

case "${1:-dev}" in
  dev)
    echo "🔧 Starting development server..."
    echo ""
    npm run dev
    ;;
  
  build)
    echo "📦 Building for production..."
    echo ""
    npm run build
    echo ""
    echo "✅ Build complete!"
    echo "📁 Output directory: dist/"
    echo "📊 Size: $(du -sh dist/ | cut -f1)"
    ;;
  
  preview)
    echo "👀 Previewing production build..."
    echo ""
    npm run preview
    ;;
  
  clean)
    echo "🧹 Cleaning up..."
    rm -rf dist/
    rm -rf node_modules/
    rm -f package-lock.json
    echo "✅ Cleaned up!"
    ;;
  
  install)
    echo "📥 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    ;;
  
  *)
    echo "Usage: $0 {dev|build|preview|clean|install}"
    echo ""
    echo "Commands:"
    echo "  dev      - Start development server (default)"
    echo "  build    - Build for production"
    echo "  preview  - Preview production build"
    echo "  clean    - Remove dist, node_modules, and package-lock.json"
    echo "  install  - Install dependencies"
    exit 1
    ;;
esac
