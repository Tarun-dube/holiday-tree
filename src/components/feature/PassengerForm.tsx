'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus, Minus, Loader2 } from 'lucide-react';

// --- Best Practice: Define types outside the component ---
type Passenger = {
  id: string; // Use a unique ID for React keys
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | ''; // Use a union type for specific values
  dob: Date | undefined;
  nationality: string;
  passportNumber: string;
  passportExpiry: Date | undefined;
};

type ContactDetails = {
  email: string;
  mobile: string;
};

// A small list of countries for the dropdown.
// In a real app, you'd fetch this from an API or a larger constants file.
const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const createNewTraveler = (): Passenger => ({
    id: crypto.randomUUID(), // Generate a unique ID for the key prop
    firstName: '',
    lastName: '',
    gender: '',
    dob: undefined,
    nationality: '',
    passportNumber: '',
    passportExpiry: undefined,
});


export default function PassengerForm({
  // Note: Replace `any` with a more specific type from your API
  pricedOffer,
  onNext,
}: {
  pricedOffer: any;
  onNext: (travelers: Passenger[], contact: ContactDetails) => void;
}) {
  const [travelers, setTravelers] = useState<Passenger[]>([createNewTraveler()]);
  const [contact, setContact] = useState<ContactDetails>({ email: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTravelerChange = (index: number, field: keyof Passenger, value: unknown) => {
    const updatedTravelers = [...travelers];
    // A type assertion is needed here because the value can be of different types
    (updatedTravelers[index] as any)[field] = value;
    setTravelers(updatedTravelers);
  };

  const addTraveler = () => {
    setTravelers([...travelers, createNewTraveler()]);
  };

  const removeTraveler = (index: number) => {
    const updatedTravelers = travelers.filter((_, i) => i !== index);
    setTravelers(updatedTravelers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // --- Improved Validation ---
    if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!contact.mobile) {
      setError('Please provide a mobile number.');
      return;
    }
    for (const t of travelers) {
      if (!t.firstName || !t.lastName || !t.gender || !t.dob || !t.nationality || !t.passportNumber || !t.passportExpiry) {
        setError(`Please fill all details for passenger ${travelers.indexOf(t) + 1}.`);
        return;
      }
    }
    
    setLoading(true);
    // Simulate an API call before proceeding
    setTimeout(() => {
        onNext(travelers, contact);
        setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-6">
      {travelers.map((p, i) => (
        <div key={p.id} className="p-4 border rounded-md space-y-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Passenger {i + 1}</h3>
            {travelers.length > 1 && (
                <Button variant="ghost" size="icon" type="button" onClick={() => removeTraveler(i)} className="absolute top-2 right-2">
                    <Minus className="h-4 w-4 text-red-500" aria-label={`Remove Passenger ${i+1}`} />
                </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`firstName-${i}`}>First Name</Label>
                <Input id={`firstName-${i}`} placeholder="First Name" value={p.firstName} onChange={(e) => handleTravelerChange(i, 'firstName', e.target.value)} required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`lastName-${i}`}>Last Name</Label>
                <Input id={`lastName-${i}`} placeholder="Last Name" value={p.lastName} onChange={(e) => handleTravelerChange(i, 'lastName', e.target.value)} required/>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`gender-${i}`}>Gender</Label>
                <Select value={p.gender} onValueChange={(value) => handleTravelerChange(i, 'gender', value)}>
                    <SelectTrigger id={`gender-${i}`}><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`dob-${i}`}>Date of Birth</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button id={`dob-${i}`} variant="outline" className="w-full justify-start font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {p.dob ? format(p.dob, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={p.dob} onSelect={(date) => handleTravelerChange(i, 'dob', date)} initialFocus /></PopoverContent>
                </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor={`nationality-${i}`}>Nationality</Label>
                  <Select value={p.nationality} onValueChange={(value) => handleTravelerChange(i, 'nationality', value)}>
                      <SelectTrigger id={`nationality-${i}`}><SelectValue placeholder="Select Nationality" /></SelectTrigger>
                      <SelectContent>
                          {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor={`passportNumber-${i}`}>Passport Number</Label>
                  <Input id={`passportNumber-${i}`} placeholder="Passport Number" value={p.passportNumber} onChange={(e) => handleTravelerChange(i, 'passportNumber', e.target.value)} required/>
              </div>
          </div>

           <div className="space-y-2">
                <Label htmlFor={`passportExpiry-${i}`}>Passport Expiry Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                         <Button id={`passportExpiry-${i}`} variant="outline" className="w-full justify-start font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {p.passportExpiry ? format(p.passportExpiry, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={p.passportExpiry} onSelect={(date) => handleTravelerChange(i, 'passportExpiry', date)} initialFocus /></PopoverContent>
                </Popover>
           </div>
        </div>
      ))}

      <Button variant="outline" type="button" onClick={addTraveler} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Another Passenger
      </Button>

      <div>
        <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" placeholder="+91 98765 43210" value={contact.mobile} onChange={(e) => setContact({...contact, mobile: e.target.value})} required/>
            </div>
        </div>
      </div>


      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {loading ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  );
}