'use client';

import React, { useState, useEffect } from 'react';
import { AgentConfiguration, StrategyConfig, ToolConfig, TriggerConfig } from '@/lib/types';
import { validateAgentConfiguration, generateAgentId } from '@/lib/validation';
import { useAgentActions, useAgentLoading } from '@/lib/agent-store';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (agentId: string) => void;
  onShowToast?: (type: 'success' | 'error', title: string, message?: string) => void;
}

interface FormData {
  name: string;
  strategy: string;
  tools: string[];
  triggerType: string;
}

interface FormErrors {
  name?: string;
  strategy?: string;
  tools?: string;
  general?: string;
}

// Available strategies with their configurations
const AVAILABLE_STRATEGIES = [
  {
    value: 'plan_execute',
    label: 'Planning & Execution',
    description: 'For complex tasks requiring planning and step-by-step execution',
    parameters: {} // Empty config as per backend requirements
  }
];

// Available tools with their configurations
const AVAILABLE_TOOLS = [
  {
    value: 'llm_chat',
    label: 'LLM Chat',
    description: 'Large Language Model for conversational AI',
    config: {}
  }
];

export function CreateAgentModal({ isOpen, onClose, onSuccess, onShowToast }: CreateAgentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    strategy: 'plan_execute',
    tools: ['llm_chat'],
    triggerType: 'webhook'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Agent store hooks
  const { createAgent, fetchAgents } = useAgentActions();
  const isLoading = useAgentLoading();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        strategy: 'plan_execute',
        tools: ['llm_chat'],
        triggerType: 'webhook'
      });
      setErrors({});
    }
  }, [isOpen]);

  // Real-time validation
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      validateForm();
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Agent name must be 100 characters or less';
    }



    // Strategy validation
    if (!formData.strategy) {
      newErrors.strategy = 'Please select a strategy';
    }

    // Tools validation
    if (formData.tools.length === 0) {
      newErrors.tools = 'At least one tool is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToolToggle = (toolValue: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(toolValue)
        ? prev.tools.filter(t => t !== toolValue)
        : [...prev.tools, toolValue]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get selected strategy configuration
      const selectedStrategy = AVAILABLE_STRATEGIES.find(s => s.value === formData.strategy);
      if (!selectedStrategy) {
        throw new Error('Invalid strategy selected');
      }

      // Build strategy config
      const strategyConfig: StrategyConfig = {
        type: formData.strategy as 'support' | 'plan_execute' | 'custom',
        parameters: selectedStrategy.parameters // Use the strategy parameters from the selected strategy
      };

      // Build tool configs
      const toolConfigs: ToolConfig[] = formData.tools.map(toolValue => {
        const toolDef = AVAILABLE_TOOLS.find(t => t.value === toolValue);
        return {
          name: toolValue,
          config: toolDef?.config || {}
        };
      });

      // Build trigger config
      const triggerConfig: TriggerConfig = {
        type: formData.triggerType.toLowerCase(), // Ensure lowercase to match backend expectations
        params: {}
      };

      // Create agent configuration
      const agentConfig: AgentConfiguration = {
        name: formData.name.trim(),
        description: `AI agent with ${formData.tools.join(', ')} capabilities`,
        strategy: strategyConfig,
        tools: toolConfigs,
        trigger: triggerConfig
      };

      // Validate the complete configuration
      const validation = validateAgentConfiguration(agentConfig);
      if (!validation.isValid) {
        setErrors({ general: validation.errors.join(', ') });
        return;
      }

      // Create the agent using the store
      const createdAgent = await createAgent(agentConfig);
      
      if (createdAgent) {
        // Show success toast
        if (onShowToast) {
          onShowToast(
            'success',
            'Agent Created Successfully',
            `${createdAgent.name} has been created and is ready to use.`
          );
        }

        // Refresh the agents list
        await fetchAgents();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(createdAgent.id);
        }

        // Reset form and close modal
        setFormData({
          name: '',
          strategy: 'plan_execute',
          tools: ['llm_chat'],
          triggerType: 'webhook'
        });
        setErrors({});
        onClose();
      } else {
        // Error handled by the store, but show user-friendly message
        setErrors({
          general: 'Failed to create agent. Please check your configuration and try again.'
        });
        
        if (onShowToast) {
          onShowToast(
            'error',
            'Agent Creation Failed',
            'There was an error creating your agent. Please try again.'
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create agent';
      setErrors({ general: errorMessage });
      
      if (onShowToast) {
        onShowToast(
          'error',
          'Agent Creation Failed',
          errorMessage
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-teal-900/90 backdrop-blur-md border border-teal-400/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-400/20">
          <h2 className="text-xl font-semibold text-white">Create New Agent</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || isLoading}
            className="text-teal-300 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Agent Name */}
          <div>
            <label htmlFor="agent-name" className="block text-sm font-medium text-teal-200 mb-2">
              Agent Name *
            </label>
            <input
              id="agent-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 bg-teal-800/30 border rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.name ? 'border-red-400' : 'border-teal-400/30'
              }`}
              placeholder="Enter agent name"
              maxLength={100}
              disabled={isSubmitting || isLoading}
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
            <p className="text-teal-300/60 text-xs mt-1">{formData.name.length}/100 characters</p>
          </div>



          {/* Strategy Selection */}
          <div>
            <label htmlFor="agent-strategy" className="block text-sm font-medium text-teal-200 mb-2">
              Strategy *
            </label>
            <select
              id="agent-strategy"
              value={formData.strategy}
              onChange={(e) => handleInputChange('strategy', e.target.value)}
              className={`w-full px-3 py-2 bg-teal-800/30 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.strategy ? 'border-red-400' : 'border-teal-400/30'
              }`}
              disabled={isSubmitting || isLoading}
            >
              {AVAILABLE_STRATEGIES.map(strategy => (
                <option key={strategy.value} value={strategy.value} className="bg-teal-800">
                  {strategy.label}
                </option>
              ))}
            </select>
            {errors.strategy && (
              <p className="text-red-300 text-sm mt-1">{errors.strategy}</p>
            )}
            {/* Strategy Description */}
            {formData.strategy && (
              <p className="text-teal-300/70 text-sm mt-1">
                {AVAILABLE_STRATEGIES.find(s => s.value === formData.strategy)?.description}
              </p>
            )}
          </div>

          {/* Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-teal-200 mb-2">
              Tools * (Select at least one)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {AVAILABLE_TOOLS.map(tool => (
                <label
                  key={tool.value}
                  className="flex items-start space-x-3 p-3 bg-teal-800/20 rounded-lg hover:bg-teal-800/30 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.tools.includes(tool.value)}
                    onChange={() => handleToolToggle(tool.value)}
                    className="mt-1 w-4 h-4 text-teal-400 bg-teal-800/30 border-teal-400/30 rounded focus:ring-teal-400 focus:ring-2"
                    disabled={isSubmitting || isLoading}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{tool.label}</div>
                    <div className="text-teal-300/70 text-sm">{tool.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.tools && (
              <p className="text-red-300 text-sm mt-1">{errors.tools}</p>
            )}
            <p className="text-teal-300/60 text-xs mt-1">
              {formData.tools.length} tool{formData.tools.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Trigger Type - Hidden but functional (defaults to webhook) */}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-teal-400/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 text-teal-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(isSubmitting || isLoading) && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting || isLoading ? 'Creating...' : 'Create Agent'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}