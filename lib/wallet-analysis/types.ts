// Wallet Analysis Types
export interface WalletAddress {
  address: string;
  chain: 'solana' | 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism';
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  uiAmount: number; // Raw UI amount from RPC
  contractAddress: string;
  decimals: number;
}

export interface Transaction {
  hash: string;
  timestamp: number;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  valueUSD: number;
  gasUsed: string;
  gasPrice: string;
  gasFeeUSD: number;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'mint' | 'burn';
  tokenSymbol?: string;
  tokenAmount?: string;
}

export interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  tokenSymbol: string;
  amount: string;
  amountUSD: number;
  apy: number;
  rewards?: {
    symbol: string;
    amount: string;
    amountUSD: number;
  }[];
}

export interface NFTHolding {
  collectionName: string;
  tokenId: string;
  contractAddress: string;
  floorPrice: number;
  estimatedValue: number;
  imageUrl?: string;
}

export interface WalletData {
  address: string;
  chain: string;
  nativeBalance: number; // Raw SOL balance
  balanceInLamports: number; // Raw lamports
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  defiPositions: DeFiPosition[];
  nftHoldings: NFTHolding[];
  firstTransactionDate: number;
  lastTransactionDate: number;
  totalTransactions: number | string;
  rawRpcData: any; // Raw RPC response data for AI analysis
}

export interface TradingMetrics {
  totalVolume: number;
  totalTrades: number;
  avgTradeSize: number;
  profitLoss: number;
  winRate: number;
  largestGain: number;
  largestLoss: number;
  avgHoldingTime: number;
  mostTradedTokens: string[];
  tradingFrequency: 'high' | 'medium' | 'low';
}

export interface RiskAssessment {
  riskScore: number; // 1-10 scale
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  factors: {
    diversification: number;
    volatility: number;
    liquidityRisk: number;
    smartContractRisk: number;
    concentrationRisk: number;
  };
  warnings: string[];
}

export interface WalletAnalysisResult {
  walletData: WalletData;
  tradingMetrics: TradingMetrics;
  riskAssessment: RiskAssessment;
  insights: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    behaviorPattern: string;
    investorType: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  };
  aiAnalysis: string;
  generatedAt: number;
}

export interface AnalysisRequest {
  walletAddress: string;
  chain?: string;
  includeNFTs?: boolean;
  includeDeFi?: boolean;
  transactionLimit?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}