import React from 'react';
import { useConnectionHealth, useAgentContext } from '@/lib/agent-context';

interface ConnectionStatusProps {
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConnectionStatus({ 
  showDetails = true, 
  size = 'md',
  className = '' 
}: ConnectionStatusProps) {
  const connectionHealth = useConnectionHealth();
  const { actions } = useAgentContext();

  const handleManualRefresh = async () => {
    try {
      await actions.forceRefresh();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  const handleRetry = () => {
    actions.retry();
  };

  const getStatusConfig = () => {
    switch (connectionHealth.health) {
      case 'healthy':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          label: 'Connected',
          description: 'Real-time updates active'
        };
      case 'degraded':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          label: 'Connection Issues',
          description: 'Experiencing connectivity problems'
        };
      case 'offline':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          ),
          label: 'Offline',
          description: 'Unable to connect to agent service'
        };
    }
  };

  const config = getStatusConfig();
  const isOffline = connectionHealth.health === 'offline';
  const isDegraded = connectionHealth.health === 'degraded';

  const formatLastUpdate = () => {
    if (!connectionHealth.lastUpdated) return 'Never';
    
    const now = new Date();
    const lastUpdate = connectionHealth.lastUpdated;
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 30) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'Over a day ago';
  };

  if (!showDetails) {
    // Compact version - just the status dot
    return (
      <div 
        className={`flex items-center space-x-2 ${className}`}
        title={`${config.label}: ${config.description}`}
      >
        <div className={`w-2 h-2 rounded-full ${
          connectionHealth.health === 'healthy' ? 'bg-green-500' :
          connectionHealth.health === 'degraded' ? 'bg-yellow-500 animate-pulse' : 
          'bg-red-500 animate-pulse'
        }`} />
        {connectionHealth.isPolling && connectionHealth.health === 'healthy' && (
          <span className="text-xs text-blue-500">Live</span>
        )}
      </div>
    );
  }

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`${config.color}`}>
            {config.icon}
          </div>
          <div>
            <div className={`text-sm font-medium ${config.color}`}>
              {config.label}
            </div>
            {showDetails && (
              <div className="text-xs text-gray-600">
                {config.description}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={connectionHealth.isPolling && connectionHealth.health === 'healthy'}
            className={`
              p-1.5 rounded-md transition-colors
              ${connectionHealth.isPolling && connectionHealth.health === 'healthy' 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }
            `}
            title="Refresh status"
            aria-label="Manually refresh agent status"
          >
            <svg 
              className={`w-4 h-4 ${connectionHealth.isPolling ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
          
          {/* Retry button for offline/degraded states */}
          {(isOffline || isDegraded) && (
            <button
              onClick={handleRetry}
              className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              aria-label="Retry connection"
            >
              Retry
            </button>
          )}
        </div>
      </div>
      
      {/* Additional details */}
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-gray-200/50">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>
              Last updated: {formatLastUpdate()}
            </span>
            {connectionHealth.retryCount > 0 && (
              <span>
                Retries: {connectionHealth.retryCount}
              </span>
            )}
          </div>
          
          {connectionHealth.lastError && (
            <div className="mt-1 text-xs text-red-600 truncate" title={connectionHealth.lastError}>
              Error: {connectionHealth.lastError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for easy access to connection actions
export function useConnectionActions() {
  const { actions } = useAgentContext();
  
  return {
    forceRefresh: actions.forceRefresh,
    retry: actions.retry,
    startPolling: actions.startPolling,
    stopPolling: actions.stopPolling,
  };
}