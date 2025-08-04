'use client';

import React, { useState, useEffect } from 'react';
import { WalletAnalysisChat } from '@/components/wallet-analysis';
import { Agent } from '@/lib/types';
import { AgentService } from '@/lib/agent-service';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface AgentSelectorProps {
  agents: Agent[];
  walletAddress: string | null;
  onAgentSelect: (agent: Agent) => void;
  onBack: () => void;
}

function AgentSelector({ agents, walletAddress, onAgentSelect, onBack }: AgentSelectorProps) {
  // Filter agents based on description and name since all use llm_chat tool
  const analysisAgents = agents.filter(agent => {
    const description = agent.description.toLowerCase();
    const name = agent.name.toLowerCase();

    // Check if description or name indicates this is an analysis agent
    return description.includes('smart money') ||
      description.includes('wallet analysis') ||
      description.includes('trading insights') ||
      description.includes('external data') ||
      description.includes('analysis') ||
      name.includes('smart money') ||
      name.includes('analysis') ||
      name.includes('wallet');
  });

  return (
    <div className="h-full bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/60 via-slate-800/50 to-slate-800/60 backdrop-blur-md border-b border-teal-400/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-teal-200 tracking-tight">
                  Select Analysis Agent
                </h1>
                <p className="text-sm text-gray-300">
                  Choose an agent to analyze {walletAddress ? `wallet ${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : 'the wallet'}
                </p>
              </div>
            </div>

            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white border border-slate-600/30 hover:border-teal-400/30 text-sm rounded-lg transition-all"
            >
              Back to Traders
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {analysisAgents.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Available Analysis Agents</h2>
                <p className="text-gray-400 text-sm">
                  Select an agent with analysis capabilities to proceed with wallet analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {analysisAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/30 hover:border-teal-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
                    onClick={() => onAgentSelect(agent)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{agent.name}</h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agent.state === 'RUNNING'
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${agent.state === 'RUNNING' ? 'bg-green-400' : 'bg-yellow-400'
                              } ${agent.state === 'RUNNING' ? 'animate-pulse' : ''}`}></div>
                            {agent.state}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {agent.description}
                    </p>

                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Tools:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.slice(0, 3).map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-700/50 text-gray-300 text-xs rounded-md"
                          >
                            {tool}
                          </span>
                        ))}
                        {agent.tools.length > 3 && (
                          <span className="px-2 py-1 bg-slate-700/50 text-gray-400 text-xs rounded-md">
                            +{agent.tools.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg transition-all text-sm font-medium">
                      Select Agent
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Analysis Agents Found</h3>
              <p className="text-gray-400 mb-6">
                No agents with analysis capabilities were found. Create a Smart Money Analysis agent to get started.
              </p>
              <div className="flex flex-col space-y-3 max-w-sm mx-auto">
                <Link
                  href="/app/agents"
                  className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all"
                >
                  Create Analysis Agent
                </Link>
                <button
                  onClick={onBack}
                  className="inline-flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all"
                >
                  Back to Traders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletFromUrl, setWalletFromUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadAgent = async () => {
      try {
        // Get wallet address from URL parameters
        const walletParam = searchParams?.get('wallet');
        if (walletParam) {
          setWalletFromUrl(walletParam);
        }

        // First try to get agent from localStorage (for backward compatibility)
        const agentData = localStorage.getItem('walletAnalysisAgent');

        if (agentData) {
          try {
            const parsedAgent = JSON.parse(agentData);
            setAgent(parsedAgent);
            localStorage.removeItem('walletAnalysisAgent');
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing agent data:', error);
          }
        }

        // Fetch all agents
        const agentService = new AgentService();
        const agentsResponse = await agentService.getAgents();

        if (agentsResponse.success && agentsResponse.data) {
          setAllAgents(agentsResponse.data);



          // Find the first agent with Smart Money Analysis capabilities
          // Since all agents use llm_chat tool, we detect based on description and name
          const smartMoneyAgent = agentsResponse.data.find(agent => {
            const description = agent.description.toLowerCase();
            const name = agent.name.toLowerCase();

            // Check if description or name indicates this is a Smart Money Analysis agent
            return description.includes('smart money') ||
              description.includes('wallet analysis') ||
              description.includes('trading insights') ||
              description.includes('external data') ||
              name.includes('smart money') ||
              name.includes('analysis') ||
              name.includes('wallet');
          });

          if (smartMoneyAgent) {
            setAgent(smartMoneyAgent);
          } else {
            // Check if there are any analysis-related agents using same logic as above
            const analysisAgents = agentsResponse.data.filter(agent => {
              const description = agent.description.toLowerCase();
              const name = agent.name.toLowerCase();

              // Check if description or name indicates this is an analysis agent
              return description.includes('smart money') ||
                description.includes('wallet analysis') ||
                description.includes('trading insights') ||
                description.includes('external data') ||
                description.includes('analysis') ||
                name.includes('smart money') ||
                name.includes('analysis') ||
                name.includes('wallet');
            });

            if (analysisAgents.length > 0) {
              setShowAgentSelector(true);
            } else {
              setError('No analysis agents found. Please create a Smart Money Analysis agent first.');
            }
          }
        } else {
          setError(agentsResponse.error || 'Failed to load agents');
        }
      } catch (err) {
        console.error('Error loading agent:', err);
        setError(err instanceof Error ? err.message : 'Failed to load agent');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [searchParams]);

  const handleAgentSelect = (selectedAgent: Agent) => {
    setAgent(selectedAgent);
    setShowAgentSelector(false);
  };

  const handleBackToTraders = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-300">Loading wallet analysis...</p>
        </div>
      </div>
    );
  }

  // Show agent selector if we have agents but no specific agent selected
  if (showAgentSelector && allAgents.length > 0) {
    return (
      <AgentSelector
        agents={allAgents}
        walletAddress={walletFromUrl}
        onAgentSelect={handleAgentSelect}
        onBack={handleBackToTraders}
      />
    );
  }

  if (!agent) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {error ? 'Agent Not Found' : 'No Agent Selected'}
          </h2>
          <p className="text-gray-400 mb-6">
            {error || 'Please select a Smart Money Analysis agent from the agents page to continue.'}
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              href="/app/agents"
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all"
            >
              {error ? 'Create Analysis Agent' : 'Go to Agents'}
            </Link>
            {error && (
              <button
                onClick={handleBackToTraders}
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all"
              >
                Back to Traders
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Header - matches agent chat style */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">A</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
              <p className="text-sm text-gray-400">Smart Money Wallet Analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
              Ready to analyze
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <WalletAnalysisChat
        agent={agent}
        initialWallet={walletFromUrl || undefined}
        onAnalysisComplete={(analysis) => {
          // Analysis completed successfully
        }}
        onError={(error) => {
          console.error('Analysis error:', error);
        }}
      />
    </div>
  );
}