'use client';

import React from 'react';
import { WalletAnalysisResult } from '@/lib/wallet-analysis/types';

interface AnalysisDisplayProps {
  analysis: WalletAnalysisResult;
  onNewAnalysis?: () => void;
}

export function AnalysisDisplay({ analysis, onNewAnalysis }: AnalysisDisplayProps) {
  const { walletData, tradingMetrics, riskAssessment, insights, aiAnalysis } = analysis;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'very_high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getInvestorTypeColor = (type: string) => {
    switch (type) {
      case 'conservative': return 'text-blue-400';
      case 'moderate': return 'text-green-400';
      case 'aggressive': return 'text-orange-400';
      case 'speculative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Analysis Results</h2>
          <p className="text-teal-300/70">
            Analysis completed on {new Date(analysis.generatedAt).toLocaleString()}
          </p>
        </div>
        {onNewAnalysis && (
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all"
          >
            New Analysis
          </button>
        )}
      </div>

      {/* Portfolio Overview */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Portfolio Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Wallet Address</div>
            <div className="text-white font-mono text-sm">
              {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Total Value</div>
            <div className="text-white font-semibold text-lg">
              ${walletData.totalBalanceUSD.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Tokens</div>
            <div className="text-white font-semibold text-lg">
              {walletData.tokenBalances.length}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Transactions</div>
            <div className="text-white font-semibold text-lg">
              {walletData.totalTransactions.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Metrics */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Trading Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Total Volume</div>
            <div className="text-white font-semibold text-lg">
              ${tradingMetrics.totalVolume.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Win Rate</div>
            <div className={`font-semibold text-lg ${tradingMetrics.winRate > 50 ? 'text-green-400' : 'text-red-400'}`}>
              {tradingMetrics.winRate.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">P&L</div>
            <div className={`font-semibold text-lg ${tradingMetrics.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${tradingMetrics.profitLoss.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Trading Frequency</div>
            <div className="text-white font-semibold capitalize">
              {tradingMetrics.tradingFrequency}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Avg Trade Size</div>
            <div className="text-white font-semibold">
              ${tradingMetrics.avgTradeSize.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="text-teal-300/70 text-sm">Total Trades</div>
            <div className="text-white font-semibold">
              {tradingMetrics.totalTrades.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Risk Assessment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-teal-300/70 text-sm">Risk Score</span>
                <span className={`font-bold text-lg ${getRiskColor(riskAssessment.riskLevel)}`}>
                  {riskAssessment.riskScore}/10
                </span>
              </div>
              <div className={`text-sm font-medium capitalize ${getRiskColor(riskAssessment.riskLevel)}`}>
                {riskAssessment.riskLevel.replace('_', ' ')} Risk
              </div>
            </div>
            
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="text-teal-300/70 text-sm mb-2">Investor Type</div>
              <div className={`font-semibold capitalize ${getInvestorTypeColor(insights.investorType)}`}>
                {insights.investorType}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-teal-300/70 text-sm mb-2">Risk Factors</div>
            {Object.entries(riskAssessment.factors).map(([factor, score]) => (
              <div key={factor} className="flex items-center justify-between py-1">
                <span className="text-white text-sm capitalize">
                  {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-teal-400 h-2 rounded-full transition-all"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-8">
                    {score.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {riskAssessment.warnings.length > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
            <div className="text-red-300 font-medium text-sm mb-2">⚠️ Risk Warnings</div>
            <ul className="space-y-1">
              {riskAssessment.warnings.map((warning, index) => (
                <li key={index} className="text-red-300/80 text-sm">• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Key Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-green-400 font-medium mb-2">✅ Strengths</h4>
            <ul className="space-y-1">
              {insights.strengths.map((strength, index) => (
                <li key={index} className="text-teal-300/80 text-sm">• {strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-orange-400 font-medium mb-2">⚠️ Areas for Improvement</h4>
            <ul className="space-y-1">
              {insights.weaknesses.map((weakness, index) => (
                <li key={index} className="text-teal-300/80 text-sm">• {weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-blue-400 font-medium mb-2">💡 Recommendations</h4>
            <ul className="space-y-1">
              {insights.recommendations.map((recommendation, index) => (
                <li key={index} className="text-teal-300/80 text-sm">• {recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-slate-800/40 rounded-lg">
          <div className="text-teal-300/70 text-sm mb-1">Behavior Pattern</div>
          <div className="text-white font-medium">{insights.behaviorPattern}</div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          AI Analysis
        </h3>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-teal-300/80 whitespace-pre-wrap leading-relaxed">
            {aiAnalysis}
          </div>
        </div>
      </div>
    </div>
  );
}