import { WalletData, TradingMetrics, RiskAssessment, WalletAnalysisResult } from './types';

export class WalletAnalyzer {
  
  calculateTradingMetrics(walletData: WalletData): TradingMetrics {
    // Return minimal metrics based on raw transaction count only
    // All complex calculations will be done by AI
    const totalTrades = 0; // Will be calculated by AI from actual trading transactions
    
    // Determine trading frequency based on transaction count and time span
    const daysSinceFirst = walletData.firstTransactionDate > 0 
      ? (Date.now() / 1000 - walletData.firstTransactionDate) / (24 * 60 * 60)
      : 1;
    const tradesPerDay = totalTrades / daysSinceFirst;
    
    let tradingFrequency: 'high' | 'medium' | 'low';
    if (tradesPerDay > 5) tradingFrequency = 'high';
    else if (tradesPerDay > 1) tradingFrequency = 'medium';
    else tradingFrequency = 'low';

    // Return minimal data - AI will do the real analysis
    return {
      totalVolume: 0, // Will be calculated by AI from raw RPC data
      totalTrades,
      avgTradeSize: 0, // Will be calculated by AI from raw RPC data
      profitLoss: 0, // Will be calculated by AI from raw RPC data
      winRate: 0, // Will be calculated by AI from raw RPC data
      largestGain: 0, // Will be calculated by AI from raw RPC data
      largestLoss: 0, // Will be calculated by AI from raw RPC data
      avgHoldingTime: 0, // Will be calculated by AI from raw RPC data
      mostTradedTokens: [], // Will be calculated by AI from raw RPC data
      tradingFrequency,
    };
  }

  assessRisk(walletData: WalletData, tradingMetrics: TradingMetrics): RiskAssessment {
    // Simplified risk assessment - AI will do the real analysis
    // Return minimal risk data based only on basic metrics
    
    const tokenCount = walletData.tokenBalances.length;
    const transactionCount = walletData.totalTransactions;
    
    // Simple risk score based on basic factors
    let riskScore = 5; // Base risk
    
    // Adjust based on token diversification
    if (tokenCount < 3) riskScore += 2;
    else if (tokenCount > 10) riskScore -= 1;
    
    // Adjust based on trading frequency
    if (tradingMetrics.tradingFrequency === 'high') riskScore += 1;
    else if (tradingMetrics.tradingFrequency === 'low') riskScore -= 1;

    // Clamp risk score to 1-10 range
    riskScore = Math.min(10, Math.max(1, riskScore));

    let riskLevel: 'low' | 'medium' | 'high' | 'very_high';
    if (riskScore <= 3) riskLevel = 'low';
    else if (riskScore <= 5) riskLevel = 'medium';
    else if (riskScore <= 7) riskLevel = 'high';
    else riskLevel = 'very_high';

    // Minimal risk assessment - AI will do detailed analysis
    return {
      riskScore: Math.round(riskScore * 10) / 10,
      riskLevel,
      factors: {
        diversification: tokenCount > 5 ? 7 : 3, // Simple diversification based on token count
        volatility: tradingMetrics.tradingFrequency === 'high' ? 8 : 4,
        liquidityRisk: 5, // Will be calculated by AI
        smartContractRisk: 3, // Will be calculated by AI
        concentrationRisk: tokenCount < 3 ? 8 : 4,
      },
      warnings: [], // AI will generate warnings
    };
  }

  generateInsights(walletData: WalletData, tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment) {
    const { tokenBalances, defiPositions } = walletData;
    
    // Generate summary
    const summary = this.generateSummary(walletData, tradingMetrics, riskAssessment);
    
    // Identify strengths
    const strengths = this.identifyStrengths(walletData, tradingMetrics, riskAssessment);
    
    // Identify weaknesses
    const weaknesses = this.identifyWeaknesses(walletData, tradingMetrics, riskAssessment);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(walletData, tradingMetrics, riskAssessment);
    
    // Determine behavior pattern
    const behaviorPattern = this.determineBehaviorPattern(tradingMetrics);
    
    // Classify investor type
    const investorType = this.classifyInvestorType(tradingMetrics, riskAssessment);

    return {
      summary,
      strengths,
      weaknesses,
      recommendations,
      behaviorPattern,
      investorType,
    };
  }

  private calculateProfitLoss(transactions: any[]): number {
    // Simplified P&L calculation
    // In reality, this would require more sophisticated tracking of buy/sell pairs
    const inflows = transactions.filter(tx => tx.type === 'receive').reduce((sum, tx) => sum + tx.valueUSD, 0);
    const outflows = transactions.filter(tx => tx.type === 'send').reduce((sum, tx) => sum + tx.valueUSD, 0);
    return inflows - outflows;
  }

  private calculateWinRate(transactions: any[]): number {
    // Simplified win rate calculation
    const profitableTxs = transactions.filter(tx => tx.valueUSD > 0).length;
    const totalTxs = transactions.length;
    return totalTxs > 0 ? (profitableTxs / totalTxs) * 100 : 0;
  }

  private calculateAvgHoldingTime(transactions: any[]): number {
    // Simplified holding time calculation
    // Would need more sophisticated tracking in reality
    if (transactions.length < 2) return 0;
    
    const timeSpan = Math.max(...transactions.map(tx => tx.timestamp)) - Math.min(...transactions.map(tx => tx.timestamp));
    return timeSpan / (24 * 60 * 60); // Convert to days
  }

  private calculateDiversification(tokenBalances: any[]): number {
    if (tokenBalances.length === 0) return 1;
    
    // Simple diversification based on token count (AI will do detailed analysis)
    if (tokenBalances.length >= 10) return 8;
    else if (tokenBalances.length >= 5) return 6;
    else if (tokenBalances.length >= 3) return 4;
    else return 2;
  }

