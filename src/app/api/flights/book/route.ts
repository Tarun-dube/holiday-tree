import { NextRequest, NextResponse } from 'next/server';
import { amadeus } from '@/lib/amadeus';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // 1. Get the user session
  const session = await getServerSession(authOptions);

  // 2. Check if the user is authenticated
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: 'You must be logged in to make a booking.' },
      { status: 401 }
    );
  }
  
  // 3. Get the user ID from the session
  const userId = session.user.id;

  let paymentIntentId: string | undefined;
  
  try {
    const { pricedOffer, travelers, contactDetails, paymentIntentId: intentId } = await request.json();
    paymentIntentId = intentId;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Prepare travelers data for Amadeus
    const formattedTravelers = travelers.map((traveler: any) => ({
      id: traveler.id || `1`,
      dateOfBirth: traveler.dateOfBirth || '1990-01-01',
      gender: traveler.gender || 'MALE',
      name: {
        firstName: traveler.firstName,
        lastName: traveler.lastName,
      },
      documents: traveler.documents || [],
    }));

    // Create the booking with Amadeus Flight Orders API
    const bookingResponse = await amadeus.booking.flightOrders.post({
      data: {
        type: 'flight-order',
        flightOffers: [pricedOffer],
        travelers: formattedTravelers,
        remarks: {
          general: [
            { subType: 'GENERAL_MISCELLANEOUS', text: 'Flight booked via Holiday Tree' },
          ],
        },
        ticketingAgreement: { option: 'DELAY_TO_CANCEL', delay: '6D' },
        contacts: [
          {
            addresseeName: { 
              firstName: contactDetails?.firstName || travelers[0]?.firstName, 
              lastName: contactDetails?.lastName || travelers[0]?.lastName 
            },
            purpose: 'STANDARD',
            phones: [{ 
              deviceType: 'MOBILE', 
              countryCallingCode: contactDetails?.countryCode || '91', 
              number: contactDetails?.phone || '9999999999' 
            }],
            emailAddress: contactDetails?.email || session.user.email || 'demo@holidaytree.com',
          },
        ],
        payment: {
          type: 'CARD',
          cardToken: 'test-token', // In production, use real payment token
        },
      },
    });

    const amadeusBookingId = bookingResponse.data.data?.id || null;
    const pnr = bookingResponse.data.data?.associatedRecords?.[0]?.reference || null;
    const ticketNumbers = bookingResponse.data.data?.flightOffers?.[0]?.ticketingAgreement || null;

    // Store booking in database
    const booking = await prisma.booking.create({
      data: {
        amadeusBookingId,
        // pnr,
        ticketNumbers,
        stripePaymentIntentId: paymentIntentId,
        paymentStatus: 'COMPLETED',
        bookingDate: new Date(),
        totalPrice: parseFloat(pricedOffer.price.total),
        // currency: pricedOffer.price.currency,
        status: 'CONFIRMED',
        userId: userId,
        passengerDetails: travelers,
        flightDetails: pricedOffer,
        contactDetails: contactDetails,
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        amadeusBookingId,
        pnr,
        ticketNumbers,
        status: booking.status,
        totalPrice: booking.totalPrice,
        // currency: booking.currency,
      },
      amadeusResponse: bookingResponse.data,
    });
  } catch (error: any) {
    console.error('Booking Error:', error.response?.data || error.message);
    
    // If Amadeus booking fails but payment succeeded, we need to handle refund
    if ((error.response?.statusCode === 400 || error.response?.statusCode === 422) && paymentIntentId) {
      try {
        // Attempt to refund the payment
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          reason: 'requested_by_customer',
        });
      } catch (refundError) {
        console.error('Refund failed:', refundError);
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to complete booking',
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}