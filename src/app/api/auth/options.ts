import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { AuthOptions, SessionStrategy } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) {
          throw new Error('No user found with that email or user signed up with a social account.');
        }
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error('Incorrect password');
        }
        return user as any;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' as SessionStrategy },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = (user as any).id;
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) (session.user as any).id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


