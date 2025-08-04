import React, { useState } from 'react';
import { Agent, AgentState, AgentStatus } from '@/lib/types';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: Agent;
  onStateChange: (id: string, state: AgentState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect?: (agent: Agent) => void;
  isLoading?: boolean;
  status?: AgentStatus;
  isPending?: boolean;
}

export function AgentCard({
  agent,
  onStateChange,
  onDelete,
  onSelect,
  status,
  isPending = false
}: AgentCardProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStateChange = async (newState: AgentState) => {
    setActionLoading(newState);
    try {
      await onStateChange(agent.id, newState);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setActionLoading('delete');
    try {
      await onDelete(agent.id);
    } finally {
      setActionLoading(null);
    }
  };

  const canStart = agent.state === 'CREATED' || agent.state === 'STOPPED';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadgeProps = () => {
    const currentStatus = status?.state || agent.state;
    const isLoading = actionLoading !== null || isPending;

    if (isLoading) {
      return {
        variant: 'secondary' as const,
        className: 'bg-slate-700/50 text-slate-300 border-slate-600',
        text: 'Loading...'
      };
    }

    switch (currentStatus) {
      case 'RUNNING':
        return {
          variant: 'default' as const,
          className: 'bg-green-900/30 text-green-400 border-green-500/30 hover:bg-green-900/40',
          text: 'Running'
        };
      case 'STOPPED':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-900/30 text-red-400 border-red-500/30',
          text: 'Stopped'
        };
      case 'CREATED':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
          text: 'Created'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-slate-700/50 text-slate-300 border-slate-600',
          text: 'Unknown'
        };
    }
  };

  const statusProps = getStatusBadgeProps();

  return (
    <div className="relative group">
      {/* Subtle glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>

      <Card className="relative w-full h-full min-h-[160px] max-h-[180px] bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/30 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:scale-[1.02] group overflow-hidden rounded-2xl">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* X Delete Button - Top Right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={actionLoading === 'delete'}
          className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-colors duration-200 z-10 rounded-xl backdrop-blur-sm cursor-pointer"
          aria-label={`Delete ${agent.name}`}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="relative p-4 h-full flex flex-col z-10">
          {/* Agent Name - Top Row */}
          <div className="flex items-start justify-between mb-3">
            <h3
              className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-teal-200 cursor-pointer hover:from-teal-300 hover:via-cyan-300 hover:to-white transition-all duration-300 leading-tight break-words pr-8 flex-1 tracking-tight"
              onClick={() => onSelect?.(agent)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(agent);
                }
              }}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {agent.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-4 break-words font-medium"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
            {agent.description}
          </p>

          {/* Created Date - Single Row */}
          <div className="text-xs mb-4 flex items-center space-x-1"
            style={{ fontFamily: 'SF Mono, Monaco, monospace' }}>
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full opacity-60"></div>
            <span className="text-gray-400 font-medium">Created:</span>
            <span className="text-teal-300 font-bold tracking-wide">
              {formatDate(agent.created_at)}
            </span>
          </div>

          {/* Bottom Section with Badge and Buttons */}
          <div className="mt-auto flex items-center justify-between">
            {/* Status Badge */}
            <Badge
              variant={statusProps.variant}
              className={`${statusProps.className} text-xs px-3 py-1.5 font-bold rounded-xl shadow-sm`}
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif' }}
            >
              {statusProps.text}
            </Badge>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Chat Button - Always visible */}
              <Button
                onClick={() => {
                  // Check if this agent has Smart Money Analysis tool
                  const hasWalletAnalysis = agent.description.toLowerCase().includes('smart money analysis');
                  
                  if (hasWalletAnalysis) {
                    // Store agent info and navigate to wallet analysis
                    localStorage.setItem('walletAnalysisAgent', JSON.stringify(agent));
                    window.location.href = '/app/analysis';
                  } else {
                    // Store the selected agent in localStorage for the chat page
                    localStorage.setItem('selectedChatAgent', JSON.stringify(agent));
                    // Navigate to chat page
                    window.location.href = '/app';
                  }
                }}
                size="sm"
                variant="outline"
                className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 hover:border-teal-500/50 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 text-xs px-3 py-1.5 h-8 rounded-xl cursor-pointer"
                aria-label={`Chat with ${agent.name}`}
                style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif' }}
              >
                {agent.description.toLowerCase().includes('smart money analysis') ? 'Analyze' : 'Chat'}
              </Button>

              {/* Start Button - Only when agent can be started */}
              {canStart && (
                <Button
                  onClick={() => handleStateChange('RUNNING')}
                  disabled={actionLoading !== null}
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/30 disabled:opacity-50 text-xs px-3 py-1.5 h-8 rounded-xl cursor-pointer"
                  aria-label={`Start ${agent.name}`}
                  style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif' }}
                >
                  {actionLoading === 'RUNNING' ? 'Starting...' : 'Start'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}