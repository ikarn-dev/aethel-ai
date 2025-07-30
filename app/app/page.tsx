"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AgentService } from "@/lib/agent-service";
import { Message } from "@/lib/types";

import PageRetryHandler from "@/components/page-retry-handler";
import LoadingIcon from "@/components/loading-icon";

// Rotating text component for AI thinking messages
function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const texts = [
    "AI is thinking...",
    "Processing your request...",
    "Analyzing information...",
    "Generating response...",
    "Almost ready...",
    "Working on it..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <span>{texts[currentIndex]}</span>;
}

interface LocalAgentStatus {
  id: string | null;
  state: "CREATED" | "RUNNING" | "STOPPED" | "ERROR";
  name: string;
}

export default function MainChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<LocalAgentStatus>({
    id: null,
    state: "STOPPED",
    name: "Aethel AI Agent"
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [agentService] = useState(() => new AgentService());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Text templates for quick input
  const textTemplates = [
    { icon: "💡", text: "Explain this concept to me", category: "Learning" },
    { icon: "🔍", text: "Help me research information about", category: "Research" },
    { icon: "✍️", text: "Write a summary of", category: "Writing" },
    { icon: "🤔", text: "What are the pros and cons of", category: "Analysis" },
    { icon: "📊", text: "Create a plan for", category: "Planning" },
    { icon: "🛠️", text: "How do I troubleshoot", category: "Problem Solving" },
    { icon: "📚", text: "Teach me about", category: "Education" },
    { icon: "💼", text: "Help me with my work on", category: "Professional" }
  ];

  // Initialize and check for selected agent from localStorage
  useEffect(() => {
    const selectedAgentData = localStorage.getItem('selectedChatAgent');

    if (selectedAgentData) {
      // If there's a selected agent, automatically load it
      selectAgent();
    } else {
      // Otherwise show welcome message and try to load an existing agent
      setMessages([{
        id: "welcome",
        content: "Welcome to AI Chat! Click 'New Chat' to start a conversation with your agents.",
        sender: "ai",
        timestamp: new Date(),
      }]);

      // Try to load an existing agent if available (for sidebar navigation)
      selectAgent();
    }
  }, []);

  // Listen for navigation changes to refresh agent status when navigating via sidebar
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && agentStatus.id) {
        // Page became visible and we have an agent, refresh its status
        refreshAgentStatus();
      }
    };

    const handleFocus = () => {
      if (agentStatus.id) {
        // Page got focus and we have an agent, refresh its status
        refreshAgentStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [agentStatus.id]);

  const refreshAgentStatus = async () => {
    if (!agentStatus.id) return;

    try {
      const statusResult = await agentService.getAgentStatus(agentStatus.id);

      if (statusResult.success && statusResult.data) {
        const newState = statusResult.data.state;

        // Update local state if it changed
        if (newState !== agentStatus.state) {
          setAgentStatus(prev => ({
            ...prev,
            state: newState as any
          }));

          // Update the agent service state as well
          const currentAgent = await agentService.getAgentById(agentStatus.id);
          if (currentAgent.success && currentAgent.data) {
            currentAgent.data.state = newState;
            agentService.setAgent(currentAgent.data);
          }

          // Update messages based on new state
          if (newState === 'RUNNING') {
            setMessages(prev => {
              // Only update if the last message isn't already a ready message
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.id !== 'ready') {
                return [...prev, {
                  id: "ready",
                  content: `Hello! I'm ${agentStatus.name}. What would you like to know?`,
                  sender: "ai",
                  timestamp: new Date(),
                }];
              }
              return prev;
            });
          }
        }
      } else {
        // Failed to refresh agent status
      }
    } catch (error) {
      console.error('Error refreshing agent status:', error);
    }
  };

  const startNewChat = async () => {
    // Reset the chat and select an agent (but don't start it)
    await selectAgent();
  };

  const selectAgent = async () => {
    setIsInitializing(true);
    agentService.reset(); // Reset any previous agent

    // Clear messages and show selecting message
    setMessages([{
      id: "selecting",
      content: "Looking for available agents...",
      sender: "ai",
      timestamp: new Date(),
    }]);

    try {
      // Get all existing agents
      const agentsResult = await agentService.getAgents();

      if (!agentsResult.success || !agentsResult.data || agentsResult.data.length === 0) {
        // No agents available
        setAgentStatus(prev => ({ ...prev, state: "ERROR" }));
        setMessages([{
          id: "no-agents",
          content: "No agents found. Please create an agent first from the Agents page to start chatting.",
          sender: "ai",
          timestamp: new Date(),
        }]);
        setIsInitializing(false);
        return;
      }

      // Check if a specific agent was selected from the agent card
      let targetAgent = null;
      const selectedAgentData = localStorage.getItem('selectedChatAgent');

      if (selectedAgentData) {
        try {
          const selectedAgent = JSON.parse(selectedAgentData);

          // Find the agent in the current agents list to get the latest state
          targetAgent = agentsResult.data.find(agent => agent.id === selectedAgent.id);
          if (targetAgent) {
            // Clear the localStorage after using it
            localStorage.removeItem('selectedChatAgent');
          }
        } catch (error) {
          console.error('Error parsing selected agent from localStorage:', error);
        }
      }

      // If no specific agent was selected or it doesn't exist, use the first available agent
      if (!targetAgent) {
        const availableAgents = agentsResult.data;
        targetAgent = availableAgents[0];
      }

      // Get fresh agent status from server to ensure we have the latest state
      const statusResult = await agentService.getAgentStatus(targetAgent.id);

      if (statusResult.success && statusResult.data) {
        // Use the fresh status from server
        targetAgent.state = statusResult.data.state;
      }

      // Set the agent in the service
      agentService.setAgent(targetAgent);

      setAgentStatus(prev => ({
        ...prev,
        id: targetAgent.id,
        state: targetAgent.state as any, // Use the actual agent state from server
        name: targetAgent.name
      }));

      // Show different messages based on agent state
      if (targetAgent.state === 'RUNNING') {
        setMessages([{
          id: "ready",
          content: `Hello! I'm ${targetAgent.name}. What would you like to know?`,
          sender: "ai",
          timestamp: new Date(),
        }]);
      } else {
        setMessages([{
          id: "selected",
          content: `Agent ${targetAgent.name} is ready. Click 'Start Agent' to begin chatting.`,
          sender: "ai",
          timestamp: new Date(),
        }]);
      }

    } catch (error) {
      console.error('Error selecting agent:', error);
      setAgentStatus(prev => ({ ...prev, state: "ERROR" }));
      setMessages([{
        id: "error",
        content: `Sorry, I encountered an error while looking for agents. Please make sure you have created at least one agent from the Agents page.`,
        sender: "ai",
        timestamp: new Date(),
      }]);
    }

    setIsInitializing(false);
  };

  const startAgent = async () => {
    if (!agentStatus.id) {
      await selectAgent();
      return;
    }

    setIsInitializing(true);

    // Clear previous messages and show starting message
    setMessages([{
      id: "starting",
      content: "Starting agent...",
      sender: "ai",
      timestamp: new Date(),
    }]);

    const startResult = await agentService.startAgent();
    if (startResult.success) {
      const agentInfo = agentService.getAgentInfo();
      setAgentStatus(prev => ({
        ...prev,
        state: agentInfo.state as any
      }));

      // Replace all messages with just the ready message
      setMessages([{
        id: "ready",
        content: `Hello! I'm ${agentStatus.name}. What would you like to know?`,
        sender: "ai",
        timestamp: new Date(),
      }]);
    } else {
      setAgentStatus(prev => ({ ...prev, state: "ERROR" }));
      setMessages([{
        id: "error",
        content: `Sorry, I'm having trouble starting the agent: ${startResult.error}. Please try again.`,
        sender: "ai",
        timestamp: new Date(),
      }]);
    }

    setIsInitializing(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || agentStatus.state !== "RUNNING") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Use the AgentService to send message and get response
      const result = await agentService.sendMessage(currentInput);

      if (result.success && result.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.error || "Sorry, I couldn't process your request. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateClick = (template: { text: string }) => {
    setInputValue(template.text);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  // Copy to clipboard function
  const handleCopyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Auto-expand textarea with scroll behavior
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';

      // Calculate new height with limits
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 40; // Minimum height
      const maxHeight = 120; // Maximum height (3 lines approximately)
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textareaRef.current.style.height = `${newHeight}px`;

      // If content exceeds max height, enable scrolling
      if (scrollHeight > maxHeight) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [inputValue]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <PageRetryHandler onRetry={selectAgent}>
      <div className="flex flex-col h-full bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">K</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
                <p className="text-sm text-gray-400">
                  Chat with {agentStatus.name || 'your agents'}.
                  <Link
                    href="/app/agents"
                    prefetch={true}
                    className="text-teal-400 hover:text-teal-300 ml-1 underline"
                  >
                    Manage agents
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${agentStatus.state === "RUNNING" ? "bg-green-900/30 text-green-400 border-green-500/30" :
                agentStatus.state === "ERROR" ? "bg-red-900/30 text-red-400 border-red-500/30" :
                  isInitializing ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30" : "bg-gray-800/50 text-gray-400 border-gray-600/30"
                }`}>
                <div className={`w-2 h-2 rounded-full ${agentStatus.state === "RUNNING" ? "bg-green-400" :
                  agentStatus.state === "ERROR" ? "bg-red-400" :
                    isInitializing ? "bg-yellow-400" : "bg-gray-400"
                  }`}></div>
                <span>
                  {agentStatus.state === "RUNNING" ? "Ready" :
                    agentStatus.state === "ERROR" ? "Error" :
                      isInitializing ? "Starting..." : "Offline"}
                </span>
              </div>
              {agentStatus.state === "ERROR" && (
                <button
                  onClick={startAgent}
                  className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs rounded-lg transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[70%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${message.sender === "user"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                      : "bg-slate-800/50 text-gray-100 border border-slate-700/50 backdrop-blur-sm"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-2">
                    <p className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {/* Copy button for AI messages - positioned below the message */}
                    {message.sender === "ai" && (
                      <button
                        onClick={() => handleCopyToClipboard(message.content, message.id)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-all"
                        title={copiedMessageId === message.id ? "Copied!" : "Copy to clipboard"}
                      >
                        {copiedMessageId === message.id ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 text-gray-100 border border-slate-700/50 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 relative flex-shrink-0 flex items-center justify-center">
                      <LoadingIcon
                        size={32}
                        animate={true}
                        className="w-8 h-8 text-teal-400"
                      />
                    </div>
                    <span className="text-gray-100 text-sm font-medium">
                      <RotatingText />
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Start Agent Button - Only show when needed */}
        {agentStatus.id && agentStatus.state !== "RUNNING" && (
          <div className="px-6 py-2">
            <div className="flex justify-center">
              <button
                onClick={startAgent}
                disabled={isInitializing}
                className="px-4 py-2 text-sm bg-green-900/30 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Agent
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6">
          {/* Text Templates */}
          {showTemplates && (
            <div className="mb-4 max-w-4xl mx-auto">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">Quick Templates</h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {textTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template)}
                      className="flex items-center space-x-3 p-3 text-left bg-slate-700/30 hover:bg-teal-900/30 border border-slate-600/30 hover:border-teal-500/30 rounded-lg transition-all group"
                    >
                      <span className="text-lg">{template.icon}</span>
                      <div>
                        <p className="text-sm text-gray-300 group-hover:text-teal-300 font-medium">{template.text}</p>
                        <p className="text-xs text-gray-500 group-hover:text-teal-400">{template.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Container - Match chat content width */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-2">
              <div className="flex items-center space-x-3">
                {/* New Chat Button with + icon */}
                <button
                  onClick={startNewChat}
                  disabled={isInitializing}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:bg-teal-900/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="New Chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                {/* Template Button */}
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:bg-teal-900/30 rounded-lg transition-all"
                  title="Show templates"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>

                {/* Input Field */}
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      agentStatus.state === "RUNNING" ? "Ask anything..." :
                        isInitializing ? "Agent is starting up..." :
                          agentStatus.state === "ERROR" ? "Agent error - please retry" :
                            agentStatus.id ? "Click 'Start Agent' to begin chatting" :
                              "Click the + button to start a new chat"
                    }
                    className={`w-full p-2 bg-transparent border-none resize-none focus:outline-none text-white placeholder-gray-400 ${agentStatus.state !== "RUNNING" ? "opacity-50" : ""
                      }`}
                    rows={1}
                    disabled={isLoading || agentStatus.state !== "RUNNING"}
                    style={{
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  />
                  <style jsx>{`
                    textarea::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </div>

                {/* Send Button - Arrow up in circle */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || agentStatus.state !== "RUNNING"}
                  className="flex-shrink-0 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="w-4 h-4">
                      <LoadingIcon size={16} animate={true} className="w-4 h-4 text-slate-900" />
                    </div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageRetryHandler>
  );
}