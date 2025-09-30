import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { hotelId, rating, comment } = body;

    if (!hotelId || !rating) {
      return NextResponse.json({ error: 'Hotel ID and rating are required' }, { status: 400 });
    }

    // Business Logic: Verify the user has a confirmed booking for this hotel
    const booking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        hotelId: hotelId,
        status: 'CONFIRMED',
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "You can only review hotels you've booked." },
        { status: 403 } // Forbidden
      );
    }

    const newReview = await prisma.review.create({
      data: {
        userId: session.user.id,
        hotelId,
        rating: parseInt(rating),
        comment,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}