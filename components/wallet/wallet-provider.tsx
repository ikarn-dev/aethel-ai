'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { clusterApiUrl } from '@solana/web3.js';

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ 
  children, 
  network = WalletAdapterNetwork.Mainnet,
  endpoint 
}) => {
  // You can also provide a custom RPC endpoint
  const rpcEndpoint = useMemo(() => {
    if (endpoint) return endpoint;
    
    // Use environment variable if available, otherwise use mainnet
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    
    // Use mainnet by default
    return clusterApiUrl(WalletAdapterNetwork.Mainnet);
  }, [network, endpoint]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};