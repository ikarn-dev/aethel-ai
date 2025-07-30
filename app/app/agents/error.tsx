"use client";

import React from 'react';
import NavigationErrorFallback from '@/components/navigation-error-fallback';

interface AgentsErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentsError({ error, reset }: AgentsErrorPageProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Agents page error:', error);
  }, [error]);

  return <NavigationErrorFallback error={error} onRetry={reset} />;
}