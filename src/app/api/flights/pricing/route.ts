import { NextRequest, NextResponse } from 'next/server';
import { amadeus } from '@/lib/amadeus';

export async function POST(request: NextRequest) {
  try {
    // Expecting request body to already be in the correct structure:
    // { data: { type: 'flight-offers-pricing', flightOffers: [offer] } }
    const pricingRequest = await request.json();

    // Pass the request body directly to Amadeus
    const response = await amadeus.shopping.flightOffers.pricing.post(pricingRequest);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Flight Pricing Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to verify pricing' },
      { status: 500 }
    );
  }
}
