import { useState, useEffect, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  name?: string;
}

export interface WalletBalanceData {
  sol: number;
  lamports: number;
  tokens: TokenBalance[];
  isLoading: boolean;
  error: string | null;
}

export const useWalletBalance = (publicKey: PublicKey | null, autoRefresh = true) => {
  const { connection } = useConnection();
  const [balanceData, setBalanceData] = useState<WalletBalanceData>({
    sol: 0,
    lamports: 0,
    tokens: [],
    isLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) {
      setBalanceData(prev => ({ ...prev, sol: 0, lamports: 0, tokens: [], error: null }));
      return;
    }

    setBalanceData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('Fetching balance for:', publicKey.toString());
      
      // Fetch SOL balance with retry logic
      let lamports = 0;
      let sol = 0;
      
      try {
        lamports = await connection.getBalance(publicKey);
        sol = lamports / LAMPORTS_PER_SOL;
        console.log('Balance fetched:', { lamports, sol });
      } catch (balanceError) {
        console.warn('Failed to fetch SOL balance, using 0:', balanceError);
        // Continue with 0 balance instead of failing completely
      }

      // Fetch token accounts with error handling
      let tokens: TokenBalance[] = [];
      
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        tokens = tokenAccounts.value
          .map(account => {
            const parsedInfo = account.account.data.parsed.info;
            return {
              mint: parsedInfo.mint,
              amount: parsedInfo.tokenAmount.uiAmount || 0,
              decimals: parsedInfo.tokenAmount.decimals,
            };
          })
          .filter(token => token.amount > 0);
      } catch (tokenError) {
        console.warn('Failed to fetch token accounts, using empty array:', tokenError);
        // Continue with empty token array instead of failing
      }

      setBalanceData({
        sol,
        lamports,
        tokens,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      
      // Check if it's a 403 error and provide helpful message
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance';
      const is403Error = errorMessage.includes('403') || errorMessage.includes('Access forbidden');
      
      const userFriendlyError = is403Error 
        ? 'RPC endpoint access limited. Balance display may be unavailable.'
        : errorMessage;
      
      setBalanceData(prev => ({
        ...prev,
        isLoading: false,
        error: userFriendlyError,
      }));
    }
  }, [publicKey, connection]);

  // Auto-refresh balance
  useEffect(() => {
    if (!autoRefresh) return;

    fetchBalance();
    
    const interval = setInterval(fetchBalance, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchBalance, autoRefresh]);

  // Manual refresh
  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    ...balanceData,
    refreshBalance,
  };
};