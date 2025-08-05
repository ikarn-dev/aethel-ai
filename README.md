# Aethel AI - Powered by JuliaOS

  
  **A sophisticated AI platform built on the JuliaOS framework, specializing in Solana wallet analysis and intelligent agent management for the blockchain ecosystem.**

  [![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![JuliaOS](https://img.shields.io/badge/JuliaOS-Framework-teal?style=flat-square)](https://julialang.org/)
  [![Solana](https://img.shields.io/badge/Solana-Blockchain-purple?style=flat-square&logo=solana)](https://solana.com/)
</div>

## 🌟 Overview

Aethel AI is a next-generation AI platform that serves as the frontend interface for the powerful **JuliaOS framework**. Built with Next.js 15 and TypeScript, it provides an intuitive experience for creating, managing, and interacting with AI agents powered by enterprise-grade backend infrastructure.

The platform specializes in **Solana blockchain integration**, offering advanced wallet analysis and smart money insights through AI-powered agents that leverage JuliaOS's modular strategy and tool system.

## ✨ Key Features

### 🤖 Multi-Agent Management
- **Agent Creation**: Create LLM Chat agents and Smart Money Analysis agents
- **Real-time Status Monitoring**: Live agent status updates with health monitoring
- **Agent Lifecycle Management**: Start, stop, and delete agents with optimistic UI updates
- **Batch Operations**: Bulk state changes and mass deletion with confirmation

### 💬 Interactive Chat Interface
- **Real-time Communication**: WebSocket-based chat with AI agents
- **Message Templates**: Pre-built templates for common queries
- **Chat Persistence**: Automatic conversation history saving
- **Multi-agent Support**: Seamlessly switch between different agents
- **Auto-scroll & Copy**: Enhanced UX with message copying and auto-scrolling

### 📊 Smart Money Analysis
- **Solana Wallet Analysis**: Comprehensive wallet performance insights
- **Trading Metrics**: Volume, win rate, P&L, trading frequency analysis
- **Risk Assessment**: Multi-factor risk scoring (1-10 scale)
- **Behavioral Analysis**: Trading pattern recognition and investor profiling
- **AI-Powered Insights**: Generated recommendations and strategic advice

### 🔗 Solana Wallet Integration
- **Multi-Wallet Support**: Phantom, Solflare, Backpack, Torus, Ledger
- **Real-time Balance Updates**: Live SOL balance and token information
- **Secure Connection**: Read-only access with no private key storage
- **Session Persistence**: Automatic reconnection across browser sessions

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Theme**: Elegant dark interface with teal/cyan accents
- **Smooth Animations**: Framer Motion and GSAP-powered animations
- **Loading States**: Comprehensive loading indicators and progress tracking

## 🏗️ Architecture

### Frontend Stack
```
Next.js 15.4.2 (App Router)
├── React 19.1.0 with TypeScript
├── Tailwind CSS 4.0 with custom design system
├── Zustand + React Context (hybrid state management)
├── Radix UI primitives with custom styling
├── Framer Motion for animations
└── Solana Web3.js with wallet adapters
```

### JuliaOS Backend Framework
```
Multi-Layered Architecture
├── Layer 1: Julia Core Engine (Foundation)
│   ├── High-performance computing (Julia >= 1.11.4)
│   ├── Agent orchestration and swarm algorithms
│   ├── Neural networks and portfolio optimization
│   └── Trading strategies and risk management
├── Layer 2: Julia API Layer (Interface, MCP-Enabled)
│   ├── RESTful API with webhook support
│   ├── Model Context Protocol (MCP) endpoints
│   └── Request validation and response formatting
└── Layer 3: Rust Security Component (Specialized)
    ├── Cryptographic operations
    ├── Transaction signing and HD wallet derivation
    └── Memory-safe environment via FFI from Julia
```

### Integration Pattern
```
Frontend → Proxy API → JuliaOS Backend → Julia Core Engine
    ↓         ↓              ↓              ↓
  UI State   CORS      Agent Framework   AI Processing
  Management Handling   & Orchestration   & Strategies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **JuliaOS Backend** running and accessible


**Sample input sent to Gemini AI 1.5 Pro using JuliaOS `llm_chat` Tool**

```json
{
  "prompt_structure": "WALLET ANALYSIS REQUEST - RESPOND EXACTLY AS SPECIFIED",
  "data_format": {
    "addr": "wallet_address",
    "txns": "total_transactions",
    "days": "activity_period_days",
    "sol": "native_balance",
    "tokens": "unique_token_count",
    "pnl": "profit_loss_amount",
    "rank": "trader_rank",
    "vol": "total_volume",
    "trades": "total_trades",
    "tf": "timeframe"
  },
  "response_format": {
    "sections": [
      "🎯 Trading Profile",
      "📊 Copy Analysis",
      "⚡ Key Behaviors"
    ],
    "constraints": "Use ONLY provided data. Be consistent. No additional analysis."
  }
}

Sample output received from Gemini AI and displayed to users

{
  "message": {
    "id": "timestamp-analysis",
    "content": "Here's the basic wallet data for ABC123...XYZ9. AI analysis in progress...",
    "sender": "agent",
    "timestamp": "2025-01-08T10:30:00Z",
    "analysis": {
      "walletData": {
        "address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
        "chain": "solana",
        "nativeBalance": 12.5,
        "balanceInLamports": 12500000000,
        "tokenBalances": [
          {
            "symbol": "SOL",
            "name": "Solana",
            "balance": "12500000000",
            "uiAmount": 12.5,
            "contractAddress": "So11111111111111111111111111111111111111112",
            "decimals": 9
          }
        ],
        "transactions": [],
        "totalTransactions": "1000+",
        "firstTransactionDate": 1704067200,
        "lastTransactionDate": 1704153600
      },
      "tradingMetrics": {
        "totalVolume": 50000,
        "totalTrades": 150,
        "avgTradeSize": 333.33,
        "profitLoss": 2500,
        "winRate": 65.5,
        "tradingFrequency": "medium"
      },
      "riskAssessment": {
        "riskScore": 6,
        "riskLevel": "medium",
        "factors": {
          "diversification": 7.2,
          "volatility": 6.8,
          "concentrationRisk": 5.5
        }
      }
    }
  }
}

```
**Output In Frontend**
The analysis is done using gemini ai that is part of JuliaOs Framework the above data is auto sent and recived upon users given inputs in the frontend 
the wallet data is fetched using various apis mentioned in docs.


<img width="1889" height="865" alt="analysis-image" src="https://github.com/user-attachments/assets/a5902721-11eb-4a0f-852a-27cf7ab0d020" />


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aethel-ai.git
   cd aethel-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Backend Configuration
   NEXT_PUBLIC_BACKEND_URL=http://your-juliaos-backend:8052/api/v1
   NEXT_PUBLIC_API_TIMEOUT=300000
   
   # Solana Configuration
   NEXT_PUBLIC_SOLANA_API_URL=https://mainnet.helius-rpc.com
   NEXT_PUBLIC_SOLANA_API_KEY=your-helius-api-key
   
   # Market Data
   NEXT_PUBLIC_BIRDEYE_API_URL=https://public-api.birdeye.so
   BIRDEYE_API_KEY=your-birdeye-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | JuliaOS backend API endpoint | ✅ | - |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | ❌ | 300000 |
| `NEXT_PUBLIC_SOLANA_API_URL` | Helius RPC endpoint | ✅ | - |
| `NEXT_PUBLIC_SOLANA_API_KEY` | Helius API key | ✅ | - |
| `NEXT_PUBLIC_BIRDEYE_API_URL` | Birdeye API endpoint | ✅ | - |
| `BIRDEYE_API_KEY` | Birdeye API key (server-side) | ✅ | - |

### Supported Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Multi-chain wallet with strong Solana support
- **Backpack** - Native Solana wallet with modern interface
- **Torus** - Social login wallet (Google, Twitter, etc.)
- **Ledger** - Hardware wallet support for maximum security

## 📖 Usage Guide

### Creating Your First Agent

1. **Navigate to Agents**
   - Click "Agents" in the sidebar navigation
   - You'll see the agent management interface

2. **Create Agent**
   - Click "Create Agent" button
   - Choose agent type:
     - **LLM Chat**: General conversations and assistance
     - **Smart Money Analysis**: Wallet analysis and trading insights
   - Enter name and description
   - Click "Create" to deploy

3. **Start Agent**
   - Find your agent in the list
   - Click "Start" to activate
   - Wait for "Running" status (green indicator)

4. **Begin Interaction**
   - Click "Chat" for LLM agents
   - Click "Analyze" for Smart Money agents
   - Start your conversation or analysis

### Wallet Analysis Workflow

1. **Create Analysis Agent**
   - Select "Smart Money Analysis" tool during creation
   - Start the agent and wait for "Running" status

2. **Connect Solana Wallet** (Optional)
   - Click wallet connect button in navbar
   - Select your preferred wallet
   - Approve connection

3. **Analyze Wallet**
   - Click "Analyze" on your Smart Money agent
   - Enter Solana wallet address (43-44 characters)
   - Wait for comprehensive analysis results

4. **Review Insights**
   - Portfolio overview with SOL balance and token count
   - Trading metrics and transaction history
   - AI-generated insights and recommendations

## 🛠️ Development

### Project Structure
```
aethel-ai/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── app/               # Protected app routes
│       ├── agents/        # Agent management
│       ├── analysis/      # Wallet analysis
│       ├── about/         # About page
│       └── docs/          # Documentation
├── components/            # Reusable UI components
│   ├── agents/           # Agent management components
│   ├── navigation/       # Navigation and routing
│   ├── wallet/           # Wallet integration
│   ├── wallet-analysis/  # Analysis interface
│   └── ui/               # Base UI components
├── lib/                  # Business logic and utilities
│   ├── agent-service.ts  # Agent management service
│   ├── api.ts           # API communication layer
│   ├── types.ts         # TypeScript definitions
│   └── wallet-analysis/ # Analysis logic
├── hooks/                # Custom React hooks
└── public/              # Static assets
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
```

### Key Technologies

- **Next.js 15.4.2** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Solana Web3.js** - Solana blockchain integration
- **Vitest** - Fast unit testing framework

## 🔌 API Integration

### JuliaOS Backend Endpoints

#### Agent Management
```typescript
GET    /api/agents              # List all agents
POST   /api/agents              # Create new agent
GET    /api/agents/{id}         # Get agent details
PUT    /api/agents/{id}         # Update agent state
DELETE /api/agents/{id}         # Delete agent
```

#### Agent Communication
```typescript
POST   /api/agents/{id}/webhook # Send message to agent
GET    /api/agents/{id}/logs    # Get agent execution logs
```

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### External APIs

- **Helius RPC**: Solana blockchain data and transaction history
- **Birdeye API**: Token prices and market analytics
- **Icons8**: UI graphics and iconography

## 🔒 Security

### Wallet Security
- **Read-only Access**: Platform only reads wallet data
- **No Private Keys**: Never requests or stores private keys
- **Secure Protocols**: All wallet communication uses secure channels
- **User Control**: Users maintain full control over connections

### API Security
- **CORS Handling**: Proxy API routes prevent CORS issues
- **Request Validation**: Input validation on all endpoints
- **Rate Limiting**: Built-in rate limiting on critical endpoints
- **Error Handling**: Graceful error handling with retry mechanisms

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
1. Configure production environment variables
2. Ensure JuliaOS backend is accessible
3. Set up proper CORS policies
4. Configure SSL certificates for HTTPS

### Recommended Hosting
- **Vercel** - Optimized for Next.js applications
- **Netlify** - JAMstack deployment platform
- **AWS Amplify** - Full-stack deployment solution
- **Docker** - Containerized deployment

## 🤝 Contributing

We welcome contributions to Aethel AI! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **JuliaOS Framework** - High-performance backend infrastructure
- **Solana Foundation** - Blockchain platform and ecosystem
- **Helius** - Solana RPC and data services
- **Birdeye** - Market data and analytics
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework


<div align="center">
  <p><strong>Built with ❤️ by K </strong></p>
  <p><em>Powered by JuliaOS Framework</em></p>
</div>
