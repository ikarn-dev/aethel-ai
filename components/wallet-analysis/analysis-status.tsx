'use client';

import React from 'react';

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface AnalysisStatusProps {
  currentStep: number;
  steps: AnalysisStep[];
  error?: string;
  onCancel?: () => void;
}

export function AnalysisStatus({ currentStep, steps, error, onCancel }: AnalysisStatusProps) {
  const getStepIcon = (step: AnalysisStep, index: number) => {
    if (step.status === 'completed') {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (step.status === 'active') {
      return (
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
          <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    } else if (step.status === 'error') {
      return (
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{index + 1}</span>
        </div>
      );
    }
  };

  const getStepColor = (step: AnalysisStep) => {
    switch (step.status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-teal-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-teal-400/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Analyzing Wallet...
          </h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-teal-300 hover:text-white hover:bg-slate-700/50 rounded transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 font-medium">Analysis Failed</span>
            </div>
            <p className="text-red-300/80 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              {getStepIcon(step, index)}
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${getStepColor(step)}`}>
                  {step.title}
                </div>
                <div className="text-teal-300/70 text-sm mt-1">
                  {step.description}
                </div>
                
                {step.status === 'active' && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-teal-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && step.status !== 'pending' && (
                <div className="absolute left-4 mt-8 w-0.5 h-8 bg-slate-600" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-teal-400/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-300/70">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-teal-300/70">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          
          <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Default analysis steps
export const DEFAULT_ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'validate',
    title: 'Validating Wallet Address',
    description: 'Checking wallet address format and accessibility',
    status: 'pending'
  },
  {
    id: 'fetch',
    title: 'Fetching Wallet Data',
    description: 'Retrieving on-chain data, transactions, and token balances',
    status: 'pending'
  },
  {
    id: 'analyze',
    title: 'Analyzing Trading Patterns',
    description: 'Computing trading metrics, risk assessment, and portfolio insights',
    status: 'pending'
  },
  {
    id: 'ai',
    title: 'AI Analysis',
    description: 'Generating detailed insights using Gemini AI',
    status: 'pending'
  },
  {
    id: 'complete',
    title: 'Analysis Complete',
    description: 'Preparing results for display',
    status: 'pending'
  }
];