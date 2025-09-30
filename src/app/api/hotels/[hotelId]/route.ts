import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});

interface IParams {
  params: { hotelId?: string };
}

export async function GET(request: Request, { params }: IParams) {
  const { hotelId } = params;

  if (!hotelId) {
    return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    // This API gets the latest offers for a *specific* hotel ID
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId: hotelId,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Amadeus API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch hotel details.' },
      { status: 500 }
    );
  }
}