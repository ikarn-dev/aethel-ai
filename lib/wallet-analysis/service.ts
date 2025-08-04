import { walletApiClient } from './api-client';
import { walletAnalyzer } from './analyzer';
import { AnalysisRequest, WalletAnalysisResult } from './types';

export class WalletAnalysisService {

    async performCompleteAnalysis(request: AnalysisRequest): Promise<WalletAnalysisResult> {
        try {
            // Step 1: Fetch wallet data from external API
            const walletData = await walletApiClient.fetchCompleteWalletData(request);

            // Step 2: Perform local analysis
            const tradingMetrics = walletAnalyzer.calculateTradingMetrics(walletData);
            const riskAssessment = walletAnalyzer.assessRisk(walletData, tradingMetrics);
            const insights = walletAnalyzer.generateInsights(walletData, tradingMetrics, riskAssessment);

            // Step 3: Generate structured analysis summary for AI
            const aiAnalysis = this.generateAnalysisSummary(walletData, tradingMetrics, riskAssessment, insights);

            // Return complete analysis
            const finalResult: WalletAnalysisResult = {
                walletData,
                tradingMetrics,
                riskAssessment,
                insights,
                aiAnalysis,
                generatedAt: Date.now(),
            };

            return finalResult;

        } catch (error) {
            console.error('❌ Wallet analysis failed:', error);
            throw new Error(`Wallet analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateWalletAddress(address: string): Promise<boolean> {
        // Basic Solana address validation - base58 encoded, 32-44 characters
        const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        return solanaAddressRegex.test(address);
    }

    async getAnalysisStatus(sessionId: string): Promise<{ status: string; progress: number; message: string }> {
        // This would typically connect to a backend service to track analysis progress
        // For now, return a mock status
        return {
            status: 'completed',
            progress: 100,
            message: 'Analysis completed successfully'
        };
    }

    private generateAnalysisSummary(walletData: any, tradingMetrics: any, riskAssessment: any, insights: any): string {
        return `
## Investment Strategy Assessment
This wallet demonstrates a ${insights.investorType} investment approach with ${tradingMetrics.tradingFrequency} trading activity. The portfolio shows ${insights.behaviorPattern.toLowerCase()} characteristics.

## Risk-Reward Profile
With a risk score of ${riskAssessment.riskScore}/10 (${riskAssessment.riskLevel}), this wallet exhibits:
- Diversification level: ${riskAssessment.factors.diversification.toFixed(1)}/10
- Volatility exposure: ${riskAssessment.factors.volatility.toFixed(1)}/10
- Concentration risk: ${riskAssessment.factors.concentrationRisk.toFixed(1)}/10

## Trading Behavior Analysis
The wallet has executed ${tradingMetrics.totalTrades} trades with a ${tradingMetrics.winRate.toFixed(1)}% win rate and total volume of $${tradingMetrics.totalVolume.toLocaleString()}. This indicates ${tradingMetrics.tradingFrequency === 'high' ? 'active' : tradingMetrics.tradingFrequency === 'medium' ? 'moderate' : 'conservative'} trading behavior.

## Portfolio Optimization Recommendations
${insights.recommendations.map((r: string) => `• ${r}`).join('\n')}

## Key Strengths
${insights.strengths.map((s: string) => `• ${s}`).join('\n')}

## Areas for Improvement
${insights.weaknesses.map((w: string) => `• ${w}`).join('\n')}

This analysis provides a comprehensive view of the wallet's performance and strategic positioning in the current market environment.
`;
    }

    formatAnalysisForChat(analysis: WalletAnalysisResult): string {
        const { walletData, tradingMetrics, riskAssessment, insights, aiAnalysis } = analysis;

        return `
# 🔍 Smart Money Wallet Analysis

## 📊 Portfolio Overview
- **Wallet**: \`${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}\`
- **Total Value**: $${walletData.totalBalanceUSD.toLocaleString()}
- **Tokens**: ${walletData.tokenBalances.length}
- **Transactions**: ${walletData.totalTransactions}

## 📈 Trading Performance
- **Total Volume**: $${tradingMetrics.totalVolume.toLocaleString()}
- **Win Rate**: ${tradingMetrics.winRate.toFixed(1)}%
- **P&L**: $${tradingMetrics.profitLoss.toLocaleString()}
- **Trading Style**: ${tradingMetrics.tradingFrequency} frequency

## ⚠️ Risk Assessment
- **Risk Score**: ${riskAssessment.riskScore}/10 (${riskAssessment.riskLevel})
- **Investor Type**: ${insights.investorType}

${riskAssessment.warnings.length > 0 ? `
**⚠️ Risk Warnings:**
${riskAssessment.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

## 💡 Key Insights
**Strengths:**
${insights.strengths.map(s => `✅ ${s}`).join('\n')}

**Areas for Improvement:**
${insights.weaknesses.map(w => `⚠️ ${w}`).join('\n')}

**Recommendations:**
${insights.recommendations.map(r => `💡 ${r}`).join('\n')}

## 🤖 AI Analysis
${aiAnalysis}

---
*Analysis generated on ${new Date(analysis.generatedAt).toLocaleString()}*
`;
    }
}

export const walletAnalysisService = new WalletAnalysisService();