"use client";

import React, { useState, useCallback } from 'react';

interface PageRetryHandlerProps {
  children: React.ReactNode;
  onRetry?: () => Promise<void> | void;
  maxRetries?: number;
}

export default function PageRetryHandler({ 
  children, 
  onRetry, 
  maxRetries = 3 
}: PageRetryHandlerProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Default retry behavior - reload the page
        window.location.reload();
      }
      setLastError(null);
    } catch (error) {
      setLastError(error as Error);
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, retryCount, maxRetries]);

  const handleReset = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
    setIsRetrying(false);
  }, []);

  // If we've exceeded max retries, show final error state
  if (retryCount >= maxRetries && lastError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Page
          </h2>
          
          <p className="text-gray-600 mb-4">
            We've tried loading this page {maxRetries} times but encountered persistent errors.
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Please check your internet connection or try again later.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reset and Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/app'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Main Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show retry UI if we're in a retry state
  if (isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-blue-600 animate-spin" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Retrying...
          </h2>
          
          <p className="text-gray-600">
            Attempt {retryCount} of {maxRetries}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}