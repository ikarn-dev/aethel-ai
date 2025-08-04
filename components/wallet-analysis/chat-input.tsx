'use client';

import React, { useState, useRef } from 'react';
import LoadingIcon from '../ui/common/loading-icon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isLoading, placeholder = "Ask anything..." }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    const messageContent = inputValue.trim();
    if (!messageContent || isLoading) return;

    onSendMessage(messageContent);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 bg-slate-800/50 rounded-2xl p-3 border border-slate-700/30">
          {/* Input Field */}
          <div className="flex-1">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-400 text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <LoadingIcon size={16} animate={true} className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}