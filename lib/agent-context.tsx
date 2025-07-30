'use client';

import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef } from 'react';
import { Agent, AgentStatus } from './types';

// Removed status-polling dependency - using simplified approach
import { AgentService } from './agent-service';

// Context state interface
interface AgentContextState {
  // Real-time state
  agentStatuses: Map<string, AgentStatus>;
  lastUpdated: Date | null;
  isPolling: boolean;
  connectionHealth: 'healthy' | 'degraded' | 'offline';

  // UI state
  selectedAgentId: string | null;
  optimisticUpdates: Map<string, Partial<Agent>>;
  pendingOperations: Set<string>;

  // Error recovery
  retryCount: number;
  lastError: string | null;
}

// Context actions
interface AgentContextActions {
  // Real-time updates
  startPolling: () => void;
  stopPolling: () => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  batchUpdateStatuses: (statuses: AgentStatus[]) => void;
  forceRefresh: () => Promise<void>;

  // Optimistic updates
  applyOptimisticUpdate: (agentId: string, updates: Partial<Agent>) => void;
  revertOptimisticUpdate: (agentId: string) => void;
  clearOptimisticUpdates: () => void;

  // UI state management
  selectAgent: (agentId: string | null) => void;

  // Error recovery
  handleError: (error: string) => void;
  clearError: () => void;
  retry: () => void;

  // Connection health
  updateConnectionHealth: (health: 'healthy' | 'degraded' | 'offline') => void;

  // Polling control
  updatePollingInterval: (interval: number) => void;
  getPollingStats: () => any;
}

// Action types for reducer
type AgentContextAction =
  | { type: 'START_POLLING' }
  | { type: 'STOP_POLLING' }
  | { type: 'UPDATE_AGENT_STATUS'; payload: { agentId: string; status: AgentStatus } }
  | { type: 'BATCH_UPDATE_STATUSES'; payload: AgentStatus[] }
  | { type: 'APPLY_OPTIMISTIC_UPDATE'; payload: { agentId: string; updates: Partial<Agent> } }
  | { type: 'REVERT_OPTIMISTIC_UPDATE'; payload: string }
  | { type: 'CLEAR_OPTIMISTIC_UPDATES' }
  | { type: 'SELECT_AGENT'; payload: string | null }
  | { type: 'ADD_PENDING_OPERATION'; payload: string }
  | { type: 'REMOVE_PENDING_OPERATION'; payload: string }
  | { type: 'HANDLE_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INCREMENT_RETRY' }
  | { type: 'RESET_RETRY' }
  | { type: 'UPDATE_CONNECTION_HEALTH'; payload: 'healthy' | 'degraded' | 'offline' }
  | { type: 'SET_LAST_UPDATED'; payload: Date };

// Initial state
const initialState: AgentContextState = {
  agentStatuses: new Map(),
  lastUpdated: null,
  isPolling: false,
  connectionHealth: 'healthy',
  selectedAgentId: null,
  optimisticUpdates: new Map(),
  pendingOperations: new Set(),
  retryCount: 0,
  lastError: null,
};

// Reducer function
function agentContextReducer(state: AgentContextState, action: AgentContextAction): AgentContextState {
  switch (action.type) {
    case 'START_POLLING':
      return { ...state, isPolling: true };

    case 'STOP_POLLING':
      return { ...state, isPolling: false };

    case 'UPDATE_AGENT_STATUS':
      const newStatuses = new Map(state.agentStatuses);
      newStatuses.set(action.payload.agentId, action.payload.status);
      return {
        ...state,
        agentStatuses: newStatuses,
        lastUpdated: new Date(),
      };

    case 'BATCH_UPDATE_STATUSES':
      const batchStatuses = new Map(state.agentStatuses);
      action.payload.forEach(status => {
        batchStatuses.set(status.id, status);
      });
      return {
        ...state,
        agentStatuses: batchStatuses,
        lastUpdated: new Date(),
      };

    case 'APPLY_OPTIMISTIC_UPDATE':
      const newOptimistic = new Map(state.optimisticUpdates);
      const existing = newOptimistic.get(action.payload.agentId) || {};
      newOptimistic.set(action.payload.agentId, { ...existing, ...action.payload.updates });
      return {
        ...state,
        optimisticUpdates: newOptimistic,
      };

    case 'REVERT_OPTIMISTIC_UPDATE':
      const revertOptimistic = new Map(state.optimisticUpdates);
      revertOptimistic.delete(action.payload);
      return {
        ...state,
        optimisticUpdates: revertOptimistic,
      };

    case 'CLEAR_OPTIMISTIC_UPDATES':
      return {
        ...state,
        optimisticUpdates: new Map(),
      };

    case 'SELECT_AGENT':
      return {
        ...state,
        selectedAgentId: action.payload,
      };

    case 'ADD_PENDING_OPERATION':
      const newPending = new Set(state.pendingOperations);
      newPending.add(action.payload);
      return {
        ...state,
        pendingOperations: newPending,
      };

    case 'REMOVE_PENDING_OPERATION':
      const removePending = new Set(state.pendingOperations);
      removePending.delete(action.payload);
      return {
        ...state,
        pendingOperations: removePending,
      };

    case 'HANDLE_ERROR':
      return {
        ...state,
        lastError: action.payload,
        connectionHealth: 'degraded',
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        lastError: null,
        connectionHealth: 'healthy',
      };

    case 'INCREMENT_RETRY':
      return {
        ...state,
        retryCount: state.retryCount + 1,
      };

    case 'RESET_RETRY':
      return {
        ...state,
        retryCount: 0,
      };

    case 'UPDATE_CONNECTION_HEALTH':
      return {
        ...state,
        connectionHealth: action.payload,
      };

    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: action.payload,
      };

    default:
      return state;
  }
}

