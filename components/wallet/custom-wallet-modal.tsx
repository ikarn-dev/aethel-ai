'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { X, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useCustomWalletConnect } from '../../hooks/use-custom-wallet-connect';

interface CustomWalletModalProps {
  visible: boolean;
  onClose: () => void;
}

interface WalletInfo {
  name: string;
  icon: string;
  detected: boolean;
  description: string;
  features: string[];
}

// Wallet Icon Components
const PhantomIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
    <svg viewBox="0 0 128 128" className="w-7 h-7">
      <defs>
        <linearGradient id="phantom-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AB9FF2" />
          <stop offset="100%" stopColor="#4E44CE" />
        </linearGradient>
      </defs>
      <path fill="url(#phantom-gradient)" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 96c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/>
    </svg>
  </div>
);

const SolflareIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
);

const BackpackIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
      <path d="M4 6h16v2H4zm0 5h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7zm4-4V5a1 1 0 011-1h6a1 1 0 011 1v2H8z"/>
    </svg>
  </div>
);

const OKXIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
    <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
      <span className="text-black font-bold text-sm">OKX</span>
    </div>
  </div>
);

const TorusIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  </div>
);

const LedgerIcon = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <rect x="7" y="10" width="10" height="4" rx="1"/>
    </svg>
  </div>
);

const walletInfo: Record<string, WalletInfo & { IconComponent: React.ComponentType }> = {
  'Phantom': {
    name: 'Phantom',
    icon: '👻',
    detected: false,
    description: 'A friendly crypto wallet built for DeFi & NFTs',
    features: ['Most Popular', 'Easy to Use', 'Mobile App'],
    IconComponent: PhantomIcon
  },
  'Solflare': {
    name: 'Solflare',
    icon: '🔥',
    detected: false,
    description: 'Non-custodial wallet for Solana ecosystem',
    features: ['Web & Mobile', 'Staking', 'DeFi Ready'],
    IconComponent: SolflareIcon
  },
  'Backpack': {
    name: 'Backpack',
    icon: '🎒',
    detected: false,
    description: 'A home for your xNFTs',
    features: ['xNFT Support', 'Modern UI', 'Multi-chain'],
    IconComponent: BackpackIcon
  },
  'OKX Wallet': {
    name: 'OKX Wallet',
    icon: '⚫',
    detected: false,
    description: 'Your gateway to the world of Web3',
    features: ['Multi-chain', 'Trading', 'Secure'],
    IconComponent: OKXIcon
  },
  'Torus': {
    name: 'Torus',
    icon: '🌐',
    detected: false,
    description: 'Login with your existing accounts',
    features: ['Social Login', 'No Download', 'Beginner Friendly'],
    IconComponent: TorusIcon
  },
  'Ledger': {
    name: 'Ledger',
    icon: '🔒',
    detected: false,
    description: 'Hardware wallet for maximum security',
    features: ['Hardware Security', 'Cold Storage', 'Multi-asset'],
    IconComponent: LedgerIcon
  }
};

export const CustomWalletModal: React.FC<CustomWalletModalProps> = ({
  visible,
  onClose
}) => {
  const { wallets } = useWallet();
  const { connectWithCustomMessage, requestSignature, connecting, connected } = useCustomWalletConnect();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal when wallet connects successfully
  useEffect(() => {
    if (connected && visible) {
      onClose();
      setSelectedWallet(null);
    }
  }, [connected, visible, onClose]);

  // Request signature after wallet connects
  useEffect(() => {
    if (connected && !visible) {
      // Wait a bit for the modal to close, then request signature
      const timer = setTimeout(async () => {
        try {
          await requestSignature();
        } catch (error) {
          console.log('Signature request failed or was declined:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [connected, visible, requestSignature]);

  // Detect installed wallets - create a state to trigger re-renders
  const [detectedWallets, setDetectedWallets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && wallets.length > 0) {
      const detected: Record<string, boolean> = {};
      Object.keys(walletInfo).forEach(walletName => {
        const wallet = wallets.find(w => w.adapter.name === walletName);
        if (wallet) {
          detected[walletName] = wallet.adapter.readyState === 'Installed';
        }
      });
      setDetectedWallets(detected);
    }
  }, [wallets]);

  const handleWalletSelect = async (walletName: WalletName) => {
    console.log('Selecting wallet with custom Aethel AI signature:', walletName);
    setSelectedWallet(walletName);
    
    try {
      // Use the custom connection with Aethel AI branding and signature
      await connectWithCustomMessage(walletName);
      console.log('Wallet connected with Aethel AI signature:', walletName);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setSelectedWallet(null);
      
      // Handle specific error cases
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('user rejected') || errorMsg.includes('user denied')) {
          console.log('User rejected the Aethel AI connection');
          return;
        }
      }
    }
  };

  const popularWallets = ['Phantom', 'Solflare', 'Backpack'];
  const otherWallets = Object.keys(walletInfo).filter(name => !popularWallets.includes(name));

  if (!visible || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '384px',
          maxHeight: '90vh',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-slate-700/50 text-center">
          <h2 className="text-lg font-bold text-white mb-1">
            Connect Wallet
          </h2>
          <p className="text-xs text-slate-400">
            Choose your preferred wallet to get started
          </p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[50vh] overflow-y-auto scrollbar-hide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {/* Popular Wallets */}
          <div className="space-y-2 mb-4">
            {popularWallets.map((walletName) => {
              const wallet = wallets.find(w => w.adapter.name === walletName);
              const info = walletInfo[walletName];
              const isConnecting = connecting && selectedWallet === walletName;
              const isDetected = detectedWallets[walletName] || false;

              if (!wallet) return null;

              return (
                <button
                  key={walletName}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-700/50 hover:border-teal-500/50 hover:bg-slate-800/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10">
                      {info?.IconComponent ? <info.IconComponent /> : (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg border border-slate-600/50">
                          💼
                        </div>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white group-hover:text-teal-300 transition-colors text-sm">
                          {walletName}
                        </span>
                        {info?.features[0] && (
                          <span className="text-xs bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full">
                            {info.features[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {info?.description || 'Solana wallet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {isConnecting ? (
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : isDetected ? (
                      <span className="text-xs text-green-400 font-medium">Detected</span>
                    ) : (
                      <span className="text-xs text-slate-500">Install</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* More Options Toggle */}
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="w-full flex items-center justify-center space-x-2 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">More options</span>
            {showMoreOptions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Additional Wallets */}
          {showMoreOptions && (
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-700/50">
              {otherWallets.map((walletName) => {
                const wallet = wallets.find(w => w.adapter.name === walletName);
                const info = walletInfo[walletName];
                const isConnecting = connecting && selectedWallet === walletName;
                const isDetected = detectedWallets[walletName] || false;

                if (!wallet) return null;

                return (
                  <button
                    key={walletName}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8">
                        {info?.IconComponent ? <info.IconComponent /> : (
                          <div className="w-full h-full rounded-lg bg-slate-800 flex items-center justify-center text-sm border border-slate-600/30">
                            💼
                          </div>
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <span className="font-medium text-white group-hover:text-teal-300 transition-colors text-sm">
                          {walletName}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {info?.description || 'Solana wallet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {isConnecting ? (
                        <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      ) : isDetected ? (
                        <span className="text-xs text-green-400 font-medium">Detected</span>
                      ) : (
                        <span className="text-xs text-slate-500">Install</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 text-center">
          {/* Security Notice */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-teal-400" />
              <p className="text-sm font-medium text-white">Secure Connection</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              We never store your private keys. Your wallet remains under your full control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
};