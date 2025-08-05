'use client';

import React, { useState, useEffect } from 'react';

interface PnLCardProps {
  walletAddress: string;
  onPnLDataUpdate?: (pnlData: PnLData | null) => void;
}

interface PnLData {
  address: string;
  pnl: number;
  timeframe: 'today' | 'yesterday' | '1W';
  rank: number;
  totalVolume: number;
  totalTrades: number;
  avgTradeSize: number;
  lastUpdated: number;
}

export function PnLCard({ walletAddress, onPnLDataUpdate }: PnLCardProps) {
  const [pnlData, setPnlData] = useState<PnLData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | '1W'>('1W');

  const formatPnL = (pnl: number) => {
    const isPositive = pnl >= 0;
    const formatted = Math.abs(pnl) >= 1000000 
      ? `${(Math.abs(pnl) / 1000000).toFixed(2)}M`
      : Math.abs(pnl) >= 1000
      ? `${(Math.abs(pnl) / 1000).toFixed(2)}K`
      : Math.abs(pnl).toFixed(2);
    
    return `${isPositive ? '+' : '-'}$${formatted}`;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const fetchPnLData = async (selectedTimeframe: 'today' | 'yesterday' | '1W') => {
    try {
      setIsLoading(true);

      // Get cached traders data from localStorage
      const cacheKey = `traders_${selectedTimeframe}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const trader = parsedData.traders?.find((t: any) => t.address === walletAddress);
          
          if (trader) {
            const pnlInfo: PnLData = {
              address: trader.address,
              pnl: trader.pnl,
              timeframe: selectedTimeframe,
              rank: trader.rank,
              totalVolume: trader.totalVolume,
              totalTrades: trader.totalTrades,
              avgTradeSize: trader.avgTradeSize,
              lastUpdated: parsedData.lastUpdated || Date.now()
            };
            
            setPnlData(pnlInfo);
            onPnLDataUpdate?.(pnlInfo);
          } else {
            // Wallet not found in cached data - mark as not ranked
            setPnlData(null);
            onPnLDataUpdate?.(null);
          }
        } catch (parseError) {
          console.warn('Failed to parse cached traders data:', parseError);
          setPnlData(null);
          onPnLDataUpdate?.(null);
        }
      } else {
        // No cached data available
        setPnlData(null);
        onPnLDataUpdate?.(null);
      }
    } catch (err) {
      console.error('Failed to fetch PnL data:', err);
      setPnlData(null);
      onPnLDataUpdate?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchPnLData(timeframe);
    }
  }, [walletAddress, timeframe]);

  // Timeframe is now fixed to 1W since buttons are removed
  // const handleTimeframeChange = (newTimeframe: 'today' | 'yesterday' | '1W') => {
  //   setTimeframe(newTimeframe);
  // };

  // Match the exact styling of other cards with teal theme
  return (
    <div className="rounded-xl p-4 border border-teal-400/20 bg-teal-500/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-300 text-sm font-medium">Trading P&L</div>
        <div className="text-teal-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="text-white text-xl font-bold mb-1">Loading...</div>
          <div className="text-gray-400 text-xs mb-3">Checking rankings</div>
        </>
      ) : pnlData ? (
        <>
          <div className={`text-xl font-bold mb-1 ${getPnLColor(pnlData.pnl)}`}>
            {formatPnL(pnlData.pnl)}
          </div>
          <div className="text-gray-400 text-xs mb-3">
            Rank #{pnlData.rank} • {pnlData.totalTrades.toLocaleString()} trades
          </div>
        </>
      ) : (
        <>
          <div className="text-white text-xl font-bold mb-1">Not Ranked</div>
          <div className="text-gray-400 text-xs mb-3">Not in top traders</div>
        </>
      )}


    </div>
  );
}