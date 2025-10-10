'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Loader2, Plane, Clock, Info } from 'lucide-react';

// Constants for sessionStorage keys
const FLIGHT_OFFERS_KEY = 'flightOffers';
const PRICED_OFFER_KEY = 'pricedOffer';
const PRICED_SUMMARY_KEY = 'pricedSummary';

export default function FlightOfferPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const router = useRouter();

  const [offer, setOffer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified and corrected effect to load the offer
  useEffect(() => {
    try {
      const storedOffersRaw = sessionStorage.getItem(FLIGHT_OFFERS_KEY);
      if (storedOffersRaw) {
        const offers = JSON.parse(storedOffersRaw);
        const foundOffer = offers.find((o: any) => String(o.id) === offerId);
        if (foundOffer) {
          setOffer(foundOffer);
        }
      }
    } catch (err) {
      console.error('Failed to parse flight offers from sessionStorage:', err);
      setError('Could not load flight details.');
    } finally {
      setIsLoading(false);
    }
  }, [offerId]);

  const handleVerifyPrice = async () => {
    if (!offer) return;
    setIsVerifying(true);
    setError(null);
   

    try {
      // CRITICAL FIX: Use backticks (`) for template literals
     const response = await fetch(`/api/flights/pricing`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      type: 'flight-offers-pricing',
      flightOffers: [offer]
    }
  }),
});

      if (!response.ok) {
        throw new Error('Price has changed or is no longer available. Please search again.');
      }
      const pricedData = await response.json();
      
      sessionStorage.setItem(PRICED_OFFER_KEY, JSON.stringify(pricedData));

      // Create a compact summary for the confirmation page
      const pricedFlight = pricedData?.flightOffers?.[0] || pricedData;
      const summary = {
        origin: pricedFlight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode,
        destination: pricedFlight?.itineraries?.[0]?.segments?.slice(-1)?.[0]?.arrival?.iataCode,
        duration: pricedFlight?.itineraries?.[0]?.duration,
      };
      sessionStorage.setItem(PRICED_SUMMARY_KEY, JSON.stringify(summary));
      
      router.push('/flights/booking');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 max-w-3xl">
        <SkeletonLoader />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Info className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Offer Not Found</h1>
        <p className="text-muted-foreground mt-2">This flight offer could not be found or has expired.</p>
        <Button onClick={() => router.push('/flights')} className="mt-6">Back to Search</Button>
      </div>
    );
  }

  // Safely get offer details
  const itinerary = offer.itineraries?.[0];
  const price = offer.price;

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Review Your Itinerary</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        {/* Itinerary Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              {itinerary?.segments?.[0]?.departure?.iataCode} → {itinerary?.segments?.slice(-1)[0]?.arrival?.iataCode}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{itinerary?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm')}</span>
            </div>
          </div>
          {itinerary?.segments.map((segment: any, index: number) => (
            <div key={index} className="flex items-start gap-4">
              <Plane className="h-5 w-5 mt-1 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{segment.departure.iataCode} → {segment.arrival.iataCode}</p>
                <p className="text-sm text-muted-foreground">
                  Departs: {new Date(segment.departure.at).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Arrives: {new Date(segment.arrival.at).toLocaleString()}
                </p>
                <p className="text-xs mt-1">
                  Airline: {segment.carrierCode} | Flight: {segment.number}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold">Price Summary</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">Total Price</span>
            <span className="text-2xl font-bold">{price?.currency} {price?.grandTotal??price?.total}</span>
          </div>
        </div>
        
        {error && (
            <p className="text-sm text-center text-destructive">{error}</p>
        )}

        <Button onClick={handleVerifyPrice} disabled={isVerifying} className="w-full text-lg py-6">
          {isVerifying && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isVerifying ? 'Verifying Price...' : 'Confirm and Continue'}
        </Button>
      </div>
    </div>
  );
}