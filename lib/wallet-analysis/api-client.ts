import { WalletData, AnalysisRequest, ApiError } from './types';

// External API configuration for Solana
const WALLET_API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_SOLANA_API_URL || 'https://mainnet.helius-rpc.com',
    apiKey: process.env.NEXT_PUBLIC_SOLANA_API_KEY || '',
    timeout: 30000,
};

export class WalletApiClient {
    private baseUrl: string;
    private apiKey: string;
    private timeout: number;

    constructor() {
        this.baseUrl = WALLET_API_CONFIG.baseUrl;
        this.apiKey = WALLET_API_CONFIG.apiKey;
        this.timeout = WALLET_API_CONFIG.timeout;
    }

    private async makeRequest<T>(rpcMethod: string, params: any[] = []): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            // Helius RPC endpoint with API key
            const url = `${this.baseUrl}?api-key=${this.apiKey}`;



            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: rpcMethod,
                    params: params
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API Error Response:', errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const result = await response.json();

            // Check for RPC errors
            if (result.error) {
                throw new Error(`RPC Error: ${result.error.code} - ${result.error.message}`);
            }

            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ Request failed:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown API error occurred');
        }
    }

    async getWalletBalance(address: string): Promise<any> {
        // Use correct Helius RPC method for balance - getBalance returns lamports
        return this.makeRequest('getBalance', [address]);
    }

    async getWalletTokens(address: string): Promise<any> {
        // Use Helius RPC method for token accounts
        return this.makeRequest('getTokenAccountsByOwner', [
            address,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' }
        ]);
    }

    async getWalletTransactions(address: string, limit: number = 1000): Promise<any> {
        // Use Helius RPC method for transaction signatures - get more transactions for better analysis
        return this.makeRequest('getSignaturesForAddress', [address, { limit: Math.min(limit, 1000) }]);
    }

    async getWalletNFTs(address: string): Promise<any> {
        // NFTs require a different API approach - for now return empty
        // In a real implementation, you'd use Helius DAS API or Metaplex
        console.warn('NFT fetching not implemented yet, returning empty result');
        return { result: [] };
    }

    async getDeFiPositions(address: string): Promise<any> {
        // Solana DeFi positions - placeholder for now
        // Could integrate with Jupiter, Raydium, or other Solana DeFi protocols
        return { result: [] };
    }

    async fetchCompleteWalletData(request: AnalysisRequest): Promise<WalletData> {
        const { walletAddress, chain = 'solana', includeNFTs = true, includeDeFi = true, transactionLimit = 1000 } = request;

        // Check if API key is configured
        if (!this.apiKey || this.apiKey === 'your_helius_api_key_here') {
            throw new Error('Solana API key is not configured. Please set NEXT_PUBLIC_SOLANA_API_KEY in your environment variables with a valid Helius API key.');
        }

        try {

            // Fetch all wallet data in parallel for Solana
            const [balanceData, tokensData, transactionsData, nftsData, defiData] = await Promise.allSettled([
                this.getWalletBalance(walletAddress),
                this.getWalletTokens(walletAddress),
                this.getWalletTransactions(walletAddress, transactionLimit),
                includeNFTs ? this.getWalletNFTs(walletAddress) : Promise.resolve({ result: [] }),
                includeDeFi ? this.getDeFiPositions(walletAddress) : Promise.resolve({ result: [] }),
            ]);

            // Check if critical API calls failed
            const criticalFailures = [];
            if (balanceData.status === 'rejected') {
                console.error('❌ Balance API failed:', balanceData.reason);
                criticalFailures.push('balance data');
            }
            if (tokensData.status === 'rejected') {
                console.error('❌ Tokens API failed:', tokensData.reason);
                criticalFailures.push('token data');
            }
            if (transactionsData.status === 'rejected') {
                console.error('❌ Transactions API failed:', transactionsData.reason);
                criticalFailures.push('transaction data');
            }

            // If critical data is missing, throw an error instead of proceeding with empty data
            if (criticalFailures.length > 0) {
                throw new Error(`Failed to fetch critical wallet data: ${criticalFailures.join(', ')}. Please check your API key and try again.`);
            }

            // Transform the raw API responses into our standardized format
            const transformedData = this.transformWalletData({
                address: walletAddress,
                chain,
                balance: balanceData.status === 'fulfilled' ? balanceData.value : null,
                tokens: tokensData.status === 'fulfilled' ? tokensData.value : null,
                transactions: transactionsData.status === 'fulfilled' ? transactionsData.value : null,
                nfts: nftsData.status === 'fulfilled' ? nftsData.value : null,
                defi: defiData.status === 'fulfilled' ? defiData.value : null,
            });

            // Validate that we got meaningful data
            if (transformedData.nativeBalance === 0 && transformedData.tokenBalances.length === 0 && transformedData.transactions.length === 0) {
                throw new Error('No wallet data found. This wallet may be empty or the address may be invalid.');
            }



            return transformedData;
        } catch (error) {
            console.error('❌ Error fetching wallet data:', error);
            throw new Error(`Failed to fetch wallet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private transformWalletData(rawData: any): WalletData {
        const {
            address,
            chain,
            balance,
            tokens,
            transactions,
            nfts,
            defi
        } = rawData;

        // Transform balance data from Helius RPC response
        // getBalance returns: { result: { context: {...}, value: lamports } }
        const balanceInLamports = balance?.result?.value || 0;
        const nativeBalance = balanceInLamports / 1000000000; // Convert lamports to SOL (1 SOL = 1e9 lamports)
        // Note: USD conversion removed - will be handled by AI analysis

        // Transform token balances from Helius RPC response - RAW DATA ONLY
        const tokenAccounts = tokens?.result?.value || [];
        const tokenBalances = tokenAccounts.map((tokenAccount: any) => {
            const accountInfo = tokenAccount.account?.data?.parsed?.info;
            const mint = accountInfo?.mint || 'unknown';
            const amount = accountInfo?.tokenAmount?.amount || '0';
            const decimals = accountInfo?.tokenAmount?.decimals || 9;
            const uiAmount = accountInfo?.tokenAmount?.uiAmount || 0;

            return {
                symbol: mint === 'So11111111111111111111111111111111111111112' ? 'SOL' : 'TOKEN',
                name: mint === 'So11111111111111111111111111111111111111112' ? 'Solana' : 'Unknown Token',
                balance: amount,
                uiAmount: uiAmount, // Raw UI amount from RPC
                contractAddress: mint,
                decimals: decimals,
            };
        });

        // Add SOL balance as a token (RAW DATA ONLY)
        if (nativeBalance > 0) {
            tokenBalances.unshift({
                symbol: 'SOL',
                name: 'Solana',
                balance: balanceInLamports.toString(),
                uiAmount: nativeBalance, // Raw SOL amount
                contractAddress: 'So11111111111111111111111111111111111111112',
                decimals: 9,
            });
        }

        // Transform transactions from Helius RPC response - RAW DATA ONLY
        const transactionSignatures = transactions?.result || [];
        const transformedTransactions = transactionSignatures.map((tx: any) => ({
            signature: tx.signature || '',
            blockTime: tx.blockTime || 0,
            slot: tx.slot || 0,
            confirmationStatus: tx.confirmationStatus || 'unknown',
            err: tx.err || null,
        }));

        // Store raw RPC data for AI analysis
        const rawRpcData = {
            balance: balance,
            tokens: tokens,
            transactions: transactions,
            nfts: nfts,
            defi: defi
        };

        const result = {
            address,
            chain,
            // Remove totalBalanceUSD - will be calculated by AI
            nativeBalance: nativeBalance, // Raw SOL balance
            balanceInLamports: balanceInLamports, // Raw lamports
            tokenBalances,
            transactions: transformedTransactions,
            defiPositions: [], // Empty for now
            nftHoldings: [], // Empty for now
            firstTransactionDate: transformedTransactions.length > 0 ? Math.min(...transformedTransactions.map((tx: any) => tx.blockTime).filter((t: number) => t > 0)) : 0,
            lastTransactionDate: transformedTransactions.length > 0 ? Math.max(...transformedTransactions.map((tx: any) => tx.blockTime).filter((t: number) => t > 0)) : 0,
            totalTransactions: transformedTransactions.length >= 1000 ? `${transformedTransactions.length}+` : transformedTransactions.length,
            rawRpcData: rawRpcData // Include raw RPC data for AI analysis
        };



        return result;
    }


}

export const walletApiClient = new WalletApiClient();