/**
 * Navigation utilities for handling routing and browser navigation
 */

import { NavigationItemId } from './types';

/**
 * Route configuration for the application
 */
export const ROUTES = {
  HOME: '/',
  CHAT: '/app',
  AGENTS: '/app/agents',
  SETTINGS: '/app/settings',
} as const;

/**
 * Navigation item configuration with proper route mapping
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'chat' as NavigationItemId,
    label: 'Chat',
    href: ROUTES.CHAT,
    icon: 'MessageCircle',
    isDisabled: false,
  },
  {
    id: 'agents' as NavigationItemId,
    label: 'Agents',
    href: ROUTES.AGENTS,
    icon: 'Users',
    isDisabled: false,
  },
  {
    id: 'settings' as NavigationItemId,
    label: 'Settings',
    href: ROUTES.SETTINGS,
    icon: 'Settings',
    isDisabled: true, // Future feature
  },
] as const;

/**
 * Utility functions for navigation
 */
export class NavigationUtils {
  /**
   * Determines the active navigation item based on current path
   */
  static getActiveItemFromPath(pathname: string | null): NavigationItemId {
    if (!pathname) return 'chat';
    
    if (pathname === ROUTES.CHAT) return 'chat';
    if (pathname.startsWith(ROUTES.AGENTS)) return 'agents';
    if (pathname.startsWith(ROUTES.SETTINGS)) return 'settings';
    
    return 'chat'; // default fallback
  }

  /**
   * Gets the route path for a navigation item
   */
  static getRouteForItem(itemId: NavigationItemId): string {
    const item = NAVIGATION_ITEMS.find(nav => nav.id === itemId);
    return item?.href || ROUTES.CHAT;
  }

  /**
   * Gets the display title for a navigation item
   */
  static getTitleForItem(itemId: NavigationItemId): string {
    const item = NAVIGATION_ITEMS.find(nav => nav.id === itemId);
    return item?.label || 'Chat';
  }

  /**
   * Checks if a route is an app route (requires authentication/layout)
   */
  static isAppRoute(pathname: string | null): boolean {
    return pathname?.startsWith('/app') ?? false;
  }

  /**
   * Checks if a navigation item is disabled
   */
  static isItemDisabled(itemId: NavigationItemId): boolean {
    const item = NAVIGATION_ITEMS.find(nav => nav.id === itemId);
    return item?.isDisabled ?? false;
  }

  /**
   * Gets all available navigation items
   */
  static getAllNavigationItems() {
    return NAVIGATION_ITEMS;
  }

  /**
   * Validates if a path matches expected route patterns
   */
  static isValidRoute(pathname: string): boolean {
    const validRoutes = [
      ROUTES.HOME,
      ROUTES.CHAT,
      ROUTES.AGENTS,
      ROUTES.SETTINGS,
    ];
    
    return validRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );
  }

  /**
   * Generates breadcrumb items for a given path
   */
  static generateBreadcrumbs(pathname: string | null): Array<{
    label: string;
    href: string;
    isActive: boolean;
  }> {
    if (!pathname) return [];

    const breadcrumbs = [
      { label: 'Home', href: ROUTES.HOME, isActive: false }
    ];

    if (pathname.startsWith('/app')) {
      if (pathname === ROUTES.CHAT) {
        breadcrumbs.push({ label: 'Chat', href: ROUTES.CHAT, isActive: true });
      } else if (pathname.startsWith(ROUTES.AGENTS)) {
        breadcrumbs.push({ label: 'Chat', href: ROUTES.CHAT, isActive: false });
        breadcrumbs.push({ label: 'Agents', href: ROUTES.AGENTS, isActive: true });
      } else if (pathname.startsWith(ROUTES.SETTINGS)) {
        breadcrumbs.push({ label: 'Chat', href: ROUTES.CHAT, isActive: false });
        breadcrumbs.push({ label: 'Settings', href: ROUTES.SETTINGS, isActive: true });
      }
    }

    return breadcrumbs;
  }

  /**
   * Handles browser back/forward navigation state
   * This is automatically handled by Next.js router, but this utility
   * can be used for custom navigation logic if needed
   */
  static handleBrowserNavigation(pathname: string | null, callback?: (itemId: NavigationItemId) => void) {
    const activeItem = this.getActiveItemFromPath(pathname);
    callback?.(activeItem);
    return activeItem;
  }

  /**
   * Prefetch configuration for navigation links
   */
  static getPrefetchConfig() {
    return {
      // Prefetch all main navigation routes for better performance
      routes: [ROUTES.CHAT, ROUTES.AGENTS],
      // Don't prefetch disabled routes
      excludeDisabled: true,
    };
  }
}

/**
 * Hook-like utility for navigation state (can be used in components)
 */
export class NavigationStateManager {
  private static listeners: Set<(state: NavigationItemId) => void> = new Set();

  /**
   * Subscribe to navigation state changes
   */
  static subscribe(callback: (state: NavigationItemId) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of navigation state change
   */
  static notify(newState: NavigationItemId) {
    this.listeners.forEach(callback => callback(newState));
  }

  /**
   * Get current navigation state from pathname
   */
  static getCurrentState(pathname: string | null): NavigationItemId {
    return NavigationUtils.getActiveItemFromPath(pathname);
  }
}

/**
 * Constants for route validation and navigation
 */
export const NAVIGATION_CONSTANTS = {
  ROUTES,
  NAVIGATION_ITEMS,
  DEFAULT_ROUTE: ROUTES.CHAT,
  HOME_ROUTE: ROUTES.HOME,
} as const;