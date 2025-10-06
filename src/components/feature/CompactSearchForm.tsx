'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LocationSearch } from '@/components/feature/LocationSearch';
import { Users, Search } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CompactSearchFormProps {
  initialValues?: {
    originLocationCode?: string | null;
    destinationLocationCode?: string | null;
    departureDate?: string | null;
    adults?: string | null;
  };
}

export default function CompactSearchForm({ initialValues }: CompactSearchFormProps) {
  const router = useRouter();

  const [origin, setOrigin] = useState(initialValues?.originLocationCode || '');
  const [destination, setDestination] = useState(initialValues?.destinationLocationCode || '');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    initialValues?.departureDate ? parseISO(initialValues.departureDate) : undefined
  );
  const [adults, setAdults] = useState(parseInt(initialValues?.adults || '1'));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
        alert("Please fill out all search fields.");
        return;
    }
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      adults: adults.toString(),
    });
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 md:grid-cols-[2fr,2fr,2fr,1fr,auto] border rounded-lg bg-card"
    >
      <div className="relative flex flex-col justify-center p-3 border-b md:border-b-0 md:border-r">
        <label className="text-xs text-muted-foreground">Leaving from</label>
        <LocationSearch
          onLocationSelect={setOrigin}
          initialValue={origin}
          placeholder="Origin"
        />
      </div>

      <div className="relative flex flex-col justify-center p-3 border-b md:border-b-0 md:border-r">
        <label className="text-xs text-muted-foreground">Going to</label>
        <LocationSearch
          onLocationSelect={setDestination}
          initialValue={destination}
          placeholder="Destination"
        />
      </div>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="flex flex-col items-start justify-center p-3 text-left border-b md:border-b-0 md:border-r h-full">
            <label className="text-xs text-muted-foreground">Travel dates</label>
            <span className="text-lg font-semibold flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {departureDate ? format(departureDate, 'MMM dd, yyyy') : 'Select Date'}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={departureDate}
            onSelect={(date) => {
              setDepartureDate(date);
              setIsCalendarOpen(false);
            }}
            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </PopoverContent>
      </Popover>

       <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="flex flex-col items-start justify-center p-3 text-left h-full">
            <label className="text-xs text-muted-foreground">Travellers</label>
            <span className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                {adults} Adult(s)
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4">
            <div className="flex items-center justify-between">
                <span className="font-medium">Adults</span>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdults(p => Math.max(1, p - 1))}>-</Button>
                    <span>{adults}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdults(p => p + 1)}>+</Button>
                </div>
            </div>
        </PopoverContent>
      </Popover>

      <div className="p-2">
        <Button type="submit" className="w-full h-full text-lg">
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </Button>
      </div>
    </form>
  );
}