import { NextRequest } from 'next/server';
import { createResponse, makeBackendRequest, validateAgentId, logError, sanitizeAgentId } from '../../../utils';

export async function OPTIONS() {
  return createResponse({});
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    // Sanitize agent ID
    const sanitizedAgentId = sanitizeAgentId(params.agentId);
    const validationError = validateAgentId(sanitizedAgentId);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    const data = await makeBackendRequest(`/api/v1/agents/${sanitizedAgentId}/logs`);
    return createResponse(data);
  } catch (error: any) {
    logError('Failed to fetch logs', error, params.agentId);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to fetch logs';
    return createResponse({ error: errorMessage }, status);
  }
}