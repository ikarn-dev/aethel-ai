'use client';

import React, { useState } from 'react';

interface WalletInputProps {
  onAnalyze: (walletAddress: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function WalletInput({ onAnalyze, isLoading = false, disabled = false }: WalletInputProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (address: string): boolean => {
    // Solana address validation - base58 encoded, 32-44 characters
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateAddress(walletAddress.trim())) {
      setError('Please enter a valid Solana wallet address');
      return;
    }

    onAnalyze(walletAddress.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="wallet-address" className="block text-sm font-medium text-teal-200">
            Wallet Address
          </label>
          <div className="relative">
            <input
              id="wallet-address"
              type="text"
              value={walletAddress}
              onChange={handleInputChange}
              placeholder="Enter Solana wallet address (e.g., 7xKX...gAsU)"
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all ${
                error ? 'border-red-400/60' : 'border-teal-400/20 hover:border-teal-400/40'
              }`}
              disabled={isLoading || disabled}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-300 text-sm">{error}</p>
          )}
          <p className="text-teal-300/70 text-xs">
            Enter a Solana wallet address to analyze trading patterns and portfolio composition
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || disabled || !walletAddress.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 font-medium"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Wallet...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analyze Wallet</span>
            </>
          )}
        </button>
      </form>

      {/* Example format info */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-teal-400/10">
        <h4 className="text-sm font-medium text-teal-200 mb-2">Address Format:</h4>
        <div className="space-y-1">
          <p className="text-xs text-teal-300/70">
            • Solana addresses are 32-44 characters long
          </p>
          <p className="text-xs text-teal-300/70">
            • Use base58 encoding (letters and numbers only)
          </p>
          <p className="text-xs text-teal-300/70">
            • Example format: 7xKX...gAsU (truncated for display)
          </p>
        </div>
      </div>
    </div>
  );
}