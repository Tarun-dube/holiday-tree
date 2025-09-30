'use client';

import { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (!res.ok) throw new Error('Failed to load your bookings.');
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader className="h-32" />
        <SkeletonLoader className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">My Bookings</h1>
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="animate-fade-in-up">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{booking.hotel?.name || 'Flight Booking'}</CardTitle>
                  <CardDescription>
                    Booked on: {formatDate(booking.bookingDate, 'PPP')}
                  </CardDescription>
                </div>
                <Badge 
                  variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}
                  className={booking.status === 'CONFIRMED' ? 'bg-green-600' : ''}
                >
                  {booking.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Total Price: {formatCurrency(booking.totalPrice)}</p>
                {/* You could add more details here, like booking ID */}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">You have no bookings yet.</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Ready to plan your next trip?
          </p>
          <Link href="/">
            <Button>Start Searching</Button>
          </Link>
        </div>
      )}
    </div>
  );
}