# Smart Money Solana Wallet Analysis Feature

This feature provides comprehensive on-chain Solana wallet analysis and trading insights using external APIs and AI-powered analysis.

## 🚀 Features

### Core Analysis Capabilities
- **Portfolio Composition**: Token holdings, balances, and USD values
- **Trading Metrics**: Volume, win rates, P&L, trading frequency
- **Risk Assessment**: Multi-factor risk scoring and warnings
- **DeFi Analysis**: Staking, lending, and liquidity positions
- **AI Insights**: Gemini-powered detailed analysis and recommendations

### Integration Points
- **Agent Creation**: Available as a tool option in agent creation modal
- **Chat Integration**: Automatic detection and processing of wallet analysis requests
- **Real-time Analysis**: Live data fetching and processing
- **Status Tracking**: Step-by-step progress indication

## 📁 File Structure

```
lib/wallet-analysis/
├── types.ts                 # TypeScript interfaces and types
├── api-client.ts            # External API integration (Moralis)
├── analyzer.ts              # Local analysis algorithms
├── gemini-client.ts         # Gemini AI integration
├── service.ts               # Main service orchestrator
├── chat-integration.ts      # Chat system integration
├── index.ts                 # Main exports
└── README.md               # This documentation

components/wallet-analysis/
├── wallet-input.tsx         # Wallet address input component
├── analysis-display.tsx     # Results display component
├── analysis-status.tsx      # Progress tracking component
├── wallet-analysis-chat.tsx # Main chat interface
└── index.ts                # Component exports
```

## 🔧 Setup & Configuration

### Environment Variables

Add these to your `.env.local` file:

```bash
# Solana Wallet Analysis Configuration
NEXT_PUBLIC_SOLANA_API_URL=https://api.helius.xyz/v0
SOLANA_API_KEY=your_helius_api_key_here
```

### API Keys Required

1. **Helius API Key**: 
   - Sign up at [helius.xyz](https://helius.xyz)
   - Create a new project
   - Copy your API key to `SOLANA_API_KEY`

**Note**: AI analysis is handled by the existing backend Gemini 1.5 Pro integration - no additional API key needed!

## 🎯 Usage

### In Agent Creation
1. Create a new agent
2. Select "Smart Money Analysis" tool
3. The agent will have wallet analysis capabilities

### In Chat
Users can request wallet analysis by:
- "Analyze wallet 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
- "Give me insights on trades for [wallet_address]"
- "Smart money analysis for [wallet_address]"

### Programmatic Usage

```typescript
import { walletAnalysisService } from '@/lib/wallet-analysis';

// Perform analysis
const analysis = await walletAnalysisService.performCompleteAnalysis({
  walletAddress: 'your_wallet_address_here',
  chain: 'solana',
  includeNFTs: true,
  includeDeFi: true,
  transactionLimit: 100
});

// Format for chat display
const chatResponse = walletAnalysisService.formatAnalysisForChat(analysis);
```

## 📊 Analysis Components

### 1. Data Fetching (`api-client.ts`)
- Fetches wallet balance, token holdings, transactions
- Retrieves NFT collections and DeFi positions
- Handles API rate limiting and error recovery

### 2. Local Analysis (`analyzer.ts`)
- Calculates trading metrics (volume, win rate, P&L)
- Performs risk assessment across multiple factors
- Generates insights and recommendations
- Classifies investor behavior patterns

### 3. AI Analysis (`gemini-client.ts`)
- Sends structured data to Gemini AI
- Generates comprehensive written analysis
- Provides strategic recommendations
- Creates personalized insights

### 4. Service Orchestration (`service.ts`)
- Coordinates the complete analysis pipeline
- Handles error recovery and validation
- Formats results for different output formats
- Manages analysis state and progress

## 🔍 Analysis Metrics

### Trading Metrics
- Total trading volume
- Number of trades
- Average trade size
- Profit/Loss estimation
- Win rate calculation
- Trading frequency classification
- Most traded tokens

### Risk Assessment
- **Diversification Score**: Portfolio spread across assets
- **Volatility Risk**: Based on trading patterns
- **Liquidity Risk**: Low-cap token exposure
- **Smart Contract Risk**: DeFi protocol exposure
- **Concentration Risk**: Single asset dominance

### Behavioral Analysis
- Investor type classification (Conservative/Moderate/Aggressive/Speculative)
- Trading behavior patterns
- Strengths and weaknesses identification
- Personalized recommendations

## 🛡️ Security & Privacy

- **Read-Only Access**: Only uses public blockchain data
- **No Private Keys**: Never requires or stores private information
- **API Security**: All external API calls use secure authentication
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Graceful failure handling

## 🔄 Integration with Existing System

### Agent System Integration
- Uses existing `llm_chat` backend tool
- Integrates with current agent creation workflow
- Maintains compatibility with existing chat system

### Chat System Integration
- Automatic message detection for wallet analysis requests
- Seamless integration with existing chat UI
- Preserves chat history and context

### UI Integration
- Consistent design with existing components
- Responsive layout for all screen sizes
- Accessible components following app standards

## 🚨 Error Handling

The system handles various error scenarios:
- Invalid wallet addresses
- API rate limiting
- Network connectivity issues
- Insufficient wallet data
- AI service unavailability

## 📈 Performance Considerations

- **Caching**: Results can be cached to reduce API calls
- **Rate Limiting**: Respects external API limits
- **Async Processing**: Non-blocking analysis pipeline
- **Progress Tracking**: Real-time status updates
- **Timeout Handling**: Prevents hanging requests

## 🔮 Future Enhancements

Potential improvements:
- Multi-chain support (Polygon, BSC, Arbitrum)
- Historical trend analysis
- Comparative analysis between wallets
- Portfolio optimization suggestions
- Real-time monitoring and alerts
- Integration with more DeFi protocols

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid wallet address"**
   - Ensure address starts with 0x and is 42 characters long
   - Check for typos in the address

2. **"API Error"**
   - Verify API keys are correctly set
   - Check API rate limits
   - Ensure network connectivity

3. **"Analysis failed"**
   - Try with a different wallet address
   - Check if wallet has sufficient transaction history
   - Verify all environment variables are set

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=wallet-analysis:*
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs for detailed error messages
3. Verify all environment variables are properly configured
4. Test with known working wallet addresses