  private calculateVolatilityRisk(tradingMetrics: TradingMetrics): number {
    let risk = 5; // Base risk
    
    if (tradingMetrics.tradingFrequency === 'high') risk += 2;
    else if (tradingMetrics.tradingFrequency === 'medium') risk += 1;
    
    if (tradingMetrics.avgTradeSize > 10000) risk += 1;
    if (tradingMetrics.winRate < 40) risk += 1;
    
    return Math.min(10, risk);
  }

  private calculateLiquidityRisk(tokenBalances: any[], defiPositions: any[]): number {
    let risk = 3; // Base risk
    
    // Check for token diversity (simplified risk assessment)
    const tokenCount = tokenBalances.length;
    if (tokenCount > 10) {
      risk += 1; // Many tokens can indicate higher risk
    }
    
    // DeFi positions add liquidity risk
    risk += Math.min(2, defiPositions.length * 0.3);
    
    return Math.min(10, risk);
  }



  private generateRiskWarnings(riskScore: number, factors: any): string[] {
    const warnings: string[] = [];
    
    if (riskScore > 7) {
      warnings.push('High overall risk profile detected');
    }
    
    if (factors.concentrationRisk > 7) {
      warnings.push('Portfolio is heavily concentrated in few assets');
    }
    
    if (factors.volatility > 7) {
      warnings.push('High trading frequency may increase risk');
    }
    
    if (factors.smartContractRisk > 6) {
      warnings.push('Significant exposure to smart contract risks');
    }
    
    if (factors.diversification < 4) {
      warnings.push('Portfolio lacks diversification');
    }
    
    return warnings;
  }

  private generateSummary(walletData: WalletData, tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment): string {
    const { nativeBalance, totalTransactions } = walletData;
    const { tradingFrequency } = tradingMetrics;
    const { riskLevel } = riskAssessment;
    
    return `This wallet holds $${nativeBalance.toFixed(2)} SOL across ${walletData.tokenBalances.length} tokens with ${totalTransactions} total transactions. The trading activity is ${tradingFrequency} frequency with $unknown in total volume. Risk assessment: ${riskLevel}.`;
  }

  private identifyStrengths(walletData: WalletData, tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment): string[] {
    const strengths: string[] = [];
    
    if (riskAssessment.factors.diversification > 6) {
      strengths.push('Well-diversified portfolio');
    }
    
    if (tradingMetrics.winRate > 60) {
      strengths.push('High win rate in trading activities');
    }
    
    if (walletData.nativeBalance > 500) {
      strengths.push('Substantial portfolio value');
    }
    
    if (tradingMetrics.tradingFrequency === 'medium') {
      strengths.push('Balanced trading frequency');
    }
    
    if (walletData.defiPositions.length > 0) {
      strengths.push('Active in DeFi ecosystem');
    }
    
    return strengths;
  }

  private identifyWeaknesses(walletData: WalletData, tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment): string[] {
    const weaknesses: string[] = [];
    
    if (riskAssessment.factors.concentrationRisk > 7) {
      weaknesses.push('Over-concentration in few assets');
    }
    
    if (tradingMetrics.winRate < 40) {
      weaknesses.push('Low trading success rate');
    }
    
    if (tradingMetrics.tradingFrequency === 'high') {
      weaknesses.push('Potentially over-trading');
    }
    
    if (riskAssessment.riskScore > 7) {
      weaknesses.push('High risk exposure');
    }
    
    if (walletData.tokenBalances.length < 3) {
      weaknesses.push('Limited diversification');
    }
    
    return weaknesses;
  }

  private generateRecommendations(walletData: WalletData, tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment): string[] {
    const recommendations: string[] = [];
    
    if (riskAssessment.factors.diversification < 5) {
      recommendations.push('Consider diversifying across more assets');
    }
    
    if (riskAssessment.factors.concentrationRisk > 6) {
      recommendations.push('Reduce concentration in largest positions');
    }
    
    if (tradingMetrics.tradingFrequency === 'high' && tradingMetrics.winRate < 50) {
      recommendations.push('Consider reducing trading frequency to improve performance');
    }
    
    if (walletData.defiPositions.length === 0 && walletData.nativeBalance > 100) {
      recommendations.push('Explore DeFi opportunities for yield generation');
    }
    
    if (riskAssessment.riskScore > 7) {
      recommendations.push('Consider implementing risk management strategies');
    }
    
    return recommendations;
  }

  private determineBehaviorPattern(tradingMetrics: TradingMetrics): string {
    const { tradingFrequency, avgTradeSize, winRate } = tradingMetrics;
    
    if (tradingFrequency === 'high' && avgTradeSize < 1000) {
      return 'High-frequency small-scale trader';
    } else if (tradingFrequency === 'low' && avgTradeSize > 10000) {
      return 'Strategic large-position investor';
    } else if (winRate > 70) {
      return 'Skilled selective trader';
    } else if (tradingFrequency === 'high' && winRate < 40) {
      return 'Impulsive high-risk trader';
    } else {
      return 'Moderate activity investor';
    }
  }

  private classifyInvestorType(tradingMetrics: TradingMetrics, riskAssessment: RiskAssessment): 'conservative' | 'moderate' | 'aggressive' | 'speculative' {
    const { tradingFrequency } = tradingMetrics;
    const { riskScore } = riskAssessment;
    
    if (riskScore <= 3 && tradingFrequency === 'low') {
      return 'conservative';
    } else if (riskScore <= 5 && tradingFrequency !== 'high') {
      return 'moderate';
    } else if (riskScore <= 7 || tradingFrequency === 'high') {
      return 'aggressive';
    } else {
      return 'speculative';
    }
  }
}

export const walletAnalyzer = new WalletAnalyzer();