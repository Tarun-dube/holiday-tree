import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  // Use the Prisma adapter to connect NextAuth to your database
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('No user found with that email or user signed up with a social account.');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Incorrect password');
        }
        
        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
    // ADD THIS CALLBACKS OBJECT
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    jwt: async ({ token, user }) => {
      // If the user object exists (e.g., on sign in), add the id to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    session: async ({ session, token }) => {
      // Add the id from the token to the session's user object
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

