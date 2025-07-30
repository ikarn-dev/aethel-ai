"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationState, NavigationItemId } from './types';
import { 
  MenuPersistence, 
  AgentSelectionPersistence, 
  StateRestoration,
  PersistenceErrorHandler 
} from './navigation-persistence';

// Agent selection context interface
export interface AgentSelectionContext {
  selectedAgentId: string | null;
  lastSelectedRoute: NavigationItemId;
  timestamp: number;
}

// Navigation context interface
export interface NavigationContextType {
  navigationState: NavigationState;
  agentSelection: AgentSelectionContext;
  setMenuCollapsed: (collapsed: boolean) => void;
  toggleMenuCollapsed: () => void;
  setActiveItem: (item: NavigationItemId) => void;
  setSelectedAgent: (agentId: string | null, route?: NavigationItemId) => void;
  getSelectedAgentForRoute: (route: NavigationItemId) => string | null;
  clearAgentSelection: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [agentSelection, setAgentSelection] = useState<AgentSelectionContext>({
    selectedAgentId: null,
    lastSelectedRoute: 'chat',
    timestamp: Date.now(),
  });

  // Load state from storage on mount
  useEffect(() => {
    try {
      const restoredState = StateRestoration.restoreNavigationState();
      setIsMenuCollapsed(restoredState.menuCollapsed);
      setAgentSelection(restoredState.agentSelection);
      setIsInitialized(true);
    } catch (error) {
      PersistenceErrorHandler.handleError('state-restoration', error as Error);
      // Use defaults if restoration fails
      setIsInitialized(true);
    }
  }, []);

  // Save collapsed state to localStorage when it changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        MenuPersistence.save(isMenuCollapsed);
      } catch (error) {
        PersistenceErrorHandler.handleError('menu-persistence', error as Error);
      }
    }
  }, [isMenuCollapsed, isInitialized]);

  // Save agent selection to sessionStorage when it changes
  useEffect(() => {
    try {
      AgentSelectionPersistence.save(agentSelection);
    } catch (error) {
      PersistenceErrorHandler.handleError('agent-selection-persistence', error as Error);
    }
  }, [agentSelection]);

  // Determine active item based on current path
  const getActiveItem = (currentPath: string | null): NavigationItemId => {
    if (!currentPath) return 'chat'; // default when pathname is null
    if (currentPath === '/app') return 'chat';
    if (currentPath.startsWith('/app/agents')) return 'agents';
    if (currentPath.startsWith('/app/settings')) return 'settings';
    return 'chat'; // default
  };

  const navigationState: NavigationState = {
    currentPath: pathname,
    isMenuCollapsed,
    activeItem: getActiveItem(pathname),
    isInitialized,
  };

  const setMenuCollapsed = (collapsed: boolean) => {
    setIsMenuCollapsed(collapsed);
  };

  const toggleMenuCollapsed = () => {
    setIsMenuCollapsed(prev => !prev);
  };

  const setActiveItem = (_item: NavigationItemId) => {
    // This is primarily for manual override, as activeItem is usually derived from pathname
    // Could be useful for programmatic navigation or special cases
    // Currently not implemented as activeItem is automatically derived from pathname
  };

  // Agent selection methods
  const setSelectedAgent = (agentId: string | null, route?: NavigationItemId) => {
    const currentRoute = route || getActiveItem(pathname);
    setAgentSelection({
      selectedAgentId: agentId,
      lastSelectedRoute: currentRoute,
      timestamp: Date.now(),
    });
  };

  const getSelectedAgentForRoute = (route: NavigationItemId): string | null => {
    // Return the selected agent if it was selected for this route or if it's the last selected route
    if (agentSelection.lastSelectedRoute === route || route === 'chat') {
      return agentSelection.selectedAgentId;
    }
    return null;
  };

  const clearAgentSelection = () => {
    setAgentSelection({
      selectedAgentId: null,
      lastSelectedRoute: 'chat',
      timestamp: Date.now(),
    });
  };

  const contextValue: NavigationContextType = {
    navigationState,
    agentSelection,
    setMenuCollapsed,
    toggleMenuCollapsed,
    setActiveItem,
    setSelectedAgent,
    getSelectedAgentForRoute,
    clearAgentSelection,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Custom hook for navigation state access
export function useNavigationState() {
  const { navigationState } = useNavigation();
  return navigationState;
}

// Custom hook for menu collapse functionality
export function useMenuCollapse() {
  const { navigationState, setMenuCollapsed, toggleMenuCollapsed } = useNavigation();
  return {
    isCollapsed: navigationState.isMenuCollapsed,
    setCollapsed: setMenuCollapsed,
    toggle: toggleMenuCollapsed,
    isInitialized: navigationState.isInitialized,
  };
}

// Custom hook for active navigation item tracking
export function useActiveNavigation() {
  const { navigationState } = useNavigation();
  
  const isActive = (itemId: NavigationItemId): boolean => {
    return navigationState.activeItem === itemId;
  };

  const getActiveItem = (): NavigationItemId => {
    return navigationState.activeItem;
  };

  return {
    activeItem: navigationState.activeItem,
    isActive,
    getActiveItem,
    currentPath: navigationState.currentPath,
  };
}

// Custom hook for agent selection functionality
export function useAgentSelection() {
  const { agentSelection, setSelectedAgent, getSelectedAgentForRoute, clearAgentSelection } = useNavigation();
  
  return {
    selectedAgentId: agentSelection.selectedAgentId,
    lastSelectedRoute: agentSelection.lastSelectedRoute,
    timestamp: agentSelection.timestamp,
    setSelectedAgent,
    getSelectedAgentForRoute,
    clearAgentSelection,
    hasSelection: agentSelection.selectedAgentId !== null,
  };
}

// Custom hook for navigation state persistence
export function useNavigationPersistence() {
  const { navigationState, agentSelection } = useNavigation();
  
  const getStorageInfo = () => {
    return StateRestoration.getStorageDiagnostics();
  };

  const clearAllPersistedData = () => {
    try {
      return StateRestoration.clearAllState();
    } catch (error) {
      PersistenceErrorHandler.handleError('clear-all-state', error as Error);
      return false;
    }
  };

  const restoreDefaultState = () => {
    clearAllPersistedData();
    // The state will be restored to defaults on next page refresh
  };

  return {
    getStorageInfo,
    clearAllPersistedData,
    restoreDefaultState,
    isInitialized: navigationState.isInitialized,
  };
}

// Custom hook for navigation utilities
export function useNavigationUtils() {
  const { navigationState } = useNavigation();
  
  const isAppRoute = (path: string | null): boolean => {
    return path?.startsWith('/app') ?? false;
  };

  const getRouteTitle = (itemId: NavigationItemId): string => {
    const titles: Record<NavigationItemId, string> = {
      chat: 'Chat',
      agents: 'Agents',
      settings: 'Settings',
    };
    return titles[itemId] || 'Chat';
  };

  const getRoutePath = (itemId: NavigationItemId): string => {
    const paths: Record<NavigationItemId, string> = {
      chat: '/app',
      agents: '/app/agents',
      settings: '/app/settings',
    };
    return paths[itemId] || '/app';
  };

  return {
    isAppRoute: isAppRoute(navigationState.currentPath),
    getRouteTitle,
    getRoutePath,
    currentPath: navigationState.currentPath,
    isInitialized: navigationState.isInitialized,
  };
}