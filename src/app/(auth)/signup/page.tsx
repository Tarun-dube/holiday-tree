'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // On successful signup, redirect to the login page for them to sign in
      router.push('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use the theme's background color
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Apply the same themed card styles as the login page */}
      <Card className="w-full max-w-md shadow-2xl rounded-xl transition-transform hover:scale-[1.01] animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            // Use the theme's 'destructive' color for error messages
            <p className="bg-destructive/10 text-destructive p-3 rounded-md text-center mb-4">
              {error}
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            {/* Use the theme's primary color for the link */}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}