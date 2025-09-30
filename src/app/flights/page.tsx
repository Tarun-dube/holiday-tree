'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import FlightCard from '@/components/feature/FlightCard';
import CombinedSearchForm from '@/components/feature/CombinedSearchForm';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function FlightResults() {
    const searchParams = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Create a summary of the current search for display
    const origin = searchParams.get('originLocationCode');
    const destination = searchParams.get('destinationLocationCode');
    const date = searchParams.get('departureDate');
    const searchSummary = `${origin} to ${destination} on ${date ? formatDate(date, 'PPP') : ''}`;

    useEffect(() => {
        const queryString = searchParams.toString();
        
        const fetchFlights = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/flights/search?${queryString}`);
                if (!response.ok) throw new Error('Failed to fetch flights. Please try again.');
                const data = await response.json();
                setFlights(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (origin) {
            fetchFlights();
        } else {
            setIsLoading(false);
        }
    }, [searchParams, origin]);

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
            <h1 className="text-3xl font-bold mb-6 text-primary">Flight Results</h1>
            
            {isLoading && (
                <div className="space-y-4">
                    <SkeletonLoader />
                    <SkeletonLoader />
                    <SkeletonLoader />
                </div>
            )}

            {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">{error}</div>}

            {!isLoading && !error && (
                flights.length > 0 ? (
                    <div className="space-y-4">
                        {flights.map((flight, index) => (
                            <FlightCard key={index} flight={flight} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground mt-8">
                        <p>No flights found for your search criteria. Please modify your search.</p>
                    </div>
                )
            )}
        </div>
    );
}

export default function FlightsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <FlightResults />
        </Suspense>
    );
}