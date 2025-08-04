'use client';

import React, { useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { useWalletBalance } from '../../hooks/use-wallet-balance';

interface WalletStatusProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({ 
  className = '',
  showBalance = false, // Changed default to false
  compact = false
}) => {
  const { connected, connecting, publicKey, formatAddress, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (publicKey?.toString()) {
      try {
        await navigator.clipboard.writeText(publicKey.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  if (!connected && !connecting) {
    return null;
  }

  if (connecting) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm text-gray-700 font-medium">
          {formatAddress(publicKey?.toString())}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 p-4 ${className}`}>
      {/* Header - Wallet Connected and Disconnect in same row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-300">Wallet Connected</span>
        </div>
        <button
          onClick={disconnect}
          className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Address - All in same row */}
      <div className="relative">
        <div className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-xs text-gray-400">Address</span>
            <span className="text-xs font-mono text-gray-200">
              {formatAddress(publicKey?.toString())}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-gray-600 rounded transition-colors"
              title="Copy address"
            >
              <svg 
                className={`w-3 h-3 text-gray-400 hover:text-gray-200 transition-all duration-200 ${
                  copied ? 'animate-copy-click' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </button>
            {copied && (
              <div className="absolute -top-10 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded animate-fade-in-out whitespace-nowrap z-50 shadow-lg border border-green-500">
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};