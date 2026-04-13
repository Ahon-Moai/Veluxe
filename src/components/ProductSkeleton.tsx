import { motion } from 'motion/react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col space-y-8 animate-pulse">
      <div className="relative w-full aspect-[4/5] bg-gray-100" />
      <div className="flex flex-col items-center space-y-3">
        <div className="h-4 w-3/4 bg-gray-100" />
        <div className="h-3 w-1/4 bg-gray-100" />
        <div className="grid grid-cols-2 gap-3 w-full pt-6">
          <div className="h-11 bg-gray-100" />
          <div className="h-11 bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
