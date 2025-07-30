import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path, 'GET');
  } catch (error) {
    console.error('Error resolving params in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to resolve route parameters' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path, 'POST');
  } catch (error) {
    console.error('Error resolving params in POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to resolve route parameters' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path, 'PUT');
  } catch (error) {
    console.error('Error resolving params in PUT handler:', error);
    return NextResponse.json(
      { error: 'Failed to resolve route parameters' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path, 'DELETE');
  } catch (error) {
    console.error('Error resolving params in DELETE handler:', error);
    return NextResponse.json(
      { error: 'Failed to resolve route parameters' },
      { status: 500 }
    );
  }
}

async function handleRequest(
  request: NextRequest,
  pathArray: string[],
  method: string
) {
  const path = pathArray.join('/');
  const url = `${BACKEND_URL}/${path}`;
  
  // Create AbortController with extended timeout for agent operations
  const controller = new AbortController();
  const isAgentWebhook = path.includes('/webhook');
  const timeout = isAgentWebhook ? 300000 : 60000; // 5 minutes for webhooks, 1 minute for others
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (error) {
        // No request body
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error(`Backend error (${response.status}): ${errorText}`);
      } catch (e) {
        console.error(`Failed to read error response: ${e}`);
        errorText = `HTTP ${response.status} error`;
      }
      
      return NextResponse.json(
        { error: errorText || `HTTP ${response.status} error` },
        { status: response.status }
      );
    }

    // Handle empty responses
    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json({ success: true, message: 'Request processed successfully' });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response:', responseText);
      return NextResponse.json(
        { error: 'Invalid JSON response from backend', raw: responseText },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Proxy error:', error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutMessage = isAgentWebhook 
        ? 'Agent webhook request timed out after 5 minutes' 
        : 'Request timed out after 1 minute';
      return NextResponse.json(
        { error: timeoutMessage },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}