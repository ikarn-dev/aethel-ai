"use client";

import { StatCard, ActionCard, StatusCard, ProgressCard, MetricCard } from './ui';

export default function DashboardSection() {
  return (
    <div className="py-20 px-6 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI Dashboard Overview
          </h2>
          <p className="text-xl text-teal-200/80 max-w-3xl mx-auto">
            Monitor your AI assistant&apos;s performance and manage your workflow with real-time insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Row */}
          <StatCard
            title="Active Sessions"
            value="24"
            subtitle="↗ 12% from last hour"
            trend="up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          
          <StatCard
            title="Response Time"
            value="0.3s"
            subtitle="Average response"
            trend="neutral"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <ProgressCard
            title="Processing Speed"
            value={85}
            unit="%"
            description="Fast performance"
            color="teal"
          />

          <ProgressCard
            title="Memory Usage"
            value={68}
            unit="%"
            description="Optimal usage"
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Cards */}
          <div className="space-y-4">
            <StatusCard
              title="AI Agent"
              status="ready"
              description="Ready to assist"
            />
            
            <StatusCard
              title="AI Assistant"
              status="online"
              description="Ready to help"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
            
            <ActionCard
              title="New Chat"
              description="Start a conversation"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              onClick={() => console.log('New Chat clicked')}
            />
            
            <ActionCard
              title="Chat History"
              description="View past conversations"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              onClick={() => console.log('Chat History clicked')}
            />
            
            <ActionCard
              title="Settings"
              description="Configure preferences"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              onClick={() => console.log('Settings clicked')}
            />
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">Recent Chats</h3>
            
            <MetricCard
              title="Activity Summary"
              metrics={[
                { label: "Business Analysis", value: "2 hours ago", color: "text-teal-300" },
                { label: "Code Review", value: "Yesterday", color: "text-teal-300" },
                { label: "Content Strategy", value: "3 days ago", color: "text-teal-300" }
              ]}
            />
          </div>
        </div>

        {/* AI Suggestions Section */}
        <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Try asking me about:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title="How can AI improve my business workflow?"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              onClick={() => console.log('Business workflow clicked')}
            />
            
            <ActionCard
              title="Analyze my data and provide insights"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              onClick={() => console.log('Data analysis clicked')}
            />
            
            <ActionCard
              title="Help me write and debug code"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              onClick={() => console.log('Code help clicked')}
            />
            
            <ActionCard
              title="Create content and copywriting"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
              onClick={() => console.log('Content creation clicked')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}