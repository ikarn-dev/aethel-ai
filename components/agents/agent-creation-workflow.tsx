'use client';

import React, { useState } from 'react';
import { CreateAgentModal } from './create-agent-modal';
import { ToastContainer, useToast } from '../ui/common/toast';

interface AgentCreationWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (agentId: string) => void;
}

export function AgentCreationWorkflow({ isOpen, onClose, onSuccess }: AgentCreationWorkflowProps) {
  const toast = useToast();

  const handleSuccess = (agentId: string) => {
    // Call the parent success callback if provided
    if (onSuccess) {
      onSuccess(agentId);
    }
  };

  const handleShowToast = (type: 'success' | 'error', title: string, message?: string) => {
    if (type === 'success') {
      toast.success(title, message, 4000);
    } else {
      toast.error(title, message, 5000);
    }
  };

  return (
    <>
      <CreateAgentModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleSuccess}
        onShowToast={handleShowToast}
      />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  );
}

// Hook for managing agent creation workflow
export function useAgentCreationWorkflow() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
    AgentCreationWorkflow: ({ onSuccess }: { onSuccess?: (agentId: string) => void }) => (
      <AgentCreationWorkflow
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={onSuccess}
      />
    )
  };
}