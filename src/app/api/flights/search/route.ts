import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// This is the same Amadeus client initialization as in your hotel search route.
// It reuses the same credentials from your .env.local file.
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults') || '1'; // Default to 1 adult

  // --- Input Validation ---
  if (!originLocationCode || !destinationLocationCode || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: originLocationCode, destinationLocationCode, and departureDate are required.' },
      { status: 400 } // Bad Request
    );
  }

  try {
    // --- Call the Amadeus API for Flight Offers ---
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      max: 15 // You can limit the number of results
    });

    // --- Return the successful response ---
    return NextResponse.json(response.data);

  } catch (error: any) {
    // --- Error Handling ---
    console.error('Amadeus API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch flight data from the provider.' },
      { status: 500 } // Internal Server Error
    );
  }
}