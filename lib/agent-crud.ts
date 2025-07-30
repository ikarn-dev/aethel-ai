import { createAgent, getAgents, getAgent, deleteAgent } from './api';
import { CreateAgentRequest, Agent, ApiResponse, AgentConfiguration } from './types';

export class AgentCRUD {
    /**
     * Create a new agent from configuration
     */
    async createAgent(config: AgentConfiguration): Promise<ApiResponse<Agent>> {
        try {
            // Convert AgentConfiguration to CreateAgentRequest format
            const createRequest: CreateAgentRequest = {
                id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                name: config.name,
                description: config.description,
                blueprint: {
                    tools: config.tools.map(tool => ({
                        name: tool.name,
                        config: tool.config
                    })),
                    strategy: {
                        name: config.strategy.type,
                        config: config.strategy.parameters || {}
                    },
                    trigger: {
                        type: config.trigger.type.toLowerCase(),
                        params: config.trigger.params || {}
                    }
                }
            };



            const result = await createAgent(createRequest);
            

            
            return result;
        } catch (error) {
            console.error('AgentCRUD: Create agent error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create agent'
            };
        }
    }

    /**
     * Create a simple chat agent
     */
    async createChatAgent(): Promise<{ success: boolean; agent?: Agent; error?: string }> {
        try {
            const result = await createAgent({
                id: `chat-agent-${Date.now()}`,
                name: 'Chat Agent',
                description: 'LLM Chat Agent',
                blueprint: {
                    tools: [
                        {
                            name: 'llm_chat',
                            config: {}
                        }
                    ],
                    strategy: {
                        name: 'plan_execute',
                        config: {}
                    },
                    trigger: {
                        type: 'webhook',
                        params: {}
                    }
                }
            });

            if (result.success && result.data) {
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

    /**
     * Get all agents
     */
    async getAgents(): Promise<ApiResponse<Agent[]>> {
        return getAgents();
    }

    /**
     * Get agent by ID
     */
    async getAgentById(id: string): Promise<ApiResponse<Agent>> {
        return getAgent(id);
    }

    /**
     * Delete agent
     */
    async deleteAgent(id: string): Promise<ApiResponse<void>> {
        return deleteAgent(id);
    }
}