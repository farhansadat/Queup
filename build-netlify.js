#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

console.log('🚀 Starting Netlify build process...');

try {
  // Build the frontend
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Build the Netlify functions with better error handling
  console.log('⚡ Building Netlify functions...');
  execSync('esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outfile=netlify/functions/api.js --target=node18', { stdio: 'inherit' });

  // Verify files were created
  if (!existsSync('dist/public/index.html')) {
    throw new Error('Frontend build failed - index.html not found');
  }
  
  if (!existsSync('netlify/functions/api.js')) {
    throw new Error('Function build failed - api.js not found');
  }

  console.log('✅ Build complete! Files ready for Netlify deployment:');
  console.log('   📁 Frontend: dist/public/');
  console.log('   ⚡ Functions: netlify/functions/api.js');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}