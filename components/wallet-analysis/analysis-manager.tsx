'use client';

import { useState, useCallback } from 'react';
import { Agent } from '@/lib/types';
import { walletAnalysisService } from '@/lib/wallet-analysis';
import { WalletAnalysisResult } from '@/lib/wallet-analysis/types';
import { AgentService } from '@/lib/agent-service';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  analysis?: WalletAnalysisResult;
}

// Analysis cache to store results and avoid repeated API calls
const analysisCache = new Map<string, { result: WalletAnalysisResult; timestamp: number; aiResponse?: string }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Track ongoing analysis requests to prevent duplicates
const ongoingAnalysis = new Map<string, Promise<void>>();

interface AnalysisManagerProps {
  agent?: Agent;
  onMessagesUpdate: (messages: ChatMessage[]) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onAnalysisComplete?: (analysis: WalletAnalysisResult) => void;
  onError?: (error: string) => void;
}

export function useAnalysisManager({ 
  agent, 
  onMessagesUpdate, 
  onLoadingChange, 
  onAnalysisComplete, 
  onError 
}: AnalysisManagerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentService] = useState(() => new AgentService());

  const updateMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  }, []);

  // Helper function to add a message to the current messages
  const addMessage = useCallback((newMessage: ChatMessage) => {
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      return updatedMessages;
    });
  }, []);

  const performWalletAnalysis = async (walletAddress: string) => {
    const analysisKey = `${walletAddress}_${agent?.id || 'default'}`;
    
    // Check if analysis is already in progress for this wallet
    if (ongoingAnalysis.has(analysisKey)) {
      console.log('Analysis already in progress for wallet:', walletAddress);
      return ongoingAnalysis.get(analysisKey);
    }

    // Create the analysis promise and store it to prevent duplicates
    const analysisPromise = (async () => {
      try {
        onLoadingChange(true);

        // Check cache first
        const basicCacheKey = `${walletAddress}_${agent?.id || 'default'}`;
        const basicCached = analysisCache.get(basicCacheKey);
        const now = Date.now();

      if (basicCached && (now - basicCached.timestamp) < CACHE_DURATION) {
        // Show cached basic data immediately
        const analysisMessage: ChatMessage = {
          id: `${Date.now()}-analysis`,
          content: `Here's the cached wallet data for ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}. Loading AI analysis...`,
          sender: 'agent',
          timestamp: new Date(),
          analysis: basicCached.result
        };
        addMessage(analysisMessage);

        // Show cached AI response if available
        if (basicCached.aiResponse) {
          setTimeout(() => {
            const aiMessage: ChatMessage = {
              id: `${Date.now()}-ai-cached`,
              content: basicCached.aiResponse!,
              sender: 'agent',
              timestamp: new Date(),
            };
            addMessage(aiMessage);
            onLoadingChange(false);
          }, 500);
        } else {
          onLoadingChange(false);
        }

        if (onAnalysisComplete) {
          onAnalysisComplete(basicCached.result);
        }
        return;
      }

      // Perform fresh wallet analysis
      const analysis = await walletAnalysisService.performCompleteAnalysis({
        walletAddress,
        chain: 'solana',
        includeNFTs: false,
        includeDeFi: false,
        transactionLimit: 1000
      });

      // Create deterministic cache key based on actual wallet data for consistency
      const walletDataHash = `${walletAddress}_${analysis.walletData.totalTransactions}_${analysis.walletData.tokenBalances.length}_${analysis.walletData.nativeBalance.toFixed(9)}_${agent?.id || 'default'}`;

      // Create analysis response with stats
      const analysisMessage: ChatMessage = {
        id: `${Date.now()}-analysis`,
        content: `Here's the basic wallet data for ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}. AI analysis in progress...`,
        sender: 'agent',
        timestamp: new Date(),
        analysis: analysis
      };

      addMessage(analysisMessage);

      // Send data to AI for analysis if agent is available
      if (agent && agentService) {
        try {
          agentService.setAgent(agent);

          // Get PnL data from cached traders table data (no API requests)
          let pnlData = null;
          try {
            // Search for wallet in different timeframes using cached data
            const timeframes: ('today' | 'yesterday' | '1W')[] = ['1W', 'today', 'yesterday'];
            
            for (const timeframe of timeframes) {
              const cacheKey = `traders_${timeframe}`;
              const cachedData = localStorage.getItem(cacheKey);
              
              if (cachedData) {
                try {
                  const parsedData = JSON.parse(cachedData);
                  const trader = parsedData.traders?.find((t: any) => t.address === walletAddress);
                  
                  if (trader) {
                    pnlData = {
                      pnl: trader.pnl,
                      timeframe: timeframe,
                      rank: trader.rank,
                      totalVolume: trader.totalVolume,
                      totalTrades: trader.totalTrades,
                      avgTradeSize: trader.avgTradeSize
                    };
                    break; // Found data, stop searching
                  }
                } catch (parseError) {
                  console.warn(`Failed to parse cached traders data for ${timeframe}:`, parseError);
                }
              }
            }
          } catch (error) {
            console.warn('Failed to get PnL data from cache:', error);
          }

          // Create comprehensive trading data for AI analysis including PnL
          const tradingAnalysisData = {
            walletAddress: walletAddress,
            tradingMetrics: {
              totalTransactions: analysis.walletData.totalTransactions,
              activityPeriodDays: analysis.walletData.firstTransactionDate > 0 && analysis.walletData.lastTransactionDate > 0
                ? Math.floor((analysis.walletData.lastTransactionDate - analysis.walletData.firstTransactionDate) / (24 * 60 * 60))
                : 0,
              avgTransactionsPerDay: analysis.walletData.firstTransactionDate > 0 && analysis.walletData.lastTransactionDate > 0
                ? (parseInt(String(analysis.walletData.totalTransactions).replace('+', '')) / Math.floor((analysis.walletData.lastTransactionDate - analysis.walletData.firstTransactionDate) / (24 * 60 * 60))).toFixed(2)
                : 0,
              firstTradeDate: analysis.walletData.firstTransactionDate > 0 ? new Date(analysis.walletData.firstTransactionDate * 1000).toISOString().split('T')[0] : null,
              lastTradeDate: analysis.walletData.lastTransactionDate > 0 ? new Date(analysis.walletData.lastTransactionDate * 1000).toISOString().split('T')[0] : null
            },
            currentHoldings: {
              solBalance: analysis.walletData.nativeBalance,
              uniqueTokens: analysis.walletData.tokenBalances.length,
              hasActivePositions: analysis.walletData.tokenBalances.length > 0
            },
            pnlData: pnlData
          };

          // Create optimized prompt with compact data structure
          const compactData = {
            addr: walletAddress,
            txns: analysis.walletData.totalTransactions,
            days: tradingAnalysisData.tradingMetrics.activityPeriodDays,
            sol: analysis.walletData.nativeBalance,
            tokens: analysis.walletData.tokenBalances.length,
            ...(pnlData && {
              pnl: pnlData.pnl,
              rank: pnlData.rank,
              vol: pnlData.totalVolume,
              trades: pnlData.totalTrades,
              tf: pnlData.timeframe
            })
          };

          const aiPrompt = `WALLET ANALYSIS REQUEST - RESPOND EXACTLY AS SPECIFIED

Wallet: ${walletAddress}
Data: ${analysis.walletData.totalTransactions} transactions (${tradingAnalysisData.tradingMetrics.avgTransactionsPerDay}/day over ${tradingAnalysisData.tradingMetrics.activityPeriodDays} days), ${analysis.walletData.nativeBalance} SOL, ${analysis.walletData.tokenBalances.length} tokens${pnlData ? `, P&L: ${pnlData.pnl >= 0 ? '+' : ''}$${Math.abs(pnlData.pnl) >= 1000000 ? (Math.abs(pnlData.pnl) / 1000000).toFixed(2) + 'M' : Math.abs(pnlData.pnl) >= 1000 ? (Math.abs(pnlData.pnl) / 1000).toFixed(2) + 'K' : Math.abs(pnlData.pnl).toFixed(2)} (${pnlData.timeframe}), Rank #${pnlData.rank}` : ''}

RESPOND WITH EXACTLY THIS FORMAT (no additional steps or planning):

🎯 **Trading Profile**
• Type: [Day/Swing/Position] trader
• Experience: [Beginner/Intermediate/Advanced]
• Style: [High/Medium/Low] frequency

📊 **Copy Analysis**
• Copyability: [1-10]/10
• Risk: [Low/Medium/High]
• Strategy: [One sentence recommendation]

⚡ **Key Behaviors**
• [Main trading pattern]
• [Portfolio management approach]
• [Copy recommendation]

RULES: Use ONLY the data provided. Be consistent. No additional analysis or steps.`;

          const aiResult = await agentService.sendMessage(aiPrompt);

          if (aiResult.success && aiResult.response) {
            const aiMessage: ChatMessage = {
              id: `${Date.now()}-ai`,
              content: aiResult.response,
              sender: 'agent',
              timestamp: new Date(),
            };
            addMessage(aiMessage);

            // Cache the complete analysis with AI response using the deterministic key
            analysisCache.set(walletDataHash, {
              result: analysis,
              timestamp: now,
              aiResponse: aiResult.response
            });
          }
        } catch (aiError) {
          console.error('AI analysis failed:', aiError);
        }
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        content: `Sorry, I encountered an error while analyzing the wallet. Please check the address and try again.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      addMessage(errorMessage);

      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      onLoadingChange(false);
      // Remove from ongoing analysis map when complete
      ongoingAnalysis.delete(analysisKey);
    }
    })();

    // Store the promise to prevent duplicate requests
    ongoingAnalysis.set(analysisKey, analysisPromise);
    
    return analysisPromise;
  };

  return {
    messages,
    performWalletAnalysis,
    updateMessages
  };
}