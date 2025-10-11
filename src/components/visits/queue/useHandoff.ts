import { useState } from 'react';
import { apiClient } from '@/lib/services/api-client';
import { toast } from 'react-toastify';
import { emitHandoffEvent } from '@/lib/utils/queue-events';

interface HandoffOptions {
  visitId: string;
  currentStage?: string;
  targetStage?: string;
  notes?: string;
  nextAction?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useHandoff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handoff = async (options: HandoffOptions) => {
    const { visitId, currentStage, targetStage, notes, nextAction, onSuccess, onError } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(
        '/api/clocking/handoff',
        {
          visitId,
          targetStage,
          notes,
          nextAction,
        },
        {
          successMessage: 'Patient transferred successfully',
          showErrorToast: true,
        }
      );

      if (currentStage && targetStage) {
        emitHandoffEvent(visitId, currentStage, targetStage);
      }

      if (onSuccess) {
        onSuccess();
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to transfer patient';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handoff,
    loading,
    error,
  };
}
