/**
 * Navigation State Persistence Utilities
 * 
 * This module provides utilities for persisting and restoring navigation state
 * across page refreshes and browser sessions. It handles edge cases like
 * storage unavailability and provides fallback mechanisms.
 */

import { NavigationItemId } from './types';
import { AgentSelectionContext } from './navigation-context';

// Storage configuration
export const PERSISTENCE_CONFIG = {
  STORAGE_KEYS: {
    MENU_COLLAPSED: 'sideMenuCollapsed',
    AGENT_SELECTION_CONTEXT: 'agentSelectionContext',
  },
  DEFAULTS: {
    MENU_COLLAPSED: false,
    AGENT_SELECTION: {
      selectedAgentId: null,
      lastSelectedRoute: 'chat' as NavigationItemId,
      timestamp: Date.now(),
    },
  },
  // Session timeout in milliseconds (24 hours)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
} as const;

/**
 * Storage availability checker with fallback handling
 */
export class StorageManager {
  private static localStorageAvailable: boolean | null = null;
  private static sessionStorageAvailable: boolean | null = null;

  static isLocalStorageAvailable(): boolean {
    if (this.localStorageAvailable !== null) {
      return this.localStorageAvailable;
    }

    if (typeof window === 'undefined') {
      this.localStorageAvailable = false;
      return false;
    }

    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.localStorageAvailable = true;
      return true;
    } catch (error) {
      this.localStorageAvailable = false;
      return false;
    }
  }

  static isSessionStorageAvailable(): boolean {
    if (this.sessionStorageAvailable !== null) {
      return this.sessionStorageAvailable;
    }

    if (typeof window === 'undefined') {
      this.sessionStorageAvailable = false;
      return false;
    }

    try {
      const testKey = '__sessionStorage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      this.sessionStorageAvailable = true;
      return true;
    } catch (error) {
      this.sessionStorageAvailable = false;
      return false;
    }
  }

  static loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    if (!this.isLocalStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      return defaultValue;
    }
  }

  static saveToLocalStorage<T>(key: string, value: T): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  static loadFromSessionStorage<T>(key: string, defaultValue: T): T {
    if (!this.isSessionStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      return defaultValue;
    }
  }

  static saveToSessionStorage<T>(key: string, value: T): boolean {
    if (!this.isSessionStorageAvailable()) {
      return false;
    }

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  static removeFromLocalStorage(key: string): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  static removeFromSessionStorage(key: string): boolean {
    if (!this.isSessionStorageAvailable()) {
      return false;
    }

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Menu collapse state persistence
 */
export class MenuPersistence {
  static load(): boolean {
    return StorageManager.loadFromLocalStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.MENU_COLLAPSED,
      PERSISTENCE_CONFIG.DEFAULTS.MENU_COLLAPSED
    );
  }

  static save(isCollapsed: boolean): boolean {
    return StorageManager.saveToLocalStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.MENU_COLLAPSED,
      isCollapsed
    );
  }

  static clear(): boolean {
    return StorageManager.removeFromLocalStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.MENU_COLLAPSED
    );
  }
}

/**
 * Agent selection state persistence with session timeout handling
 */
export class AgentSelectionPersistence {
  static load(): AgentSelectionContext {
    const stored = StorageManager.loadFromSessionStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.AGENT_SELECTION_CONTEXT,
      PERSISTENCE_CONFIG.DEFAULTS.AGENT_SELECTION
    );

    // Check if the stored data is expired
    if (this.isExpired(stored)) {
      return PERSISTENCE_CONFIG.DEFAULTS.AGENT_SELECTION;
    }

