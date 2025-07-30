import React from 'react';
import { AgentState } from '@/lib/types';

interface AgentStatusIndicatorProps {
  status: AgentState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  isLoading?: boolean;
  isStale?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  lastUpdated?: string;
}

const statusConfig = {
  CREATED: {
    color: 'bg-gray-400',
    label: 'Created',
    textColor: 'text-gray-600',
  },
  RUNNING: {
    color: 'bg-green-500',
    label: 'Running',
    textColor: 'text-green-600',
  },

  STOPPED: {
    color: 'bg-red-500',
    label: 'Stopped',
    textColor: 'text-red-600',
  },
};

const sizeConfig = {
  sm: {
    dot: 'w-2 h-2',
    text: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    dot: 'w-3 h-3',
    text: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    dot: 'w-4 h-4',
    text: 'text-base',
    gap: 'gap-2',
  },
};

export function AgentStatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = true,
  isLoading = false,
  isStale = false,
  hasError = false,
  errorMessage,
  lastUpdated
}: AgentStatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  // Determine visual state
  const isTransitioning = isLoading;
  const showStaleIndicator = isStale && !isLoading;
  const showErrorState = hasError && !isLoading;

  // Calculate time since last update for stale detection
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return null;
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const timeSinceUpdate = getTimeSinceUpdate();

  // Build aria label with context
  const buildAriaLabel = () => {
    let label = `Agent status: ${config.label}`;
    if (showErrorState && errorMessage) {
      label += `, Error: ${errorMessage}`;
    } else if (showStaleIndicator) {
      label += ', Data may be stale';
    } else if (isTransitioning) {
      label += ', Updating';
    }
    if (timeSinceUpdate) {
      label += `, Last updated ${timeSinceUpdate}`;
    }
    return label;
  };

  return (
    <div 
      className={`flex items-center ${sizeStyles.gap} group relative`}
      role="status"
      aria-label={buildAriaLabel()}
      title={buildAriaLabel()}
    >
      <div className="relative">
        {/* Main status dot */}
        <div
          className={`
            ${sizeStyles.dot} 
            ${showErrorState ? 'bg-red-500 border-2 border-red-300' : config.color}
            ${showStaleIndicator ? 'opacity-60' : ''}
            rounded-full 
            transition-all duration-300 ease-in-out
            ${isTransitioning ? 'animate-pulse' : ''}
          `}
          aria-hidden="true"
        />
        
        {/* Transition animation ring */}
        {isTransitioning && (
          <div
            className={`
              absolute inset-0 
              ${sizeStyles.dot} 
              ${config.color} 
              rounded-full 
              animate-ping 
              opacity-75
            `}
            aria-hidden="true"
          />
        )}
        
        {/* Stale data indicator */}
        {showStaleIndicator && (
          <div
            className={`
              absolute -top-0.5 -right-0.5
              w-1.5 h-1.5
              bg-orange-400
              rounded-full
              animate-pulse
            `}
            aria-hidden="true"
            title="Status data may be stale"
          />
        )}
        
        {/* Error indicator */}
        {showErrorState && (
          <div
            className={`
              absolute -top-0.5 -right-0.5
              w-1.5 h-1.5
              bg-red-600
              rounded-full
              animate-pulse
            `}
            aria-hidden="true"
            title={errorMessage || "Status error"}
          />
        )}
      </div>
      
      {showLabel && (
        <div className="flex flex-col">
          <span 
            className={`
              ${sizeStyles.text} 
              ${showErrorState ? 'text-red-600' : config.textColor} 
              ${showStaleIndicator ? 'opacity-70' : ''}
              font-medium
              transition-colors duration-200
            `}
            aria-hidden="true"
          >
            {config.label}
            {isTransitioning && (
              <span className="ml-1 text-xs opacity-75">
                ...
              </span>
            )}
          </span>
          
          {/* Show additional info on hover or when there's an issue */}
          {(showStaleIndicator || showErrorState || timeSinceUpdate) && (
            <span 
              className={`
                ${size === 'sm' ? 'text-xs' : 'text-xs'} 
                text-gray-500
                ${showErrorState ? 'text-red-500' : ''}
                ${showStaleIndicator ? 'text-orange-500' : ''}
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                max-w-32 truncate
              `}
              aria-hidden="true"
            >
              {showErrorState && errorMessage ? (
                errorMessage.length > 20 ? `${errorMessage.substring(0, 20)}...` : errorMessage
              ) : showStaleIndicator ? (
                'Stale data'
              ) : (
                timeSinceUpdate
              )}
            </span>
          )}
        </div>
      )}
      
      {/* Tooltip for detailed information */}
      {(showErrorState || showStaleIndicator) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
          {showErrorState && errorMessage ? (
            `Error: ${errorMessage}`
          ) : showStaleIndicator ? (
            `Data may be stale${timeSinceUpdate ? ` (${timeSinceUpdate})` : ''}`
          ) : null}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}