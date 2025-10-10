'use client';

import { useEffect, useState } from 'react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, Clock, MapPin, CreditCard, User } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <SkeletonLoader />;

  if (!bookings.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Plane className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
        <p className="text-muted-foreground mb-6">Start exploring and book your first flight!</p>
        <Button asChild>
          <a href="/flights">Search Flights</a>
        </Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <Button asChild>
          <a href="/flights">Book New Flight</a>
        </Button>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => {
          const flightDetails = booking.flightDetails as any;
          const passengerDetails = booking.passengerDetails as any[];
          const contactDetails = booking.contactDetails as any;

          return (
            <div
              key={booking.id}
              className="rounded-xl border bg-card p-6 shadow-sm space-y-6"
            >
              {/* Booking Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Flight Booking</h2>
                  <p className="text-sm text-muted-foreground">
                    Booked on {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    Payment {booking.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Booking Reference */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="font-mono font-semibold">{booking.amadeusBookingId || 'N/A'}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">PNR</p>
                  <p className="font-mono font-semibold">{booking.pnr || 'N/A'}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">{booking.currency} {booking.totalPrice}</p>
                </div>
              </div>

              {/* Flight Details */}
              {flightDetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Plane className="h-5 w-5 mr-2" />
                    Flight Details
                  </h3>
                  
                  {flightDetails.itineraries?.map((itinerary: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(itinerary.segments[0].departure.at).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      
                      {itinerary.segments.map((segment: any, segIndex: number) => (
                        <div key={segIndex} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="font-semibold text-lg">{segment.departure.iataCode}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {segment.departure.terminal || 'T1'}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-px bg-gray-300"></div>
                              <Plane className="h-4 w-4 text-muted-foreground" />
                              <div className="w-20 h-px bg-gray-300"></div>
                            </div>
                            
                            <div className="text-center">
                              <p className="font-semibold text-lg">{segment.arrival.iataCode}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {segment.arrival.terminal || 'T1'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium">{segment.carrierCode} {segment.number}</p>
                            <p className="text-sm text-muted-foreground">{segment.aircraft.code}</p>
                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {itinerary.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Passenger Details */}
              {passengerDetails && passengerDetails.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Passenger Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {passengerDetails.map((passenger: any, index: number) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <p className="font-semibold">{passenger.firstName} {passenger.lastName}</p>
                        {passenger.dateOfBirth && (
                          <p className="text-sm text-muted-foreground">
                            DOB: {new Date(passenger.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                        {passenger.gender && (
                          <p className="text-sm text-muted-foreground">
                            Gender: {passenger.gender}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {contactDetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="font-semibold">{contactDetails.firstName} {contactDetails.lastName}</p>
                    <p className="text-sm text-muted-foreground">{contactDetails.email}</p>
                    {contactDetails.phone && (
                      <p className="text-sm text-muted-foreground">
                        {contactDetails.countryCode} {contactDetails.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
