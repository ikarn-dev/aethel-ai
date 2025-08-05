'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Agent } from '@/lib/types';
import { WalletAnalysisResult } from '@/lib/wallet-analysis/types';
import { AgentService } from '@/lib/agent-service';
import { ProgressTracker } from './progress-tracker';
import { StatsCards } from './stats-cards';
import { useAnalysisManager } from './analysis-manager';
import { ChatInput } from './chat-input';
import { ChatPersistenceManager } from '@/lib/chat-persistence';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  analysis?: WalletAnalysisResult;
  agentId?: string;
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

  // Helper functions for chat persistence
  const getAgentId = () => agent?.id || 'wallet-analysis-default';

  const loadChatHistory = useCallback(() => {
    if (!ChatPersistenceManager.isStorageAvailable()) {
      return [];
    }

    const agentId = getAgentId();
    
    try {
      // Load from custom storage key for wallet analysis
      const walletAnalysisKey = `wallet_analysis_chat_${agentId}`;
      const stored = localStorage.getItem(walletAnalysisKey);
      
      if (!stored) {
        return [];
      }
      
      const persistedMessages = JSON.parse(stored);
      
      // Convert persisted messages to local ChatMessage format
      return persistedMessages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'agent',
        timestamp: new Date(msg.timestamp),
        agentId: msg.agentId,
        analysis: msg.analysis // Analysis data is already in the correct format
      }));
    } catch (error) {
      console.warn('Failed to load wallet analysis chat history:', error);
      return [];
    }
  }, [agent?.id]);

  const saveChatHistory = useCallback((messages: ChatMessage[]) => {
    if (!ChatPersistenceManager.isStorageAvailable()) return;
    
    const agentId = getAgentId();
    
    try {
      // Create a custom storage key for wallet analysis with analysis data
      const walletAnalysisKey = `wallet_analysis_chat_${agentId}`;
      
      // Limit messages to prevent localStorage bloat
      const limitedMessages = messages.slice(-100);
      
      // Store messages with analysis data
      const messagesWithAnalysis = limitedMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        agentId: agentId,
        analysis: msg.analysis // Keep the full analysis object
      }));
      
      localStorage.setItem(walletAnalysisKey, JSON.stringify(messagesWithAnalysis));
    } catch (error) {
      console.warn('Failed to save wallet analysis chat history:', error);
    }
  }, [agent?.id]);

  // Combine and sort messages by timestamp to maintain chronological order
  // Filter out duplicate analysis messages to prevent duplicate stats cards
  const messages = [...localMessages, ...analysisMessages]
    .filter((message, index, array) => {
      // Remove duplicate messages with analysis data
      if (message.analysis) {
        const firstAnalysisIndex = array.findIndex(m => m.analysis && m.analysis.walletData.address === message.analysis?.walletData.address);
        return index === firstAnalysisIndex;
      }
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Save all combined messages whenever analysisMessages change (these contain the analysis results)
  useEffect(() => {
    if (analysisMessages.length > 0) {
      // When we get new analysis messages, save the combined messages
      const allMessages = [...localMessages, ...analysisMessages].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      saveChatHistory(allMessages);
    }
  }, [analysisMessages, localMessages, saveChatHistory]);

  // Track the current wallet being analyzed to detect changes
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);

  // Initialize with welcome message and handle initial wallet
  useEffect(() => {
    // If wallet address changed, reset analysis state and clear messages
    if (initialWallet && initialWallet !== currentWallet) {
      setCurrentWallet(initialWallet);
      hasTriggeredAnalysis.current = false; // Reset analysis flag for new wallet
      setLocalMessages([]); // Start with empty messages to prevent jitter
      
      // Trigger automatic analysis for the new wallet immediately without welcome message
      hasTriggeredAnalysis.current = true;
      handleWalletAnalysisAutomatic(initialWallet);
      
      return; // Exit early for new wallet - prevent duplicate execution
    }

    // Only load persisted chat history if no initialWallet is provided (not coming from traders table)
    if (!initialWallet) {
      const persistedMessages = loadChatHistory();
      
      if (persistedMessages.length > 0) {
        // If we have persisted messages, use them as local messages and don't trigger automatic analysis
        setLocalMessages(persistedMessages);
        hasTriggeredAnalysis.current = true; // Mark as triggered to prevent auto-analysis
      } else if (!hasTriggeredAnalysis.current) {
        // If no persisted messages, create welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          content: `Hello! I'm your wallet analysis assistant`,
          sender: 'agent',
          timestamp: new Date(),
          agentId: getAgentId(),
        };
        setLocalMessages([welcomeMessage]);
      }
    }
  }, [initialWallet, loadChatHistory, currentWallet]);

  // Auto-scroll to bottom when messages change - but only if user is near bottom
  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
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

    setLocalMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Save to persistence
      saveChatHistory(newMessages);
      return newMessages;
    });
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
          agentId: getAgentId(),
        };
        setLocalMessages(prev => {
          const newMessages = [...prev, feedbackMessage];
          // Save to persistence
          saveChatHistory(newMessages);
          return newMessages;
        });
        return;
      } else {
        // No address detected - restrict to Solana addresses only
        const restrictionMessage: ChatMessage = {
          id: `${Date.now()}-restriction`,
          content: `🔒 **Solana addresses only**\n\nI can only analyze Solana wallet addresses at this time.\n\n**Please provide a Solana wallet address to get started.**\n\nExample format: \`9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM\`\n\n• 43-44 characters long\n• Base58 encoded (no 0x prefix)\n• Contains letters and numbers only`,
          sender: 'agent',
          timestamp: new Date(),
          agentId: getAgentId(),
        };
        setLocalMessages(prev => {
          const newMessages = [...prev, restrictionMessage];
          // Save to persistence
          saveChatHistory(newMessages);
          return newMessages;
        });
        return;
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        content: `Sorry, I encountered an error while analyzing the wallet. Please check the address and try again.`,
        sender: 'agent',
        timestamp: new Date(),
        agentId: getAgentId(),
      };
      setLocalMessages(prev => {
        const newMessages = [...prev, errorMessage];
        // Save to persistence
        saveChatHistory(newMessages);
        return newMessages;
      });

      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat function
  const handleClearChat = useCallback(() => {
    // Clear local messages
    setLocalMessages([]);
    
    // Clear analysis messages by resetting the analysis manager
    // This is handled by clearing the cache and localStorage
    
    // Clear chat history from localStorage
    const agentId = getAgentId();
    const walletAnalysisKey = `wallet_analysis_chat_${agentId}`;
    localStorage.removeItem(walletAnalysisKey);
    
    // Reset analysis trigger flag
    hasTriggeredAnalysis.current = false;
    
    // Add welcome message back
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      content: `Hello! I'm your wallet analysis assistant`,
      sender: 'agent',
      timestamp: new Date(),
      agentId: agentId,
    };
    setLocalMessages([welcomeMessage]);
  }, []);

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