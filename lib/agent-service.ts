import { updateAgentState, getAgents, getAgent, createAgent, deleteAgent, sendMessageToAgent, getAgentLogs } from './api';
import { Agent, ApiResponse, AgentStatus, AgentState } from './types';
import { AgentCRUD } from './agent-crud';
import { AgentStateManager } from './agent-state-manager';
import { AgentRetryHandler } from './agent-retry-handler';
import { EnhancedResponseParser } from './simple-response-parser';

export class AgentService {
  public agentId: string | null = null;
  public agentState: string = 'STOPPED';
  
  // Module instances
  private crud: AgentCRUD;
  private stateManager: AgentStateManager;
  private retryHandler: AgentRetryHandler;

  constructor() {
    this.crud = new AgentCRUD();
    this.stateManager = new AgentStateManager();
    this.retryHandler = new AgentRetryHandler();
  }

  // Legacy methods for backward compatibility

  // Create a new LLM chat agent
  async createChatAgent(): Promise<{ success: boolean; agent?: Agent; error?: string }> {
    try {
      const result = await createAgent({
        id: `chat-agent-${Date.now()}`,
        name: 'Chat Agent',
        description: 'LLM Chat Agent',
        blueprint: {
          strategy: {
            name: 'plan_execute',
            config: {}
          },
          tools: [],
          trigger: {
            type: 'webhook',
            params: {}
          }
        }
      });

      if (result.success && result.data) {
        this.agentId = result.data.id;
        this.agentState = result.data.state;
        return { success: true, agent: result.data };
      } else {
        return { success: false, error: result.error || 'Failed to create agent' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Start the agent (set to RUNNING state)
  async startAgent(): Promise<{ success: boolean; error?: string }> {
    if (!this.agentId) {
      return { success: false, error: 'No agent created' };
    }

    try {
      const response = await updateAgentState(this.agentId, 'RUNNING');

      if (response.success && response.data) {
        this.agentState = response.data.state;
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to start agent' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current agent info
  getAgentInfo(): { id: string | null; state: string } {
    return {
      id: this.agentId,
      state: this.agentState
    };
  }

  // Reset agent (for new chat sessions)
  reset(): void {
    this.agentId = null;
    this.agentState = 'STOPPED';
  }

  // Set an existing agent as the current agent
  setAgent(agent: Agent): void {
    this.agentId = agent.id;
    this.agentState = agent.state;
  }

  // Send message to agent and get response
  async sendMessage(message: string): Promise<{ success: boolean; response?: string; error?: string }> {
    if (!this.agentId) {
      return { success: false, error: 'No agent available' };
    }

    if (this.agentState !== 'RUNNING') {
      return { success: false, error: 'Agent is not running' };
    }

    try {
      // Get the current agent data
      const agentResponse = await getAgent(this.agentId);
      if (!agentResponse.success || !agentResponse.data) {
        return { success: false, error: 'Failed to get agent data' };
      }

      // Send message to agent
      const sendResult = await sendMessageToAgent(this.agentId, message, agentResponse.data);
      if (!sendResult.success) {
        return { success: false, error: sendResult.error || 'Failed to send message' };
      }

      // Poll for response by checking logs
      const maxAttempts = 20; // 40 seconds total
      const pollInterval = 2000; // 2 seconds

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        try {
          const logsResult = await getAgentLogs(this.agentId);
          if (logsResult.success && logsResult.data && logsResult.data.logs) {
            const parseResult = EnhancedResponseParser.extractResponse(logsResult.data.logs);
            
            if (parseResult.success && parseResult.response) {
              return { success: true, response: parseResult.response };
            }
          }
        } catch (pollError) {
          // Continue polling even if one attempt fails
        }
      }

      return { success: false, error: 'No response received from agent within timeout' };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending message'
      };
    }
  }

  // CRUD methods using direct API calls
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return getAgents();
  }

  async getAgentById(id: string): Promise<ApiResponse<Agent>> {
    return getAgent(id);
  }

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    const result = await deleteAgent(id);

    // If this was the current agent, reset the service state
    if (this.agentId === id) {
      this.reset();
    }

    return result;
  }

  async createAgent(config: any): Promise<ApiResponse<Agent>> {
    return this.crud.createAgent(config);
  }

  // State management methods using state manager
  async updateAgentState(id: string, newState: AgentState): Promise<ApiResponse<Agent>> {
    const currentAgentResponse = await this.crud.getAgentById(id);
    if (!currentAgentResponse.success || !currentAgentResponse.data) {
      return {
        success: false,
        error: 'Failed to get current agent state'
      };
    }

    const result = await this.stateManager.updateAgentState(id, newState, currentAgentResponse.data);
    
    // Update local state if this is the current agent
    if (this.agentId === id && result.success && result.data) {
      this.agentState = result.data.state;
    }
    
    return result;
  }

  async getAgentStatus(id: string): Promise<ApiResponse<AgentStatus>> {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Agent ID is required'
        };
      }

      const response = await getAgent(id);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get agent status'
        };
      }

      // Create status from agent data
      const status: AgentStatus = {
        id: response.data.id,
        state: response.data.state,
        lastUpdated: response.data.updated_at || new Date().toISOString(),
        isHealthy: response.data.state === 'RUNNING'
      };

      return {
        success: true,
        data: status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get agent status'
      };
    }
  }

  async batchUpdateAgentStates(updates: Array<{ id: string; state: AgentState }>): Promise<ApiResponse<Agent[]>> {
    return this.stateManager.batchUpdateAgentStates(updates, (id) => this.crud.getAgentById(id));
  }

  // Retry-enabled methods
  async getAgentsWithRetry(): Promise<ApiResponse<Agent[]>> {
    return this.retryHandler.executeWithRetry(
      () => this.getAgents()
    );
  }

  async getAgentByIdWithRetry(id: string): Promise<ApiResponse<Agent>> {
    return this.retryHandler.executeWithRetry(
      () => this.getAgentById(id)
    );
  }

  async updateAgentStateWithRetry(id: string, newState: AgentState): Promise<ApiResponse<Agent>> {
    return this.retryHandler.executeWithRetry(
      () => this.updateAgentState(id, newState)
    );
  }

  async getAgentStatusWithRetry(id: string): Promise<ApiResponse<AgentStatus>> {
    return this.retryHandler.executeWithRetry(
      () => this.getAgentStatus(id)
    );
  }

  /**
   * Health check for the agent service
   * @returns Promise with health status
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      // Try to get agents list as a health check
      const agentsResponse = await this.getAgents();

      if (agentsResponse.success) {
        return {
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          data: {
            status: 'unhealthy',
            timestamp: new Date().toISOString()
          },
          error: agentsResponse.error || 'Health check failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }
}