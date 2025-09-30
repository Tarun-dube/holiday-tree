import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// Initialize the Amadeus client with your API credentials from environment variables
// This is done outside the handler to be reused across requests
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

export async function GET(request: NextRequest) {
  // Extract search parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const cityCode = searchParams.get('cityCode');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults') || '1'; // Default to 1 adult if not provided

  // --- Input Validation ---
  if (!cityCode) {
    return NextResponse.json(
      { error: 'Missing required parameter: cityCode' },
      { status: 400 } // Bad Request
    );
  }

  try {
    // --- Call the Amadeus API ---
    // The 'get' method of hotelOffers is used to search for hotel deals
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults,
      // You can add more parameters here like 'ratings', 'amenities', etc.
    });

    // --- Return the successful response ---
    // The actual hotel data is in the 'data' property of the response
    return NextResponse.json(response.data);

  } catch (error: any) {
    // --- Error Handling ---
    // Log the detailed error on the server for debugging
    console.error('Amadeus API Error:', error.response?.data || error.message);

    // Return a generic error message to the client for security
    return NextResponse.json(
      { error: 'Failed to fetch hotel data from the provider.' },
      { status: 500 } // Internal Server Error
    );
  }
}