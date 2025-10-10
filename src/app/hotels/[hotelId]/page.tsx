'use client';

import { useRouter,useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Wifi, 
  Car, 
  Utensils, 
  Dumbbell,
  ArrowLeft,
  Loader2,
  Phone,
  Globe,
  Info,
  Hotel as HotelIcon
} from 'lucide-react';
import Link from 'next/link';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={20}
          className={i < rating ? 'text-primary fill-primary' : 'text-muted/50'}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  );
};

const HotelAmenities = ({ hotel }: { hotel: any }) => {
  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Utensils, label: 'Restaurant' },
    { icon: Dumbbell, label: 'Fitness Center' },
  ];

  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Hotel Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <amenity.icon className="h-4 w-4 text-primary" />
            <span>{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HotelContact = ({ hotel }: { hotel: any }) => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-primary" />
          <span>Contact hotel directly for reservations</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Globe className="h-4 w-4 text-primary" />
          <span>Visit hotel website for more details</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Info className="h-4 w-4 text-primary" />
          <span>Hotel ID: {hotel.hotelId}</span>
        </div>
      </div>
    </div>
  );
};

const OfferCard = ({ offer }: { offer: any }) => {
  const price = offer.price?.total || '0';
  const currency = offer.price?.currency || 'INR';

  return (
    <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold">{offer.room?.type?.bedType || 'Standard Room'}</h4>
          <p className="text-sm text-muted-foreground">
            {offer.room?.description?.text || 'Comfortable accommodation'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(parseFloat(price), currency)}
          </p>
          <p className="text-xs text-muted-foreground">total for stay</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Max {offer.guests?.adults || 2} adults
          </span>
        </div>
        <Button>
          Book Now
        </Button>
      </div>
    </div>
  );
};

function HotelDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [hotelData, setHotelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hotelId = params.hotelId as string;
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults') || '1';

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams({
          checkInDate: checkInDate || '',
          checkOutDate: checkOutDate || '',
          adults: adults
        });
        
        const response = await fetch(`/api/hotels/${hotelId}?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch hotel details');
        
        const data = await response.json();
        setHotelData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId, checkInDate, checkOutDate, adults]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <SkeletonLoader className="h-8 w-64" />
          <SkeletonLoader className="h-64" />
          <SkeletonLoader className="h-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">
          Hotel not found
        </div>
      </div>
    );
  }

  const { hotel, offers, searchParams: search, message } = hotelData;
  const rating = hotel.rating ? parseInt(hotel.rating) : 0;
  const hasOffers = offers && offers.length > 0;

  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      {/* Back Button */}
       <div className="mb-6">
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-primary hover:underline"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Hotels
    </button>
  </div>
   

      {/* Hotel Header */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{hotel.name || 'Hotel Details'}</h1>
            
            <div className="flex items-center mb-3">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {hotel.address?.lines?.[0] && `${hotel.address.lines[0]}, `}
                {hotel.address?.cityName || 'City'}
                {hotel.address?.countryName && `, ${hotel.address.countryName}`}
              </span>
            </div>
            
            {rating > 0 ? (
              <StarRating rating={rating} />
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <HotelIcon className="h-4 w-4 mr-2" />
                <span>Rating not available</span>
              </div>
            )}

            {/* Hotel Location Coordinates */}
            {hotel.geoCode && (
              <div className="mt-3 text-sm text-muted-foreground">
                <span>Location: {hotel.geoCode.latitude}°N, {hotel.geoCode.longitude}°E</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 bg-muted/30 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Your Search</div>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {checkInDate && checkOutDate ? (
                  <span>
                    {formatDate(checkInDate, 'MMM dd')} - {formatDate(checkOutDate, 'MMM dd, yyyy')}
                  </span>
                ) : (
                  <span>Dates not specified</span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                <span>{adults} Adult{parseInt(adults) > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Image Placeholder */}
      <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-6">
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-2">🏨</div>
          <p>Hotel Images Coming Soon</p>
        </div>
      </div>

      {/* Hotel Amenities */}
      <HotelAmenities hotel={hotel} />

      {/* Contact Information */}
      <HotelContact hotel={hotel} />

      {/* Available Offers or Message */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Rooms & Rates</h2>
        
        {hasOffers ? (
          <div className="space-y-4">
            {offers.map((offer: any, index: number) => (
              <OfferCard key={index} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 text-center">
            <HotelIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Rooms Currently Unavailable</h3>
            <p className="text-muted-foreground mb-4">
              {message || 'No rooms are available for the selected dates in our test environment.'}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Try different dates to see availability</p>
              <p>• Contact the hotel directly for real-time rates</p>
              <p>• This is a demo using Amadeus test data</p>
            </div>
            <div className="mt-6 space-y-2">
              <Button className="w-full md:w-auto">
                Contact Hotel Directly
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {hotel.hotelId && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
          <p><strong>Note:</strong> This is a demonstration using Amadeus test environment data. 
          In a production environment, you would see real-time availability and pricing.</p>
        </div>
      )}
    </div>
  );
}

export default function HotelDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <HotelDetailsContent />
    </Suspense>
  );
}
