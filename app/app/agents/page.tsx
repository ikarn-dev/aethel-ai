import { Metadata } from 'next';
import { AgentManagementWrapper } from '../../../components/agent-management-wrapper';

export const metadata: Metadata = {
  title: 'Agents - Agent Management',
  description: 'Manage your AI agents, create new agents, and monitor their status in real-time.',
  keywords: ['agents', 'AI', 'management', 'chat', 'automation'],
  openGraph: {
    title: 'Agents - Agent Management',
    description: 'Manage your AI agents, create new agents, and monitor their status in real-time.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Agents - Agent Management',
    description: 'Manage your AI agents, create new agents, and monitor their status in real-time.',
  },
};

export default function AgentsPage() {
  return <AgentManagementWrapper />;
}