# Hanger On Development Setup Script
# This script helps fix the authentication and database connection issues

Write-Host "🔧 Hanger On Development Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ Environment file found: .env.local" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found! Please create it first." -ForegroundColor Red
    Write-Host "📝 Copy .env.example to .env.local and update the values" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "🔨 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Try to push database schema
Write-Host "🗄️  Setting up database schema..." -ForegroundColor Blue
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database setup failed. This is likely due to:" -ForegroundColor Yellow
    Write-Host "   • PostgreSQL not running" -ForegroundColor Yellow
    Write-Host "   • Incorrect DATABASE_URL in .env.local" -ForegroundColor Yellow
    Write-Host "   • Database doesn't exist" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Install PostgreSQL if not already installed" -ForegroundColor White
    Write-Host "   2. Create database: createdb hanger_on_dev" -ForegroundColor White
    Write-Host "   3. Update DATABASE_URL in .env.local" -ForegroundColor White
    Write-Host "   4. Run this script again" -ForegroundColor White
} else {
    Write-Host "✅ Database schema created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Setup complete! You can now:" -ForegroundColor Green
    Write-Host "   • Run 'npm run dev' to start the development server" -ForegroundColor White
    Write-Host "   • Open 'npx prisma studio' to view your database" -ForegroundColor White
    Write-Host "   • Create user accounts through the app" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 For more help, see SETUP.md" -ForegroundColor Cyan
