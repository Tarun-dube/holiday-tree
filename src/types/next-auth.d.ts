import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the default session and user types
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getServerSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database id. */
      id: string;
    } & DefaultSession['user']; // Inherit the default properties (name, email, image)
  }

  interface User extends DefaultUser {
    /** The user's database id. */
    id: string;
  }
}

// Extend the JWT type to include the user's id
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's database id. */
    id: string;
  }
}