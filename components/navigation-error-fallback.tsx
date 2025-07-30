import React from 'react';
import Link from 'next/link';

interface NavigationErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export default function NavigationErrorFallback({ error, onRetry }: NavigationErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Navigation Error
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're having trouble loading this page. This might be a temporary issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          )}
          
          <Link
            href="/app"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Go to Main Chat
          </Link>
          
          <Link
            href="/app/agents"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Go to Agents
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error details (development only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-red-600 overflow-auto">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}