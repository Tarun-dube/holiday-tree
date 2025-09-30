'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProfileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/profile', label: 'My Profile' },
    { href: '/profile/my-bookings', label: 'My Bookings' },
    // You can add more links here in the future
  ];

  return (
    <nav className="flex flex-col space-y-2 p-4 bg-card border rounded-lg">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'p-2 rounded-md transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-semibold' // Active link style
                : 'hover:bg-accent hover:text-accent-foreground' // Inactive link style
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}