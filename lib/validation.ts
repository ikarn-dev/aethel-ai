import { AgentConfiguration, AgentState, ToolConfig, StrategyConfig } from './types';

/**
 * Validation utilities for agent management
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate agent configuration before creation
 */
export function validateAgentConfiguration(config: AgentConfiguration): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!config.name || config.name.trim().length === 0) {
    errors.push('Agent name is required');
  }

  if (!config.description || config.description.trim().length === 0) {
    errors.push('Agent description is required');
  }

  // Name length validation
  if (config.name && config.name.length > 100) {
    errors.push('Agent name must be 100 characters or less');
  }

  // Description length validation
  if (config.description && config.description.length > 500) {
    errors.push('Agent description must be 500 characters or less');
  }

  // Strategy validation
  if (!config.strategy) {
    errors.push('Agent strategy is required');
  } else {
    const strategyValidation = validateStrategyConfig(config.strategy);
    if (!strategyValidation.isValid) {
      errors.push(...strategyValidation.errors);
    }
  }

  // Tools validation - allow empty tools array for basic agents
  if (config.tools && config.tools.length > 0) {
    config.tools.forEach((tool, index) => {
      const toolValidation = validateToolConfig(tool);
      if (!toolValidation.isValid) {
        errors.push(...toolValidation.errors.map(error => `Tool ${index + 1}: ${error}`));
      }
    });
  }

  // Trigger validation
  if (!config.trigger) {
    errors.push('Agent trigger configuration is required');
  } else {
    if (!config.trigger.type) {
      errors.push('Trigger type is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate strategy configuration
 */
export function validateStrategyConfig(strategy: StrategyConfig): ValidationResult {
  const errors: string[] = [];

  if (!strategy.type) {
    errors.push('Strategy type is required');
  }

  const validStrategyTypes = ['plan_execute'];
  if (strategy.type && !validStrategyTypes.includes(strategy.type)) {
    errors.push(`Invalid strategy type. Must be one of: ${validStrategyTypes.join(', ')}`);
  }

  // Strategy-specific validation - no longer requiring name parameter
  // All strategies now use empty config objects as per backend requirements

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate tool configuration
 */
export function validateToolConfig(tool: ToolConfig): ValidationResult {
  const errors: string[] = [];

  if (!tool.name || tool.name.trim().length === 0) {
    errors.push('Tool name is required');
  }

  // Common tool names validation
  const validToolNames = [
    'llm_chat',
    'web_search',
    'file_manager',
    'code_executor',
    'database_query',
    'api_client'
  ];

  if (tool.name && !validToolNames.includes(tool.name)) {
    // Allow custom tools but warn
  }

  if (!tool.config || typeof tool.config !== 'object') {
    errors.push('Tool configuration object is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate agent state transition
 */
export function validateStateTransition(currentState: AgentState, newState: AgentState): ValidationResult {
  const errors: string[] = [];

  const validTransitions: Record<AgentState, AgentState[]> = {
    'CREATED': ['RUNNING', 'STOPPED'],
    'RUNNING': ['STOPPED'],
    'STOPPED': ['RUNNING']
  };

  if (!validTransitions[currentState]?.includes(newState)) {
    errors.push(`Invalid state transition from ${currentState} to ${newState}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate agent ID format
 */
export function validateAgentId(id: string): ValidationResult {
  const errors: string[] = [];

  if (!id || id.trim().length === 0) {
    errors.push('Agent ID is required');
  }

  // ID format validation (alphanumeric, hyphens, underscores)
  const idPattern = /^[a-zA-Z0-9_-]+$/;
  if (id && !idPattern.test(id)) {
    errors.push('Agent ID can only contain letters, numbers, hyphens, and underscores');
  }

  // Length validation
  if (id && (id.length < 3 || id.length > 50)) {
    errors.push('Agent ID must be between 3 and 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize agent name for use as ID
 */
export function sanitizeAgentName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate unique agent ID
 */
export function generateAgentId(baseName?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  if (baseName) {
    const sanitized = sanitizeAgentName(baseName);
    return `${sanitized}-${timestamp}-${random}`;
  }

  return `agent-${timestamp}-${random}`;
}

/**
 * Validate batch operation input
 */
export function validateBatchOperation<T>(
  items: T[],
  maxBatchSize: number = 10
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(items)) {
    errors.push('Batch operation requires an array of items');
  }

  if (items.length === 0) {
    errors.push('Batch operation requires at least one item');
  }

  if (items.length > maxBatchSize) {
    errors.push(`Batch operation cannot exceed ${maxBatchSize} items`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate agent health check parameters
 */
export function validateHealthCheckParams(params: {
  maxResponseTime?: number;
  maxInactiveTime?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (params.maxResponseTime !== undefined) {
    if (typeof params.maxResponseTime !== 'number' || params.maxResponseTime <= 0) {
      errors.push('Max response time must be a positive number');
    }
  }

  if (params.maxInactiveTime !== undefined) {
    if (typeof params.maxInactiveTime !== 'number' || params.maxInactiveTime <= 0) {
      errors.push('Max inactive time must be a positive number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}