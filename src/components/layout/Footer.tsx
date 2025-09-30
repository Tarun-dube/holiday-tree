import Link from 'next/link';
import { Plane, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    // Use the theme's 'muted' color for a soft, distinct background
    <footer className="bg-muted border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
          
          {/* Brand & Description */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-xl font-bold text-primary">
              <Plane />
              <h3>Hodliday</h3>
            </div>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Your seamless solution for booking flights and hotels worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex justify-center space-x-6 font-medium text-muted-foreground">
            <Link href="/about" className="transition-all hover:text-primary hover:-translate-y-0.5">About</Link>
            <Link href="/contact" className="transition-all hover:text-primary hover:-translate-y-0.5">Contact</Link>
            <Link href="/faq" className="transition-all hover:text-primary hover:-translate-y-0.5">FAQ</Link>
            <Link href="/terms-of-service" className="transition-all hover:text-primary hover:-translate-y-0.5">Terms</Link>
          </nav>

          {/* Social Media Links */}
          <div className="flex-1 flex justify-center md:justify-end items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-all hover:text-primary hover:-translate-y-0.5">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-all hover:text-primary hover:-translate-y-0.5">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-all hover:text-primary hover:-translate-y-0.5">
              <Instagram size={24} />
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground border-t mt-8 pt-6">
          <p>&copy; {new Date().getFullYear()} TravelPlanner. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}