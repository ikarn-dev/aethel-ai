import { walletAnalysisService } from './service';
import { WalletAnalysisResult } from './types';

export class WalletAnalysisChatIntegration {
  
  /**
   * Detects if a chat message is requesting wallet analysis
   */
  static isWalletAnalysisRequest(message: string): boolean {
    const walletAnalysisKeywords = [
      'analyze wallet',
      'wallet analysis',
      'analyze trades',
      'trade analysis',
      'smart money',
      'wallet insights',
      'portfolio analysis',
      'trading patterns'
    ];

    const lowerMessage = message.toLowerCase();
    return walletAnalysisKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Extracts wallet address from chat message
   */
  static extractWalletAddress(message: string): string | null {
    // Solana address regex - base58 encoded, 32-44 characters
    const solanaAddressRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
    const matches = message.match(solanaAddressRegex);
    return matches ? matches[0] : null;
  }

  /**
   * Processes wallet analysis request from chat
   */
  static async processWalletAnalysisRequest(message: string): Promise<{
    success: boolean;
    response: string;
    analysis?: WalletAnalysisResult;
    error?: string;
  }> {
    try {
      // Extract wallet address from message
      const walletAddress = this.extractWalletAddress(message);
      
      if (!walletAddress) {
        return {
          success: false,
          response: "I couldn't find a valid wallet address in your message. Please provide a Solana wallet address for analysis.",
          error: 'No wallet address found'
        };
      }

      // Validate wallet address
      const isValid = await walletAnalysisService.validateWalletAddress(walletAddress);
      if (!isValid) {
        return {
          success: false,
          response: "The wallet address you provided doesn't appear to be valid. Please check the address and try again.",
          error: 'Invalid wallet address'
        };
      }

      // Perform analysis
      const analysis = await walletAnalysisService.performCompleteAnalysis({
        walletAddress,
        chain: 'solana',
        includeNFTs: true,
        includeDeFi: true,
        transactionLimit: 100
      });

      // Create a structured prompt for the backend AI
      const analysisPrompt = `Please analyze this wallet data and provide detailed insights:

WALLET ANALYSIS DATA:
${JSON.stringify({
        address: analysis.walletData.address,
        nativeBalance: analysis.walletData.nativeBalance,
        tokenCount: analysis.walletData.tokenBalances.length,
        transactionCount: analysis.walletData.totalTransactions,
        tradingMetrics: analysis.tradingMetrics,
        riskAssessment: analysis.riskAssessment,
        insights: analysis.insights
      }, null, 2)}

Please provide a comprehensive analysis covering:
1. Investment strategy assessment
2. Risk-reward profile evaluation  
3. Trading behavior analysis
4. Portfolio optimization recommendations
5. Market positioning insights
6. Future outlook and recommendations

Format your response in a clear, professional manner suitable for both novice and experienced crypto investors.`;

      // Return the structured data for the backend to process
      const formattedResponse = walletAnalysisService.formatAnalysisForChat(analysis);

      return {
        success: true,
        response: formattedResponse,
        analysis
      };

    } catch (error) {
      console.error('Wallet analysis request failed:', error);
      
      return {
        success: false,
        response: `I encountered an error while analyzing the wallet: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check if the wallet address is correct.`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generates a helpful response when wallet analysis is requested but no address is provided
   */
  static generateWalletAnalysisHelp(): string {
    return `
# 🔍 Smart Money Wallet Analysis

I can help you analyze any Solana wallet! Just provide a wallet address and I'll give you:

## 📊 What I'll Analyze:
- **Portfolio Composition** - SOL and SPL token holdings with their values
- **Trading Patterns** - Win rates, trading frequency, and strategies
- **Risk Assessment** - Diversification, volatility, and concentration risks
- **DeFi Activity** - Staking, lending, and liquidity positions on Solana
- **AI Insights** - Personalized recommendations and behavioral analysis

## 💡 How to Use:
Simply say something like:
- "Analyze wallet 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
- "Give me insights on trades for DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK"
- "Smart money analysis for GThUX1Atko4tqhN2NaiTazWSeFWMuiUiswQeNEHJBtPs"

## 🔒 Privacy & Security:
- All analysis is read-only using public blockchain data
- No private keys or sensitive information required
- Analysis is performed in real-time

Ready to analyze a Solana wallet? Just provide the address! 🚀
`;
  }

  /**
   * Checks if the message is asking for help with wallet analysis
   */
  static isWalletAnalysisHelpRequest(message: string): boolean {
    const helpKeywords = [
      'how to analyze wallet',
      'wallet analysis help',
      'how does wallet analysis work',
      'what can you analyze',
      'help with wallet',
      'smart money help'
    ];

    const lowerMessage = message.toLowerCase();
    return helpKeywords.some(keyword => lowerMessage.includes(keyword));
  }
}

/**
 * Enhanced message processing for agents with wallet analysis capability
 */
export async function processMessageWithWalletAnalysis(
  message: string,
  agentId: string,
  isWalletAnalysisAgent: boolean = false
): Promise<{
  shouldHandleLocally: boolean;
  response?: string;
  analysis?: WalletAnalysisResult;
  error?: string;
}> {
  // Only process wallet analysis for agents with wallet analysis capability
  if (!isWalletAnalysisAgent) {
    return { shouldHandleLocally: false };
  }

  // Check if this is a help request
  if (WalletAnalysisChatIntegration.isWalletAnalysisHelpRequest(message)) {
    return {
      shouldHandleLocally: true,
      response: WalletAnalysisChatIntegration.generateWalletAnalysisHelp()
    };
  }

  // Check if this is a wallet analysis request
  if (WalletAnalysisChatIntegration.isWalletAnalysisRequest(message)) {
    const result = await WalletAnalysisChatIntegration.processWalletAnalysisRequest(message);
    
    return {
      shouldHandleLocally: true,
      response: result.response,
      analysis: result.analysis,
      error: result.error
    };
  }

  // Let the regular agent handle other messages
  return { shouldHandleLocally: false };
}