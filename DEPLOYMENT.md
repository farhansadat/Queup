# Netlify Deployment Guide for QueueUp Pro

## Prerequisites

1. **Supabase Database**: Set up a PostgreSQL database on Supabase
2. **Netlify Account**: Create an account at netlify.com
3. **GitHub Repository**: Push your code to a GitHub repository

## Deployment Steps

### 1. Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Create a new project
3. Navigate to Settings → Database
4. Copy the connection string under "Connection string" → "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with your database password

### 2. Netlify Configuration

1. Connect your GitHub repository to Netlify
2. Set the following build settings:
   - **Build command**: `node build-netlify.js`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### 3. Environment Variables

In Netlify dashboard, go to Site settings → Environment variables and add:

**Required:**
```
DATABASE_URL=your_supabase_connection_string
ADMIN_PASSWORD=Admin@Sadat!
```

**Optional:**
```
SENDGRID_API_KEY=your_sendgrid_key_for_emails
```

**Important Notes:**
- The `DATABASE_URL` should be your complete Supabase connection string
- The `ADMIN_PASSWORD` is used for admin dashboard access (default: Admin@Sadat!)
- Do not include PGHOST, PGPORT, etc. individually - only DATABASE_URL is needed

### 4. Deploy

1. Push your code to GitHub
2. Netlify will automatically build and deploy
3. Your app will be available at `https://your-app-name.netlify.app`

## Database Migration

After deployment, run the database migration:

```bash
npm run db:push
```

## Features Ready for Production

- Complete queue management system
- Real-time WebSocket updates
- Multi-language support (English/German)
- Responsive mobile design
- Professional kiosk mode
- Admin dashboard with analytics
- QR code generation for mobile access

## Troubleshooting 502 Errors

If you encounter 502 errors after deployment:

### 1. Check Environment Variables
- Ensure `DATABASE_URL` is set correctly in Netlify
- Verify `ADMIN_PASSWORD` is set (default: Admin@Sadat!)
- Go to Site settings → Environment variables in Netlify dashboard

### 2. Check Function Logs
- Go to Netlify dashboard → Functions tab
- Click on your deployed function to view logs
- Look for error messages related to database connection

### 3. Database Connection Issues
- Verify your Supabase database is active
- Check that the connection string includes the correct password
- Ensure your Supabase project allows connections from Netlify

### 4. Admin Login Credentials
- Use password: `Admin@Sadat!` (case-sensitive)
- The admin system uses simple password authentication
- Token is stored in browser localStorage after successful login

### 5. Common Fixes
- Redeploy the site after setting environment variables
- Check that all required packages are in package.json
- Verify the Netlify function is properly bundled

## Post-Deployment Checklist

- [ ] Environment variables set in Netlify
- [ ] Database connection working (check function logs)
- [ ] Admin login functional with Admin@Sadat!
- [ ] API endpoints responding (test /api/health)
- [ ] Queue management functional
- [ ] QR codes generating proper URLs
- [ ] Mobile customer interface working
- [ ] Language selector functioning

## Support

For deployment issues, check:
1. Netlify build logs (Deploys → specific deploy → Function logs)
2. Function logs in Netlify dashboard (Functions tab)
3. Database connection in Supabase logs (Database → Logs)
4. Network tab in browser dev tools for API call status