import { NextRequest } from 'next/server';
import { createResponse, makeBackendRequest, validateAgentId, validateWebhookRequest, logError, sanitizeRequestBody, sanitizeAgentId, checkRateLimit } from '../../../utils';

export async function OPTIONS() {
  return createResponse({});
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const resolvedParams = await params;
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
    const sanitizedAgentId = sanitizeAgentId(resolvedParams.agentId);
    const validationError = validateAgentId(sanitizedAgentId);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    const body = await request.json();
    
    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(body);
    
    // Validate webhook payload
    const webhookValidationError = validateWebhookRequest(sanitizedBody);
    if (webhookValidationError) {
      return createResponse({ error: webhookValidationError }, 400);
    }

    const data = await makeBackendRequest(`/api/v1/agents/${sanitizedAgentId}/webhook`, {
      method: 'POST',
      body: JSON.stringify(sanitizedBody),
    });
    
    return createResponse(data);
  } catch (error: any) {
    logError('Failed to send webhook', error, resolvedParams.agentId);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to send webhook';
    return createResponse({ error: errorMessage }, status);
  }
}