/**
 * Simple Status Manager
 * 
 * A lightweight status manager for chat processing states
 * with parallel processing support
 */

export type ProcessingStage = 'idle' | 'sending' | 'processing' | 'complete' | 'error';

export interface StatusUpdate {
  stage: ProcessingStage;
  message: string;
  timestamp: number;
}

export class SimpleStatusManager {
  private listeners: ((update: StatusUpdate) => void)[] = [];
  private currentStage: ProcessingStage = 'idle';

  subscribe(callback: (update: StatusUpdate) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  updateStatus(stage: ProcessingStage, message: string) {
    this.currentStage = stage;
    const update: StatusUpdate = {
      stage,
      message,
      timestamp: Date.now()
    };

    // Notify all listeners in parallel
    this.listeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        // Status listener error
      }
    });
  }

  getCurrentStage(): ProcessingStage {
    return this.currentStage;
  }

  reset() {
    this.currentStage = 'idle';
    this.listeners = [];
  }
}