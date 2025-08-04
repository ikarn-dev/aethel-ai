import { BirdeyeApiResponse, TraderData, TradersResponse, TradersRequest } from './types';

export class TradersService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/traders'; // Use our API route instead of direct Birdeye API
  }

  private async makeRequest<T>(queryParams: string): Promise<T> {
    // Remove client-side rate limiting since it's handled by the API route
    try {
      const response = await fetch(`${this.baseUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Traders API request failed:', error);
      throw error;
    }
  }

  private transformTraderData(items: any[], offset: number): TraderData[] {
    return items.map((item, index) => ({
      address: item.address,
      pnl: item.pnl || 0,
      totalVolume: item.volume || 0,
      totalTrades: item.trade_count || 0,
      avgTradeSize: item.volume && item.trade_count ? item.volume / item.trade_count : 0,
      rank: offset + index + 1,
      network: item.network || 'solana',
      displayAddress: `${item.address.slice(0, 6)}...${item.address.slice(-4)}`,
    }));
  }

  async getTopTraders(request: TradersRequest): Promise<TradersResponse> {
    try {
      const queryParams = `type=${request.type}&sortBy=${request.sortBy}&sortType=${request.sortType}&offset=${request.offset}&limit=${request.limit}`;
      
      const response = await this.makeRequest<BirdeyeApiResponse>(queryParams);

      if (!response.success || !response.data?.items) {
        throw new Error('Invalid API response format');
      }

      const traders = this.transformTraderData(response.data.items, request.offset);
      
      // Estimate if there are more results (since API doesn't provide total count)
      const hasMore = response.data.items.length === request.limit;

      const result: TradersResponse = {
        traders,
        total: request.offset + traders.length + (hasMore ? 1 : 0), // Rough estimate
        offset: request.offset,
        limit: request.limit,
        hasMore,
        lastUpdated: Date.now(),
      };

      return result;

    } catch (error) {
      console.error('❌ Failed to fetch top traders:', error);
      throw new Error(`Failed to fetch top traders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTradersByPage(
    page: number, 
    pageSize: number = 50, 
    timeframe: TradersRequest['type'] = '1W',
    sortBy: TradersRequest['sortBy'] = 'PnL'
  ): Promise<TradersResponse> {
    const offset = (page - 1) * pageSize;
    
    return this.getTopTraders({
      type: timeframe,
      sortBy,
      sortType: 'desc',
      offset,
      limit: pageSize,
    });
  }


}

export const tradersService = new TradersService();