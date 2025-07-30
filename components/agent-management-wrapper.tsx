'use client';

import React from 'react';
import { AgentContextProvider } from '@/lib/agent-context';
import { AgentStoreProvider } from '@/lib/agent-store';
import { AgentManagementPage } from './agent-management-page';

export function AgentManagementWrapper() {
  return (
    <AgentStoreProvider>
      <AgentContextProvider pollingInterval={5000}>
        <AgentManagementPage />
      </AgentContextProvider>
    </AgentStoreProvider>
  );
}