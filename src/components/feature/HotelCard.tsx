import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import Link from 'next/link';

// The StarRating component is now themed
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          // Filled stars use the theme's primary color; empty stars are a muted gray
          className={i < rating ? 'text-primary fill-primary' : 'text-muted/50'}
        />
      ))}
    </div>
  );
};

// IMPORTANT: The structure of the 'hotel' and 'offer' objects depends on the Amadeus API response.
// Use console.log() to inspect the actual data structure and adjust the accessors below as needed.
export default function HotelCard({ hotel, offer }: { hotel: any; offer: any }) {
  // Simplified data extraction - ADJUST AS NEEDED!
  const price = offer.price.total;
  const rating = hotel.rating ? parseInt(hotel.rating) : 0;
  const hotelId = hotel.hotelId;

  return (
    // Use the base card styles with hover and animation effects
    <div className="border bg-card text-card-foreground rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up flex flex-col">
      {/* Image placeholder now uses themed colors */}
      <div className="bg-muted h-40 flex items-center justify-center text-muted-foreground">
        Image Placeholder
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg leading-tight truncate">{hotel.name}</h3>
        {/* Use muted-foreground for secondary text */}
        <p className="text-sm text-muted-foreground mt-1">{hotel.address?.cityName}</p>
        <div className="mt-2">
          <StarRating rating={rating} />
        </div>
        <div className="mt-4 pt-4 border-t flex-grow flex items-end justify-between">
          <div>
            <p className="text-xl font-bold">{formatCurrency(parseFloat(price))}</p>
            <p className="text-xs text-muted-foreground">total for stay</p>
          </div>
          {/* The button is now a functional link */}
          <Link href={`/hotels/${hotelId}`}>
            <Button size="sm">View Deal</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}