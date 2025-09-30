import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface IParams {
  params: { hotelId?: string };
}

export async function GET(request: Request, { params }: IParams) {
  const { hotelId } = params;

  if (!hotelId) {
    return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: {
        // Include user's name and image but not their email for privacy
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}