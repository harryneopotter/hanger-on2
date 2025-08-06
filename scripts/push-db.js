const { execSync } = require('child_process');
const { PrismaClient } = require('../lib/generated/prisma');

async function pushSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    console.log('📋 Pushing database schema...');
    
    // Use the Prisma client to execute raw SQL to create tables
    console.log('Creating tables manually...');
    
    // Create accounts table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "provider_account_id" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('✅ Created accounts table');
    
    // Create sessions table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL,
        "session_token" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('✅ Created sessions table');
    
    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "email_verified" TIMESTAMP(3),
        "image" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('✅ Created users table');
    
    // Create verification_tokens table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      );
    `;
    
    console.log('✅ Created verification_tokens table');
    
    console.log('🎉 Basic tables created! You can now enable RLS in Supabase dashboard.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

pushSchema();
