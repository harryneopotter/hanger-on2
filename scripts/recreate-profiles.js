const { PrismaClient } = require('../lib/generated/prisma');

async function recreateProfilesTable() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    console.log('🗑️ Dropping existing profiles table...');
    
    // Drop the profiles table if it exists
    await prisma.$executeRaw`DROP TABLE IF EXISTS "profiles" CASCADE;`;
    console.log('✅ Dropped profiles table');
    
    console.log('📋 Creating profiles table with correct structure...');
    
    // Create profiles table with exact structure from Prisma schema
    await prisma.$executeRaw`
      CREATE TABLE "profiles" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "email_verified" TIMESTAMP(3),
        "image" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('✅ Created profiles table with correct structure');
    
    // Add unique constraint on email
    await prisma.$executeRaw`
      ALTER TABLE "profiles" ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");
    `;
    
    console.log('✅ Added unique constraint on email');
    
    // Recreate foreign key constraints
    console.log('🔗 Recreating foreign key constraints...');
    
    // Update accounts table foreign key
    await prisma.$executeRaw`
      ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_user_id_fkey";
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;
    
    // Update sessions table foreign key
    await prisma.$executeRaw`
      ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;
    
    console.log('✅ Recreated foreign key constraints');
    
    console.log('🎉 Profiles table recreated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateProfilesTable();