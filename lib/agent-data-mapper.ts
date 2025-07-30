import { Agent, AgentState, TriggerType } from './types';

/**
 * Backend agent data structure as received from the API
 */
export interface BackendAgent {
  id: string;
  name: string;
  description?: string;
  state: string;
  blueprint?: {
    tools?: any[];
    strategy?: any;
    trigger?: any;
  };
  input_schema?: any;
  created_at?: string;
  updated_at?: string;
  // Handle potential variations in field names
  trigger_type?: string;
  strategy?: string;
  tools?: string[] | any[];
}

/**
 * Agent Data Mapper class for transforming backend data to frontend format
 */
export class AgentDataMapper {
  /**
   * Map a single backend agent to frontend format
   */
  static mapAgentFromBackend(backendAgent: BackendAgent): Agent {
    return {
      id: backendAgent.id,
      name: backendAgent.name || 'Unnamed Agent',
      description: backendAgent.description || '',
      state: this.mapAgentState(backendAgent.state),
      trigger_type: this.mapTriggerType(backendAgent),
      strategy: this.mapStrategy(backendAgent),
      tools: this.mapTools(backendAgent),
      created_at: backendAgent.created_at || new Date().toISOString(),
      updated_at: backendAgent.updated_at || new Date().toISOString(),
      input_schema: backendAgent.input_schema
    };
  }

  /**
   * Map an array of backend agents to frontend format
   */
  static mapAgentListFromBackend(backendAgents: BackendAgent[]): Agent[] {
    if (!Array.isArray(backendAgents)) {

      return [];
    }

    return backendAgents
      .filter(agent => this.validateAgentData(agent))
      .map(agent => this.mapAgentFromBackend(agent));
  }

  /**
   * Validate that agent data has required fields
   */
  static validateAgentData(agent: any): boolean {
    if (!agent || typeof agent !== 'object') {

      return false;
    }

    if (!agent.id || typeof agent.id !== 'string') {

      return false;
    }

    if (!agent.name || typeof agent.name !== 'string') {

      return false;
    }

    return true;
  }

  /**
   * Map backend agent state to frontend AgentState enum
   */
  private static mapAgentState(state: string): AgentState {
    if (!state || typeof state !== 'string') {

      return 'CREATED';
    }

    const normalizedState = state.toUpperCase();
    
    switch (normalizedState) {
      case 'CREATED':
        return 'CREATED';
      case 'RUNNING':
        return 'RUNNING';
      case 'STOPPED':
        return 'STOPPED';

      default:

        return 'CREATED';
    }
  }

  /**
   * Map backend trigger information to frontend TriggerType
   */
  private static mapTriggerType(backendAgent: BackendAgent): TriggerType {
    // Check direct trigger_type field first
    if (backendAgent.trigger_type) {
      return this.normalizeTriggerType(backendAgent.trigger_type);
    }

    // Check blueprint.trigger
    if (backendAgent.blueprint?.trigger?.type) {
      return this.normalizeTriggerType(backendAgent.blueprint.trigger.type);
    }

    // Default to WEBHOOK if no trigger type found

    return 'WEBHOOK';
  }

  /**
   * Normalize trigger type string to TriggerType enum
   */
  private static normalizeTriggerType(triggerType: string): TriggerType {
    if (!triggerType || typeof triggerType !== 'string') {
      return 'WEBHOOK';
    }

    const normalized = triggerType.toLowerCase();
    
    switch (normalized) {
      case 'webhook':
        return 'WEBHOOK';
      case 'periodic':
      case 'scheduled':
        return 'PERIODIC';
      default:

        return 'WEBHOOK';
    }
  }

  /**
   * Map backend strategy information to frontend string
   */
  private static mapStrategy(backendAgent: BackendAgent): string {
    // Check direct strategy field first
    if (backendAgent.strategy && typeof backendAgent.strategy === 'string') {
      return backendAgent.strategy;
    }

    // Check blueprint.strategy
    if (backendAgent.blueprint?.strategy) {
      const strategy = backendAgent.blueprint.strategy;
      
      // Handle different strategy formats
      if (typeof strategy === 'string') {
        return strategy;
      }
      
      if (strategy.name && typeof strategy.name === 'string') {
        return strategy.name;
      }
      
      if (strategy.type && typeof strategy.type === 'string') {
        return strategy.type;
      }
    }

    // Default strategy (reduce console noise in development)
    return 'plan_execute';
  }

