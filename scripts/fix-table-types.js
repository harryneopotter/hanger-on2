const { PrismaClient } = require('../lib/generated/prisma');

async function fixTableTypes() {
  const prisma = new PrismaClient();

  try {
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    console.log('🔍 Checking existing table structures...');

    // Check accounts table structure
    const accountsInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'accounts' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    console.log('Accounts table structure:', accountsInfo);

    // Check sessions table structure
    const sessionsInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'sessions' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    console.log('Sessions table structure:', sessionsInfo);

    console.log('🗑️ Dropping and recreating all tables with consistent types...');

    // Drop all tables in correct order (foreign keys first)
    await prisma.$executeRaw`DROP TABLE IF EXISTS "accounts" CASCADE;`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "sessions" CASCADE;`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "profiles" CASCADE;`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "verification_tokens" CASCADE;`;

    console.log('✅ Dropped all tables');

    // Create profiles table first (referenced by others)
    await prisma.$executeRaw`
      CREATE TABLE "profiles" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "email_verified" TIMESTAMP(3),
        "image" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "profiles_email_key" UNIQUE ("email")
      );
    `;

    console.log('✅ Created profiles table');

    // Create accounts table with TEXT user_id to match profiles.id
    await prisma.$executeRaw`
      CREATE TABLE "accounts" (
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
        CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "accounts_provider_provider_account_id_key" UNIQUE ("provider", "provider_account_id")
      );
    `;

    console.log('✅ Created accounts table');

    // Create sessions table with TEXT user_id to match profiles.id
    await prisma.$executeRaw`
      CREATE TABLE "sessions" (
        "id" TEXT NOT NULL,
        "session_token" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "sessions_session_token_key" UNIQUE ("session_token"),
        CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    console.log('✅ Created sessions table');

    // Create verification_tokens table
    await prisma.$executeRaw`
      CREATE TABLE "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "verification_tokens_token_key" UNIQUE ("token"),
        CONSTRAINT "verification_tokens_identifier_token_key" UNIQUE ("identifier", "token")
      );
    `;

    console.log('✅ Created verification_tokens table');

    console.log('🎉 All tables recreated with consistent types!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTableTypes();
