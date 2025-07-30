/**
 * Browser navigation utilities for handling back/forward navigation
 * and ensuring proper navigation state management
 */

import { NavigationItemId } from './types';
import { NavigationUtils } from './navigation-utils';

/**
 * Browser navigation handler for managing navigation state
 * across browser back/forward actions
 */
export class BrowserNavigationHandler {
  private static listeners: Set<(itemId: NavigationItemId) => void> = new Set();
  private static isInitialized = false;

  /**
   * Initialize browser navigation handling
   * This should be called once in the app layout or root component
   */
  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', this.handlePopState);
    this.isInitialized = true;
  }

  /**
   * Cleanup browser navigation handling
   */
  static cleanup() {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('popstate', this.handlePopState);
    this.listeners.clear();
    this.isInitialized = false;
  }

  /**
   * Handle browser popstate events
   */
  private static handlePopState = (event: PopStateEvent) => {
    const currentPath = window.location.pathname;
    const activeItem = NavigationUtils.getActiveItemFromPath(currentPath);
    
    // Notify all listeners of the navigation change
    this.listeners.forEach(callback => callback(activeItem));
    

  };

  /**
   * Subscribe to browser navigation changes
   */
  static subscribe(callback: (itemId: NavigationItemId) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current navigation state from browser location
   */
  static getCurrentNavigationState(): NavigationItemId {
    if (typeof window === 'undefined') {
      return 'chat';
    }
    return NavigationUtils.getActiveItemFromPath(window.location.pathname);
  }

  /**
   * Check if browser supports navigation features
   */
  static isBrowserNavigationSupported(): boolean {
    return typeof window !== 'undefined' && 
           'history' in window && 
           'pushState' in window.history;
  }

  /**
   * Programmatically navigate (for special cases)
   * Note: Generally prefer Next.js router for navigation
   */
  static navigateTo(path: string, replace = false) {
    if (!this.isBrowserNavigationSupported()) {

      return;
    }

    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }

    // Trigger popstate manually for consistency
    this.handlePopState(new PopStateEvent('popstate'));
  }

  /**
   * Get browser navigation history length (if available)
   */
  static getHistoryLength(): number {
    if (typeof window === 'undefined' || !window.history) {
      return 0;
    }
    return window.history.length;
  }

  /**
   * Check if user can go back in history
   */
  static canGoBack(): boolean {
    return this.getHistoryLength() > 1;
  }
}

/**
 * React hook for browser navigation handling
 * This can be used in components that need to respond to browser navigation
 */
export function useBrowserNavigation() {
  const [currentItem, setCurrentItem] = React.useState<NavigationItemId>(() => 
    BrowserNavigationHandler.getCurrentNavigationState()
  );

  React.useEffect(() => {
    // Initialize browser navigation handling
    BrowserNavigationHandler.initialize();

    // Subscribe to navigation changes
    const unsubscribe = BrowserNavigationHandler.subscribe(setCurrentItem);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    currentItem,
    canGoBack: BrowserNavigationHandler.canGoBack(),
    historyLength: BrowserNavigationHandler.getHistoryLength(),
    isSupported: BrowserNavigationHandler.isBrowserNavigationSupported(),
  };
}

// Import React for the hook
import React from 'react';

/**
 * Navigation state validator for ensuring consistent navigation
 */
export class NavigationStateValidator {
  /**
   * Validate that the current URL matches expected navigation state
   */
  static validateCurrentState(): {
    isValid: boolean;
    expectedItem: NavigationItemId;
    actualPath: string;
  } {
    if (typeof window === 'undefined') {
      return {
        isValid: true,
        expectedItem: 'chat',
        actualPath: '',
      };
    }

    const actualPath = window.location.pathname;
    const expectedItem = NavigationUtils.getActiveItemFromPath(actualPath);
    const isValid = NavigationUtils.isValidRoute(actualPath);

    return {
      isValid,
      expectedItem,
      actualPath,
    };
  }

  /**
   * Ensure navigation state consistency
   */
  static ensureConsistency(): boolean {
    const validation = this.validateCurrentState();
    
    if (!validation.isValid) {

      // Could implement automatic correction here if needed
      return false;
    }

    return true;
  }
}