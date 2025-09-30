'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function BookingForm() {
    const { data: session } = useSession(); // Get session data
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fullName, setFullName] = useState(session?.user?.name || '');
    const [email, setEmail] = useState(session?.user?.email || '');

    // Update form if session loads after component mount
    useEffect(() => {
        if (session?.user) {
            setFullName(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);
    
    // Get booking details from URL
    const hotelName = searchParams.get('hotelName');
    const price = searchParams.get('price');
    const hotelId = searchParams.get('offerId');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (!fullName || !email) {
            setError('Full name and email are required.');
            setIsLoading(false);
            return;
        }

        const bookingDetails = {
            hotelId: hotelId,
            totalPrice: price,
            passengerDetails: { name: fullName, email: email },
        };

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingDetails),
            });
            if (!res.ok) throw new Error('Booking failed. Please try again.');
            
            router.push('/profile/my-bookings');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-2xl animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-6 text-primary">Confirm Your Booking</h1>
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>{hotelName}</CardTitle>
                    <CardDescription>Final step to secure your stay.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 pb-4 border-b">
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-3xl font-bold text-primary mt-1">
                            {formatCurrency(parseFloat(price || '0'))}
                        </p>
                    </div>

                    {error && <p className="bg-destructive/10 text-destructive p-3 rounded-md text-center mb-4">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="font-semibold">Passenger Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        
                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Processing...' : 'Confirm & Book'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
            <BookingForm />
        </Suspense>
    )
}