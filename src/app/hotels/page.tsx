'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import HotelCard from '@/components/feature/HotelCard';
import CombinedSearchForm from '@/components/feature/BookingSearchForm';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

function HotelResults() {
    const searchParams = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Create a summary of the current search for display
    const city = searchParams.get('cityCode');
    const checkIn = searchParams.get('checkInDate');
    const checkOut = searchParams.get('checkOutDate');
    const searchSummary = `Hotels in ${city} from ${checkIn ? formatDate(checkIn, 'PPP') : ''} to ${checkOut ? formatDate(checkOut, 'PPP') : ''}`;

    useEffect(() => {
        const queryString = searchParams.toString();
        
        const fetchHotels = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/hotels/search?${queryString}`);
                if (!response.ok) throw new Error('Failed to fetch hotels. Please try again.');
                const data = await response.json();
                setHotels(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (city) {
            fetchHotels();
        } else {
            setIsLoading(false);
        }
    }, [searchParams, city]);
    
    return (
        <div className="container mx-auto py-8">
            {/* Collapsible Search Form Section */}
            <div className="mb-8">
                <Collapsible className="space-y-4 rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Your Search</h2>
                            <p className="text-muted-foreground">{searchSummary}</p>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle Search Form</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        {/* We are reusing the powerful search form component! */}
                        <CombinedSearchForm />
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Results Section */}
            <h1 className="text-3xl font-bold mb-6 text-primary">Hotel Results</h1>
            
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkeletonLoader className="h-80" />
                    <SkeletonLoader className="h-80" />
                    <SkeletonLoader className="h-80" />
                </div>
            )}

            {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">{error}</div>}

            {!isLoading && !error && (
                hotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotels.map((hotelOffer: any, index: number) => (
                            <HotelCard key={index} hotel={hotelOffer.hotel} offer={hotelOffer.offers[0]} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground mt-8">
                        <p>No hotels found for your search criteria. Please modify your search.</p>
                    </div>
                )
            )}
        </div>
    );
}

export default function HotelsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <HotelResults />
        </Suspense>
    );
}