  /**
   * Map backend tools information to frontend string array
   */
  private static mapTools(backendAgent: BackendAgent): string[] {
    // Check direct tools field first
    if (backendAgent.tools) {
      return this.normalizeToolsArray(backendAgent.tools);
    }

    // Check blueprint.tools
    if (backendAgent.blueprint?.tools) {
      return this.normalizeToolsArray(backendAgent.blueprint.tools);
    }

    // Default to empty array (reduce console noise in development)
    return [];
  }

  /**
   * Normalize tools data to string array
   */
  private static normalizeToolsArray(tools: any): string[] {
    if (!Array.isArray(tools)) {

      return [];
    }

    return tools
      .map(tool => {
        if (typeof tool === 'string') {
          return tool;
        }
        
        if (tool && typeof tool === 'object') {
          if (tool.name && typeof tool.name === 'string') {
            return tool.name;
          }
          
          if (tool.type && typeof tool.type === 'string') {
            return tool.type;
          }
        }
        

        return null;
      })
      .filter((tool): tool is string => tool !== null);
  }

  /**
   * Transform frontend agent data to backend format for API calls
   */
  static mapAgentToBackend(frontendAgent: Partial<Agent>): any {
    const backendAgent: any = {
      id: frontendAgent.id,
      name: frontendAgent.name,
      description: frontendAgent.description,
      state: frontendAgent.state
    };

    // Only include blueprint if we have strategy, tools, or trigger_type
    if (frontendAgent.strategy || frontendAgent.tools || frontendAgent.trigger_type) {
      backendAgent.blueprint = {
        strategy: frontendAgent.strategy ? {
          name: frontendAgent.strategy,
          config: {}
        } : undefined,
        tools: frontendAgent.tools ? frontendAgent.tools.map(tool => ({
          name: tool,
          config: {}
        })) : undefined,
        trigger: frontendAgent.trigger_type ? {
          type: frontendAgent.trigger_type.toLowerCase(),
          params: {}
        } : undefined
      };
    }

    // Include input_schema if present
    if (frontendAgent.input_schema) {
      backendAgent.input_schema = frontendAgent.input_schema;
    }

    return backendAgent;
  }

  /**
   * Check if an object looks like a backend agent
   */
  static isBackendAgent(obj: any): obj is BackendAgent {
    return obj && 
           typeof obj === 'object' && 
           typeof obj.id === 'string' && 
           typeof obj.name === 'string';
  }

  /**
   * Safely transform unknown data that might contain agents
   */
  static transformResponseData(data: any): any {
    if (!data) {
      return data;
    }

    // Handle array of agents
    if (Array.isArray(data)) {
      return data.map(item => {
        if (this.isBackendAgent(item)) {
          return this.mapAgentFromBackend(item);
        }
        return item;
      });
    }

    // Handle single agent
    if (this.isBackendAgent(data)) {
      return this.mapAgentFromBackend(data);
    }

    // Return data unchanged if it's not agent data
    return data;
  }

  /**
   * Get default agent values for missing fields
   */
  static getDefaultAgent(): Partial<Agent> {
    return {
      description: '',
      state: 'CREATED',
      trigger_type: 'WEBHOOK',
      strategy: 'plan_execute',
      tools: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Merge agent data with defaults for missing fields
   */
  static mergeWithDefaults(agent: Partial<Agent>): Agent {
    const defaults = this.getDefaultAgent();
    
    return {
      id: agent.id || '',
      name: agent.name || 'Unnamed Agent',
      description: agent.description ?? defaults.description!,
      state: agent.state ?? defaults.state!,
      trigger_type: agent.trigger_type ?? defaults.trigger_type!,
      strategy: agent.strategy ?? defaults.strategy!,
      tools: agent.tools ?? defaults.tools!,
      created_at: agent.created_at ?? defaults.created_at!,
      updated_at: agent.updated_at ?? defaults.updated_at!,
      input_schema: agent.input_schema
    };
  }
}