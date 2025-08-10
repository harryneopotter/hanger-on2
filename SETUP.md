# Hanger On - Setup Instructions

## Quick Fix for Current Issues

The app is currently showing mock data (Sarah Johnson) because the database connection and authentication are not properly configured. Follow these steps to fix it:

### 1. Database Setup

You have two options:

#### Option A: Local PostgreSQL (Recommended for Development)
1. Install PostgreSQL on your machine
2. Create a database: `createdb hanger_on_dev`
3. Update the `DATABASE_URL` in `.env.local` to match your local setup

#### Option B: Use Supabase (Recommended for Production)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your database URL from the project settings
3. Update `.env.local` with your Supabase credentials

### 2. Environment Variables

The `.env.local` file has been created with development defaults. Update these values:

```env
# Required - Update with your actual database URL
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/hanger_on_dev"

# Required - Use a secure secret for production
NEXTAUTH_SECRET="your-secure-32-character-secret-key"

# Optional - Only needed if using Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Initialize Database

Run these commands to set up your database schema:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

## What Was Fixed

1. **Removed External API Dependencies**: 
   - Replaced failing `readdy.ai` image URLs with reliable Unsplash images
   - Added proper avatar fallback system using user initials
   - Replaced chart images with emoji placeholders

2. **Added Environment Configuration**:
   - Created `.env.local` with proper NextAuth configuration
   - Added database connection template

3. **Authentication Setup**:
   - NextAuth is configured for both credentials and Google OAuth
   - User creation and authentication flow is properly set up

## Next Steps

1. **For Production**: Set up Supabase or another PostgreSQL database
2. **For Images**: Configure Supabase Storage or another image storage service
3. **For 3-User Setup**: Create user accounts through the app's registration flow

## Troubleshooting

- **Still seeing Sarah Johnson?** - Database connection isn't working. Check your `DATABASE_URL`
- **Authentication errors?** - Make sure `NEXTAUTH_SECRET` is set and database tables exist
- **Can't connect to database?** - Verify PostgreSQL is running and connection string is correct

Run `npx prisma db push` to create the database tables if they don't exist yet.
