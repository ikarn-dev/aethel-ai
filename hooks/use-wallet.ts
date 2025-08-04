import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCallback, useMemo } from 'react';

export interface WalletBalance {
  sol: number;
  lamports: number;
}

export interface WalletHookReturn {
  // Wallet connection state
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  
  // Wallet info
  publicKey: PublicKey | null;
  wallet: any;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Balance
  balance: WalletBalance | null;
  refreshBalance: () => Promise<void>;
  
  // Transactions
  sendTransaction: (transaction: Transaction) => Promise<string>;
  sendSol: (to: string, amount: number) => Promise<string>;
  
  // Utilities
  formatAddress: (address?: string) => string;
  isValidAddress: (address: string) => boolean;
}

export const useWallet = (): WalletHookReturn => {
  const { 
    wallet, 
    publicKey, 
    connected, 
    connecting, 
    disconnecting,
    connect: connectWallet,
    disconnect: disconnectWallet,
    sendTransaction: sendWalletTransaction
  } = useSolanaWallet();
  
  const { connection } = useConnection();

  // Balance state and refresh function
  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!publicKey || !connection) return;
    
    try {
      const lamports = await connection.getBalance(publicKey);
      // Balance is fetched but not stored since it's not used in UI
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [publicKey, connection]);

  // Memoized balance - in a real app, you'd want to use a state management solution
  const balance = useMemo(() => {
    // This is a simplified approach - in production, you'd want to manage this state properly
    return null;
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [connectWallet]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [disconnectWallet]);

  // Send transaction
  const sendTransaction = useCallback(async (transaction: Transaction): Promise<string> => {
    if (!publicKey || !sendWalletTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await sendWalletTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [publicKey, sendWalletTransaction, connection]);

  // Send SOL
  const sendSol = useCallback(async (to: string, amount: number): Promise<string> => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const toPublicKey = new PublicKey(to);
      const lamports = Math.round(amount * LAMPORTS_PER_SOL);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      return await sendTransaction(transaction);
    } catch (error) {
      console.error('Failed to send SOL:', error);
      throw error;
    }
  }, [publicKey, sendTransaction]);

  // Format address for display
  const formatAddress = useCallback((address?: string): string => {
    if (!address) return '';
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, []);

  // Validate Solana address
  const isValidAddress = useCallback((address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    // Connection state
    connected,
    connecting,
    disconnecting,
    
    // Wallet info
    publicKey,
    wallet,
    
    // Actions
    connect,
    disconnect,
    
    // Balance
    balance,
    refreshBalance,
    
    // Transactions
    sendTransaction,
    sendSol,
    
    // Utilities
    formatAddress,
    isValidAddress,
  };
};