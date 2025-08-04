export type AgentState = 'CREATED' | 'RUNNING' | 'STOPPED';
export type TriggerType = 'WEBHOOK' | 'PERIODIC';

export interface Agent {
  id: string;
  name: string;
  description: string;
  state: AgentState;
  trigger_type: TriggerType;
  strategy: string;
  tools: string[];
  created_at: string;
  updated_at: string;
  input_schema?: Record<string, any>;
}

export interface AgentBlueprint {
  tools: ToolBlueprint[];
  strategy: StrategyBlueprint;
  trigger: TriggerConfig;
}

export interface ToolBlueprint {
  name: string;
  config: Record<string, any>; // Changed from config_data to config to match backend
}

export interface StrategyBlueprint {
  name: string;
  config: Record<string, any>; // Changed from config_data to config to match backend
}

export interface TriggerConfig {
  type: string;
  params: Record<string, any>;
}

export interface CreateAgentRequest {
  id: string;
  name: string;
  description: string;
  blueprint: AgentBlueprint;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Enhanced interfaces for multi-agent support
export interface AgentConfiguration {
  name: string;
  description: string;
  strategy: StrategyConfig;
  tools: ToolConfig[];
  trigger: TriggerConfig;
}

export interface StrategyConfig {
  type: 'support' | 'plan_execute' | 'custom';
  parameters: Record<string, any>; // This will be mapped to config in the backend
}

export interface ToolConfig {
  name: string;
  config: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
}

export interface AgentStatus {
  id: string;
  state: AgentState;
  lastUpdated: string;
  isHealthy: boolean;
  errorMessage?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    steps?: string[];
    executionSummary?: string;
    performance?: any; // Performance metrics from performance monitor
  };
}

// Status tracking types
export type ProcessingStage = 
  | 'initializing'
  | 'sending'
  | 'processing'
  | 'polling'
  | 'parsing'
  | 'generating'
  | 'formatting'
  | 'complete'
  | 'error'
  | 'timeout';

export interface StatusUpdate {
  stage: ProcessingStage;
  message: string;
  progress?: number;
  timestamp: number;
  metadata?: {
    attempt?: number;
    maxAttempts?: number;
    elapsedTime?: number;
    estimatedTimeRemaining?: number;
    agentId?: string;
    [key: string]: any;
  };
}

export interface StatusCallback {
  (status: StatusUpdate): void;
}

export interface ProcessingPhase {
  id: string;
  name: string;
  stage: ProcessingStage;
  description: string;
  estimatedDuration: number;
  isComplete: boolean;
  startTime?: number;
  endTime?: number;
  error?: string;
}

export interface StatusState {
  sessionId: string;
  agentId?: string;
  currentPhase: ProcessingPhase | null;
  phases: ProcessingPhase[];
  overallProgress: number;
  isActive: boolean;
  startTime: number;
  endTime?: number;
  totalElapsedTime: number;
  estimatedTimeRemaining: number;
  lastUpdate: number;
}

// Navigation types
export type NavigationItemId = 'chat' | 'agents' | 'settings';

export interface NavigationItem {
  id: NavigationItemId;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isDisabled?: boolean;
  badge?: string | number;
}

export interface NavigationState {
  currentPath: string | null;
  isMenuCollapsed: boolean;
  activeItem: NavigationItemId;
  isInitialized: boolean;
}

// Wallet-related types
export interface WalletConnectionState {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: string | null;
  walletName: string | null;
}

export interface SolanaTransaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  status: 'confirmed' | 'finalized' | 'processed';
  amount?: number;
  type: 'transfer' | 'program' | 'unknown';
  from?: string;
  to?: string;
}

export interface WalletBalance {
  sol: number;
  lamports: number;
  tokens: TokenBalance[];
  lastUpdated: number;
}

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  name?: string;
  logoUri?: string;
}