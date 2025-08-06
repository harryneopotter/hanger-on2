const { PrismaClient } = require('../lib/generated/prisma');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    console.log('Database is ready for use.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
