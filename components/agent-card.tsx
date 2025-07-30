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
        className: 'bg-slate-100 text-slate-700 border-slate-200',
        text: 'Loading...'
      };
    }

    switch (currentStatus) {
      case 'RUNNING':
        return {
          variant: 'default' as const,
          className: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
          text: 'Running'
        };
      case 'STOPPED':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
          text: 'Stopped'
        };
      case 'CREATED':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          text: 'Created'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown'
        };
    }
  };

  const statusProps = getStatusBadgeProps();

  return (
    <Card className="w-full h-full min-h-[160px] max-h-[180px] bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200 hover:shadow-lg hover:shadow-teal-200/50 transition-all duration-300 hover:scale-[1.02] group overflow-hidden relative">
      {/* X Delete Button - Top Right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={actionLoading === 'delete'}
        className="absolute top-1 right-1 h-6 w-6 text-teal-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 z-10"
        aria-label={`Delete ${agent.name}`}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="p-3 h-full flex flex-col">
        {/* Agent Name - Top Row */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-sm font-bold text-teal-900 cursor-pointer hover:text-teal-700 transition-colors duration-200 leading-tight break-words pr-8 flex-1"
            onClick={() => onSelect?.(agent)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(agent);
              }
            }}
          >
            {agent.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-teal-800 text-xs leading-relaxed line-clamp-2 mb-3 break-words">
          {agent.description}
        </p>

        {/* Created Date - Single Row */}
        <div className="text-xs mb-3">
          <span className="text-teal-700 font-medium">Created: </span>
          <span className="text-teal-800 font-semibold">
            {formatDate(agent.created_at)}
          </span>
        </div>

        {/* Bottom Section with Badge and Buttons */}
        <div className="mt-auto flex items-center justify-between">
          {/* Status Badge */}
          <Badge
            variant={statusProps.variant}
            className={`${statusProps.className} text-xs px-2 py-1 font-medium`}
          >
            {statusProps.text}
          </Badge>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Chat Button - Always visible */}
            <Button
              onClick={() => {
                // Store the selected agent in localStorage for the chat page
                localStorage.setItem('selectedChatAgent', JSON.stringify(agent));
                // Navigate to chat page
                window.location.href = '/app';
              }}
              size="sm"
              variant="outline"
              className="bg-white/80 hover:bg-white border-teal-300 text-teal-700 hover:text-teal-800 font-semibold transition-all duration-300 hover:shadow-md hover:shadow-teal-300/50 text-xs px-2 py-1 h-7"
              aria-label={`Chat with ${agent.name}`}
            >
              Chat
            </Button>

            {/* Start Button - Only when agent can be started */}
            {canStart && (
              <Button
                onClick={() => handleStateChange('RUNNING')}
                disabled={actionLoading !== null}
                size="sm"
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold transition-all duration-300 hover:shadow-md hover:shadow-teal-300/50 disabled:opacity-50 text-xs px-2 py-1 h-7"
                aria-label={`Start ${agent.name}`}
              >
                {actionLoading === 'RUNNING' ? 'Starting...' : 'Start'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}