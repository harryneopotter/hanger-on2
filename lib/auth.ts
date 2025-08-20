import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';
import { prisma } from './prisma';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: any[] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      // Find user by email in profiles table
      const user = await prisma.user.findUnique({ where: { email: credentials.email } });
      if (!user || !user.password) return null;
      // Compare password using bcrypt
      const bcrypt = require('bcryptjs');
      const valid = await bcrypt.compare(credentials.password, user.password);
      if (!valid) return null;
      return { 
        id: user.id, 
        name: user.name, 
        email: user.email,
      image: user.image 
      };
    }
  })
];

if (googleClientId && googleClientSecret) {
  providers.push(GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  }));
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('[auth] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set. Google login disabled in dev.');
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-expect-error - extend session user with id
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  // Disable debug to avoid hitting /api/auth/_log in dev
  debug: false,
};

export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}
