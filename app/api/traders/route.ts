import { NextRequest, NextResponse } from 'next/server';

const BIRDEYE_API_URL = 'https://public-api.birdeye.so';
const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;

// Rate limiting state (in production, use Redis or similar)
let rateLimitState = {
  requestCount: 0,
  minuteRequestCount: 0,
  lastRequestTime: 0,
  lastMinuteReset: Date.now(),
};

const RATE_LIMITS = {
  REQUESTS_PER_SECOND: 1,
  REQUESTS_PER_MINUTE: 50, // Reduced from 60 to be safer
  SECOND_IN_MS: 1200, // Slightly increased from 1000ms to 1.2s for better UX
  MINUTE_IN_MS: 60 * 1000,
};

async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  
  // Reset minute counter if a minute has passed
  if (now - rateLimitState.lastMinuteReset >= RATE_LIMITS.MINUTE_IN_MS) {
    rateLimitState.minuteRequestCount = 0;
    rateLimitState.lastMinuteReset = now;
  }

  // Check if we've exceeded minute limit
  if (rateLimitState.minuteRequestCount >= RATE_LIMITS.REQUESTS_PER_MINUTE) {
    const waitTime = RATE_LIMITS.MINUTE_IN_MS - (now - rateLimitState.lastMinuteReset);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    rateLimitState.minuteRequestCount = 0;
    rateLimitState.lastMinuteReset = Date.now();
  }

  // Enforce 1 request per second
  const timeSinceLastRequest = now - rateLimitState.lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMITS.SECOND_IN_MS) {
    const waitTime = RATE_LIMITS.SECOND_IN_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Update counters
  rateLimitState.lastRequestTime = Date.now();
  rateLimitState.requestCount++;
  rateLimitState.minuteRequestCount++;
}

export async function GET(request: NextRequest) {
  try {
    if (!BIRDEYE_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Birdeye API key not configured' },
        { status: 500 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '1W';
    const sortBy = searchParams.get('sortBy') || 'PnL';
    const sortType = searchParams.get('sortType') || 'desc';
    const offset = searchParams.get('offset') || '0';
    const requestedLimit = parseInt(searchParams.get('limit') || '10');
    
    // Birdeye API limit constraint: 1-10 only
    const limit = Math.min(Math.max(requestedLimit, 1), 10).toString();



    // Enforce rate limiting
    await enforceRateLimit();

    // Validate parameters based on Birdeye API documentation
    const validTypes = ['today', 'yesterday', '1W']; // Only these are supported by Birdeye API
    const validSortBy = ['PnL']; // Only PnL sorting is available
    const validSortType = ['asc', 'desc'];

    if (!validTypes.includes(type)) {
      console.error('❌ Invalid type parameter:', type);
      return NextResponse.json(
        { success: false, message: `Invalid type: ${type}. Valid values: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validSortBy.includes(sortBy)) {
      console.error('❌ Invalid sortBy parameter:', sortBy);
      return NextResponse.json(
        { success: false, message: `Invalid sortBy: ${sortBy}. Valid values: ${validSortBy.join(', ')}` },
        { status: 400 }
      );
    }

    // Map frontend parameters to Birdeye API format
    let mappedSortBy = sortBy;
    if (sortBy === 'trades') {
      mappedSortBy = 'trade_count'; // Map 'trades' to 'trade_count' for Birdeye API
    }
    
    // Build the URL with proper parameter mapping
    const birdeyeUrl = `${BIRDEYE_API_URL}/trader/gainers-losers?type=${type}&sort_by=${mappedSortBy}&sort_type=${sortType}&offset=${offset}&limit=${limit}`;
    
    const response = await fetch(birdeyeUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
        'accept': 'application/json',
        'x-chain': 'solana',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Birdeye API error:', response.status, errorText);
      console.error('❌ Request URL was:', birdeyeUrl);
      
      // Provide user-friendly error messages based on status codes
      let userMessage = '';
      let statusCode = response.status;
      
      switch (response.status) {
        case 429:
          userMessage = 'Rate limit exceeded. The trading data API is temporarily unavailable due to high demand. Please wait a moment and try again.';
          // Reset rate limit counters to prevent cascading failures
          rateLimitState.requestCount = 0;
          rateLimitState.minuteRequestCount = RATE_LIMITS.REQUESTS_PER_MINUTE;
          rateLimitState.lastMinuteReset = Date.now();
          break;
        case 500:
          userMessage = 'Server error. The trading data service is temporarily unavailable. Please try again in a few moments.';
          break;
        case 503:
          userMessage = 'Service temporarily unavailable. The trading data provider is under maintenance. Please try again later.';
          break;
        case 401:
          userMessage = 'Authentication error. API access is currently unavailable.';
          statusCode = 500; // Don't expose auth issues to frontend
          break;
        case 403:
          userMessage = 'Access forbidden. API quota may have been exceeded.';
          statusCode = 500; // Don't expose auth issues to frontend
          break;
        case 404:
          userMessage = 'Trading data not found for the requested parameters.';
          break;
        default:
          userMessage = `Trading data service error (${response.status}). Please try again later.`;
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: userMessage,
          code: response.status,
          timestamp: new Date().toISOString()
        },
        { status: statusCode }
      );
    }

    const data = await response.json();

    // Return in the format expected by the frontend service
    return NextResponse.json({
      success: true,
      data: data.data // Extract the data object from Birdeye response
    });

  } catch (error) {
    console.error('❌ API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}