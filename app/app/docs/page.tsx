"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Zap, Shield, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');


  // Custom Icon Components (relevant for documentation sections)
  const OverviewIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/home--v1.png"
      alt="overview"
      className={className}
    />
  );

  const GettingStartedIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/rocket.png"
      alt="getting-started"
      className={className}
    />
  );

  const AgentIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios-filled/50/12B886/ai-chatting.png"
      alt="ai-agents"
      className={className}
    />
  );

  const ChatIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/windows/32/12B886/chat-message.png"
      alt="chat-interface"
      className={className}
    />
  );

  const AnalysisIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ink/48/12B886/whale.png"
      alt="smart-money-whale"
      className={className}
    />
  );

  const IntegrationIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/link--v1.png"
      alt="wallet-integration"
      className={className}
    />
  );

  const ApiIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/api.png"
      alt="api-reference"
      className={className}
    />
  );

  const ArchitectureIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/blueprint.png"
      alt="architecture"
      className={className}
    />
  );

  const TroubleshootingIcon = ({ className }: { className?: string }) => (
    <Image
      width={20}
      height={20}
      src="https://img.icons8.com/ios/50/12B886/wrench.png"
      alt="troubleshooting"
      className={className}
    />
  );

  const sections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: OverviewIcon,
      description: 'Introduction to Aethel AI platform'
    },
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: GettingStartedIcon,
      description: 'Quick start guide and setup'
    },
    {
      id: 'agents',
      label: 'Agent Management',
      icon: AgentIcon,
      description: 'Creating and managing AI agents'
    },
    {
      id: 'chat',
      label: 'Chat Interface',
      icon: ChatIcon,
      description: 'Interactive chat features'
    },
    {
      id: 'wallet-analysis',
      label: 'Smart Money Analysis',
      icon: AnalysisIcon,
      description: 'Wallet analysis and trading insights'
    },
    {
      id: 'wallet-integration',
      label: 'Wallet Integration',
      icon: IntegrationIcon,
      description: 'Solana wallet connectivity'
    },
    {
      id: 'api',
      label: 'API Reference',
      icon: ApiIcon,
      description: 'Complete API documentation'
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: ArchitectureIcon,
      description: 'System architecture and design'
    },
    {
      id: 'troubleshooting',
      label: 'Troubleshooting',
      icon: TroubleshootingIcon,
      description: 'Common issues and solutions'
    }
  ];
  const
    documentation = {
      'overview': {
        title: 'Aethel AI Platform Overview',
        content: [
          {
            title: 'Welcome to Aethel AI',
            content: `**Aethel AI** is a Next Generation AI Platform built on the **JuliaOS framework** - a comprehensive framework for building decentralized applications (DApps) with a focus on agent-based architectures and swarm intelligence.

The platform provides comprehensive agent management capabilities with integrated Solana wallet analysis and smart money insights, leveraging JuliaOS's powerful Julia backend for sophisticated AI-powered strategies and blockchain analysis.

**Key Features:**
• **JuliaOS Framework**: Built on Julia's high-performance computing capabilities
• **Agent-Based Architecture**: Modular agent framework with swarm intelligence
• **Multi-Agent Management**: Create and manage multiple AI agents with different capabilities
• **Solana Integration**: Specialized support for Solana blockchain ecosystem
• **Real-time Chat Interface**: Interactive chat with AI agents
• **Smart Money Analysis**: Advanced wallet analysis using external APIs
• **Solana Wallet Integration**: Full Solana wallet connectivity and transaction analysis
• **Real-time Status Monitoring**: Live agent status updates and health monitoring
• **Responsive Design**: Mobile-first responsive interface`
          },
          {
            title: 'Platform Capabilities',
            content: `**Agent Types:**
• **LLM Chat Agents**: General purpose conversational AI for assistance and information
• **Smart Money Analysis Agents**: Specialized agents for wallet analysis and trading insights

**Supported Wallets:**
• Phantom, Solflare, Backpack, Torus, Ledger

**External Integrations:**
• Helius RPC for Solana blockchain data
• Birdeye API for token prices and market data
• Icons8 for UI graphics and icons`
          },
          {
            title: 'Technology Stack',
            content: `**Frontend:**
• Next.js 15.4.2 with App Router
• React 19.1.0 with TypeScript
• Tailwind CSS with Radix UI components
• Zustand for state management

**JuliaOS Backend Framework:**
• **Julia Core Engine**: High-performance computing backend (Julia >= 1.11.4)
• **Python Wrapper**: Python SDK for agent orchestration (Python >= 3.11)
• **Agent Framework**: Modular agent-based architecture with swarm intelligence
• **Solana Blockchain Integration**: Specialized Solana ecosystem support
• **RESTful API**: Webhook support with MCP (Model Context Protocol) enabled
• **Database**: PostgreSQL for persistent storage
• **Docker Support**: Containerized deployment options

**Blockchain Integration:**
• **Solana**: Web3.js integration with multiple wallet adapters
• **Wallet Support**: Phantom, Solflare, Backpack, Torus, Ledger
• **Blockchain Data**: Helius RPC for transaction and balance data
• **Market Data**: Birdeye API for token prices and analytics`
          }
        ]
      },
      'getting-started': {
        title: 'Getting Started',
        content: [
          {
            title: 'Quick Start Guide',
            content: `**Step 1: Access the Platform**
Navigate to the Aethel AI platform and familiarize yourself with the interface.

**Step 2: Create Your First Agent**
1. Click on **"Agents"** in the sidebar navigation
2. Click the **"Create Agent"** button
3. Choose your agent type:
   - **LLM Chat**: For general conversations and assistance
   - **Smart Money Analysis**: For wallet analysis and trading insights
4. Enter a name and description for your agent
5. Click **"Create"** to deploy your agent

**Step 3: Start Your Agent**
1. Find your newly created agent in the agents list
2. Click the **"Start"** button to activate the agent
3. Wait for the status to change to **"Running"** (green indicator)

**Step 4: Begin Chatting**
1. Click the **"Chat"** button on your agent card
2. You'll be redirected to the chat interface
3. Type your message and press Enter to start the conversation`
          },
          {
            title: 'System Requirements',
            content: `**Browser Requirements:**
• Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
• JavaScript enabled
• Local storage enabled for session persistence

**Network Requirements:**
• Stable internet connection (minimum 1 Mbps)
• WebSocket support for real-time features
• Access to external APIs (Helius, Birdeye)

**Optional Requirements:**
• Solana wallet extension (for wallet analysis features)
• Minimum screen resolution: 1024x768 (responsive design supports mobile)`
          },
          {
            title: 'First Steps Checklist',
            content: `✅ **Platform Access**: Successfully loaded the Aethel AI interface
✅ **Navigation**: Familiarized with sidebar navigation (Agents, Chat, etc.)
✅ **Agent Creation**: Created your first AI agent
✅ **Agent Activation**: Started your agent and confirmed "Running" status
✅ **Chat Interaction**: Successfully sent and received messages
✅ **Wallet Connection** (Optional): Connected your Solana wallet for analysis features

**Next Steps:**
• Explore different agent types and their capabilities
• Try the Smart Money Analysis feature with a Solana wallet
• Review the API documentation for advanced integrations`
          }
        ]
      },
      'agents': {
        title: 'Agent Management',
        content: [
          {
            title: 'Creating Agents',
            content: `**Agent Creation Process:**

1. **Navigate to Agents Page**
   - Click "Agents" in the sidebar navigation
   - You'll see the agent management interface

2. **Click "Create Agent"**
   - Opens the agent creation modal
   - Real-time form validation

3. **Configure Your Agent**
   - **Name**: Enter a descriptive name (max 100 characters)
   - **Strategy**: Currently supports "Planning & Execution"
   - **Tool Selection**: Choose between:
     • **LLM Chat**: General purpose conversational AI
     • **Smart Money Analysis**: Wallet analysis and trading insights

4. **Create and Deploy**
   - Click "Create" to deploy your agent
   - Agent appears in the management interface
   - Initial state is "Created"`
          },
          {
            title: 'Agent States and Lifecycle',
            content: `**Agent States:**

**CREATED** 🔵
• Agent has been created but not yet started
• Configuration is complete and validated
• Ready to be activated

**RUNNING** 🟢
• Agent is active and ready to receive messages
• Can process chat requests and provide responses
• Consumes system resources

**STOPPED** 🔴
• Agent has been deactivated
• Not processing new requests
• Can be restarted at any time

**State Transitions:**
\`CREATED → (Start) → RUNNING → (Stop) → STOPPED → (Restart) → RUNNING\``
          },
          {
            title: 'Agent Management Features',
            content: `**Agent Cards Interface:**
• **Status Indicators**: Visual representation of agent state
• **Quick Actions**: Start, stop, chat, delete buttons
• **Agent Information**: Name, description, creation date
• **Real-time Updates**: Live status monitoring

**Bulk Operations:**
• Select multiple agents for batch operations
• Bulk state changes (start/stop multiple agents)
• Mass deletion with confirmation

**Monitoring and Health:**
• Real-time status polling every 2 seconds
• Connection health monitoring
• Automatic error recovery and retry mechanisms
• Optimistic UI updates with rollback on failure`
          }
        ]
      },
      'chat': {
        title: 'Chat Interface',
        content: [
          {
            title: 'Starting a Conversation',
            content: `**Accessing Chat:**
1. **From Agent Card**: Click "Chat" button on any running agent
2. **From Navigation**: Click "Chat" in sidebar (auto-selects available agent)
3. **Direct Navigation**: Navigate to /app for main chat interface

**Chat Prerequisites:**
• At least one agent must be created
• Agent must be in "Running" state (green indicator)
• Stable internet connection for real-time communication

**First Message:**
• Type your message in the input field at the bottom
• Press Enter or click the send button (arrow icon)
• Wait for the AI response (typically 2-10 seconds)`
          },
          {
            title: 'Chat Features',
            content: `**Message Management:**
• **Message History**: All conversations automatically saved
• **Copy to Clipboard**: Click copy icon on AI messages
• **Timestamps**: Each message shows send/receive time
• **Auto-scroll**: Automatically scrolls to newest messages

**Input Features:**
• **Auto-expanding Text Area**: Grows with message length (max 3 lines)
• **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
• **Template System**: Quick message templates for common queries
• **Message Validation**: Prevents empty messages

**Advanced Features:**
• **New Chat**: Start fresh conversation with + button
• **Agent Switching**: Seamlessly switch between different agents
• **Real-time Status**: Live agent status in chat header
• **Error Recovery**: Automatic retry for failed messages`
          },
          {
            title: 'Message Templates',
            content: `**Available Templates:**
• 💡 "Explain this concept to me" - Learning
• 🔍 "Help me research information about" - Research  
• ✍️ "Write a summary of" - Writing
• 🤔 "What are the pros and cons of" - Analysis
• 📊 "Create a plan for" - Planning
• 🛠️ "How do I troubleshoot" - Problem Solving
• 📚 "Teach me about" - Education
• 💼 "Help me with my work on" - Professional

**Using Templates:**
1. Click the template icon (three lines) in the chat input
2. Browse available templates by category
3. Click on any template to insert it into the input field
4. Customize the template text as needed
5. Send the message normally`
          }
        ]
      },
      'wallet-analysis': {
        title: 'Smart Money Analysis',
        content: [
          {
            title: 'Wallet Analysis Overview',
            content: `**Smart Money Analysis** provides comprehensive insights into Solana wallet performance, trading patterns, and risk assessment. This feature combines blockchain data analysis with AI-powered insights to help users understand wallet behavior and make informed decisions.

**Analysis Components:**
• **Portfolio Overview**: Total value, token distribution, balance analysis
• **Trading Metrics**: Volume, win rate, P&L, trading frequency
• **Risk Assessment**: Multi-factor risk scoring (1-10 scale)
• **Behavioral Analysis**: Trading pattern recognition and investor profiling
• **AI Insights**: Generated recommendations and strategic advice

**Data Sources:**
• **Helius RPC**: Primary Solana blockchain data provider
• **Birdeye API**: Token prices and market data
• **Real-time Processing**: Live data analysis and updates`
          },
          {
            title: 'Creating Analysis Agents',
            content: `**Smart Money Analysis Agent Setup:**

1. **Create Agent**
   - Navigate to Agents page
   - Click "Create Agent"
   - Select "Smart Money Analysis" tool
   - Name your agent (e.g., "Wallet Analyzer")

2. **Agent Configuration**
   - **Strategy**: Planning & Execution (default)
   - **Tool**: Smart Money Analysis (specialized for wallet data)
   - **Description**: Automatically set to indicate analysis capabilities

3. **Start Analysis Agent**
   - Click "Start" to activate the agent
   - Wait for "Running" status
   - Agent is now ready for wallet analysis requests`
          },
          {
            title: 'Performing Wallet Analysis',
            content: `**Analysis Process:**

1. **Access Analysis Interface**
   - Click "Analyze" button on Smart Money Analysis agent
   - Or navigate directly to /app/analysis

2. **Enter Wallet Address**
   - Paste Solana wallet address (32-44 characters, base58 encoded)
   - Address validation happens automatically
   - Click "Analyze Wallet" to begin

3. **Analysis Stages**
   - **Data Collection**: Fetching wallet data from blockchain
   - **Metric Calculation**: Computing trading performance metrics
   - **Risk Assessment**: Evaluating portfolio risk factors
   - **AI Processing**: Generating insights and recommendations
   - **Report Generation**: Creating comprehensive analysis report

**Analysis Output:**
• **Portfolio Summary**: Total value, token count, transaction history
• **Trading Performance**: Win rate, P&L, volume analysis
• **Risk Score**: 1-10 scale with detailed factor breakdown
• **Investor Profile**: Conservative, moderate, aggressive, or speculative
• **Recommendations**: AI-generated improvement suggestions`
          }
        ]
      },
      'wallet-integration': {
        title: 'Wallet Integration',
        content: [
          {
            title: 'Supported Wallets',
            content: `**Solana Wallet Adapters:**

**Phantom Wallet** 🟣
• Most popular Solana wallet
• Browser extension and mobile app
• Excellent user experience and security

**Solflare** 🟡  
• Multi-chain wallet with strong Solana support
• Web, browser extension, and mobile versions
• Advanced features for power users

**Backpack** 🎒
• Native Solana wallet with modern interface
• Built specifically for Solana ecosystem
• Integrated with xNFT applications

**Torus** 🌐
• Social login wallet (Google, Twitter, etc.)
• No extension required
• Great for new users to crypto

**Ledger** 🔒
• Hardware wallet support
• Maximum security for large holdings
• Requires Ledger device and Ledger Live`
          },
          {
            title: 'Wallet Connection Process',
            content: `**Connecting Your Wallet:**

1. **Automatic Detection**
   - Platform automatically detects installed wallet extensions
   - Available wallets appear in connection interface

2. **Select Wallet**
   - Click on your preferred wallet from the list
   - Wallet extension will prompt for connection approval

3. **Approve Connection**
   - Review the connection request in your wallet
   - Click "Connect" or "Approve" in the wallet popup
   - Platform will confirm successful connection

4. **Wallet Status**
   - Connected wallet appears in sidebar
   - Shows wallet address (truncated) and SOL balance
   - Green indicator confirms active connection

**Connection Features:**
• **Auto-connect**: Automatically reconnects on return visits
• **Multi-wallet Support**: Switch between multiple connected wallets
• **Session Persistence**: Connection maintained across browser sessions`
          },
          {
            title: 'Wallet Features and Security',
            content: `**Available Features:**
• **Balance Display**: Real-time SOL balance updates
• **Address Display**: Truncated address with copy functionality
• **Connection Status**: Visual indicators for connection health
• **Disconnect Option**: Easy wallet disconnection

**Security Considerations:**
• **Read-only Access**: Platform only reads wallet data, never requests private keys
• **No Transaction Signing**: Platform does not initiate transactions
• **Secure Connection**: All wallet communication uses secure protocols
• **User Control**: Users maintain full control over wallet connection

**Privacy:**
• **Optional Connection**: Wallet connection is not required for basic features
• **Data Usage**: Wallet data only used for analysis features when explicitly requested
• **No Storage**: Private keys never stored or transmitted`
          }
        ]
      },
      'api': {
        title: 'API Reference',
        content: [
          {
            title: 'API Overview',
            content: `**Base Configuration:**
• **Backend URL**: Uses \`NEXT_PUBLIC_BACKEND_URL\` environment variable
• **Proxy Route**: \`/api/proxy\` (handles CORS issues)
• **Timeout**: 300 seconds (5 minutes) for agent operations
• **Content Type**: \`application/json\`

**Authentication:**
Currently, the API uses direct backend communication through the proxy layer. Future versions may implement API key authentication.

**Rate Limiting:**
• Built-in rate limiting on agent creation endpoints
• Automatic retry mechanisms for failed requests
• Exponential backoff for error recovery`
          },
          {
            title: 'Agent Management Endpoints',
            content: `**List All Agents**
\`GET /api/agents\`
Returns array of all user agents with current status.

**Create New Agent**
\`POST /api/agents\`
Request body:
\`\`\`json
{
  "id": "agent-unique-id",
  "name": "Agent Name",
  "description": "Agent description",
  "blueprint": {
    "strategy": {
      "name": "plan_execute",
      "config": {}
    },
    "tools": [{
      "name": "llm_chat",
      "config": {}
    }],
    "trigger": {
      "type": "webhook",
      "params": {}
    }
  }
}
\`\`\`

**Get Agent Details**
\`GET /api/agents/{agentId}\`
Returns detailed agent information including current state.

**Update Agent State**
\`PUT /api/agents/{agentId}\`
Request body:
\`\`\`json
{
  "state": "RUNNING" | "STOPPED"
}
\`\`\`

**Delete Agent**
\`DELETE /api/agents/{agentId}\`
Permanently removes the agent.`
          },
          {
            title: 'Chat and Messaging Endpoints',
            content: `**Send Message to Agent**
\`POST /api/agents/{agentId}/webhook\`
Request body:
\`\`\`json
{
  "text": "Your message to the agent"
}
\`\`\`

**Get Agent Logs**
\`GET /api/agents/{agentId}/logs\`
Returns agent execution logs and responses.

**Response Format:**
All API responses follow this structure:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "error": null
}
\`\`\`

**Error Responses:**
\`\`\`json
{
  "success": false,
  "data": null,
  "error": "Error message description"
}
\`\`\`

**Status Codes:**
• \`200\` - Success
• \`201\` - Created
• \`400\` - Bad Request
• \`404\` - Not Found
• \`408\` - Request Timeout
• \`429\` - Rate Limited
• \`500\` - Server Error`
          }
        ]
      },
      'architecture': {
        title: 'System Architecture',
        content: [
          {
            title: 'Frontend Architecture',
            content: `**Technology Stack:**
• **Framework**: Next.js 15.4.2 with App Router
• **Language**: TypeScript with strict type checking
• **Styling**: Tailwind CSS 4.0 with custom design system
• **State Management**: Zustand + React Context for hybrid approach
• **UI Components**: Radix UI primitives with custom styling

**Component Architecture:**
\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── app/               # Protected app routes
├── components/            # Reusable UI components
│   ├── agents/           # Agent management components
│   ├── navigation/       # Navigation and routing
│   ├── wallet/           # Wallet integration
│   └── ui/               # Base UI components
├── lib/                  # Business logic and utilities
│   ├── agent-service.ts  # Agent management service
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── hooks/                # Custom React hooks
\`\`\``
          },
          {
            title: 'JuliaOS Backend Architecture',
            content: `**Multi-Layered JuliaOS Architecture:**

**Layer 1: Julia Core Engine (Foundation Layer)**
• High-performance computing backend using Julia (>= 1.11.4)
• Agent orchestration and swarm algorithms
• Neural networks and portfolio optimization
• Blockchain/DEX integration and price feeds
• Trading strategies and risk management

**Layer 2: Julia API Layer (Interface Layer, MCP-Enabled)**
• RESTful API with webhook support
• Model Context Protocol (MCP) enabled endpoints
• Request validation and response formatting
• API-level security enforcement

**Layer 3: Rust Security Component (Specialized Security Layer)**
• Cryptographic operations and private key management
• Transaction signing and HD wallet derivation
• Memory-safe environment via FFI from Julia

**Integration Pattern:**
\`\`\`
Frontend → Proxy API → JuliaOS Backend → Julia Core Engine
    ↓         ↓              ↓              ↓
  UI State   CORS      Agent Framework   AI Processing
  Management Handling   & Orchestration   & Strategies
\`\`\`

**Data Flow:**
1. User interaction triggers frontend action
2. Frontend calls proxy API endpoint
3. Proxy forwards request to JuliaOS backend
4. JuliaOS processes request through Julia core engine
5. Agent framework executes strategies and tools
6. Response flows back through the chain
7. Frontend updates UI with new state`
          },
          {
            title: 'External Service Integration',
            content: `**Blockchain Data:**
• **Helius RPC**: Primary Solana blockchain data provider
  - Wallet balance and transaction data
  - Token metadata and pricing
  - Real-time blockchain updates

**Market Data:**
• **Birdeye API**: Token prices and market analytics
  - Real-time price feeds
  - Historical price data
  - Market capitalization and volume

**UI Assets:**
• **Icons8**: Consistent icon library
  - Agent, chat, and navigation icons
  - Branded color scheme (#12B886)
  - Scalable vector graphics

**Service Reliability:**
• **Retry Mechanisms**: Automatic retry for failed API calls
• **Fallback Handling**: Graceful degradation when services unavailable
• **Caching**: Strategic caching for improved performance
• **Error Boundaries**: Isolated error handling per service`
          }
        ]
      },
      'troubleshooting': {
        title: 'Troubleshooting',
        content: [
          {
            title: 'Common Agent Issues',
            content: `**Agent Not Starting:**
• **Check Status**: Verify agent shows "Created" state before starting
• **Network Connection**: Ensure stable internet connection
• **Backend Connectivity**: Check if backend API is accessible
• **Browser Console**: Look for error messages in developer tools
• **Solution**: Try refreshing the page and restarting the agent

**Agent Not Responding:**
• **Status Check**: Confirm agent shows "Running" (green) status
• **Message Format**: Ensure messages are not empty
• **Timeout Issues**: Wait up to 5 minutes for complex responses
• **Log Analysis**: Check agent logs for error messages
• **Solution**: Stop and restart the agent, check network connection

**Chat Interface Issues:**
• **Message Not Sending**: Check agent status and network connection
• **No Response**: Wait for processing, check agent logs
• **Interface Freezing**: Refresh browser, clear cache
• **Solution**: Use browser refresh, try different browser`
          },
          {
            title: 'Wallet Connection Problems',
            content: `**Wallet Not Detected:**
• **Extension Check**: Ensure wallet extension is installed and enabled
• **Browser Compatibility**: Use supported browsers (Chrome, Firefox, Safari, Edge)
• **Extension Updates**: Update wallet extension to latest version
• **Solution**: Restart browser, reinstall wallet extension if needed

**Connection Fails:**
• **Popup Blockers**: Disable popup blockers for the site
• **Extension Permissions**: Grant necessary permissions to wallet
• **Network Issues**: Check internet connection stability
• **Solution**: Try different wallet, clear browser cache

`
          },
          {
            title: 'Performance and Error Recovery',
            content: `**Slow Performance:**
• **Network Speed**: Check internet connection speed (minimum 1 Mbps)
• **Browser Resources**: Close unnecessary tabs and applications
• **Cache Issues**: Clear browser cache and cookies
• **Extension Conflicts**: Disable other browser extensions temporarily
• **Solution**: Use incognito mode, try different browser

**Error Recovery Steps:**
1. **Refresh Page**: Simple browser refresh often resolves temporary issues
2. **Clear Cache**: Clear browser cache and local storage
3. **Check Network**: Verify stable internet connection
4. **Restart Browser**: Close and reopen browser completely
5. **Try Different Browser**: Test with Chrome, Firefox, or Safari
6. **Contact Support**: If issues persist, use the Contact page

**Getting Additional Help:**
• **Documentation**: Review relevant sections in this documentation
• **Browser Console**: Check for error messages (F12 → Console)
• **Network Tab**: Monitor API calls for failures (F12 → Network)
• **Contact Support**: Use the Contact page for technical assistance
• **Community**: Join community discussions for peer support`
          }
        ]
      }
    };

  const currentDoc = documentation[activeSection as keyof typeof documentation];



  // Auto-scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Header */}
      <div className="relative min-h-[200px] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: "url('/assets/header-image-docs.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center min-h-[200px]">
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            <div className="flex items-center justify-between">
              {/* Left side - Text content */}
              <div className="flex-1 max-w-2xl">
                {/* Aethel AI Brand with JuliaOS Badge */}
                <div className="mb-4 flex items-center space-x-3">
                  <span className="text-white text-lg font-bold tracking-wider">
                    Aethel AI
                  </span>
                  <span className="px-2 py-1 bg-teal-500/20 border border-teal-400/30 rounded-md text-xs text-teal-300 font-medium">
                    Powered by JuliaOS
                  </span>
                </div>

                {/* Main Headlines - Combined in two rows */}
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 leading-tight"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Built for the restless.<br />
                  Powered by the swarm.
                </h1>
              </div>

              {/* Right side - Space for the spherical image (handled by background) */}
              <div className="hidden lg:block flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                  Table of Contents
                </h2>

                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${activeSection === section.id
                        ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600/50 border border-transparent'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <section.icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{section.label}</div>
                          <div className="text-xs opacity-70 truncate">{section.description}</div>
                        </div>
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4 text-teal-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                  <Image width={16} height={16} src="https://img.icons8.com/hatch/64/12B886/quick-mode-on.png" alt="quick-mode-on" className="mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/app/agents"
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 hover:bg-teal-900/30 border border-slate-600/30 hover:border-teal-500/30 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                      <Image width={16} height={16} src="https://img.icons8.com/ios-filled/50/12B886/ai-chatting.png" alt="create-agent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white group-hover:text-teal-300">Create Agent</div>
                      <div className="text-xs text-slate-400">Start building</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
                  </Link>

                  <Link
                    href="/app"
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 hover:bg-cyan-900/30 border border-slate-600/30 hover:border-cyan-500/30 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Image width={16} height={16} src="https://img.icons8.com/windows/32/12B886/chat-message.png" alt="start-chat" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white group-hover:text-cyan-300">Start Chat</div>
                      <div className="text-xs text-slate-400">Begin conversation</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  </Link>
                </div>
              </div>


            </div>
          </div>
          {/* Documentation Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-slate-800/60 via-slate-800/50 to-slate-800/60 backdrop-blur-md border-b border-slate-700/30 p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    {React.createElement(sections.find(s => s.id === activeSection)?.icon || OverviewIcon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-teal-200 tracking-tight"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {currentDoc.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {sections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8">
                <div className="prose prose-invert prose-lg max-w-none">
                  {currentDoc.content.map((item, index) => (
                    <div key={index} className="mb-12">
                      <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-slate-700/50 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-4"></div>
                        {item.title}
                      </h3>
                      <div className="text-slate-300 leading-relaxed space-y-4">
                        {item.content.split('\n\n').map((paragraph, pIndex) => (
                          <div key={pIndex} className="whitespace-pre-line">
                            {paragraph.split('\n').map((line, lIndex) => {
                              // Handle code blocks
                              if (line.startsWith('```')) {
                                return null; // Handle separately
                              }
                              // Handle bullet points
                              if (line.startsWith('• ')) {
                                return (
                                  <div key={lIndex} className="flex items-start space-x-3 my-2">
                                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{line.substring(2)}</span>
                                  </div>
                                );
                              }
                              // Handle bold text
                              if (line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <div key={lIndex} className="my-2">
                                    {parts.map((part, partIndex) =>
                                      partIndex % 2 === 1 ?
                                        <strong key={partIndex} className="text-teal-300 font-semibold">{part}</strong> :
                                        <span key={partIndex}>{part}</span>
                                    )}
                                  </div>
                                );
                              }
                              // Handle code inline
                              if (line.includes('`') && !line.startsWith('```')) {
                                const parts = line.split('`');
                                return (
                                  <div key={lIndex} className="my-2">
                                    {parts.map((part, partIndex) =>
                                      partIndex % 2 === 1 ?
                                        <code key={partIndex} className="bg-slate-700/50 text-cyan-300 px-2 py-1 rounded text-sm font-mono">{part}</code> :
                                        <span key={partIndex}>{part}</span>
                                    )}
                                  </div>
                                );
                              }
                              return <div key={lIndex} className="my-2">{line}</div>;
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Footer */}
              <div className="bg-gradient-to-r from-slate-800/60 via-slate-800/50 to-slate-800/60 backdrop-blur-md border-t border-slate-700/30 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-400 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(sections[currentIndex - 1].id);
                        }
                      }}
                      disabled={sections.findIndex(s => s.id === activeSection) === 0}
                      className="text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === activeSection);
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1].id);
                        }
                      }}
                      disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                      className="text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}