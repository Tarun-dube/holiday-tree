'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PassengerForm from '@/components/feature/PassengerForm';
import { Button } from '@/components/ui/Button';

const PRICED_OFFER_KEY = 'pricedOffer';

export default function FlightBookingPage() {
  const router = useRouter();
  const [pricedOffer, setPricedOffer] = useState<any>(null);

  useEffect(() => {
    try {
      const pricedRaw = sessionStorage.getItem(PRICED_OFFER_KEY);
      if (pricedRaw) setPricedOffer(JSON.parse(pricedRaw));
      else router.replace('/flights');
    } catch (_) {
      router.replace('/flights');
    }
  }, [router]);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-2xl font-bold">Passenger Details</h1>
      <p className="text-muted-foreground">Please enter traveler names as per passport.</p>

      {pricedOffer ? (
        <PassengerForm
          pricedOffer={pricedOffer?.flightOffers?.[0] || pricedOffer}
          onNext={(travelers) => {
            try {
              sessionStorage.setItem('travelers', JSON.stringify(travelers));
            } catch (_) {}
            router.push('/flights/payment');
          }}
        />
      ) : (
        <div className="mt-6">
          <Button onClick={() => router.push('/flights')}>Back to Search</Button>
        </div>
      )}
    </div>
  );
}


