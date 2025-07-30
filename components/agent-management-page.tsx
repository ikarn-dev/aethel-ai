'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Agent, AgentState } from '@/lib/types';
import { useAgents, useAgentLoading, useAgentError, useAgentActions } from '@/lib/agent-store';
import {
  useAgentContext,
  useAgentStatuses,
  useConnectionHealth,
  useOptimisticUpdates
} from '@/lib/agent-context';
import { AgentList } from './agent-list';
import { CreateAgentModal } from './create-agent-modal';
import { Toast } from './toast';
import { ConnectionStatus } from './connection-status';

interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message?: string;
}

export function AgentManagementPage() {
  // Global agent state
  const agents = useAgents();
  const isLoading = useAgentLoading();
  const error = useAgentError();
  const actions = useAgentActions();

  // Real-time context state
  const { actions: contextActions } = useAgentContext();
  const agentStatuses = useAgentStatuses();
  const connectionHealth = useConnectionHealth();
  const { applyUpdate, revertUpdate, updates: optimisticUpdates, pendingOperations } = useOptimisticUpdates();

  // Local component state
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });



  // Create refs to store stable references
  const actionsRef = useRef(actions);
  const contextActionsRef = useRef(contextActions);
  const mountedRef = useRef(false);

  // Update refs when actions change
  actionsRef.current = actions;
  contextActionsRef.current = contextActions;

  // Load agents on component mount and start polling
  useEffect(() => {
    if (mountedRef.current) return; // Prevent double execution
    mountedRef.current = true;

    const loadData = async () => {
      await actionsRef.current.fetchAgents();
      contextActionsRef.current.startPolling();
    };

    loadData();

    return () => {
      contextActionsRef.current.stopPolling();
    };
  }, []); // Empty deps - only run on mount

  // Auto-select first agent if none selected and agents exist
  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      const firstAgent = agents[0];
      setSelectedAgent(firstAgent);
      actionsRef.current.setCurrentAgent(firstAgent);
      contextActionsRef.current.selectAgent(firstAgent.id);
    }
  }, [agents.length, selectedAgent]); // Only depend on agents.length and selectedAgent

  // Handle connection health changes
  useEffect(() => {
    if (connectionHealth.health === 'offline') {
      showToast('error', 'Connection Lost', 'Lost connection to agent service');
    } else if (connectionHealth.health === 'degraded') {
      showToast('error', 'Connection Issues', 'Experiencing connection problems');
    }
  }, [connectionHealth.health]);

  // Merge agents with optimistic updates and real-time status
  const getEnhancedAgents = (): Agent[] => {
    return agents.map(agent => {
      // Apply optimistic updates
      const optimisticUpdate = optimisticUpdates.get(agent.id);
      const enhancedAgent = optimisticUpdate ? { ...agent, ...optimisticUpdate } : agent;

      // Apply real-time status if available
      const status = agentStatuses.get(agent.id);
      if (status) {
        enhancedAgent.state = status.state;
        enhancedAgent.updated_at = status.lastUpdated;
      }

      return enhancedAgent;
    });
  };

  const enhancedAgents = getEnhancedAgents();

  // Handle agent selection
  const handleAgentSelect = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    actionsRef.current.setCurrentAgent(agent);
  }, []);

  // Handle agent state changes with optimistic updates
  const handleStateChange = useCallback(async (id: string, state: AgentState) => {
    // Apply optimistic update immediately
    applyUpdate(id, { state, updated_at: new Date().toISOString() });

    // Update selected agent optimistically
    if (selectedAgent?.id === id) {
      setSelectedAgent(prev => prev ? { ...prev, state } : null);
    }

    try {
      const success = await actionsRef.current.updateAgentState(id, state);
      if (success) {
        showToast('success', 'State Updated', `Agent state changed to ${state.toLowerCase()}`);

        // Force refresh the real-time status immediately after successful update
        await contextActionsRef.current.forceRefresh();

        // Refresh the agents list to get the latest data
        await actionsRef.current.fetchAgents();

        // Update selected agent with actual data
        if (selectedAgent?.id === id) {
          const updatedAgent = agents.find(a => a.id === id);
          if (updatedAgent) {
            setSelectedAgent(updatedAgent);
          }
        }

        // Clear the optimistic update since we have real data now
        revertUpdate(id);
      } else {
        // Revert optimistic update on failure
        revertUpdate(id);
        if (selectedAgent?.id === id) {
          const originalAgent = agents.find(a => a.id === id);
          if (originalAgent) {
            setSelectedAgent(originalAgent);
          }
        }
        showToast('error', 'State Change Failed', 'Failed to update agent state');
      }
    } catch (error) {
      console.error('Failed to update agent state:', error);

      // Revert optimistic update on error
      revertUpdate(id);
      if (selectedAgent?.id === id) {
        const originalAgent = agents.find(a => a.id === id);
        if (originalAgent) {
          setSelectedAgent(originalAgent);
        }
      }

      showToast('error', 'State Change Failed', 'An error occurred while updating agent state');
      contextActionsRef.current.handleError('Failed to update agent state');
    }
  }, [selectedAgent, agents, applyUpdate, revertUpdate]);

  // Handle agent deletion
  const handleDelete = useCallback(async (id: string) => {
    try {
      const success = await actionsRef.current.deleteAgent(id);
      if (success) {
        showToast('success', 'Agent Deleted', 'Agent has been successfully deleted');

        // Clear selection if deleted agent was selected
        if (selectedAgent?.id === id) {
          setSelectedAgent(null);
          actionsRef.current.setCurrentAgent(null);
        }
      } else {
        showToast('error', 'Deletion Failed', 'Failed to delete agent');
      }
    } catch (error) {
      console.error('Failed to delete agent:', error);
      showToast('error', 'Deletion Failed', 'An error occurred while deleting agent');
    }
  }, [selectedAgent]);

  // Handle create agent modal
  const handleCreateAgent = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = useCallback((agentId: string) => {
    // Agent will be automatically added to the list via the store
    // Find and select the newly created agent
    setTimeout(() => {
      const newAgent = agents.find(a => a.id === agentId);
      if (newAgent) {
        setSelectedAgent(newAgent);
        actionsRef.current.setCurrentAgent(newAgent);
      }
    }, 100);
  }, [agents]);

  // Handle retry for failed operations
  const handleRetry = useCallback(() => {
    actionsRef.current.setError(null);
    actionsRef.current.fetchAgents();
  }, []);



  // Toast helper
  const showToast = (type: 'success' | 'error', title: string, message?: string) => {
    setToast({
      show: true,
      type,
      title,
      message
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Agent Management Layout */}
      <div className="w-full bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Agent Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                {enhancedAgents.length} agent{enhancedAgents.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={handleCreateAgent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
          </div>

          {/* Connection Status */}
          <ConnectionStatus showDetails={true} />
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-6">
          <AgentList
            agents={enhancedAgents}
            onAgentSelect={handleAgentSelect}
            onStateChange={handleStateChange}
            onDelete={handleDelete}
            onCreateAgent={handleCreateAgent}
            onRetry={handleRetry}
            isLoading={isLoading}
            error={error}
            agentStatuses={agentStatuses}
            pendingOperations={pendingOperations}
          />
        </div>
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}