import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Hotel } from 'lucide-react';
import Link from 'next/link';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-primary fill-primary' : 'text-muted/50'}
        />
      ))}
    </div>
  );
};

// Updated component props to include searchParams
export default function HotelCard({ 
  hotel, 
  offer, 
  searchParams 
}: { 
  hotel: any; 
  offer: any; 
  searchParams?: {
    checkInDate: string | null;
    checkOutDate: string | null;
    adults: string | null;
  }; 
}) {
  const rating = hotel.rating ? parseInt(hotel.rating) : 0;
  const hotelId = hotel.hotelId;
  const hotelName = hotel.name || 'Hotel Name Not Available';
  const cityName = hotel.address?.cityName || 'Location Not Available';
  const countryName = hotel.address?.countryName;

  // Build the detail page URL with search parameters
  const detailsUrl = `/hotels/${hotelId}${
    searchParams 
      ? `?checkInDate=${searchParams.checkInDate}&checkOutDate=${searchParams.checkOutDate}&adults=${searchParams.adults}` 
      : ''
  }`;

  return (
    <div className="border bg-card text-card-foreground rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up flex flex-col">
      <div className="bg-muted h-40 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Hotel className="h-8 w-8 mx-auto mb-2 text-primary" />
          <span className="text-sm">Hotel Image</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg leading-tight truncate" title={hotelName}>
          {hotelName}
        </h3>
        
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">
            {cityName}{countryName && `, ${countryName}`}
          </span>
        </div>
        
        <div className="mt-2">
          <StarRating rating={rating} />
        </div>
        
        <div className="mt-4 pt-4 border-t flex-grow flex items-end justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Starting from</p>
            <p className="text-lg font-bold text-primary">View Offers</p>
          </div>
          
          <Link href={detailsUrl}>
            <Button size="sm" className="ml-2">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
