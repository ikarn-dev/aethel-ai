/**
 * Demo component to showcase navigation state persistence functionality
 * This component demonstrates all the persistence features implemented in task 8
 */

"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  useMenuCollapse, 
  useAgentSelection, 
  useNavigationPersistence,
  useNavigationState 
} from '@/lib/navigation-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Database, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Info,
  User,
  MessageCircle
} from 'lucide-react';

export default function NavigationPersistenceDemo() {
  const menuCollapse = useMenuCollapse();
  const agentSelection = useAgentSelection();
  const persistence = useNavigationPersistence();
  const navigationState = useNavigationState();
  const [demoAgentId, setDemoAgentId] = useState('demo-agent-123');

  const storageInfo = persistence.getStorageInfo();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Navigation State Persistence Demo
        </h1>
        <p className="text-gray-600">
          This demo showcases the navigation state persistence functionality implemented in Task 8
        </p>
      </div>

      {/* Current State Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Current Navigation State
          </CardTitle>
          <CardDescription>
            Real-time view of the current navigation state and persistence status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Menu State</h4>
              <div className="flex items-center gap-2">
                <Badge variant={menuCollapse.isCollapsed ? "destructive" : "default"}>
                  {menuCollapse.isCollapsed ? "Collapsed" : "Expanded"}
                </Badge>
                <Badge variant={menuCollapse.isInitialized ? "default" : "secondary"}>
                  {menuCollapse.isInitialized ? "Initialized" : "Loading"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Active Route</h4>
              <Badge variant="outline">
                {navigationState.activeItem}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Agent Selection</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={agentSelection.hasSelection ? "default" : "secondary"}>
                {agentSelection.hasSelection ? `Selected: ${agentSelection.selectedAgentId}` : "No Selection"}
              </Badge>
              <Badge variant="outline">
                Route: {agentSelection.lastSelectedRoute}
              </Badge>
              <Badge variant="outline">
                Updated: {new Date(agentSelection.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Collapse Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Menu Collapse Persistence (localStorage)
          </CardTitle>
          <CardDescription>
            Test menu collapse state persistence across page refreshes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => menuCollapse.setCollapsed(true)}
              variant={menuCollapse.isCollapsed ? "default" : "outline"}
              size="sm"
            >
              Collapse Menu
            </Button>
            <Button 
              onClick={() => menuCollapse.setCollapsed(false)}
              variant={!menuCollapse.isCollapsed ? "default" : "outline"}
              size="sm"
            >
              Expand Menu
            </Button>
            <Button 
              onClick={menuCollapse.toggle}
              variant="secondary"
              size="sm"
            >
              Toggle Menu
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>💡 Try collapsing/expanding the menu, then refresh the page to see persistence in action!</p>
          </div>
        </CardContent>
      </Card>

      {/* Agent Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Agent Selection Persistence (sessionStorage)
          </CardTitle>
          <CardDescription>
            Test agent selection persistence across navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => agentSelection.setSelectedAgent(demoAgentId, 'chat')}
              variant="outline"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Select for Chat
            </Button>
            <Button 
              onClick={() => agentSelection.setSelectedAgent(demoAgentId, 'agents')}
              variant="outline"
              size="sm"
            >
              <User className="w-4 h-4 mr-1" />
              Select for Agents
            </Button>
            <Button 
              onClick={() => agentSelection.clearAgentSelection()}
              variant="secondary"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Demo Agent ID:</label>
            <input
              type="text"
              value={demoAgentId}
              onChange={(e) => setDemoAgentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter agent ID"
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>💡 Select an agent, navigate between pages, and see how the selection persists!</p>
            <p>🔄 Agent selection persists within the browser session (until tab is closed)</p>
          </div>
        </CardContent>
      </Card>

      {/* Storage Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Storage Diagnostics
          </CardTitle>
          <CardDescription>
            View storage availability and current stored data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                localStorage
                {storageInfo.localStorage.available ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </h4>
              <div className="text-sm text-gray-600">
                <p>Available: {storageInfo.localStorage.available ? 'Yes' : 'No'}</p>
                {storageInfo.localStorage.menuCollapsed !== null && (
                  <p>Menu Collapsed: {storageInfo.localStorage.menuCollapsed ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                sessionStorage
                {storageInfo.sessionStorage.available ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </h4>
              <div className="text-sm text-gray-600">
                <p>Available: {storageInfo.sessionStorage.available ? 'Yes' : 'No'}</p>
                {storageInfo.sessionStorage.agentSelection && (
                  <div>
                    <p>Agent: {storageInfo.sessionStorage.agentSelection.selectedAgentId || 'None'}</p>
                    <p>Route: {storageInfo.sessionStorage.agentSelection.lastSelectedRoute}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => {
                const success = persistence.clearAllPersistedData();
                if (success) {
                  alert('All persisted data cleared! Refresh the page to see defaults.');
                } else {
                  alert('Failed to clear some data. Check console for details.');
                }
              }}
              variant="destructive"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All Data
            </Button>
            <Button 
              onClick={() => {
                persistence.restoreDefaultState();
                alert('Default state will be restored on next page refresh.');
              }}
              variant="outline"
              size="sm"
            >
              Restore Defaults
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>⚠️ Clearing data will reset all navigation preferences</p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Menu Collapse Persistence:</h4>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Toggle the menu collapse state using the buttons above</li>
              <li>Refresh the page (F5 or Ctrl+R)</li>
              <li>Notice the menu maintains its collapsed/expanded state</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Agent Selection Persistence:</h4>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Select an agent using the buttons above</li>
              <li>Navigate to different pages (Chat, Agents, etc.)</li>
              <li>Return to this page and see the selection is maintained</li>
              <li>Close and reopen the tab - selection will be cleared (session-based)</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Edge Case Testing:</h4>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Try using the app in private/incognito mode</li>
              <li>Clear browser storage manually and see graceful fallbacks</li>
              <li>Test with storage quota exceeded (fill up storage)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}