'use client';

import React, { useState, useEffect } from 'react';
import { tradersService } from '@/lib/traders/service';
import { TraderData, TradersRequest } from '@/lib/traders/types';
import LoadingIcon from '@/components/ui/common/loading-icon';
import TradersTable from '@/components/ui/common/traders-table';
import Link from 'next/link';

export default function TradersPage() {
  const [traders, setTraders] = useState<TraderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [timeframe, setTimeframe] = useState<TradersRequest['type']>('1W');
  const sortBy: TradersRequest['sortBy'] = 'PnL'; // Fixed to PnL since it's the only option
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const pageSize = 10; // Birdeye API limit is 1-10

  // Cooldown management with auto-retry for rate limit errors
  const startCooldown = (seconds: number, autoRetry: boolean = false) => {
    setIsOnCooldown(true);
    setCooldownTime(seconds);

    const interval = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsOnCooldown(false);
          
          // Auto-retry for rate limit errors when cooldown expires
          if (autoRetry && error.includes('Rate limit')) {
            setTimeout(() => {
              loadTraders(1, true);
            }, 500); // Small delay before retry
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loadTraders = async (page: number, reset: boolean = false) => {
    // Check if we're on cooldown
    if (isOnCooldown && page > 1) {
      return;
    }

    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError('');

      const response = await tradersService.getTradersByPage(page, pageSize, timeframe, sortBy);

      if (reset || page === 1) {
        setTraders(response.traders);
      } else {
        setTraders(prev => [...prev, ...response.traders]);
      }

      setHasMore(response.hasMore);
      setCurrentPage(page);

      // Start cooldown after successful load (except for initial load)
      if (page > 1) {
        startCooldown(2); // 2 second cooldown between requests
      }

    } catch (err) {
      console.error('Failed to load traders:', err);
      
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'Failed to load traders';
      let cooldownTime = 5; // Default cooldown on error
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        if (errorText.includes('429') || errorText.includes('rate limit') || errorText.includes('too many requests')) {
          errorMessage = 'Rate limit exceeded. The API is temporarily unavailable due to high demand. Please wait a moment and try again.';
          cooldownTime = 10; // Longer cooldown for rate limit errors
        } else if (errorText.includes('500') || errorText.includes('internal server error')) {
          errorMessage = 'Server error. The trading data service is temporarily unavailable. Please try again in a few moments.';
          cooldownTime = 8;
        } else if (errorText.includes('503') || errorText.includes('service unavailable')) {
          errorMessage = 'Service temporarily unavailable. The trading data provider is under maintenance. Please try again later.';
          cooldownTime = 15;
        } else if (errorText.includes('network') || errorText.includes('fetch')) {
          errorMessage = 'Network connection error. Please check your internet connection and try again.';
          cooldownTime = 5;
        } else if (errorText.includes('timeout')) {
          errorMessage = 'Request timeout. The server took too long to respond. Please try again.';
          cooldownTime = 7;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);

      // Start longer cooldown on error with dynamic timing and auto-retry for rate limits
      const shouldAutoRetry = err instanceof Error && (
        err.message.toLowerCase().includes('429') || 
        err.message.toLowerCase().includes('rate limit') || 
        err.message.toLowerCase().includes('too many requests')
      );
      
      if (page > 1) {
        startCooldown(cooldownTime, shouldAutoRetry);
      } else {
        // For initial page load, also enable auto-retry for rate limit errors
        startCooldown(cooldownTime, shouldAutoRetry);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadTraders(1, true);
  }, [timeframe]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && !isOnCooldown) {
      loadTraders(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingIcon size={48} animate={true} className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <p className="text-teal-300">Loading top traders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Top Traders
                </h1>
                <p className="text-sm text-gray-300">
                  Discover the most successful Solana traders
                </p>
              </div>
            </div>

            <Link
              href="/app/agents"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white border border-slate-600/30 hover:border-teal-400/30 text-sm rounded-lg transition-all"
            >
              Back to Agents
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Timeframe:</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as TradersRequest['type'])}
                className="px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm focus:outline-none focus:border-teal-400/50"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="1W">1 Week</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Sort by:</label>
              <div className="px-3 py-1 bg-slate-800/30 border border-slate-600/30 rounded-lg text-gray-400 text-sm">
                P&L (Only option available)
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Showing {traders.length} traders
              </div>

              {/* Rate Limit Status Indicator */}
              {isOnCooldown && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded-full text-xs text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Rate limit cooldown: {cooldownTime}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-red-300 font-medium">Error Loading Traders</span>
                    {isOnCooldown && (
                      <div className="flex items-center space-x-1 text-xs text-red-400/70">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Auto-retry in {cooldownTime}s</span>
                      </div>
                    )}
                  </div>
                  <p className="text-red-300/80 text-sm mt-1 leading-relaxed">{error}</p>
                  <div className="flex items-center space-x-3 mt-3">
                    <button
                      onClick={() => loadTraders(1, true)}
                      disabled={isOnCooldown}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-all flex items-center space-x-2"
                    >
                      {isOnCooldown ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retrying...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Try Again</span>
                        </>
                      )}
                    </button>
                    <div className="text-xs text-gray-400">
                      {error.includes('Rate limit') ? (
                        'High API demand - automatic retry enabled'
                      ) : error.includes('Server error') ? (
                        'Service issue - please wait a moment'
                      ) : (
                        'Check your connection and try again'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {traders.length > 0 ? (
            <>
              {/* Traders Table */}
              <div className="mb-8">
                <TradersTable traders={traders} />
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center space-y-3">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || isOnCooldown}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                  >
                    {isLoadingMore ? (
                      <>
                        <LoadingIcon size={20} animate={true} className="w-5 h-5" />
                        <span>Loading...</span>
                      </>
                    ) : isOnCooldown ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Wait {cooldownTime}s</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Traders</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Cooldown Info */}
                  {isOnCooldown && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Rate limit protection - preventing API overload</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            !error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Traders Found</h3>
                <p className="text-gray-400">
                  No trading data available for the selected timeframe and filters.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}