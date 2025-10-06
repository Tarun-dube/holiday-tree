"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LocationSearch } from "@/components/feature/LocationSearch";
import {
  Plane,
  Hotel,
  Users,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Search,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SearchType = "flights" | "hotels";

export default function BookingSearchForm() {
  const router = useRouter();

  const [searchType, setSearchType] = useState<SearchType>("flights");
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [isDepartureCalendarOpen, setIsDepartureCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): string | null => {
    if (searchType === "flights") {
      if (!originLocation || !destinationLocation || !departureDate) {
        return "Please fill out origin, destination, and departure date for a flight search.";
      }
      if (originLocation === destinationLocation) return "Origin and destination must be different";
    } else { // hotels
      if (!destinationLocation || !departureDate || !returnDate) {
        return "Please fill out all hotel search fields.";
      }
    }
    if (returnDate && departureDate && returnDate <= departureDate) {
      return searchType === "flights"
        ? "Return date must be after departure date"
        : "Check-out date must be after check-in date";
    }
    return null;
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    const params = new URLSearchParams();

    if (searchType === "flights") {
      params.set("originLocationCode", originLocation);
      params.set("destinationLocationCode", destinationLocation);
      params.set("departureDate", format(departureDate!, "yyyy-MM-dd"));
      if (returnDate) {
        params.set("returnDate", format(returnDate, "yyyy-MM-dd"));
      }
      params.set("adults", adultCount.toString());
      router.push(`/flights?${params.toString()}`);
    } else {
      params.set("cityCode", destinationLocation);
      params.set("checkInDate", format(departureDate!, "yyyy-MM-dd"));
      params.set("checkOutDate", format(returnDate!, "yyyy-MM-dd"));
      params.set("adults", adultCount.toString());
      params.set("roomQuantity", roomCount.toString());
      router.push(`/hotels?${params.toString()}`);
    }
  };

  const generateGuestSummary = (): string => {
    const parts = [`${adultCount} Adult${adultCount > 1 ? "s" : ""}`];
    if (childrenCount > 0) parts.push(`${childrenCount} Child${childrenCount > 1 ? "ren" : ""}`);
    if (searchType === "hotels") parts.push(`${roomCount} Room${roomCount > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  return (
    <div className="bg-card rounded-xl shadow-xl p-6 border">
      <div className="flex mb-6 p-1 bg-muted rounded-lg">
        <Button
          type="button"
          variant={searchType === "flights" ? "default" : "ghost"}
          onClick={() => setSearchType("flights")}
          className="flex-1"
        >
          <Plane className="mr-2 h-4 w-4" /> Flights
        </Button>
        <Button
          type="button"
          variant={searchType === "hotels" ? "default" : "ghost"}
          onClick={() => setSearchType("hotels")}
          className="flex-1"
        >
          <Hotel className="mr-2 h-4 w-4" /> Hotels
        </Button>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-6">
        <div className={cn("grid gap-4", searchType === "flights" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
          {searchType === "flights" && (
            <div className="space-y-2">
              <Label>From</Label>
              <LocationSearch onLocationSelect={setOriginLocation} placeholder="Select origin..." />
            </div>
          )}
          <div className="space-y-2">
            <Label>{searchType === "flights" ? "To" : "Destination"}</Label>
            <LocationSearch onLocationSelect={setDestinationLocation} placeholder="Select destination..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{searchType === 'flights' ? 'Departure Date' : 'Check-in Date'}</Label>
            <Popover open={isDepartureCalendarOpen} onOpenChange={setIsDepartureCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !departureDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={(date) => { setDepartureDate(date); setIsDepartureCalendarOpen(false); }}
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>{searchType === 'flights' ? 'Return Date (Optional)' : 'Check-out Date'}</Label>
            <Popover open={isReturnCalendarOpen} onOpenChange={setIsReturnCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => { setReturnDate(date); setIsReturnCalendarOpen(false); }}
                  disabled={(date) => date < (departureDate || new Date(new Date().setDate(new Date().getDate() - 1)))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label>Travelers & Rooms</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Users className="mr-2 h-4 w-4" />
                  {generateGuestSummary()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Travelers</h4>
                    <p className="text-sm text-muted-foreground">Select number of travelers and rooms.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Adults</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} disabled={adultCount <= 1}><Minus className="h-4 w-4" /></Button>
                        <span className="w-8 text-center">{adultCount}</span>
                        <Button type="button" variant="outline" size="sm" onClick={() => setAdultCount(adultCount + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Children</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} disabled={childrenCount <= 0}><Minus className="h-4 w-4" /></Button>
                        <span className="w-8 text-center">{childrenCount}</span>
                        <Button type="button" variant="outline" size="sm" onClick={() => setChildrenCount(childrenCount + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    {searchType === 'hotels' && (
                      <div className="flex items-center justify-between">
                        <Label>Rooms</Label>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => setRoomCount(Math.max(1, roomCount - 1))} disabled={roomCount <= 1}><Minus className="h-4 w-4" /></Button>
                          <span className="w-8 text-center">{roomCount}</span>
                          <Button type="button" variant="outline" size="sm" onClick={() => setRoomCount(roomCount + 1)}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
            ) : (
              <><Search className="mr-2 h-4 w-4" /> Search {searchType === 'flights' ? 'Flights' : 'Hotels'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}