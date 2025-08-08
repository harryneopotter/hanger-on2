const { PrismaClient } = require('../lib/generated/prisma');

async function addPasswordColumn() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    console.log('📋 Adding password column to profiles table...');
    
    // Add password column to profiles table
    await prisma.$executeRaw`
      ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "password" TEXT;
    `;
    
    console.log('✅ Added password column to profiles table');
    
    console.log('🎉 Database schema updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPasswordColumn();