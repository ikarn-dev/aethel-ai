'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../hooks/use-wallet';
import { CustomWalletModal } from '../wallet/custom-wallet-modal';
import { Wallet } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback
}) => {
  const { connected, connecting } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading during SSR and initial client render
  if (!isClient || connecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-teal-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt if not connected
  if (!connected) {
    return fallback || <WalletConnectionPrompt />;
  }

  // Render protected content
  return <>{children}</>;
};

const WalletConnectionPrompt: React.FC = () => {
  const router = useRouter();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            {/* Header with Home button */}
            <div className="flex items-center justify-start mb-6">
              {/* Home Button */}
              <button
                onClick={() => router.push('/')}
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Home</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-white mb-3">
              Connect Your Wallet
            </h1>

            {/* Description */}
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              To access Aethel AI's features, please connect your Solana wallet. Your wallet is required for secure authentication.
            </p>

            {/* Wallet Connect Button */}
            <div className="mb-6">
              <button
                onClick={handleConnectWallet}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            </div>

            {/* Security Note */}
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-left">
                  <p className="text-sm text-white font-medium mb-1">Secure Connection</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We never store your private keys. Your wallet remains under your full control.
                  </p>
                </div>
              </div>
            </div>

            {/* Supported Wallets */}
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-3">Supported Wallets:</p>
              <div className="flex justify-center space-x-6">
                <span className="text-sm text-slate-300">Phantom</span>
                <span className="text-sm text-slate-300">Solflare</span>
                <span className="text-sm text-slate-300">Backpack</span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Custom Wallet Modal */}
      <CustomWalletModal
        visible={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
};