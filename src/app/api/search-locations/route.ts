import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.length < 2) {
    return NextResponse.json(
      { error: 'Keyword is required and must be at least 2 characters long' },
      { status: 400 }
    );
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: Amadeus.location.city, // Search for cities
    });

    // We only send back the relevant data to the client
    const simplifiedData = response.data.map((location: any) => ({
      name: `${location.address.cityName}, ${location.address.countryCode}`,
      iataCode: location.iataCode,
    }));
    
    return NextResponse.json(simplifiedData);

  } catch (error: any) {
    console.error('Amadeus API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch location data.' },
      { status: 500 }
    );
  }
}