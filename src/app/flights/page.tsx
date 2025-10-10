'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import FlightCard from '@/components/feature/FlightCard';
import CompactSearchForm from '@/components/feature/CompactSearchForm';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import Filter from '@/components/feature/Filter';
import { Frown, Loader2 } from 'lucide-react';

const FLIGHT_OFFERS_KEY = 'flightOffers';

function FlightResults() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('originLocationCode');
  const destination = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults');

  const [allFlights, setAllFlights] = useState<any[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSort, setActiveSort] = useState<string | null>(null);
  const [activeStops, setActiveStops] = useState<number | null>(null);

  // Fetch flights
  useEffect(() => {
    if (!origin || !destination || !departureDate) {
      setIsLoading(false);
      return;
    }

    const fetchFlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/flights?${searchParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch flights. Please try again.');
        const result = await response.json();

        // Save flights & dictionaries once
        setAllFlights(result.data || []);
        setFilteredFlights(result.data || []);
        sessionStorage.setItem(FLIGHT_OFFERS_KEY, JSON.stringify(result.data || []));
        if (!sessionStorage.getItem("dictionaries")) {
          sessionStorage.setItem("dictionaries", JSON.stringify(result.dictionaries || {}));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, departureDate]);

  // Apply filters (placeholder)
  useEffect(() => {
    setFilteredFlights(allFlights);
  }, [activeSort, activeStops, allFlights]);

  const handleClearFilters = () => {
    setActiveSort(null);
    setActiveStops(null);
  };

  const renderContent = () => {
    if (isLoading) return <div className="space-y-4"><SkeletonLoader /><SkeletonLoader /><SkeletonLoader /></div>;
    if (error) return (
      <div className="text-center text-destructive mt-8 border bg-destructive/10 rounded-lg p-8">
        <h2 className="text-xl font-semibold">An Error Occurred</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
    if (filteredFlights.length > 0) return (
      <div className="space-y-4">
        {filteredFlights.map(flight => <FlightCard key={flight.id} flight={flight} />)}
      </div>
    );
    return (
      <div className="text-center text-muted-foreground mt-8 border bg-card rounded-lg p-8">
        <Frown className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">No Flights Found</h2>
        <p className="mt-2">We couldn't find any flights for your search criteria. Please modify your search.</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <CompactSearchForm
          initialValues={{ originLocationCode: origin, destinationLocationCode: destination, departureDate, adults }}
        />
      </div>

      <div className="mb-6">
        <Filter
          activeSort={activeSort}
          activeStops={activeStops}
          onSortChange={sort => setActiveSort(prev => prev === sort ? null : sort)}
          onStopsChange={stops => setActiveStops(prev => prev === stops ? null : stops)}
          onClearFilters={handleClearFilters}
        />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-primary">Available Flights</h1>
      {renderContent()}
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <FlightResults />
    </Suspense>
  );
}
