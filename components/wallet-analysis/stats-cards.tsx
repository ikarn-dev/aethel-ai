'use client';

import React, { useState } from 'react';
import { WalletAnalysisResult } from '@/lib/wallet-analysis/types';
import { PnLCard } from './pnl-card';

interface StatsCardsProps {
  analysis: WalletAnalysisResult;
}

// Crypto Stats Card Component
function StatsCard({ title, value, subtitle, icon, color = "teal" }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    teal: "border-teal-400/20 bg-teal-500/10",
    green: "border-green-400/20 bg-green-500/10",
    red: "border-red-400/20 bg-red-500/10",
    yellow: "border-yellow-400/20 bg-yellow-500/10",
    blue: "border-blue-400/20 bg-blue-500/10"
  };

  return (
    <div className={`rounded-xl p-4 border backdrop-blur-sm ${colorClasses[color as keyof typeof colorClasses] || colorClasses.teal}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-300 text-sm font-medium">{title}</div>
        <div className="text-teal-400">{icon}</div>
      </div>
      <div className="text-white text-xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-gray-400 text-xs">{subtitle}</div>}
    </div>
  );
}

export function StatsCards({ analysis }: StatsCardsProps) {
  const [showCopied, setShowCopied] = React.useState(false);
  const [pnlData, setPnlData] = useState<any>(null);

  // Format wallet address for display (show first 6 and last 4 characters)
  const formatWalletAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle copy to clipboard with animation
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(analysis.walletData.address);
      setShowCopied(true);
      // Hide the animation after 1 second
      setTimeout(() => setShowCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Wallet Address Header */}
      <div className="mb-4 p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-gray-300 text-sm font-medium">Wallet Address</div>
            <div className="text-white text-sm font-mono">{formatWalletAddress(analysis.walletData.address)}</div>
          </div>
          <div className="ml-auto relative">
            <button
              onClick={handleCopyAddress}
              className="p-2 text-gray-400 hover:text-teal-400 transition-colors rounded-lg hover:bg-teal-900/20"
              title="Copy full address"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            
            {/* Copied Animation */}
            {showCopied && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white text-xs px-2 py-1 rounded-md shadow-lg animate-pulse">
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Overview Stats - Now 4 Cards including PnL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="SOL Balance"
          value={`${(analysis.walletData.nativeBalance || 0).toFixed(9)} SOL`}
          subtitle="Native balance"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="teal"
        />
        <StatsCard
          title="Token Types"
          value={analysis.walletData.tokenBalances.length}
          subtitle="Different assets"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="teal"
        />
        <StatsCard
          title="Transactions"
          value={analysis.walletData.totalTransactions}
          subtitle="Total on-chain activity"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="teal"
        />
        
        {/* PnL Card */}
        <PnLCard 
          walletAddress={analysis.walletData.address}
          onPnLDataUpdate={(data) => setPnlData(data)}
        />
      </div>
    </div>
  );
}