// Context creation
const AgentContext = createContext<{
  state: AgentContextState;
  actions: AgentContextActions;
} | null>(null);

// Provider component
interface AgentContextProviderProps {
  children: React.ReactNode;
  pollingInterval?: number;
}

export function AgentContextProvider({
  children,
  pollingInterval = 5000
}: AgentContextProviderProps) {
  const [state, dispatch] = useReducer(agentContextReducer, initialState);
  // Removed pollingServiceRef - using simplified approach
  const agentServiceRef = useRef<AgentService | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize services
  useEffect(() => {
    if (!agentServiceRef.current) {
      agentServiceRef.current = new AgentService();
    }

    // Simplified approach - no complex status polling needed
  }, [pollingInterval]);

  // Handle polling state changes
  useEffect(() => {
    if (!agentServiceRef.current) return;

    if (state.isPolling) {
      // Start a simple polling interval to fetch agent statuses
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const agents = await agentServiceRef.current!.getAgents();
          if (agents.success && agents.data) {
            const statuses: AgentStatus[] = agents.data.map(agent => ({
              id: agent.id,
              state: agent.state,
              lastUpdated: agent.updated_at,
              isHealthy: agent.state === 'RUNNING',
              errorMessage: agent.state !== 'RUNNING' ? `Agent is ${agent.state}` : undefined
            }));
            dispatch({ type: 'BATCH_UPDATE_STATUSES', payload: statuses });
            dispatch({ type: 'RESET_RETRY' });
            dispatch({ type: 'UPDATE_CONNECTION_HEALTH', payload: 'healthy' });
          }
        } catch (error) {
          dispatch({ type: 'HANDLE_ERROR', payload: error instanceof Error ? error.message : 'Polling failed' });
          dispatch({ type: 'INCREMENT_RETRY' });
          dispatch({ type: 'UPDATE_CONNECTION_HEALTH', payload: 'degraded' });
        }
      }, pollingInterval);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [state.isPolling, pollingInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  // Actions implementation
  const actions: AgentContextActions = {
    startPolling: useCallback(() => {
      dispatch({ type: 'START_POLLING' });
    }, []),

    stopPolling: useCallback(() => {
      dispatch({ type: 'STOP_POLLING' });
    }, []),

    updateAgentStatus: useCallback((agentId: string, status: AgentStatus) => {
      dispatch({ type: 'UPDATE_AGENT_STATUS', payload: { agentId, status } });
    }, []),

    batchUpdateStatuses: useCallback((statuses: AgentStatus[]) => {
      dispatch({ type: 'BATCH_UPDATE_STATUSES', payload: statuses });
    }, []),

    applyOptimisticUpdate: useCallback((agentId: string, updates: Partial<Agent>) => {
      dispatch({ type: 'APPLY_OPTIMISTIC_UPDATE', payload: { agentId, updates } });
      dispatch({ type: 'ADD_PENDING_OPERATION', payload: agentId });
    }, []),

    revertOptimisticUpdate: useCallback((agentId: string) => {
      dispatch({ type: 'REVERT_OPTIMISTIC_UPDATE', payload: agentId });
      dispatch({ type: 'REMOVE_PENDING_OPERATION', payload: agentId });
    }, []),

    clearOptimisticUpdates: useCallback(() => {
      dispatch({ type: 'CLEAR_OPTIMISTIC_UPDATES' });
    }, []),

    selectAgent: useCallback((agentId: string | null) => {
      dispatch({ type: 'SELECT_AGENT', payload: agentId });
    }, []),

    handleError: useCallback((error: string) => {
      dispatch({ type: 'HANDLE_ERROR', payload: error });
    }, []),

    clearError: useCallback(() => {
      dispatch({ type: 'CLEAR_ERROR' });
    }, []),

    retry: useCallback(async () => {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'RESET_RETRY' });

      try {
        // Force refresh by restarting polling
        dispatch({ type: 'STOP_POLLING' });
        setTimeout(() => {
          dispatch({ type: 'START_POLLING' });
        }, 100);
      } catch (error) {
        dispatch({
          type: 'HANDLE_ERROR',
          payload: error instanceof Error ? error.message : 'Retry failed'
        });
      }
    }, []),

    updateConnectionHealth: useCallback((health: 'healthy' | 'degraded' | 'offline') => {
      dispatch({ type: 'UPDATE_CONNECTION_HEALTH', payload: health });
    }, []),

    forceRefresh: useCallback(async () => {
      // Force refresh by manually triggering a status update
      if (agentServiceRef.current) {
        try {
          const agents = await agentServiceRef.current.getAgents();
          if (agents.success && agents.data) {
            const statuses: AgentStatus[] = agents.data.map(agent => ({
              id: agent.id,
              state: agent.state,
              lastUpdated: agent.updated_at,
              isHealthy: agent.state === 'RUNNING',
              errorMessage: agent.state !== 'RUNNING' ? `Agent is ${agent.state}` : undefined
            }));
            dispatch({ type: 'BATCH_UPDATE_STATUSES', payload: statuses });
          }
        } catch (error) {
          dispatch({ type: 'HANDLE_ERROR', payload: error instanceof Error ? error.message : 'Force refresh failed' });
        }
      }
    }, []),

    updatePollingInterval: useCallback((interval: number) => {
      // Update polling interval by restarting with new interval
      if (state.isPolling) {
        dispatch({ type: 'STOP_POLLING' });
        setTimeout(() => {
          dispatch({ type: 'START_POLLING' });
        }, 100);
      }
    }, [state.isPolling]),

    getPollingStats: useCallback(() => {
      // Return basic polling stats
      return {
        isPolling: state.isPolling,
        lastUpdated: state.lastUpdated,
        retryCount: state.retryCount,
        connectionHealth: state.connectionHealth
      };
    }, [state.isPolling, state.lastUpdated, state.retryCount, state.connectionHealth]),
  };

  return (
    <AgentContext.Provider value={{ state, actions }}>
      {children}
    </AgentContext.Provider>
  );
}

