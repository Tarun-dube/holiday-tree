import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Plane } from 'lucide-react';
import Link from 'next/link';

// IMPORTANT: The structure of the 'flight' object depends entirely on the Amadeus API response.
// You WILL need to adjust the data accessors (e.g., flight.itineraries[0]...)
// Use console.log(flight) in the parent component to inspect the actual structure.
export default function FlightCard({ flight }: { flight: any }) {
  // Simplified data extraction - ADJUST AS NEEDED!
  const itinerary = flight.itineraries[0];
  const departure = itinerary.segments[0].departure;
  const arrival = itinerary.segments[itinerary.segments.length - 1].arrival;
  const duration = itinerary.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  const price = flight.price.total;

  return (
    // Use the base card styles with hover and animation effects
    <div className="border bg-card text-card-foreground rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Flight Details */}
        <div className="flex items-center gap-4 flex-1">
          {/* Use the primary theme color for the icon */}
          <Plane className="text-primary" size={32} />
          <div>
            <div className="font-bold text-lg">
              {departure.iataCode} <ArrowRight className="inline-block mx-2" size={16} /> {arrival.iataCode}
            </div>
            {/* Use the muted-foreground theme color for secondary text */}
            <div className="text-sm text-muted-foreground">
              {formatDate(departure.at, 'HH:mm')} - {formatDate(arrival.at, 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="text-center flex-1">
          <div className="font-semibold">{duration}</div>
          <div className="text-sm text-muted-foreground">Direct</div> {/* Simplified */}
        </div>

        {/* Price and Action Button */}
        <div className="text-center md:text-right flex-1">
          <div className="text-xl font-bold">{formatCurrency(parseFloat(price))}</div>
          {/* The Button is already themed! We can make it a bit smaller. */}
          <Link href="/book">
            <Button size="sm" className="mt-2">
              Select Flight
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}