"use client";

import React from 'react';
import NavigationErrorFallback from '@/components/navigation/navigation-error-fallback';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('App route error:', error);
  }, [error]);

  return <NavigationErrorFallback error={error} onRetry={reset} />;
}