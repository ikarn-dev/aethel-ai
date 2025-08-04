// Birdeye API Response Types
export interface BirdeyeTraderItem {
    network: string;
    address: string;
    pnl: number;
    trade_count: number;
    volume: number;
}

export interface BirdeyeApiResponse {
    success: boolean;
    data: {
        items: BirdeyeTraderItem[];
    };
}

// Processed Trader Data Types
export interface TraderData {
    address: string;
    pnl: number;
    totalVolume: number;
    totalTrades: number;
    avgTradeSize: number;
    rank: number;
    network: string;
    displayAddress: string; // Shortened address for display
}

export interface TradersResponse {
    traders: TraderData[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    lastUpdated: number;
}

export interface TradersRequest {
    type: 'today' | 'yesterday' | '1W';
    sortBy: 'PnL'; // Only PnL sorting is available in Birdeye API
    sortType: 'asc' | 'desc';
    offset: number;
    limit: number;
}

export interface RateLimitState {
    requestCount: number;
    minuteRequestCount: number;
    lastRequestTime: number;
    lastMinuteReset: number;
    isLimited: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}