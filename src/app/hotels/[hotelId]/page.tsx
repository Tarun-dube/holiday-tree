import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';
import Link from 'next/link';

async function getHotelDetails(hotelId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hotels/${hotelId}`);
  if (!res.ok) throw new Error('Failed to fetch hotel details');
  return res.json();
}

async function getHotelReviews(hotelId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hotels/${hotelId}/reviews`);
  if (!res.ok) return []; // Return empty array if reviews fail
  return res.json();
}

export default async function HotelDetailPage({ params }: { params: { hotelId: string } }) {
  const hotelData = await getHotelDetails(params.hotelId);
  const reviews = await getHotelReviews(params.hotelId);
  const { hotel, offers } = hotelData;
  const offer = offers[0]; // Display the first available offer

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* You would have a gallery of images here */}
        <div className="bg-gray-200 h-64 flex items-center justify-center">
          <p>Hotel Image Gallery</p>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <p className="text-gray-600 mt-2">{hotel.address.lines[0]}, {hotel.address.cityName}</p>
          <div className="flex items-center my-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={i < parseInt(hotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <div className="prose max-w-none mt-4">
            <p>{hotel.description?.text || 'No description available.'}</p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Starting from</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(parseFloat(offer.price.total))}</p>
            </div>
            {/* Pass offer details via query params to the booking page */}
            <Link href={`/book?offerId=${offer.id}&hotelName=${encodeURIComponent(hotel.name)}&price=${offer.price.total}`}>
              <Button size="lg">Book Now</Button>
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-2">
                  <p className="font-semibold">{review.user.name}</p>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet for this hotel.</p>
          )}
        </div>
      </div>
    </div>
  );
}