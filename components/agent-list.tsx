import React from 'react';
import { Agent, AgentState, AgentStatus } from '@/lib/types';
import { AgentCard } from './agent-card';

interface AgentListProps {
  agents: Agent[];
  onAgentSelect?: (agent: Agent) => void;
  onStateChange: (id: string, state: AgentState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreateAgent?: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  error?: string | null;
  agentStatuses?: Map<string, AgentStatus>;
  pendingOperations?: Set<string>;
}

// Loading skeleton component
function AgentCardSkeleton() {
  return (
    <div className="w-full h-full min-h-[160px] max-h-[180px] bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 rounded-xl shadow-sm animate-pulse overflow-hidden relative">
      {/* X Delete Button - Top Right */}
      <div className="absolute top-2 right-2 w-5 h-5 bg-teal-200 rounded-full"></div>

      {/* Title - Centered at Top */}
      <div className="pt-3 pb-2 px-4">
        <div className="h-4 bg-teal-200 rounded w-2/3 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2 pt-0 flex-1 flex flex-col">
        {/* Description - Left Aligned */}
        <div className="space-y-1 mb-2">
          <div className="h-3 bg-teal-200 rounded w-full"></div>
          <div className="h-3 bg-teal-200 rounded w-2/3"></div>
        </div>

        {/* Created Date - Centered */}
        <div className="flex justify-center mb-2">
          <div className="h-3 bg-teal-200 rounded w-20"></div>
        </div>

        {/* Bottom Section with Badge and Button */}
        <div className="mt-auto flex items-end justify-between">
          {/* Status Badge - Left Bottom */}
          <div className="h-4 bg-teal-200 rounded-full w-12"></div>
          
          {/* Start Button - Right Bottom */}
          <div className="h-6 bg-teal-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ onCreateAgent }: { onCreateAgent?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Get started by creating your first AI agent. You can configure different strategies and tools to suit your needs.
      </p>
      {onCreateAgent && (
        <button
          onClick={onCreateAgent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Agent
        </button>
      )}
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load agents</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}

export function AgentList({
  agents,
  onAgentSelect,
  onStateChange,
  onDelete,
  onCreateAgent,
  onRetry,
  isLoading = false,
  error = null,
  agentStatuses,
  pendingOperations,
}: AgentListProps) {
  // Show error state
  if (error && !isLoading) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Show loading state
  if (isLoading && agents.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <AgentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (!isLoading && agents.length === 0) {
    return <EmptyState onCreateAgent={onCreateAgent} />;
  }

  // Show agents grid
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
      role="grid"
      aria-label="Agent list"
    >
      {agents.map((agent) => (
        <div key={agent.id} role="gridcell" className="flex">
          <AgentCard
            agent={agent}
            onStateChange={onStateChange}
            onDelete={onDelete}
            onSelect={onAgentSelect}
            isLoading={isLoading}
            status={agentStatuses?.get(agent.id)}
            isPending={pendingOperations?.has(agent.id)}
          />
        </div>
      ))}
    </div>
  );
}