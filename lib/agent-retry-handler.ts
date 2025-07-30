import { ApiResponse } from './types';

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  attempts: number;
}

export class AgentRetryHandler {
  private options: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.options = {
      maxAttempts: options.maxAttempts || 3,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 10000,
      backoffMultiplier: options.backoffMultiplier || 2
    };
  }

  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<ApiResponse<T>>,
    operationName?: string
  ): Promise<RetryResult<T>> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= this.options.maxAttempts; attempt++) {
      try {
        const result = await operation();
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            attempts: attempt
          };
        } else {
          lastError = result.error || 'Unknown error';
          
          // Don't retry on the last attempt
          if (attempt === this.options.maxAttempts) {
            break;
          }
          
          // Wait before retrying
          const delay = Math.min(
            this.options.baseDelay * Math.pow(this.options.backoffMultiplier, attempt - 1),
            this.options.maxDelay
          );
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Don't retry on the last attempt
        if (attempt === this.options.maxAttempts) {
          break;
        }
        
        // Wait before retrying
        const delay = Math.min(
          this.options.baseDelay * Math.pow(this.options.backoffMultiplier, attempt - 1),
          this.options.maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: lastError,
      attempts: this.options.maxAttempts
    };
  }

  /**
   * Create a network retry handler with appropriate settings
   */
  static createNetworkRetryHandler(): AgentRetryHandler {
    return new AgentRetryHandler({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2
    });
  }

  /**
   * Create an agent retry handler with appropriate settings
   */
  static createAgentRetryHandler(): AgentRetryHandler {
    return new AgentRetryHandler({
      maxAttempts: 2,
      baseDelay: 500,
      maxDelay: 2000,
      backoffMultiplier: 1.5
    });
  }
}