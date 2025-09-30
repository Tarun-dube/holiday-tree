import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET all bookings for the current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        flight: true, // Optionally include related data
        hotel: true,
      },
      orderBy: {
        bookingDate: 'desc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new booking
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { flightId, hotelId, totalPrice, passengerDetails, amadeusBookingId } = body;

    // TODO: Here you would typically perform the actual booking with the Amadeus API
    // and get a real `amadeusBookingId` before saving to your database.
    
    const newBooking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        flightId,
        hotelId,
        totalPrice: parseFloat(totalPrice),
        passengerDetails,
        amadeusBookingId,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}