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
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### 3. Environment Variables

In Netlify dashboard, go to Site settings → Environment variables and add:

```
DATABASE_URL=your_supabase_connection_string
PGHOST=your_supabase_host
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_database_password
PGDATABASE=postgres
```

Optional:
```
SENDGRID_API_KEY=your_sendgrid_key_for_emails
```

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

## Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Authentication working
- [ ] Queue management functional
- [ ] QR codes generating proper URLs
- [ ] Mobile customer interface working
- [ ] Kiosk display mode operational
- [ ] Language selector functioning
- [ ] WebSocket real-time updates active

## Support

For deployment issues, check:
1. Netlify build logs
2. Function logs in Netlify dashboard
3. Database connection in Supabase logs