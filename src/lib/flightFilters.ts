// Convert ISO 8601 duration (e.g., "PT5H30M") to total minutes
function durationToMinutes(duration: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

// ✅ Corrected function to apply filters to your SIMPLIFIED flight objects
export function applyFlightFilters(
  allFlights: any[],
  activeStops: number | null,
  activeSort: string | null
): any[] {
  let flights = [...allFlights];

  // Filter by stops (now much simpler)
  if (activeStops !== null) {
    // We just read the 'stops' property directly from the object
    flights = flights.filter(flight => flight.stops === activeStops);
  }

  // Sort by price
  if (activeSort === 'price') {
    flights.sort(
      (a, b) => parseFloat(a.price?.total || '0') - parseFloat(b.price?.total || '0')
    );
  }

  // Sort by duration
  if (activeSort === 'duration') {
    flights.sort(
      (a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration)
    );
  }

  return flights;
}