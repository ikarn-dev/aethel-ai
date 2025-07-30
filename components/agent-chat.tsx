"use client";

import { useState, useEffect, useRef } from "react";
import { Agent, ChatMessage, AgentStatus } from "../lib/types";
import { AgentService } from "../lib/agent-service";
import LoadingIcon from "./loading-icon";
import { ParallelChatHandler } from "../lib/parallel-chat-handler";
import { StatusUpdate } from "../lib/status-manager";

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

interface AgentChatProps {
  agent: Agent | null;
  onClose?: () => void;
}

export default function AgentChat({ agent, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [agentService] = useState(() => new AgentService());
  const [chatHandler] = useState(() => new ParallelChatHandler());

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history and status when agent changes
  useEffect(() => {
    if (agent) {
      loadChatHistory();
      updateAgentStatus();
    } else {
      setMessages([]);
      setAgentStatus(null);
    }
  }, [agent]);

  const loadChatHistory = async () => {
    if (!agent) return;

    const welcomeMessage: ChatMessage = {
      id: `welcome-${agent.id}`,
      content: `Hello! I'm ${agent.name}. ${agent.description}. How can I help you today?`,
      sender: "agent",
      timestamp: new Date(),
      agentId: agent.id,
    };

    setMessages([welcomeMessage]);
  };

  const updateAgentStatus = async () => {
    if (!agent) return;

    try {
      const result = await agentService.getAgentStatus(agent.id);
      if (result.success && result.data) {
        setAgentStatus(result.data);
      } else {
        setAgentStatus({
          id: agent.id,
          state: agent.state,
          lastUpdated: new Date().toISOString(),
          isHealthy: agent.state === 'RUNNING',
          errorMessage: result.error,
        });
      }
    } catch (error) {
      console.error('Failed to get agent status:', error);
      setAgentStatus({
        id: agent.id,
        state: agent.state,
        lastUpdated: new Date().toISOString(),
        isHealthy: false,
        errorMessage: 'Failed to check agent status',
      });
    }
  };

  const handleSendMessage = async () => {
    const messageContent = inputValue.trim();
    if (!messageContent || !agent || !isAgentReady()) return;

    // Add user message immediately
    const userMessageId = `${Date.now()}-user`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
      agentId: agent.id,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Start animation
    setIsAnimating(true);

    try {
      // Use parallel chat handler with real-time status updates
      const result = await chatHandler.sendMessage(
        agent.id,
        messageContent,
        agent,
        (statusUpdate: StatusUpdate) => {

          // Update animation text based on status
          const statusTexts: Record<string, string> = {
            'sending': 'Processing...',
            'processing': statusUpdate.message || 'Agent is thinking...',
            'complete': 'Response received!',
            'error': statusUpdate.message || 'Something went wrong...'
          };

          setCurrentStatus(statusTexts[statusUpdate.stage] || statusUpdate.message);
        }
      );

      if (result.success && result.response) {
        // Stop animation
        setIsAnimating(false);
        setCurrentStatus('');

        // Add agent response immediately
        const agentMessageId = `${Date.now()}-agent`;
        const agentMessage: ChatMessage = {
          id: agentMessageId,
          content: result.response,
          sender: "agent",
          timestamp: new Date(),
          agentId: agent.id,
        };

        setMessages(prev => {
          const newMessages = [...prev, agentMessage];
          return newMessages;
        });

      } else {
        throw new Error(result.error || 'No response received');
      }

    } catch (error) {
      console.error('❌ Chat error:', error);

      // Stop animation and show error
      setIsAnimating(false);
      setCurrentStatus('');

      // Add error message
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        sender: "agent",
        timestamp: new Date(),
        agentId: agent.id,
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const isAgentReady = () => {
    return agentStatus?.state === 'RUNNING' && agentStatus?.isHealthy;
  };

  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2 text-white">No Agent Selected</h3>
          <p>Select an agent from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Chat Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">K</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
              <p className="text-sm text-gray-400">{agent.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isAgentReady() ? (
              <div className="text-xs text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30">
                {agentStatus?.state === 'STOPPED' ? "Agent stopped" : "Agent not ready"}
              </div>
            ) : (
              <div className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                Ready to chat
              </div>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                title="Close chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`rounded-2xl px-6 py-4 ${message.sender === "user"
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
                </div>
              </div>
            </div>
          ))}

          {/* Processing Animation */}
          {isAnimating && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-teal-50/20 to-teal-100/20 border border-teal-200/30 rounded-3xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 relative flex-shrink-0 overflow-visible">
                    <LoadingIcon
                      size={52}
                      animate={true}
                      className="w-13 h-13 absolute -top-3.5 -left-3.5 text-teal-400"
                    />
                  </div>
                  <span className="text-teal-600 text-sm font-medium">
                    <RotatingText />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800/30 border-t border-slate-700/50 p-6">
        {/* Text Templates */}
        {showTemplates && (
          <div className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-sm backdrop-blur-sm">
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
        )}

        {/* Modern Input Container */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-4">
          <div className="flex items-end space-x-4">
            {/* Template Button */}
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex-shrink-0 p-3 text-gray-400 hover:text-teal-400 hover:bg-teal-900/30 rounded-xl transition-all"
              title="Show templates"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  isAgentReady() ? `Ask ${agent.name} anything...` :
                    agentStatus?.state === 'STOPPED' ? "Agent is stopped" :
                      "Agent not ready"
                }
                className={`w-full p-3 bg-transparent border-none resize-none focus:outline-none text-white placeholder-gray-400 ${!isAgentReady() ? "opacity-50" : ""
                  }`}
                rows={1}
                disabled={isLoading || !isAgentReady()}
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isAgentReady()}
              className="flex-shrink-0 p-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5">
                  <LoadingIcon size={20} animate={true} className="w-5 h-5" />
                </div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-700/30">
            <div className="flex items-center space-x-2">
              {!isAgentReady() ? (
                <div className="text-xs text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30">
                  {agentStatus?.state === 'STOPPED'
                    ? "Agent stopped"
                    : "Agent not ready"}
                </div>
              ) : (
                <div className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                  Ready to chat
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}