import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic"; // Ensure this route is treated as dynamic in export mode

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
