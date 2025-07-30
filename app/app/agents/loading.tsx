import React from 'react';

export default function AgentsLoading() {
  return (
    <div className="flex h-full bg-white">
      {/* Agent List Skeleton */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Agent List */}
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        </div>
      </div>
    </div>
  );
}