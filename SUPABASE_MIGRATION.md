# Supabase Migration Guide

## Overview
The application has been migrated from Neon to Supabase PostgreSQL. All database schema and functionality remain identical.

## Changes Made
- ✅ Updated database driver from `@neondatabase/serverless` to `postgres`
- ✅ Configured SSL connection for Supabase compatibility
- ✅ Added connection pooling settings
- ✅ Fixed UI text visibility issues in registration forms
- ✅ QR codes dynamically adapt to deployment domain

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Create a new project
3. Wait for database initialization (2-3 minutes)

### 2. Get Database URL
1. In your Supabase project, click "Connect" in the top toolbar
2. Select "Connection string" tab
3. Copy the "Transaction pooler" URI
4. Replace `[YOUR-PASSWORD]` with your actual database password

### 3. Update Environment Variable
Replace the current DATABASE_URL environment variable with your Supabase connection string:
```
DATABASE_URL=postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 4. Push Database Schema
Run this command to create all tables in Supabase:
```bash
npm run db:push
```

## QR Code Compatibility
✅ **QR codes are fully dynamic and will automatically work with any deployment domain:**
- Development: localhost:5000
- Replit: your-app.replit.app
- Netlify: your-domain.netlify.app
- Custom domain: your-custom-domain.com

The QR codes use `window.location.host` and `window.location.origin`, so they adapt automatically to whatever domain the application is served from.

## Verification
After updating the DATABASE_URL:
1. Application will restart automatically
2. Database tables will be created via `npm run db:push`
3. Registration and login will work with Supabase
4. All existing functionality remains identical