    return stored;
  }

  static save(agentSelection: AgentSelectionContext): boolean {
    // Update timestamp when saving
    const dataToSave = {
      ...agentSelection,
      timestamp: Date.now(),
    };

    return StorageManager.saveToSessionStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.AGENT_SELECTION_CONTEXT,
      dataToSave
    );
  }

  static clear(): boolean {
    return StorageManager.removeFromSessionStorage(
      PERSISTENCE_CONFIG.STORAGE_KEYS.AGENT_SELECTION_CONTEXT
    );
  }

  private static isExpired(agentSelection: AgentSelectionContext): boolean {
    if (!agentSelection.timestamp) {
      return true;
    }

    const now = Date.now();
    const age = now - agentSelection.timestamp;
    return age > PERSISTENCE_CONFIG.SESSION_TIMEOUT;
  }

  /**
   * Validates agent selection data structure
   */
  static validate(data: any): data is AgentSelectionContext {
    return (
      typeof data === 'object' &&
      data !== null &&
      (data.selectedAgentId === null || typeof data.selectedAgentId === 'string') &&
      typeof data.lastSelectedRoute === 'string' &&
      ['chat', 'agents', 'settings'].includes(data.lastSelectedRoute) &&
      typeof data.timestamp === 'number'
    );
  }

  /**
   * Safely loads and validates agent selection data
   */
  static loadSafe(): AgentSelectionContext {
    try {
      const loaded = this.load();
      if (this.validate(loaded)) {
        return loaded;
      }
      return PERSISTENCE_CONFIG.DEFAULTS.AGENT_SELECTION;
    } catch (error) {
      return PERSISTENCE_CONFIG.DEFAULTS.AGENT_SELECTION;
    }
  }
}

/**
 * State restoration utilities for page refreshes
 */
export class StateRestoration {
  /**
   * Restores all navigation state from storage
   */
  static restoreNavigationState() {
    return {
      menuCollapsed: MenuPersistence.load(),
      agentSelection: AgentSelectionPersistence.loadSafe(),
    };
  }

  /**
   * Clears all persisted navigation state
   */
  static clearAllState(): boolean {
    const menuCleared = MenuPersistence.clear();
    const agentSelectionCleared = AgentSelectionPersistence.clear();
    
    return menuCleared && agentSelectionCleared;
  }

  /**
   * Gets storage diagnostic information
   */
  static getStorageDiagnostics() {
    return {
      localStorage: {
        available: StorageManager.isLocalStorageAvailable(),
        menuCollapsed: StorageManager.isLocalStorageAvailable() 
          ? MenuPersistence.load() 
          : null,
      },
      sessionStorage: {
        available: StorageManager.isSessionStorageAvailable(),
        agentSelection: StorageManager.isSessionStorageAvailable() 
          ? AgentSelectionPersistence.loadSafe() 
          : null,
      },
      config: PERSISTENCE_CONFIG,
    };
  }

  /**
   * Handles storage quota exceeded errors
   */
  static handleStorageQuotaExceeded(storageType: 'localStorage' | 'sessionStorage') {
    
    if (storageType === 'localStorage') {
      // Clear non-essential localStorage items first
      try {
        // Only clear our own keys to avoid affecting other applications
        MenuPersistence.clear();
      } catch (error) {
        console.error('Failed to clear localStorage during quota cleanup:', error);
      }
    } else {
      // Clear sessionStorage items
      try {
        AgentSelectionPersistence.clear();
      } catch (error) {
        console.error('Failed to clear sessionStorage during quota cleanup:', error);
      }
    }
  }

  /**
   * Migrates old storage format to new format (for future use)
   */
  static migrateStorageFormat() {
    // This method can be used in the future if we need to migrate
    // from old storage formats to new ones
  }
}

/**
 * Utility for handling edge cases and fallbacks
 */
export class PersistenceErrorHandler {
  private static errorCounts = new Map<string, number>();
  private static readonly MAX_ERRORS = 5;

  static handleError(operation: string, error: Error): void {
    const count = this.errorCounts.get(operation) || 0;
    this.errorCounts.set(operation, count + 1);

    if (count < this.MAX_ERRORS) {
      // Navigation persistence error
    } else if (count === this.MAX_ERRORS) {
      console.error(`Too many errors in ${operation}, suppressing further warnings`);
    }
  }

  static resetErrorCount(operation: string): void {
    this.errorCounts.delete(operation);
  }

  static getErrorCounts(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }
}