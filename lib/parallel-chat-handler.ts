/**
 * Parallel Chat Handler
 * 
 * A simple, direct approach to handle chat messages with parallel processing
 * for real-time UI updates as backend generates responses
 */

import { sendMessageToAgent, getAgentLogs } from './api';
import { EnhancedResponseParser } from './simple-response-parser';
import { SimpleStatusManager, StatusUpdate } from './status-manager';
import { Agent } from './types';

export interface ChatResponse {
    success: boolean;
    response?: string;
    error?: string;
    processingTime?: number;
}

export class ParallelChatHandler {
    private statusManager = new SimpleStatusManager();
    private isProcessing = false;

    /**
     * Send message with parallel processing and real-time updates
     */
    async sendMessage(
        agentId: string,
        message: string,
        agent: Agent,
        onStatusUpdate?: (update: StatusUpdate) => void
    ): Promise<ChatResponse> {
        const startTime = Date.now();

        // Subscribe to status updates if callback provided
        let unsubscribe: (() => void) | undefined;
        if (onStatusUpdate) {
            unsubscribe = this.statusManager.subscribe(onStatusUpdate);
        }

        try {
            this.isProcessing = true;

            // Step 1: Send message (parallel with status updates)
            this.statusManager.updateStatus('sending', 'Sending your request to AI...');

            const sendResult = await sendMessageToAgent(agentId, message, agent);
            if (!sendResult.success) {
                throw new Error(sendResult.error || 'Failed to send message');
            }



            // Step 2: Start parallel polling with real-time updates
            this.statusManager.updateStatus('processing', 'Agent is thinking...');

            const response = await this.pollWithParallelUpdates(agentId);

            if (response) {
                this.statusManager.updateStatus('complete', 'Response received!');

                return {
                    success: true,
                    response,
                    processingTime: Date.now() - startTime
                };
            } else {
                throw new Error('No response received from agent');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.statusManager.updateStatus('error', errorMessage);

            return {
                success: false,
                error: errorMessage,
                processingTime: Date.now() - startTime
            };
        } finally {
            this.isProcessing = false;
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }

    /**
     * Poll for response with parallel status updates
     */
    private async pollWithParallelUpdates(agentId: string): Promise<string | null> {
        const maxAttempts = 60; // 120 seconds total (2 minutes)
        const pollInterval = 1000; // 1 second for faster response

        let attempt = 0;
        let lastLogCount = 0;

        while (attempt < maxAttempts && this.isProcessing) {
            attempt++;

            // Update status with dynamic progress indication
            const progressMessages = [
                'AI is analyzing your request...',
                'Generating content...',
                'Crafting your response...',
                'Refining the output...',
                'Polishing the final result...',
                'Almost ready...',
                'Finalizing response...'
            ];

            const messageIndex = Math.min(Math.floor((attempt - 1) / 8), progressMessages.length - 1);
            this.statusManager.updateStatus('processing', progressMessages[messageIndex]);

            try {
                // Get logs
                const logsResult = await getAgentLogs(agentId);

                if (logsResult.success && logsResult.data && logsResult.data.logs) {
                    const logs = logsResult.data.logs;


                    // Check if we have new logs (parallel processing indicator)
                    if (logs.length > lastLogCount) {
                        lastLogCount = logs.length;
                        this.statusManager.updateStatus('processing', 'Agent is making progress...');
                    }

                    // Try to extract response
                    const parseResult = EnhancedResponseParser.extractResponse(logs);

                    if (parseResult.success && parseResult.response) {

                        return parseResult.response;
                    }
                }

                // Wait before next attempt (non-blocking)
                await new Promise(resolve => setTimeout(resolve, pollInterval));

            } catch (error) {
                // Continue polling even if one attempt fails
            }
        }

        return null;
    }

    /**
     * Check if currently processing
     */
    isCurrentlyProcessing(): boolean {
        return this.isProcessing;
    }

    /**
     * Cancel current processing
     */
    cancel() {
        this.isProcessing = false;
        this.statusManager.updateStatus('idle', 'Cancelled');
    }

    /**
     * Reset the handler
     */
    reset() {
        this.isProcessing = false;
        this.statusManager.reset();
    }
}