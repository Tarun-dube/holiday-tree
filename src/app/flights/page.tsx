'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import FlightCard from '@/components/feature/FlightCard';
import CompactSearchForm from '@/components/feature/CompactSearchForm';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Loader2 } from 'lucide-react';
import Filter from '@/components/feature/Filter';
import { applyFlightFilters } from '@/lib/flightFilters';

// Helper function to convert ISO 8601 duration (e.g., PT5H30M) to minutes
function durationToMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

function FlightResults() {
  const searchParams = useSearchParams();

  const [allFlights, setAllFlights] = useState<any[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSort, setActiveSort] = useState<string | null>(null);
  const [activeStops, setActiveStops] = useState<number | null>(null);

  const origin = searchParams.get('originLocationCode');
  const destination = searchParams.get('destinationLocationCode');
  const date = searchParams.get('departureDate');
  const adults = searchParams.get('adults');

  // Fetch flights
  useEffect(() => {
    const queryString = searchParams.toString();
    if (!origin || !destination || !date) {
      setIsLoading(false);
      return;
    }

    const fetchFlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/flights?${queryString}`);
      
        if (!response.ok) throw new Error('Failed to fetch flights. Please try again.');
        const data = await response.json();
        setAllFlights(data);
        setFilteredFlights(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlights();
  }, [searchParams, origin, destination, date]);

  // Apply filters and sorting
  useEffect(() => {
     
  const filtered = applyFlightFilters(allFlights, activeStops, activeSort);
   
  setFilteredFlights(filtered);
}, [activeSort, activeStops, allFlights]);

  // Clear all filters
  const handleClearFilters = () => {
    setActiveSort(null);
    setActiveStops(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <CompactSearchForm
          initialValues={{
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: adults,
          }}
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <Filter
          activeSort={activeSort}
          activeStops={activeStops}
          onSortChange={(sort) => setActiveSort(prev => prev === sort ? null : sort)}
          onStopsChange={(stops) => setActiveStops(prev => prev === stops ? null : stops)}
          onClearFilters={handleClearFilters}
        />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-primary">Flight Results</h1>

      {/* Loading, error, or results */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonLoader /><SkeletonLoader /><SkeletonLoader />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        filteredFlights.length > 0 ? (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8 border bg-card rounded-lg p-8">
            <h2 className="text-xl font-semibold">No Flights Found</h2>
            <p className="mt-2">We couldn't find any flights for your search criteria. Please modify your search.</p>
          </div>
        )
      )}
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <FlightResults />
    </Suspense>
  );
}
