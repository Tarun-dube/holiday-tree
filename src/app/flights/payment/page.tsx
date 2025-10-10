'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const PRICED_OFFER_KEY = 'pricedOffer';
const TRAVELERS_KEY = 'travelers';

export default function FlightPaymentPage() {
  const router = useRouter();
  const [pricedOffer, setPricedOffer] = useState<any>(null);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Contact details form
  const [contactDetails, setContactDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
  });

  useEffect(() => {
    try {
      const pricedRaw = sessionStorage.getItem(PRICED_OFFER_KEY);
      if (pricedRaw) setPricedOffer(JSON.parse(pricedRaw));
      else router.replace('/flights');

      const travRaw = sessionStorage.getItem(TRAVELERS_KEY);
      if (travRaw) setTravelers(JSON.parse(travRaw));
    } catch (_) {
      router.replace('/flights');
    }
  }, [router]);

  const handlePayment = async () => {
    if (!pricedOffer) return;
    setLoading(true);
    setError(null);

    try {
      const totalAmount = parseFloat(pricedOffer?.flightOffers?.[0]?.price?.total || pricedOffer?.price?.total);
      const currency = pricedOffer?.flightOffers?.[0]?.price?.currency || pricedOffer?.price?.currency || 'INR';

      // Create payment intent
      const paymentIntentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency,
          metadata: {
            type: 'flight_booking',
            offerId: pricedOffer?.flightOffers?.[0]?.id || pricedOffer?.id,
          },
        }),
      });

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      // In a real implementation, you would use Stripe Elements here
      // For demo purposes, we'll simulate a successful payment
      // In production, you would integrate with Stripe's Payment Element

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Now create the booking
      const bookingResponse = await fetch('/api/flights/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricedOffer: pricedOffer?.flightOffers?.[0] || pricedOffer,
          travelers: travelers && travelers.length ? travelers : [{ firstName: 'John', lastName: 'Doe' }],
          contactDetails,
          paymentIntentId,
        }),
      });

      const bookingData = await bookingResponse.json();
      
      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Booking failed');
      }

      sessionStorage.setItem('bookingResponse', JSON.stringify(bookingData));
      router.push('/flights/confirmation');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = pricedOffer?.flightOffers?.[0]?.price?.grandTotal || pricedOffer?.price?.grandTotal;
  const currency = pricedOffer?.flightOffers?.[0]?.price?.currency || pricedOffer?.price?.currency;

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Payment & Contact Details</h1>
      <p className="text-muted-foreground mb-8">Complete your booking with payment and contact information.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={contactDetails.firstName}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={contactDetails.lastName}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactDetails.email}
                onChange={(e) => setContactDetails(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="countryCode">Country Code</Label>
                <Input
                  id="countryCode"
                  value={contactDetails.countryCode}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, countryCode: e.target.value }))}
                  placeholder="+91"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Flight Price:</span>
              <span>{currency} {totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees:</span>
              <span>{currency} 0</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{currency} {totalAmount}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Payment</h3>
            <p className="text-sm text-blue-700">
              This is a demo booking. In production, you would integrate with Stripe Elements for secure payment processing.
            </p>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
          
          <Button 
            onClick={handlePayment} 
            disabled={loading || !contactDetails.firstName || !contactDetails.lastName || !contactDetails.email} 
            className="w-full"
          >
            {loading ? 'Processing Payment...' : `Pay ${currency} ${totalAmount}`}
          </Button>
        </div>
      </div>
    </div>
  );
}


