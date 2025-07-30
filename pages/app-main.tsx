"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AgentService } from "../lib/agent-service";
import { Message } from "../lib/types";

interface LocalAgentStatus {
  id: string | null;
  state: "CREATED" | "RUNNING" | "STOPPED" | "ERROR";
  name: string;
}

export default function AppMain() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<LocalAgentStatus>({
    id: null,
    state: "STOPPED",
    name: "Aethel AI Agent"
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [agentService] = useState(() => new AgentService());

  // Initialize with welcome message instead of auto-starting
  useEffect(() => {
    setMessages([{
      id: "welcome",
      content: "Welcome to Aethel AI! Click 'New Chat' to start a conversation.",
      sender: "ai",
      timestamp: new Date(),
    }]);
    setIsInitializing(false);
  }, []);

  const startNewChat = () => {
    // Reset the chat without starting agent
    agentService.reset();
    setAgentStatus({
      id: null,
      state: "STOPPED",
      name: "Aethel AI Agent"
    });
    setMessages([{
      id: "welcome",
      content: "Welcome to Aethel AI! Click 'Create Agent' to start a conversation.",
      sender: "ai",
      timestamp: new Date(),
    }]);
  };

  const createNewAgent = async () => {
    setIsInitializing(true);
    agentService.reset(); // Reset any previous agent

    // Clear messages and show creating message
    setMessages([{
      id: "creating",
      content: "Creating a new agent...",
      sender: "ai",
      timestamp: new Date(),
    }]);

    // Create new agent using the service (but don't start it)
    const createResult = await agentService.createChatAgent();
    if (createResult.success && createResult.agent) {
      setAgentStatus(prev => ({
        ...prev,
        id: createResult.agent!.id,
        state: createResult.agent!.state as any
      }));

      setMessages([{
        id: "created",
        content: "Agent created successfully! Click 'Start Agent' to begin chatting.",
        sender: "ai",
        timestamp: new Date(),
      }]);
    } else {
      setAgentStatus(prev => ({ ...prev, state: "ERROR" }));
      setMessages([{
        id: "error",
        content: `Sorry, I couldn't create the agent: ${createResult.error}. Please try again.`,
        sender: "ai",
        timestamp: new Date(),
      }]);
    }

    setIsInitializing(false);
  };

  const startAgent = async () => {
    if (!agentStatus.id) {
      await createNewAgent();
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
        content: "Hello! I'm Aethel AI. What would you like to know?",
        sender: "ai",
        timestamp: new Date(),
      }]);
    } else {
      setAgentStatus(prev => ({ ...prev, state: "ERROR" }));
      setMessages([{
        id: "error",
        content: `Sorry, I'm having trouble starting up: ${startResult.error}. Please try again.`,
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" prefetch={true} className="text-xl font-bold text-gray-800">
            Aethel AI
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={startNewChat}
              disabled={isInitializing}
              className="w-full text-left px-3 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              New Chat
            </button>
            {!agentStatus.id && (
              <button
                onClick={createNewAgent}
                disabled={isInitializing}
                className="w-full text-left px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Agent
              </button>
            )}
            {agentStatus.id && agentStatus.state !== "RUNNING" && (
              <button
                onClick={startAgent}
                disabled={isInitializing}
                className="w-full text-left px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Agent
              </button>
            )}
            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              History
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${agentStatus.state === "RUNNING" ? "bg-green-500" :
                agentStatus.state === "ERROR" ? "bg-red-500" :
                  isInitializing ? "bg-yellow-500" : "bg-gray-400"
                }`}></div>
              <span>
                {agentStatus.state === "RUNNING" ? "Agent Ready" :
                  agentStatus.state === "ERROR" ? "Agent Error" :
                    isInitializing ? "Initializing..." : "Disconnected"}
              </span>
            </div>
            {agentStatus.id && (
              <div className="text-xs text-gray-400 mt-1">
                ID: {agentStatus.id.slice(-8)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${agentStatus.state === "RUNNING" ? "bg-green-100 text-green-700" :
                agentStatus.state === "ERROR" ? "bg-red-100 text-red-700" :
                  isInitializing ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                }`}>
                <div className={`w-2 h-2 rounded-full ${agentStatus.state === "RUNNING" ? "bg-green-500" :
                  agentStatus.state === "ERROR" ? "bg-red-500" :
                    isInitializing ? "bg-yellow-500" : "bg-gray-400"
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
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${message.sender === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
                  }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  agentStatus.state === "RUNNING" ? "Type your message here..." :
                    isInitializing ? "Agent is starting up..." :
                      agentStatus.state === "ERROR" ? "Agent error - please retry" :
                        agentStatus.id ? "Click 'Start Agent' to begin chatting" :
                        "Click 'Create Agent' to create an agent"
                }
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent ${agentStatus.state === "RUNNING"
                  ? "border-gray-300 focus:ring-purple-500"
                  : "border-gray-200 bg-gray-50"
                  }`}
                rows={3}
                disabled={isLoading || agentStatus.state !== "RUNNING"}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || agentStatus.state !== "RUNNING"}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Send"}
            </button>
          </div>
          {agentStatus.state !== "RUNNING" && !isInitializing && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              {agentStatus.state === "ERROR"
                ? "Agent encountered an error. Click 'Retry' to restart."
                : "Waiting for agent to be ready..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 