import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSeed?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackSeed, 
  containerClassName,
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getFallbackUrl = (seed: string) => {
    return `https://picsum.photos/seed/${seed}/400/500`;
  };

  const finalSrc = error || !src 
    ? getFallbackUrl(fallbackSeed || 'luxury') 
    : src;

  return (
    <div className={cn("relative overflow-hidden bg-luxury-cream/50", containerClassName)}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-luxury-gold/5" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={cn(
          "transition-all duration-700",
          !loaded ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) setError(true);
        }}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
}
