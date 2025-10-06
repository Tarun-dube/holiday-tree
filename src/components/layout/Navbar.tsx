'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Plane } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  // Get first initial from user name or email
  const userInitial =
    session?.user?.name?.[0]?.toUpperCase() ||
    session?.user?.email?.[0]?.toUpperCase() ||
    '?';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Brand/Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary transition-transform hover:scale-105"
          >
            <Plane />
            Holiday
          </Link>

          {/* Navigation / Auth */}
          <div className="flex items-center space-x-4">
            {/* Loading State */}
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
                {/* Profile Circle with Initial */}
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
                >
                  {userInitial}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
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
