'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'; // Import Loader2
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Location {
  name: string;
  iataCode: string;
}

interface LocationSearchProps {
  onLocationSelect: (iataCode: string) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<Location | null>(null);
  const [isLoading, setIsLoading] = React.useState(false); // New loading state

  React.useEffect(() => {
    if (inputValue.length < 2) {
      setLocations([]);
      return;
    }

    setIsLoading(true); // Start loading
    const timer = setTimeout(() => {
      fetch(`/api/search-locations?keyword=${inputValue}`)
        .then((res) => res.json())
        .then((data) => {
          setLocations(data.error ? [] : data);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          {selectedValue ? selectedValue.name : 'Select a destination...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search for a city..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading ? (
              // Display spinner while loading
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  {locations.map((location) => (
                    <CommandItem
                      key={location.iataCode}
                      onSelect={() => {
                        setSelectedValue(location);
                        onLocationSelect(location.iataCode);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue?.iataCode === location.iataCode
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {location.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}