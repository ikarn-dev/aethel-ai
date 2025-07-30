import { NextRequest } from 'next/server';
import { createResponse, makeBackendRequest, validateAgentId, validateAgentState, logError, sanitizeRequestBody, sanitizeAgentId, checkRateLimit } from '../../utils';

export async function OPTIONS() {
  return createResponse({});
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    // Sanitize agent ID
    const sanitizedAgentId = sanitizeAgentId(params.agentId);
    const validationError = validateAgentId(sanitizedAgentId);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    const data = await makeBackendRequest(`/api/v1/agents/${sanitizedAgentId}`, {}, true);
    return createResponse(data);
  } catch (error: any) {
    logError('Failed to fetch agent', error, params.agentId);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to fetch agent';
    return createResponse({ error: errorMessage }, status);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown';
    if (!checkRateLimit(clientIp)) {
      return createResponse({ error: 'Rate limit exceeded' }, 429);
    }

    // Sanitize agent ID
    const sanitizedAgentId = sanitizeAgentId(params.agentId);
    const validationError = validateAgentId(sanitizedAgentId);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    const body = await request.json();
    
    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(body);
    
    // Validate state updates if present
    if (sanitizedBody.state) {
      const stateValidationError = validateAgentState(sanitizedBody.state);
      if (stateValidationError) {
        return createResponse({ error: stateValidationError }, 400);
      }
    }

    const data = await makeBackendRequest(`/api/v1/agents/${sanitizedAgentId}`, {
      method: 'PUT',
      body: JSON.stringify(sanitizedBody),
    }, true);
    
    return createResponse(data);
  } catch (error: any) {
    logError('Failed to update agent', error, params.agentId);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to update agent';
    return createResponse({ error: errorMessage }, status);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown';
    if (!checkRateLimit(clientIp)) {
      return createResponse({ error: 'Rate limit exceeded' }, 429);
    }

    // Sanitize agent ID
    const sanitizedAgentId = sanitizeAgentId(params.agentId);
    const validationError = validateAgentId(sanitizedAgentId);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    await makeBackendRequest(`/api/v1/agents/${sanitizedAgentId}`, {
      method: 'DELETE',
    });
    
    return createResponse({ message: 'Agent deleted successfully' });
  } catch (error: any) {
    logError('Failed to delete agent', error, params.agentId);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to delete agent';
    return createResponse({ error: errorMessage }, status);
  }
}