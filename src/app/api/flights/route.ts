import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// Initialize the Amadeus client with your environment variables
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY as string,
  clientSecret: process.env.AMADEUS_API_SECRET as string,
});

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
    const formattedFlights = response.data.map((offer: any) => {
      const firstItinerary = offer.itineraries[0];
      const firstSegment = firstItinerary.segments[0];
      const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

      return {
        id: offer.id,
        price: {
          total: offer.price.total,
          currency: offer.price.currency,
        },
        departure: {
          iataCode: firstSegment.departure.iataCode,
          time: firstSegment.departure.at,
        },
        arrival: {
          iataCode: lastSegment.arrival.iataCode,
          time: lastSegment.arrival.at,
        },
        duration: firstItinerary.duration,
        // You can get the airline name from the included dictionaries
        airline: response.result.dictionaries.carriers[firstSegment.carrierCode],
        stops: firstItinerary.segments.length - 1,
      };
    });

    return NextResponse.json(formattedFlights);

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