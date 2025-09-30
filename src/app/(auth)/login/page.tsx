'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2 } from 'lucide-react'; // A nice loading spinner icon

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError(result?.error || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    // Use the theme's background color
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* The base Card component now gets its colors from the theme */}
      <Card className="w-full max-w-md shadow-2xl rounded-xl transition-transform hover:scale-[1.01] animate-fade-in-up">
        <CardHeader>
          {/* Text colors are inherited from the theme's foreground color */}
          <CardTitle className="text-3xl font-bold text-center">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            // Use the theme's 'destructive' colors for errors
            <p className="bg-destructive/10 text-destructive p-3 rounded-md text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {/* The Input component is already themed */}
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
            {/* The default Button is now your primary green button from the theme */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              {/* Use the theme's border color */}
              <span className="w-full border-t" /> 
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              {/* Use the theme's background and muted foreground colors */}
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            {/* Use the theme's primary color for the link */}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}