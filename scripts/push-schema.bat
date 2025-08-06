@echo off
echo Setting up database schema...
npx prisma db push --accept-data-loss --force-reset
echo Done!
