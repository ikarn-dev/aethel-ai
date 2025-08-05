import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Agent, AgentState, AgentStatus } from './types';
import { AgentService } from './agent-service';
import { useWallet } from '../hooks/use-wallet';

// Client-side wallet-agent association management
const WALLET_AGENTS_KEY = 'wallet_agents_mapping';

interface WalletAgentsMapping {
  [walletAddress: string]: string[]; // wallet address -> agent IDs
}

// Helper functions for managing wallet-agent associations
const getWalletAgentsMapping = (): WalletAgentsMapping => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(WALLET_AGENTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveWalletAgentsMapping = (mapping: WalletAgentsMapping): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WALLET_AGENTS_KEY, JSON.stringify(mapping));
  } catch (error) {
    console.error('Failed to save wallet agents mapping:', error);
  }
};

const getAgentsForWallet = (walletAddress: string): string[] => {
  const mapping = getWalletAgentsMapping();
  return mapping[walletAddress] || [];
};

const addAgentToWallet = (walletAddress: string, agentId: string): void => {
  const mapping = getWalletAgentsMapping();
  if (!mapping[walletAddress]) {
    mapping[walletAddress] = [];
  }
  if (!mapping[walletAddress].includes(agentId)) {
    mapping[walletAddress].push(agentId);
    saveWalletAgentsMapping(mapping);
  }
};

const removeAgentFromWallet = (walletAddress: string, agentId: string): void => {
  const mapping = getWalletAgentsMapping();
  if (mapping[walletAddress]) {
    mapping[walletAddress] = mapping[walletAddress].filter(id => id !== agentId);
    saveWalletAgentsMapping(mapping);
  }
};

const removeAgentFromAllWallets = (agentId: string): void => {
  const mapping = getWalletAgentsMapping();
  let changed = false;
  
  Object.keys(mapping).forEach(walletAddress => {
    const originalLength = mapping[walletAddress].length;
    mapping[walletAddress] = mapping[walletAddress].filter(id => id !== agentId);
    if (mapping[walletAddress].length !== originalLength) {
      changed = true;
    }
  });
  
  if (changed) {
    saveWalletAgentsMapping(mapping);
  }
};

// Simple state interface
interface AgentStoreState {
  agents: Agent[];
  currentAgent: Agent | null;
  selectedAgents: string[];
  loading: boolean;
  error: string | null;
}

// Actions interface
interface AgentStoreActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAgents: (agents: Agent[]) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  selectAgent: (id: string) => void;
  deselectAgent: (id: string) => void;
  clearSelection: () => void;
  fetchAgents: () => Promise<void>;
  fetchAgent: (id: string) => Promise<Agent | null>;
  createAgent: (config: any) => Promise<Agent | null>;
  deleteAgent: (id: string) => Promise<boolean>;
  updateAgentState: (id: string, state: AgentState) => Promise<boolean>;
  getAgentStatus: (id: string) => Promise<AgentStatus | null>;
  batchUpdateStates: (updates: Array<{ id: string; state: AgentState }>) => Promise<boolean>;
}

// Context type
interface AgentStoreContextType {
  state: AgentStoreState;
  actions: AgentStoreActions;
}

// Create context
const AgentStoreContext = createContext<AgentStoreContextType | null>(null);

// Initial state
const initialState: AgentStoreState = {
  agents: [],
  currentAgent: null,
  selectedAgents: [],
  loading: false,
  error: null,
};

