/**
 * Chat Persistence Manager
 * Handles saving and loading chat messages to/from localStorage
 */

import { ChatMessage } from './types';

const CHAT_STORAGE_KEY = 'agent_chat_history';
const MAX_MESSAGES_PER_AGENT = 100; // Limit to prevent localStorage bloat

export interface ChatHistory {
  [agentId: string]: ChatMessage[];
}

export class ChatPersistenceManager {
  /**
   * Save chat messages for a specific agent
   */
  static saveChatHistory(agentId: string, messages: ChatMessage[]): void {
    try {
      const existingHistory = this.loadAllChatHistory();
      
      // Limit messages to prevent localStorage bloat
      const limitedMessages = messages.slice(-MAX_MESSAGES_PER_AGENT);
      
      existingHistory[agentId] = limitedMessages;
      
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(existingHistory));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }

  /**
   * Load chat messages for a specific agent
   */
  static loadChatHistory(agentId: string): ChatMessage[] {
    try {
      const allHistory = this.loadAllChatHistory();
      const messages = allHistory[agentId] || [];
      
      // Convert timestamp strings back to Date objects
      return messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
    } catch (error) {
      console.warn('Failed to load chat history:', error);
      return [];
    }
  }

  /**
   * Load all chat history
   */
  static loadAllChatHistory(): ChatHistory {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load all chat history:', error);
      return {};
    }
  }

  /**
   * Clear chat history for a specific agent
   */
  static clearChatHistory(agentId: string): void {
    try {
      const existingHistory = this.loadAllChatHistory();
      delete existingHistory[agentId];
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(existingHistory));
    } catch (error) {
      console.warn('Failed to clear chat history:', error);
    }
  }

  /**
   * Clear all chat history
   */
  static clearAllChatHistory(): void {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear all chat history:', error);
    }
  }

  /**
   * Add a single message to chat history
   */
  static addMessage(agentId: string, message: ChatMessage): void {
    try {
      const existingMessages = this.loadChatHistory(agentId);
      const updatedMessages = [...existingMessages, message];
      this.saveChatHistory(agentId, updatedMessages);
    } catch (error) {
      console.warn('Failed to add message to chat history:', error);
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): { totalSize: number; messageCount: number; agentCount: number } {
    try {
      const allHistory = this.loadAllChatHistory();
      const totalSize = JSON.stringify(allHistory).length;
      const agentCount = Object.keys(allHistory).length;
      const messageCount = Object.values(allHistory).reduce((total, messages) => total + messages.length, 0);
      
      return { totalSize, messageCount, agentCount };
    } catch (error) {
      return { totalSize: 0, messageCount: 0, agentCount: 0 };
    }
  }

  /**
   * Check if localStorage is available
   */
  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}