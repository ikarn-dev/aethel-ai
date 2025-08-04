'use client';

import React, { useState } from 'react';
import { TraderData } from '@/lib/traders/types';
import Link from 'next/link';

interface TradersTableProps {
  traders: TraderData[];
}

function TraderRow({ trader }: { trader: TraderData }) {
  const [isCopied, setIsCopied] = useState(false);

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return `${num.toFixed(2)}`;
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(trader.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <tr className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200">
      {/* Rank */}
      <td className="px-6 py-4">
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">#{trader.rank}</span>
        </div>
      </td>

      {/* Address */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div>
            <div className="text-white font-mono text-sm font-medium">
              {trader.displayAddress}
            </div>
            <div className="text-gray-400 text-xs">
              {trader.network.toUpperCase()}
            </div>
          </div>
          <button
            onClick={handleCopyAddress}
            className={`relative p-1.5 rounded-lg transition-all duration-300 ${
              isCopied 
                ? 'text-green-400 bg-green-900/30 scale-110' 
                : 'text-gray-400 hover:text-teal-400 hover:bg-teal-900/30'
            }`}
            title={isCopied ? "Copied!" : "Copy address"}
          >
            <div className="relative">
              {isCopied ? (
                <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            
            {/* Copy feedback animation */}
            {isCopied && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-out whitespace-nowrap">
                Copied!
              </div>
            )}
          </button>
        </div>
      </td>

      {/* P&L */}
      <td className="px-6 py-4">
        <div className={`font-bold text-lg ${getPnLColor(trader.pnl)}`}>
          {formatNumber(trader.pnl)}
        </div>
      </td>

      {/* Volume */}
      <td className="px-6 py-4">
        <div className="text-white font-bold text-lg">
          {formatNumber(trader.totalVolume)}
        </div>
      </td>

      {/* Trades */}
      <td className="px-6 py-4">
        <div className="text-white font-semibold">
          {trader.totalTrades.toLocaleString()}
        </div>
      </td>

      {/* Avg Size */}
      <td className="px-6 py-4">
        <div className="text-white font-semibold">
          {formatNumber(trader.avgTradeSize)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <Link
          href={`/app/analysis?wallet=${trader.address}`}
          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all text-sm font-medium"
        >
          Analyze
        </Link>
      </td>
    </tr>
  );
}

export default function TradersTable({ traders }: TradersTableProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full bg-slate-800">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trades
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Avg Size
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {traders.map((trader, index) => (
              <TraderRow key={`${trader.address}-${index}`} trader={trader} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}