// Provider component
export function AgentStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AgentStoreState>(initialState);
  const agentServiceRef = useRef<AgentService>(new AgentService());
  const { publicKey } = useWallet();

  // Synchronous actions
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setAgents = useCallback((agents: Agent[]) => {
    setState(prev => ({ ...prev, agents }));
  }, []);

  const setCurrentAgent = useCallback((agent: Agent | null) => {
    setState(prev => ({ ...prev, currentAgent: agent }));
  }, []);

  const addAgent = useCallback((agent: Agent) => {
    setState(prev => ({ ...prev, agents: [...prev.agents, agent] }));
  }, []);

  const updateAgent = useCallback((id: string, updates: Partial<Agent>) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent =>
        agent.id === id ? { ...agent, ...updates } : agent
      ),
      currentAgent: prev.currentAgent?.id === id
        ? { ...prev.currentAgent, ...updates }
        : prev.currentAgent
    }));
  }, []);

  const removeAgent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.filter(agent => agent.id !== id),
      currentAgent: prev.currentAgent?.id === id ? null : prev.currentAgent,
      selectedAgents: prev.selectedAgents.filter(agentId => agentId !== id)
    }));
  }, []);

  const selectAgent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(id)
        ? prev.selectedAgents
        : [...prev.selectedAgents, id]
    }));
  }, []);

  const deselectAgent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.filter(agentId => agentId !== id)
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedAgents: [] }));
  }, []);

  // Async actions
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all agents from backend
      const response = await agentServiceRef.current.getAgents();

      if (response.success && response.data) {
        // Filter agents by current wallet on client-side
        const walletAddress = publicKey?.toString();
        if (walletAddress) {
          const walletAgents = getAgentsForWallet(walletAddress);
          const filteredAgents = response.data.filter(agent => 
            walletAgents.includes(agent.id)
          );
          setAgents(filteredAgents);
        } else {
          setAgents([]);
        }
      } else {
        setError(response.error || 'Failed to fetch agents');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAgents, publicKey]);

  const fetchAgent = useCallback(async (id: string): Promise<Agent | null> => {
    setError(null);

    try {
      const response = await agentServiceRef.current.getAgentById(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch agent');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }, [setError]);

  const createAgent = useCallback(async (config: any): Promise<Agent | null> => {
    setLoading(true);
    setError(null);

    try {
      const walletAddress = publicKey?.toString();
      if (!walletAddress) {
        setError('Wallet not connected');
        return null;
      }

      // Create agent without wallet_address since backend doesn't support it
      const response = await agentServiceRef.current.createAgent(config);

      if (response.success && response.data) {
        // Associate the agent with the current wallet in localStorage
        addAgentToWallet(walletAddress, response.data.id);
        addAgent(response.data);
        return response.data;
      } else {
        setError(response.error || 'Failed to create agent');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addAgent, publicKey]);

  const deleteAgent = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const walletAddress = publicKey?.toString();
      if (!walletAddress) {
        setError('Wallet not connected');
        return false;
      }

      // Check if the agent belongs to the current wallet
      const walletAgents = getAgentsForWallet(walletAddress);
      if (!walletAgents.includes(id)) {
        setError('Access denied: You can only delete agents you own');
        return false;
      }

      // Delete from backend (without wallet parameter since backend doesn't support it)
      const response = await agentServiceRef.current.deleteAgent(id);

      if (response.success) {
        // Remove from wallet association
        removeAgentFromWallet(walletAddress, id);
        removeAgent(id);
        return true;
      } else {
        setError(response.error || 'Failed to delete agent');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, removeAgent, publicKey]);

  const updateAgentState = useCallback(async (id: string, state: AgentState): Promise<boolean> => {
    setError(null);

    try {
      const walletAddress = publicKey?.toString();
      if (!walletAddress) {
        setError('Wallet not connected');
        return false;
      }

      // Check if the agent belongs to the current wallet
      const walletAgents = getAgentsForWallet(walletAddress);
      if (!walletAgents.includes(id)) {
        setError('Access denied: You can only modify agents you own');
        return false;
      }

      // Update agent state (without wallet parameter since backend doesn't support it)
      const response = await agentServiceRef.current.updateAgentState(id, state);

      if (response.success && response.data) {
        updateAgent(id, { state: response.data.state, updated_at: response.data.updated_at });
        return true;
      } else {
        setError(response.error || 'Failed to update agent state');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [setError, updateAgent, publicKey]);

  const getAgentStatus = useCallback(async (id: string): Promise<AgentStatus | null> => {
    setError(null);

    try {
      const response = await agentServiceRef.current.getAgentStatus(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to get agent status');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }, [setError]);

  const batchUpdateStates = useCallback(async (updates: Array<{ id: string; state: AgentState }>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Process updates sequentially since we don't have a batch API
      const results = [];
      for (const update of updates) {
        const response = await agentServiceRef.current.updateAgentState(update.id, update.state);
        results.push(response);

        if (response.success && response.data) {
          updateAgent(update.id, { state: response.data.state, updated_at: response.data.updated_at });
        }
      }

      // Check if all updates succeeded
      const allSucceeded = results.every(result => result.success);

      if (!allSucceeded) {
        const failedUpdates = results.filter(result => !result.success);
        setError(`Failed to update ${failedUpdates.length} agent(s)`);
        return false;
      }

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateAgent]);

  // Create stable actions object
  const actions: AgentStoreActions = {
    setLoading,
    setError,
    setAgents,
    setCurrentAgent,
    addAgent,
    updateAgent,
    removeAgent,
    selectAgent,
    deselectAgent,
    clearSelection,
    fetchAgents,
    fetchAgent,
    createAgent,
    deleteAgent,
    updateAgentState,
    getAgentStatus,
    batchUpdateStates,
  };

  // Handle wallet changes
  useEffect(() => {
    if (!publicKey) {
      // Wallet disconnected - clear all agents
      setAgents([]);
      setCurrentAgent(null);
      clearSelection();
      setError(null);
    } else {
      // Wallet connected or changed - fetch agents for this wallet
      fetchAgents();
    }
  }, [publicKey, fetchAgents]);

  const contextValue: AgentStoreContextType = {
    state,
    actions,
  };

  return (
    <AgentStoreContext.Provider value={contextValue}>
      {children}
    </AgentStoreContext.Provider>
  );
}

// Hook to use the store
export function useAgentStore() {
  const context = useContext(AgentStoreContext);
  if (!context) {
    throw new Error('useAgentStore must be used within an AgentStoreProvider');
  }
  return context;
}

// Individual selector hooks
export const useAgents = () => {
  if (typeof window === 'undefined') return [];
  const { state } = useAgentStore();
  return state.agents;
};

export const useCurrentAgent = () => {
  if (typeof window === 'undefined') return null;
  const { state } = useAgentStore();
  return state.currentAgent;
};

export const useSelectedAgents = () => {
  if (typeof window === 'undefined') return [];
  const { state } = useAgentStore();
  return state.selectedAgents;
};

export const useAgentLoading = () => {
  if (typeof window === 'undefined') return false;
  const { state } = useAgentStore();
  return state.loading;
};

export const useAgentError = () => {
  if (typeof window === 'undefined') return null;
  const { state } = useAgentStore();
  return state.error;
};

export const useAgentActions = () => {
  if (typeof window === 'undefined') {
    // Return no-op functions for SSR
    return {
      setLoading: () => { },
      setError: () => { },
      setAgents: () => { },
      setCurrentAgent: () => { },
      addAgent: () => { },
      updateAgent: () => { },
      removeAgent: () => { },
      selectAgent: () => { },
      deselectAgent: () => { },
      clearSelection: () => { },
      fetchAgents: async () => { },
      fetchAgent: async () => null,
      createAgent: async () => null,
      deleteAgent: async () => false,
      updateAgentState: async () => false,
      getAgentStatus: async () => null,
      batchUpdateStates: async () => false,
    };
  }

  const { actions } = useAgentStore();
  return actions;
};