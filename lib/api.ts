import { Agent, CreateAgentRequest } from './types';
import { AgentDataMapper } from './agent-data-mapper';
import { MessageFormatter } from './message-formatter';

// Use the proxy API route to avoid CORS issues
const API_BASE_URL = '/api/proxy';
// Increased timeout to 5 minutes (300000ms) to handle longer agent processing times
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '300000');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      console.error(`Request URL:`, url);
      console.error(`Request method:`, options.method || 'GET');
      console.error(`Request headers:`, options.headers);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();

    // Transform agent data using the mapper
    const transformedData = AgentDataMapper.transformResponseData(data);

    return { success: true, data: transformedData };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Agent Management API calls
export async function getAgents(): Promise<ApiResponse<Agent[]>> {
  return apiCall('/agents');
}

export async function getAgent(agentId: string): Promise<ApiResponse<Agent>> {
  return apiCall(`/agents/${agentId}`);
}

export async function createAgent(agentData: CreateAgentRequest): Promise<ApiResponse<Agent>> {
  const result = await apiCall('/agents', {
    method: 'POST',
    body: JSON.stringify(agentData),
  });

  return result;
}

// Webhook-based agent starting function
export async function startAgentViaWebhook(agentId: string): Promise<ApiResponse<Agent | null>> {

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const url = `${API_BASE_URL}/agents/${agentId}/webhook`;
    const body = { text: "start" }; // Simple message to trigger the agent

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);



    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Webhook start failed: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const responseText = await response.text();

    // Webhook calls typically don't return agent data, so fetch the updated agent
    try {
      const updatedAgent = await getAgent(agentId);
      if (updatedAgent.success && updatedAgent.data) {
        return updatedAgent;
      }
    } catch (fetchError) {
      // Failed to fetch agent after webhook start
    }

    // Return success but try to fetch real agent data, don't use hardcoded response
    try {
      const updatedAgent = await getAgent(agentId);
      if (updatedAgent.success && updatedAgent.data) {
        return updatedAgent;
      }
    } catch (fetchError) {
      // Failed to fetch agent after webhook start
    }

    // If we can't get real data, return minimal success response
    return {
      success: true,
      data: null // Don't return fake data
    };

  } catch (error) {
    console.error('❌ Webhook start failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error starting agent via webhook'
    };
  }
}

export async function updateAgentState(agentId: string, state: string): Promise<ApiResponse<Agent>> {

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    // Use the direct PUT approach that matches your working curl command
    const url = `${API_BASE_URL}/agents/${agentId}`;
    const body = { state };



    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);



    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ State update failed: ${response.status} - ${errorText}`);

      // Check if this is the "must use webhook" error and we're trying to start an agent
      if (response.status === 500) {
        if (errorText.includes('must use webhook') && state === 'RUNNING') {
          try {
            const webhookResult = await startAgentViaWebhook(agentId);
            if (webhookResult.success) {
              // Fetch the updated agent state
              const updatedAgent = await getAgent(agentId);
              if (updatedAgent.success && updatedAgent.data) {
                return updatedAgent;
              }
              // If webhook succeeded but we can't get agent data, return error
              return {
                success: false,
                error: 'Webhook succeeded but could not fetch updated agent state'
              };
            }
          } catch (webhookError) {
            console.error('❌ Webhook fallback also failed:', webhookError);
          }
        }
      }

      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Handle successful response
    const responseText = await response.text();

    // Handle empty response (which might be expected for state updates)
    if (!responseText || responseText.trim() === '') {
      // Fetch the updated agent to get the real state
      try {
        const updatedAgent = await getAgent(agentId);
        if (updatedAgent.success && updatedAgent.data) {
          return updatedAgent;
        }
      } catch (fetchError) {
        // Failed to fetch updated agent
      }

      // Return error instead of mock data - we should get real data from backend
      return {
        success: false,
        error: 'Failed to fetch updated agent state after successful state change'
      };
    }

    // Try to parse JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // Fetch the updated agent to get the real state
      try {
        const updatedAgent = await getAgent(agentId);
        if (updatedAgent.success && updatedAgent.data) {
          return updatedAgent;
        }
      } catch (fetchError) {
        // Failed to fetch updated agent
      }

      // Return error instead of mock data - we should get real data from backend
      return {
        success: false,
        error: 'Failed to parse response and fetch updated agent state'
      };
    }

    // Transform agent data using the mapper
    const transformedData = AgentDataMapper.transformResponseData(data);

    return { success: true, data: transformedData };

  } catch (error) {
    console.error('❌ State update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error updating agent state'
    };
  }
}



export async function deleteAgent(agentId: string): Promise<ApiResponse<void>> {
  return apiCall(`/agents/${agentId}`, {
    method: 'DELETE',
  });
}

export async function sendMessageToAgent(agentId: string, message: string, agent?: Agent): Promise<ApiResponse> {
  try {
    let formattedMessage: any;

    if (agent) {
      // Use the message formatter to format according to agent's schema
      const formatResult = MessageFormatter.formatMessageForAgent(message, agent);
      if (!formatResult.success) {
        console.error('Message formatting failed:', formatResult.error);
        return {
          success: false,
          error: formatResult.error || 'Failed to format message'
        };
      }
      formattedMessage = formatResult.formattedMessage;
    } else {
      // Fallback to default format if no agent provided
      formattedMessage = { text: message };
    }

    const result = await apiCall(`/agents/${agentId}/webhook`, {
      method: 'POST',
      body: JSON.stringify(formattedMessage),
    });
    return result;
  } catch (error) {
    console.error('Error in sendMessageToAgent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending message'
    };
  }
}

export async function getAgentLogs(agentId: string): Promise<ApiResponse> {
  return apiCall(`/agents/${agentId}/logs`);
}