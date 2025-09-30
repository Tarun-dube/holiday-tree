'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { LocationSearch } from '@/components/feature/LocationSearch';
import { Plane, Hotel, Users, Minus, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CombinedSearchForm() {
  const router = useRouter();
  
  // State for component control
  const [searchType, setSearchType] = useState<'flights' | 'hotels'>('flights');

  // State for all form inputs
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'flights') {
      // Return date is now required for flights
      if (!origin || !destination || !departureDate || !returnDate) {
        alert('Please fill out all fields for a round-trip flight search.');
        return;
      }
      const params = new URLSearchParams({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: format(departureDate, 'yyyy-MM-dd'),
        returnDate: format(returnDate, 'yyyy-MM-dd'), // Always include return date
        adults: adults.toString(),
      });
      router.push(`/flights?${params.toString()}`);

    } else if (searchType === 'hotels') {
      if (!destination || !departureDate || !returnDate) {
        alert('Please fill out all hotel search fields.');
        return;
      }
      const params = new URLSearchParams({
        cityCode: destination,
        checkInDate: format(departureDate, 'yyyy-MM-dd'),
        checkOutDate: format(returnDate, 'yyyy-MM-dd'),
        adults: adults.toString(),
        roomQuantity: rooms.toString(),
      });
      router.push(`/hotels?${params.toString()}`);
    }
  };

  const guestSummary = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}${searchType === 'hotels' ? `, ${rooms} Room${rooms > 1 ? 's' : ''}` : ''}`;

  return (
    <div className="bg-card rounded-xl shadow-xl p-6 border">
      {/* Tabs */}
      <div className="mb-4">
        <Button variant={searchType === 'flights' ? 'secondary' : 'ghost'} onClick={() => setSearchType('flights')}>
          <Plane className="mr-2 h-4 w-4" /> Flights
        </Button>
        <Button variant={searchType === 'hotels' ? 'secondary' : 'ghost'} onClick={() => setSearchType('hotels')}>
          <Hotel className="mr-2 h-4 w-4" /> Hotels
        </Button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Location Inputs */}
        <div className={cn("grid gap-4", searchType === 'flights' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1')}>
          {searchType === 'flights' && (
            <div>
              <Label>From</Label>
              <LocationSearch onLocationSelect={setOrigin} />
            </div>
          )}
          <div>
            <Label>{searchType === 'flights' ? 'To' : 'Destination'}</Label>
            <LocationSearch onLocationSelect={setDestination} />
          </div>
        </div>
        
        {/* Date Inputs with Calendar Popover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{searchType === 'flights' ? 'Departure Date' : 'Check-in Date'}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !departureDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>{searchType === 'flights' ? 'Return Date' : 'Check-out Date'}</Label>
            <Popover>
              <PopoverTrigger asChild>
                {/* The 'disabled' attribute has been removed */}
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guest Selector and Submit Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-2">
             <div>
                <Label>Travelers & Rooms</Label>
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><Users className="mr-2 h-4 w-4" />{guestSummary}</Button></PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Guests</h4>
                        <p className="text-sm text-muted-foreground">Select number of travelers.</p>
                      </div>
                      <div className="grid gap-2">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <Label>Adults</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setAdults(Math.max(1, adults - 1))}><Minus className="h-4 w-4" /></Button>
                            <span>{adults}</span>
                            <Button variant="outline" size="sm" onClick={() => setAdults(adults + 1)}><Plus className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <Label>Children</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setChildren(Math.max(0, children - 1))}><Minus className="h-4 w-4" /></Button>
                            <span>{children}</span>
                            <Button variant="outline" size="sm" onClick={() => setChildren(children + 1)}><Plus className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        {/* Rooms (Hotels only) */}
                        {searchType === 'hotels' && (
                          <div className="flex items-center justify-between">
                            <Label>Rooms</Label>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => setRooms(Math.max(1, rooms - 1))}><Minus className="h-4 w-4" /></Button>
                              <span>{rooms}</span>
                              <Button variant="outline" size="sm" onClick={() => setRooms(rooms + 1)}><Plus className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
             </div>
             <Button type="submit" className="w-full h-10">Search</Button>
        </div>
      </form>
    </div>
  );
}