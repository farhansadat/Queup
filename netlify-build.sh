#!/bin/bash
echo "🚀 Starting Netlify build process..."

# Build the frontend
echo "📦 Building frontend..."
npm run build:frontend

# Build the Netlify functions
echo "⚡ Building Netlify functions..."
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outfile=netlify/functions/api.js --target=node20 --external:postgres --external:bcrypt

# Verify files were created
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Frontend build failed - index.html not found"
    exit 1
fi

if [ ! -f "netlify/functions/api.js" ]; then
    echo "❌ Function build failed - api.js not found"
    exit 1
fi

echo "✅ Build complete! Files ready for Netlify deployment:"
echo "   📁 Frontend: dist/public/"
echo "   ⚡ Functions: netlify/functions/api.js"