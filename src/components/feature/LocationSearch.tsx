'use client';

import * as React from 'react';
import { ChevronsUpDown, Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface LocationData {
  name: string;
  iataCode: string;
}

interface LocationSearchProps {
  onLocationSelect: (iataCode: string) => void;
  placeholder?: string;
  initialValue?: string | null;
}

export function LocationSearch({
  onLocationSelect,
  placeholder = "Search cities or airports...",
  initialValue,
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [locations, setLocations] = React.useState<LocationData[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialValue && !selectedValue) {
      const fetchInitialLocation = async () => {
        try {
          const response = await fetch(`/api/search-locations?keyword=${initialValue}`);
          const data = await response.json();
          if (data && data.length > 0) {
            const initialLocation = data.find((loc: LocationData) => loc.iataCode === initialValue);
            if (initialLocation) {
              setSelectedValue(initialLocation);
            }
          }
        } catch (error) {
          console.error("Failed to fetch initial location:", error);
        }
      };
      fetchInitialLocation();
    }
  }, [initialValue, selectedValue]);

  React.useEffect(() => {
    if (query.length < 2) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    const searchTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search-locations?keyword=${encodeURIComponent(query.trim())}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const responseData = await response.json();
        setLocations(responseData || []);
      } catch (fetchError) {
        console.error("Location search error:", fetchError);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleSelect = (location: LocationData) => {
    setSelectedValue(location);
    onLocationSelect(location.iataCode);
    setQuery(""); // Clear search query after selection
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between text-left font-normal h-auto"
        >
          <div className="flex items-center truncate">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className={cn("truncate", !selectedValue && "text-muted-foreground")}>
              {selectedValue ? selectedValue.name : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="flex items-center border-b px-3">
            <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
                placeholder="Type to search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
            {isLoading && (
              <div className="p-4 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            )}
            {!isLoading && locations.length === 0 && query.length >= 2 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
            )}
            {!isLoading && locations.length > 0 && (
              <div className="p-1">
                {locations.map((location) => (
                  <Button
                    variant="ghost"
                    key={location.iataCode}
                    onClick={() => handleSelect(location)}
                    className="w-full justify-start font-normal h-auto py-2"
                  >
                    <span className="truncate flex flex-col items-start">
                        <span>{location.name}</span>
                        <span className="text-xs text-muted-foreground">{location.iataCode}</span>
                    </span>
                  </Button>
                ))}
              </div>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}