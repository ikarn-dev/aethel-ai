import { updateAgentState } from './api';
import { Agent, ApiResponse, AgentStatus, AgentState } from './types';

export class AgentStateManager {
  /**
   * Update agent state
   */
  async updateAgentState(id: string, newState: AgentState, currentAgent: Agent): Promise<ApiResponse<Agent>> {
    try {
      const result = await updateAgentState(id, newState);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update agent state'
      };
    }
  }

  /**
   * Get agent status from agent data
   */
  getAgentStatus(agent: Agent): AgentStatus {
    return {
      id: agent.id,
      state: agent.state,
      lastUpdated: agent.updated_at || new Date().toISOString(),
      isHealthy: agent.state === 'RUNNING'
    };
  }

  /**
   * Batch update agent states
   */
  async batchUpdateAgentStates(
    updates: Array<{ id: string; state: AgentState }>,
    getAgentById: (id: string) => Promise<ApiResponse<Agent>>
  ): Promise<ApiResponse<Agent[]>> {
    try {
      const results = [];
      for (const update of updates) {
        const currentAgent = await getAgentById(update.id);
        if (currentAgent.success && currentAgent.data) {
          const result = await this.updateAgentState(update.id, update.state, currentAgent.data);
          if (result.success && result.data) {
            results.push(result.data);
          }
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to batch update agent states'
      };
    }
  }
}