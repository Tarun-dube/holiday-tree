'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Plane } from 'lucide-react'; // An icon for the brand

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    // 'sticky top-0 z-50' makes the navbar stick to the top
    // 'bg-background/80 backdrop-blur-sm' creates the cool, semi-transparent glass effect
    // 'border-b' adds a clean line separating the nav from the content below
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Brand/Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary transition-transform hover:scale-105">
            <Plane />
            Holiday
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/flights" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Flights
            </Link>
            <Link href="/hotels" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Hotels
            </Link>
            
            {/* Loading State Skeleton */}
            {status === 'loading' && (
              <div className="w-24 h-10 bg-muted rounded-md animate-pulse"></div>
            )}

            {/* Unauthenticated State */}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}

            {/* Authenticated State */}
            {status === 'authenticated' && (
              <>
                <Link href="/profile/my-bookings" className="font-medium text-muted-foreground transition-colors hover:text-primary">
                  My Bookings
                </Link>
                <span className="text-sm text-foreground">
                  Hi, {session.user?.name?.split(' ')[0]}
                </span>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}