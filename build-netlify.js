#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

// Build the frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Build the Netlify functions
console.log('Building Netlify functions...');
execSync('esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outfile=netlify/functions/api.js', { stdio: 'inherit' });

// Create a simple index.html redirect for SPA routing
const indexHtml = readFileSync('dist/public/index.html', 'utf8');
writeFileSync('dist/public/index.html', indexHtml);

console.log('Build complete! Ready for Netlify deployment.');