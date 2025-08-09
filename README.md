# Hanger On - Digital Wardrobe Manager

A privacy-focused digital wardrobe management application built with Next.js, helping you organize, track, and manage your clothing collection.

![Hanger On](./visual-verification.png)

## ✨ Features

### 👔 Wardrobe Management
- **Add & Edit Garments**: Complete garment details including category, material, color, size, brand, and care instructions
- **Image Upload**: Multiple images per garment with cropping capabilities
- **Status Tracking**: Track garment status (Clean, Worn, Dirty, Needs Washing)
- **Categories**: Organize by clothing categories (Shirts, Pants, Shoes, etc.)

### 🏷️ Smart Organization
- **Tags System**: Create custom tags for advanced organization
- **Collections**: Create regular and smart collections with rule-based automation
- **Search & Filter**: Powerful search and filtering by category, status, tags, and more
- **Smart Collections**: Auto-populate collections based on rules (e.g., all red shirts)

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Guest Mode**: Try the app without creating an account
- **Progressive Web App**: Install as an app on your device

### 📊 Analytics & Insights
- **Statistics Dashboard**: Track your wardrobe metrics and usage patterns
- **Visual Charts**: See your collection breakdown by category, color, and status

## 🚀 Technology Stack

- **Frontend**: Next.js 15.3.2, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and email/password
- **Image Storage**: Supabase for secure image hosting
- **State Management**: SWR for efficient data fetching
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Deployment**: Optimized for Vercel deployment

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Supabase account (for image storage)
- Google OAuth app (optional, for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harryneopotter/hanger-on2.git
   cd hanger-on2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/hanger_on"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Supabase (for image storage)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:safe   # Build with optimized settings

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run check-format # Check code formatting
npm run check        # Run all checks (lint + format + test)

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ui      # Run tests with UI
```

## 🏗️ Project Structure

```
hanger-on2/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── account/           # User account management
│   ├── add/               # Add/Edit garment page
│   ├── collections/       # Collections management
│   ├── login/             # Authentication
│   └── ...
├── components/            # React components
│   ├── features/          # Feature-specific components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── services/         # API service classes
│   ├── validation/       # Zod schemas
│   └── ...
├── types/                # TypeScript type definitions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── src/test/            # Test files
```

## 🔧 Key Components

### Core Features
- **GarmentCard**: Display garment with image, status, and actions
- **GarmentForm**: Add/edit garment with validation
- **CompactFilterBar**: Advanced search and filtering
- **CollectionForm**: Create and manage collections
- **TagSelector**: Tag management interface

### UI Components
- **Header**: Navigation with theme toggle and user menu
- **Layout**: Responsive layout wrapper
- **EmptyState**: User-friendly empty states
- **LoadingSpinner**: Loading indicators

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Unit tests
npm run test

# E2E tests
npx playwright test

# Visual regression tests
npm run test:visual
```

### Test Coverage
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Full user flow testing with Playwright
- **Visual Tests**: Screenshot comparison testing

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
docker build -t hanger-on .
docker run -p 3000:3000 hanger-on
```

## 🛡️ Security & Privacy

- **Privacy-focused**: All data stays in your database
- **Secure authentication**: NextAuth.js with secure session management
- **Image security**: Secure image upload and storage with Supabase
- **Input validation**: Comprehensive validation with Zod schemas
- **SQL injection protection**: Prisma ORM with parameterized queries

## 📱 Progressive Web App

Hanger On is a full PWA with:
- **Offline capability**: Works without internet connection
- **App installation**: Install on mobile/desktop
- **Push notifications**: Coming soon
- **Background sync**: Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: Lucide React for beautiful icons
- **UI Components**: Custom components built with Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **Animations**: Framer Motion for smooth interactions

## 🐛 Known Issues

- Prisma generation requires internet connection for first setup
- Some test files may need updating for latest dependencies
- Guest mode has limited functionality

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Hanger On** - Making wardrobe management simple and enjoyable! 👔✨