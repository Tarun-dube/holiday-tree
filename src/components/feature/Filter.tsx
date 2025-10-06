'use client';

import { Button } from '@/components/ui/Button';

interface FilterProps {
  activeSort: string | null;
  activeStops: number | null;
  onSortChange: (sort: string) => void;
  onStopsChange: (stops: number) => void;
  onClearFilters: () => void;
}

export default function Filter({
  activeSort,
  activeStops,
  onSortChange,
  onStopsChange,
  onClearFilters,
}: FilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={activeSort === 'duration' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortChange('duration')}
      >
        Duration
      </Button>

      <Button
        variant={activeSort === 'price' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortChange('price')}
      >
        Price
      </Button>

      <Button
        variant={activeStops === 0 ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStopsChange(0)}
      >
        Non-stop
      </Button>

      <Button
        variant={activeStops === 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStopsChange(1)}
      >
        1 Stop
      </Button>

      {(activeSort || activeStops !== null) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
