# Deployment Guide

This guide covers deploying the Hanger On application to production using Vercel with Supabase as the database backend.

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account with this repository
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Supabase project (create at [supabase.com](https://supabase.com))
- [ ] Google OAuth credentials (if using Google login)

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region close to your users
4. Save your project credentials:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (from Settings > API)
   - **Service Role Key** (from Settings > API - keep this secret!)
   - **Database URL** (from Settings > Database > Connection String > URI)

### 2. Run Database Migrations

From your local machine:

```bash
# Set your Supabase database URL
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
npx prisma db push

# Verify tables were created
npx prisma studio
```

---

## Google OAuth Setup (Optional)

If you want to enable Google OAuth login:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure consent screen if not already done
6. Application type: "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
8. Save your credentials:
   - **Client ID**
   - **Client Secret**

---

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select this repository
4. Click "Import"

### Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

**Required Variables:**

```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Generate NEXTAUTH_SECRET:**

```bash
# On your local machine
openssl rand -base64 32
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your deployment URL and test:

- [ ] Home page loads
- [ ] Authentication works (email/password or Google)
- [ ] Can create a garment
- [ ] Can create a collection
- [ ] Can create tags
- [ ] Images upload successfully

### 2. Set Up Custom Domain (Optional)

In Vercel project settings:
1. Go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs

### 3. Monitor Application

- Check Vercel deployment logs for errors
- Monitor Supabase dashboard for database usage
- Set up alerts for errors (see Monitoring section below)

---

## CI/CD Pipeline

The repository has GitHub Actions configured for automatic testing and deployment.

### Workflows

**`.github/workflows/ci.yml`** - Runs on every push:
- Linting and type checking
- Unit tests with coverage
- E2E tests with Playwright
- Security scanning

**`.github/workflows/deploy.yml`** - Runs on main branch:
- Automatic production deployment
- Preview deployments for PRs

### Required GitHub Secrets

Add these in GitHub repository settings > Secrets and variables > Actions:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
CODECOV_TOKEN=your_codecov_token (optional)
```

**Get Vercel tokens:**
1. Go to Vercel > Settings > Tokens
2. Create a new token
3. Find ORG_ID and PROJECT_ID in `.vercel/project.json` after first `vercel` CLI deployment

---

## Environment-Specific Configuration

### Development

Use `.env.local` file:

```bash
cp .env.example .env.local
# Edit .env.local with your local values
```

### Staging/Preview

Vercel automatically creates preview deployments for pull requests. Configure preview-specific environment variables in Vercel dashboard.

### Production

Use Vercel's production environment variables. Never commit secrets to git!

---

## Database Management

### Running Migrations

After schema changes:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name your_migration_name
```

### Backup Database

Supabase provides automatic backups. To create manual backup:

1. Go to Supabase dashboard
2. Navigate to Database > Backups
3. Click "Create Backup"

### Restore Database

```bash
# Download backup from Supabase
# Restore using psql
psql $DATABASE_URL < backup.sql
```

---

## Monitoring and Observability

### Vercel Analytics

Enable in Vercel dashboard:
1. Project Settings > Analytics
2. Enable Web Analytics

### Error Tracking (Recommended)

Set up Sentry for production error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add Sentry DSN to environment variables:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### Logging

Application uses console.log for logging. In production, logs are available in:
- Vercel dashboard > Deployments > [deployment] > Functions
- Supabase dashboard > Logs

---

## Performance Optimization

### Image Optimization

Images are currently unoptimized (`next.config.ts`). For production:

1. Consider enabling Next.js image optimization
2. Use Supabase Storage CDN for image delivery
3. Implement image compression before upload

### Database Performance

Monitor Supabase dashboard for:
- Query performance
- Connection pooling usage
- Database size

### Caching

Consider adding caching for:
- User garment lists
- Collection data
- Tag lists

Use SWR (already configured) with appropriate cache times.

---

## Security Checklist

Before going live:

- [ ] Environment variables are set correctly
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database credentials are not exposed
- [ ] Google OAuth redirect URIs match your domain
- [ ] Security headers are configured (already done in next.config.ts)
- [ ] Row Level Security (RLS) policies enabled in Supabase
- [ ] CORS is properly configured
- [ ] Rate limiting considered for API routes

---

## Troubleshooting

### Build Fails

**Error:** "Module not found" or "Type errors"
- Solution: Check `package.json` dependencies are installed
- Note: Build error suppression is enabled for MVP (see next.config.ts)

**Error:** "Prisma client not generated"
- Solution: Run `npx prisma generate` before build
- This is automated in `vercel-build` script

### Database Connection Issues

**Error:** "Can't reach database server"
- Check `DATABASE_URL` format is correct
- Verify Supabase project is running
- Check IP allowlist in Supabase (should allow all for Vercel)

### Authentication Not Working

**Error:** "Configuration error" from NextAuth
- Check `NEXTAUTH_URL` matches your deployment URL
- Verify `NEXTAUTH_SECRET` is set
- Check Google OAuth credentials if using Google login

### Images Not Uploading

**Error:** "Failed to upload image"
- Check Supabase Storage bucket exists
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check storage bucket policies allow uploads

---

## Rollback Procedure

If deployment has issues:

### Via Vercel Dashboard

1. Go to Deployments
2. Find last working deployment
3. Click "..." > "Promote to Production"

### Via Vercel CLI

```bash
vercel rollback
```

### Via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

---

## Scaling Considerations

### Current Setup (Vercel + Supabase)

- Supports: 3-10 concurrent users
- Database: Supabase free tier (500MB)
- Functions: Vercel hobby tier (serverless)

### If Scaling Needed

**For 10-100 users:**
- Upgrade Supabase to Pro ($25/month)
- Enable database connection pooling
- Add caching layer (Redis/Upstash)

**For 100+ users:**
- Upgrade Vercel to Pro
- Consider dedicated database
- Implement CDN for images
- Add rate limiting

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check error logs in Vercel
- [ ] Review Supabase database usage
- [ ] Test critical user flows

**Monthly:**
- [ ] Update dependencies (`npm outdated`)
- [ ] Review and clean up old deployments
- [ ] Check database backup status
- [ ] Review security advisories

**Quarterly:**
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review

---

## Support and Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org

**Community:**
- Next.js Discord
- Supabase Discord
- GitHub Issues (this repository)

---

## Quick Reference

### Common Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database operations
npx prisma studio          # View database
npx prisma generate        # Generate client
npx prisma db push         # Push schema changes
npx prisma migrate dev     # Create migration

# Deployment
vercel                     # Deploy to Vercel
vercel --prod              # Deploy to production
```

### Environment Variables Template

```bash
# Copy this to .env.local for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/hanger_on_dev"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_32_character_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

---

**Last Updated:** 2025-11-27
**Version:** 1.0
**Maintainer:** Development Team
