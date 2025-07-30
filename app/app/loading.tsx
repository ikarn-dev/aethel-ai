import React from 'react';

export default function AppLoading() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Message skeletons */}
        <div className="flex justify-start">
          <div className="max-w-[70%] bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[70%] bg-gray-200 rounded-lg px-4 py-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[70%] bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}