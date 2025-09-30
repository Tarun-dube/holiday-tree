import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

interface IParams {
  params: { bookingId?: string };
}

// GET a single booking by ID
export async function GET(request: Request, { params }: IParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookingId } = params;
  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  try {
    // Crucially, we check that the booking also belongs to the current user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE (cancel) a booking
export async function DELETE(request: Request, { params }: IParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookingId } = params;
  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }
  
  try {
    // Ensure the booking exists and belongs to the user before deleting/canceling
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or you do not have permission to cancel it' }, { status: 404 });
    }
    
    // TODO: Here you would call the Amadeus API to process the actual cancellation.
    
    // Instead of deleting, it's often better to update the status
    const canceledBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
    });

    return NextResponse.json(canceledBooking);
  } catch (error) {
    console.error('Error canceling booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}