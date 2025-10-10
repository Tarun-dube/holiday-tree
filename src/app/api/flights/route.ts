import { NextRequest, NextResponse } from 'next/server';
import { amadeus } from '@/lib/amadeus';

// Using shared Amadeus client from lib to ensure consistent env vars

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get the search parameters required by Amadeus
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults');

  // Basic validation to ensure required parameters are present
  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return NextResponse.json(
      { error: 'Missing required search parameters.' },
      { status: 400 }
    );
  }

  try {
    // Make the API call to Amadeus for Flight Offers Search
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      currencyCode: 'INR', // You can change the currency
    });
    
    // The Amadeus response is very complex. We need to format it
    // into a simpler structure for our frontend.
    
    return NextResponse.json({
      data: response.data,
      dictionaries: response.dictionaries
    });

  } catch (error: any) {
    // Log the detailed error for debugging on the server
    console.error("Amadeus API Error:", error.description || error);
    
    // Return a structured error response to the client
    return NextResponse.json(
      { error: 'Failed to fetch flight data from Amadeus.', details: error.description?.detail || 'An unknown error occurred.' },
      { status: error.response?.statusCode || 500 }
    );
  }
}