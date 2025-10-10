import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  const resolvedParams = await params;
  const searchParams = request.nextUrl.searchParams;
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults') || '1';
  const hotelId = resolvedParams.hotelId;

  if (!hotelId) {
    return NextResponse.json(
      { error: 'Missing required parameter: hotelId' },
      { status: 400 }
    );
  }

  try {
    // Get hotel details only
    const detailsResponse = await amadeus.referenceData.locations.hotels.byHotels.get({
      hotelIds: hotelId
    });

    const hotelData = {
      hotel: detailsResponse.data?.[0] || {},
      offers: [], // Empty offers array for now
      searchParams: {
        checkInDate,
        checkOutDate,
        adults
      },
      message: "Hotel offers functionality coming soon. Contact hotel directly for booking."
    };

    return NextResponse.json(hotelData);

  } catch (error: any) {
    console.error('Amadeus API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      hotelId
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch hotel details from the provider.',
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}
