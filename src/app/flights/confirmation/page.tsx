'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Plane, Calendar, Clock, MapPin } from 'lucide-react';

const BOOKING_RESPONSE_KEY = 'bookingResponse';

export default function BookingConfirmationPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const bookingRaw = sessionStorage.getItem(BOOKING_RESPONSE_KEY);
      if (bookingRaw) {
        setBookingData(JSON.parse(bookingRaw));
      }
    } catch (err) {
      console.error('Failed to parse booking data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading booking confirmation...</p>
        </div>
      );
    }

    if (!bookingData?.success) {
      return (
        <>
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Booking Failed</h1>
          <p className="text-muted-foreground mt-2">
            We couldn't complete your booking. Please try again or contact support.
          </p>
        </>
      );
    }

    const { booking } = bookingData;
    const flightDetails = bookingData.amadeusResponse?.data;

    return (
      <>
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your flight has been successfully booked. You will receive a confirmation email shortly.
        </p>

        {/* Booking Details */}
        <div className="mt-8 w-full max-w-2xl text-left">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700">Booking Reference</p>
                <p className="font-mono font-semibold text-green-900">{booking.amadeusBookingId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">PNR</p>
                <p className="font-mono font-semibold text-green-900">{booking.pnr || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Status</p>
                <p className="font-semibold text-green-900">{booking.status}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Total Paid</p>
                <p className="font-semibold text-green-900">{booking.currency} {booking.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          {flightDetails && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Flight Details
              </h2>
              
              {flightDetails.flightOffers?.[0]?.itineraries?.map((itinerary: any, index: number) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(itinerary.segments[0].departure.at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {itinerary.segments.map((segment: any, segIndex: number) => (
                    <div key={segIndex} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-semibold">{segment.departure.iataCode}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-px bg-gray-300"></div>
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <div className="w-16 h-px bg-gray-300"></div>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-semibold">{segment.arrival.iataCode}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">{segment.carrierCode} {segment.number}</p>
                        <p className="text-sm text-muted-foreground">{segment.aircraft.code}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration: {itinerary.duration}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {renderContent()}
        <div className="mt-8 space-x-4">
          <Button asChild>
            <Link href="/flights">Book Another Flight</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/profile/my-bookings">View My Bookings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}