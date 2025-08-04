'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Agent } from '@/lib/types';
import { WalletAnalysisResult } from '@/lib/wallet-analysis/types';
import { AgentService } from '@/lib/agent-service';
import { ProgressTracker } from './progress-tracker';
import { StatsCards } from './stats-cards';
import { useAnalysisManager } from './analysis-manager';
import { ChatInput } from './chat-input';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  analysis?: WalletAnalysisResult;
}

interface WalletAnalysisChatProps {
  agent?: Agent;
  initialWallet?: string;
  onAnalysisComplete?: (analysis: WalletAnalysisResult) => void;
  onError?: (error: string) => void;
}

export function WalletAnalysisChat({
  agent,
  initialWallet,
  onAnalysisComplete,
  onError
}: WalletAnalysisChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredAnalysis = useRef(false);
  const [agentService] = useState(() => new AgentService());

  const { messages: analysisMessages, performWalletAnalysis } = useAnalysisManager({
    agent,
    onMessagesUpdate: useCallback(() => { }, []), // We handle messages locally
    onLoadingChange: useCallback((loading) => {
      setIsLoading(loading);
      setIsAnalyzing(loading);
    }, []),
    onAnalysisComplete,
    onError
  });

  // Combine and sort messages by timestamp to maintain chronological order
  const messages = [...localMessages, ...analysisMessages].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Initialize with welcome message and handle initial wallet
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: `Hello! I'm your wallet analysis assistant`,
      sender: 'agent',
      timestamp: new Date(),
    };
    setLocalMessages([welcomeMessage]);

    // If initialWallet is provided, automatically start analysis
    if (initialWallet && !hasTriggeredAnalysis.current) {
      hasTriggeredAnalysis.current = true;
      setTimeout(() => {
        handleWalletAnalysisAutomatic(initialWallet);
      }, 500);
    }
  }, [initialWallet]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleWalletAnalysisAutomatic = async (walletAddress: string) => {
    setIsAnalyzing(true);
    await performWalletAnalysis(walletAddress);
  };

  const isValidSolanaAddress = (address: string): boolean => {
    // Solana addresses are base58 encoded and exactly 32 bytes (44 characters when base58 encoded)
    // They use the base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

    // Check basic format
    if (!solanaAddressRegex.test(address)) {
      return false;
    }

    // Additional checks to exclude common non-Solana formats
    // Ethereum addresses start with 0x and are 42 characters
    if (address.startsWith('0x') || address.length === 42) {
      return false;
    }

    // Bitcoin addresses typically start with 1, 3, or bc1
    if (address.startsWith('bc1') || (address.startsWith('1') && address.length < 40) || (address.startsWith('3') && address.length < 40)) {
      return false;
    }

    return true;
  };

  const extractWalletAddress = (message: string): { address: string | null; isValid: boolean; detectedFormat?: string } => {
    // Remove whitespace and extract potential addresses
    const cleanMessage = message.trim();

    // Check for Ethereum address pattern
    const ethPattern = /0x[a-fA-F0-9]{40}/g;
    const ethMatch = cleanMessage.match(ethPattern);
    if (ethMatch) {
      return { address: null, isValid: false, detectedFormat: 'Ethereum' };
    }

    // Check for Bitcoin address patterns
    const btcPattern = /(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^bc1[a-z0-9]{39,59}$)/g;
    const btcMatch = cleanMessage.match(btcPattern);
    if (btcMatch) {
      return { address: null, isValid: false, detectedFormat: 'Bitcoin' };
    }

    // Look for potential Solana addresses
    const solanaPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
    const matches = cleanMessage.match(solanaPattern);

    if (matches) {
      for (const match of matches) {
        if (isValidSolanaAddress(match)) {
          return { address: match, isValid: true };
        }
      }
      // Found address-like string but not valid Solana
      return { address: null, isValid: false, detectedFormat: 'Invalid format' };
    }

    return { address: null, isValid: false };
  };

  const handleSendMessage = async (messageContent: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if message contains a wallet address
      const addressResult = extractWalletAddress(messageContent);

      if (addressResult.isValid && addressResult.address) {
        // Valid Solana address found
        setIsAnalyzing(true);
        await performWalletAnalysis(addressResult.address);
        return;
      } else if (addressResult.detectedFormat) {
        // Invalid address format detected - provide specific feedback
        let errorMessage = '';

        if (addressResult.detectedFormat === 'Ethereum') {
          errorMessage = `❌ **Ethereum addresses are not supported**\n\nI detected an Ethereum address, but I can only analyze Solana wallets at this time.\n\n**Please provide a Solana wallet address instead.**\n\nSolana addresses are 43-44 characters long and use base58 encoding (no 0x prefix).`;
        } else if (addressResult.detectedFormat === 'Bitcoin') {
          errorMessage = `❌ **Bitcoin addresses are not supported**\n\nI detected a Bitcoin address, but I can only analyze Solana wallets at this time.\n\n**Please provide a Solana wallet address instead.**\n\nSolana addresses are 43-44 characters long and use base58 encoding.`;
        } else {
          errorMessage = `❌ **Invalid address format**\n\nThe address format you provided is not recognized as a valid Solana address.\n\n**Only Solana addresses are supported as of now.**\n\nPlease provide a valid Solana wallet address (43-44 characters, base58 encoded).`;
        }

        const feedbackMessage: ChatMessage = {
          id: `${Date.now()}-feedback`,
          content: errorMessage,
          sender: 'agent',
          timestamp: new Date(),
        };
        setLocalMessages(prev => [...prev, feedbackMessage]);
        return;
      } else {
        // No address detected - restrict to Solana addresses only
        const restrictionMessage: ChatMessage = {
          id: `${Date.now()}-restriction`,
          content: `🔒 **Solana addresses only**\n\nI can only analyze Solana wallet addresses at this time.\n\n**Please provide a Solana wallet address to get started.**\n\nExample format: \`9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM\`\n\n• 43-44 characters long\n• Base58 encoded (no 0x prefix)\n• Contains letters and numbers only`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setLocalMessages(prev => [...prev, restrictionMessage]);
        return;
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        content: `Sorry, I encountered an error while analyzing the wallet. Please check the address and try again.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      setLocalMessages(prev => [...prev, errorMessage]);

      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 pb-0 space-y-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {/* Chat Message */}
              <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] space-y-4">
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${message.sender === "user"
                        ? "bg-slate-700/50 text-white ml-auto"
                        : "bg-slate-800/30 text-gray-100"
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    <div className="flex items-center mt-1 px-2">
                      <p className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Analysis Stats Cards - part of the message */}
                  {message.analysis && (
                    <div className="w-full">
                      <StatsCards analysis={message.analysis} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Single Progress Tracker - only appears when loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-teal-50/20 to-teal-100/20 border border-teal-200/30 rounded-3xl px-3 py-1 backdrop-blur-sm shadow-sm">
                <ProgressTracker
                  agentId={agent?.id}
                  isAnalyzing={isAnalyzing}
                  onAnalysisComplete={() => setIsAnalyzing(false)}
                />
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Enter a Solana wallet address to analyze..."
      />
    </div>
  );
}