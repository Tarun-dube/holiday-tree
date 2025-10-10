// /api/hotels/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityCode = searchParams.get('cityCode');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults') || '1';

  if (!cityCode || !checkInDate || !checkOutDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: cityCode, checkInDate, or checkOutDate' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Get the list of hotel IDs in the specified city.
    const hotelsByCityResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode,
    });
    
    // Extract just the hotel IDs from the response
    const hotelIds = hotelsByCityResponse.data.map((hotel: any) => hotel.hotelId);

    // If no hotels are found in the city, return an empty array.
    if (!hotelIds || hotelIds.length === 0) {
        return NextResponse.json([]);
    }

    // Step 2: Use the hotel IDs to search for available offers.
    // This is the key change! We are now using the shopping endpoint.
    const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        adults: adults,
        currency: 'INR', // It's good practice to specify a currency
        paymentPolicy: 'NONE' // Important for test environment
    });
    
    // The offersResponse.data contains a list of hotels that have available rooms.
    return NextResponse.json(offersResponse.data);

  } catch (error: any) {
    console.error('Amadeus API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch hotel offers from the provider.' },
      { status: 500 }
    );
  }
}