// Hook to use the context with SSR support
export function useAgentContext() {
  if (typeof window === 'undefined') {
    // Return mock context during SSR
    return {
      state: {
        agentStatuses: new Map<string, AgentStatus>(),
        lastUpdated: null,
        isPolling: false,
        connectionHealth: 'healthy' as const,
        selectedAgentId: null,
        optimisticUpdates: new Map<string, Partial<Agent>>(),
        pendingOperations: new Set<string>(),
        retryCount: 0,
        lastError: null,
      },
      actions: {
        startPolling: () => { },
        stopPolling: () => { },
        updateAgentStatus: () => { },
        batchUpdateStatuses: () => { },
        forceRefresh: async () => { },
        applyOptimisticUpdate: () => { },
        revertOptimisticUpdate: () => { },
        clearOptimisticUpdates: () => { },
        selectAgent: () => { },
        handleError: () => { },
        clearError: () => { },
        retry: async () => { },
        updateConnectionHealth: () => { },
        updatePollingInterval: () => { },
        getPollingStats: () => null,
      }
    };
  }

  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentContextProvider');
  }
  return context;
}

// Convenience hooks
export function useAgentStatuses() {
  const { state } = useAgentContext();
  return state.agentStatuses;
}

export function useSelectedAgent() {
  const { state } = useAgentContext();
  return state.selectedAgentId;
}

export function useConnectionHealth() {
  const { state } = useAgentContext();
  return {
    health: state.connectionHealth,
    lastUpdated: state.lastUpdated,
    isPolling: state.isPolling,
    retryCount: state.retryCount,
    lastError: state.lastError,
  };
}

export function useOptimisticUpdates() {
  const { state, actions } = useAgentContext();
  return {
    updates: state.optimisticUpdates,
    pendingOperations: state.pendingOperations,
    applyUpdate: actions.applyOptimisticUpdate,
    revertUpdate: actions.revertOptimisticUpdate,
    clearUpdates: actions.clearOptimisticUpdates,
  };
}