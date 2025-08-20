import { z } from 'zod';

const isProd = process.env.NODE_ENV === 'production';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: isProd ? z.string().url() : z.string().url().optional().or(z.literal('').optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isProd ? z.string().min(1) : z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: isProd ? z.string().min(1) : z.string().min(1).optional(),
  
  // Database
  DATABASE_URL: isProd ? z.string().url() : z.string().url().optional().or(z.literal('').optional()),
  
  // NextAuth
  NEXTAUTH_URL: isProd ? z.string().url() : z.string().url().optional().or(z.literal('').optional()),
  NEXTAUTH_SECRET: isProd ? z.string().min(1) : z.string().min(1).optional(),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: isProd ? z.string().min(1) : z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: isProd ? z.string().min(1) : z.string().min(1).optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsed.success) {
  if (isProd) {
    throw new Error('Invalid environment variables: ' + JSON.stringify(parsed.error.flatten(), null, 2));
  } else {
    console.warn('[env] Missing/invalid env vars in development:', parsed.error.flatten());
  }
}

export const env = (parsed.success ? parsed.data : ({} as any));
