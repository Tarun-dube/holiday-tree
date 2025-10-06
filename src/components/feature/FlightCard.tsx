import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Plane } from 'lucide-react';
import Link from 'next/link';

export default function FlightCard({ flight }: { flight: any }) {
  // ✅ Data extraction from the SIMPLIFIED flight object
  const { departure, arrival, duration, price, stops, airline } = flight;

  const formattedDuration = duration
    ? duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')
    : 'N/A';

  if (!departure || !arrival) {
    return (
      <div className="border bg-card text-card-foreground rounded-lg p-4 text-muted-foreground">
        <p>⚠️ Incomplete flight data.</p>
      </div>
    );
  }

  return (
    <div className="border bg-card text-card-foreground rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Flight Details */}
        <div className="flex items-center gap-4 flex-1">
          <Plane className="text-primary" size={32} />
          <div>
            <div className="font-bold text-lg">
              {departure.iataCode}{' '}
              <ArrowRight className="inline-block mx-2" size={16} />{' '}
              {arrival.iataCode}
            </div>
            <div className="text-sm text-muted-foreground">
              {airline}
            </div>
          </div>
        </div>

        {/* Departure & Arrival Times */}
        <div className="text-center flex-1">
            <div className="font-semibold">
                {formatDate(departure.time, 'HH:mm')} - {formatDate(arrival.time, 'HH:mm')}
            </div>
            <div className="text-sm text-muted-foreground">Timings</div>
        </div>

        {/* Duration & Stops */}
        <div className="text-center flex-1">
          <div className="font-semibold">{formattedDuration}</div>
          <div className="text-sm text-muted-foreground">
            {stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Price and Action Button */}
        <div className="text-center md:text-right flex-1">
          <div className="text-xl font-bold">
            {price?.total ? formatCurrency(parseFloat(price.total)) : 'N/A'}
          </div>
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