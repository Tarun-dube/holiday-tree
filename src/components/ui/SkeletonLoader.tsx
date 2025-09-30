import { cn } from '@/lib/utils';

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted', // Use the theme's muted color
        'h-24 w-full', // Set a default size using Tailwind
        className // Allow custom classes to override the default size
      )}
    />
  );
}