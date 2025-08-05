import { NextResponse } from 'next/server';

// Backend configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api/v1', '');
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '300000'); // 5 minutes default

// Response transformation interfaces
interface BackendAgent {
  id: string;
  name: string;
  description?: string;
  state: string;
  blueprint: {
    tools: any[];
    strategy: any;
    trigger: any;
  };
  created_at?: string;
  updated_at?: string;
}

interface FrontendAgent {
  id: string;
  name: string;
  description: string;
  state: AgentState;
  trigger_type: TriggerType;
  strategy: string;
  tools: string[];
  created_at: string;
  updated_at: string;
}

type AgentState = 'CREATED' | 'RUNNING' | 'STOPPED';
type TriggerType = 'manual' | 'webhook' | 'scheduled';

// Response transformation functions
export function transformBackendAgentToFrontend(backendAgent: BackendAgent): FrontendAgent {
  return {
    id: backendAgent.id,
    name: backendAgent.name,
    description: backendAgent.description || '',
    state: backendAgent.state as AgentState,
    trigger_type: determineTriggerType(backendAgent.blueprint.trigger),
    strategy: extractStrategyName(backendAgent.blueprint.strategy),
    tools: extractToolNames(backendAgent.blueprint.tools),
    created_at: backendAgent.created_at || new Date().toISOString(),
    updated_at: backendAgent.updated_at || new Date().toISOString(),
  };
}

export function transformFrontendAgentToBackend(frontendAgent: Partial<FrontendAgent>): Partial<BackendAgent> {
  const backendAgent: Partial<BackendAgent> = {
    id: frontendAgent.id,
    name: frontendAgent.name,
    description: frontendAgent.description,
    state: frontendAgent.state,
  };

  if (frontendAgent.strategy || frontendAgent.tools || frontendAgent.trigger_type) {
    backendAgent.blueprint = {
      strategy: frontendAgent.strategy ? { type: frontendAgent.strategy } : {},
      tools: frontendAgent.tools ? frontendAgent.tools.map(tool => ({ name: tool })) : [],
      trigger: frontendAgent.trigger_type ? { type: frontendAgent.trigger_type } : {},
    };
  }

  return backendAgent;
}

// Helper functions for transformation
function determineTriggerType(trigger: any): TriggerType {
  if (trigger?.type) {
    switch (trigger.type.toLowerCase()) {
      case 'webhook':
        return 'webhook';
      case 'scheduled':
        return 'scheduled';
      default:
        return 'manual';
    }
  }
  return 'manual';
}

function extractStrategyName(strategy: any): string {
  if (strategy?.type) {
    return strategy.type;
  }
  return 'default';
}

function extractToolNames(tools: any[]): string[] {
  if (!Array.isArray(tools)) {
    return [];
  }
  return tools.map(tool => {
    if (typeof tool === 'string') {
      return tool;
    }
    if (tool?.name) {
      return tool.name;
    }
    return 'unknown';
  });
}

// Helper function to create response with CORS headers
export function createResponse(data: any, status: number = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Helper function to make backend requests with timeout and proper error handling
export async function makeBackendRequest(url: string, options: RequestInit = {}, transformResponse: boolean = true) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    
    // Prepare headers with proper forwarding
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Aethel-Frontend/1.0',
      ...options.headers,
    };

    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await handleErrorResponse(response);
      throw new BackendError(
        `Backend error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Transform response if requested and data contains agents
      if (transformResponse && data) {
        if (Array.isArray(data)) {
          return data.map((item: any) => 
            isBackendAgent(item) ? transformBackendAgentToFrontend(item) : item
          );
        } else if (isBackendAgent(data)) {
          return transformBackendAgentToFrontend(data);
        }
      }
      
      return data;
    } else {
      return { success: true };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new BackendError('Request timeout', 408, { message: 'Request timeout' });
    }
    if (error instanceof BackendError) {
      throw error;
    }
    throw new BackendError('Network error', 500, { message: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Enhanced error handling
class BackendError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

async function handleErrorResponse(response: Response): Promise<any> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text || 'Unknown error' };
    }
  } catch {
    return { message: 'Failed to parse error response' };
  }
}

function isBackendAgent(obj: any): obj is BackendAgent {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' && 
         obj.blueprint && 
         typeof obj.blueprint === 'object';
}

// Validation helpers
export function validateAgentId(agentId: string | undefined): string | null {
  if (!agentId || agentId.trim() === '') {
    return 'Agent ID is required';
  }
  return null;
}

export function validateAgentState(state: string): string | null {
  const validStates = ['CREATED', 'RUNNING', 'STOPPED'];
  if (!validStates.includes(state)) {
    return `Invalid agent state. Must be one of: ${validStates.join(', ')}`;
  }
  return null;
}

export function validateCreateAgentRequest(body: any): string | null {
  if (!body.id || typeof body.id !== 'string') {
    return 'Agent ID is required and must be a string';
  }
  if (!body.name || typeof body.name !== 'string') {
    return 'Agent name is required and must be a string';
  }
  if (!body.blueprint || typeof body.blueprint !== 'object') {
    return 'Agent blueprint is required and must be an object';
  }
  if (!body.blueprint.tools || !Array.isArray(body.blueprint.tools)) {
    return 'Blueprint tools must be an array';
  }
  if (!body.blueprint.strategy || typeof body.blueprint.strategy !== 'object') {
    return 'Blueprint strategy is required and must be an object';
  }
  if (!body.blueprint.trigger || typeof body.blueprint.trigger !== 'object') {
    return 'Blueprint trigger is required and must be an object';
  }
  
  return null;
}

export function validateWebhookRequest(body: any): string | null {
  if (!body.text && !body.message) {
    return 'Message text is required (use "text" or "message" field)';
  }
  return null;
}



// Input sanitization utilities
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML/XML characters
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .trim()
    .substring(0, maxLength);
}

export function sanitizeAgentId(agentId: string): string {
  if (typeof agentId !== 'string') {
    return '';
  }
  
  // Only allow alphanumeric characters, hyphens, and underscores
  return agentId.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 100);
}

export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' ? sanitizeRequestBody(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Rate limiting helper (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Error logging helper
export function logError(context: string, error: unknown, agentId?: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const logMessage = agentId 
    ? `${context} for agent ${agentId}: ${errorMessage}`
    : `${context}: ${errorMessage}`;
  
  console.error(logMessage, error);
}