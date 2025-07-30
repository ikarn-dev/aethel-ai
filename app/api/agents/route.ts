import { NextRequest } from 'next/server';
import { createResponse, makeBackendRequest, validateCreateAgentRequest, logError, sanitizeRequestBody, checkRateLimit } from '../utils';

export async function OPTIONS() {
  return createResponse({});
}

export async function GET() {
  try {
    const data = await makeBackendRequest('/api/v1/agents', {}, true);
    return createResponse(data);
  } catch (error: any) {
    logError('Failed to fetch agents', error);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to fetch agents';
    return createResponse({ error: errorMessage }, status);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown';
    if (!checkRateLimit(clientIp)) {
      return createResponse({ error: 'Rate limit exceeded' }, 429);
    }

    const body = await request.json();
    
    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(body);
    
    // Validate request body
    const validationError = validateCreateAgentRequest(sanitizedBody);
    if (validationError) {
      return createResponse({ error: validationError }, 400);
    }

    const data = await makeBackendRequest('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify(sanitizedBody),
    }, true);
    
    return createResponse(data, 201);
  } catch (error: any) {
    logError('Failed to create agent', error);
    const status = error.status || 500;
    const errorMessage = error.data?.message || error.message || 'Failed to create agent';
    return createResponse({ error: errorMessage }, status);
  }
}