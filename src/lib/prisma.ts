import { PrismaClient } from '@prisma/client';

// This helps extend the global type definition for the prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// In development, the 'global.prisma' is used to preserve the PrismaClient instance
// across hot reloads. In production, a new instance is always created.
const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

export default client;