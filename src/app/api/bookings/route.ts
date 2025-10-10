import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { bookingDate: 'desc' },
  });

  return NextResponse.json(bookings);
}
