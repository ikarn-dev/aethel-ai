'use client';

import React, { useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { CustomWalletModal } from './custom-wallet-modal';
import { ChevronDown, Wallet, LogOut } from 'lucide-react';

interface WalletConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  showDropdown?: boolean;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  className = '',
  variant = 'default',
  showDropdown = true
}) => {
  const { connected, connecting, publicKey, formatAddress, disconnect, wallet } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showDropdownState, setShowDropdownState] = useState(false);

  const handleClick = () => {
    if (connected) {
      if (showDropdown) {
        setShowDropdownState(!showDropdownState);
      } else {
        disconnect();
      }
    } else {
      setShowModal(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdownState(false);
  };

  const getButtonText = () => {
    if (connecting) return 'Connecting...';
    if (connected && publicKey) return formatAddress(publicKey.toString());
    return 'Connect Wallet';
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-lg text-sm font-medium 
    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 disabled:opacity-50 
    disabled:pointer-events-none ring-offset-background relative
  `;

  const variantClasses = {
    default: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-teal-500/25',
    outline: 'border border-teal-400/50 text-teal-100 hover:bg-teal-500/10 hover:border-teal-400 backdrop-blur-sm',
    ghost: 'text-teal-300 hover:bg-teal-500/10 hover:text-teal-200',
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={connecting}
        className={`${baseClasses} ${variantClasses[variant]} ${className} ${connected && showDropdown ? 'pr-8' : ''}`}
      >
        <div className="flex items-center space-x-2">
          {!connected && <Wallet className="w-4 h-4" />}
          <span>{getButtonText()}</span>
          {connected && showDropdown && (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </div>
        
        {connecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {connected && showDropdown && showDropdownState && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Wallet Info */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {wallet?.adapter.name || 'Connected Wallet'}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  {formatAddress(publicKey?.toString())}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdownState && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdownState(false)}
        />
      )}

      {/* Custom Wallet Modal */}
      <CustomWalletModal 
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};