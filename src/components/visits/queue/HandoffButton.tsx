"use client";
import React, { useState } from 'react';
import { useHandoff } from './useHandoff';
import { getNextStage, getStageLabel } from '@/lib/constants/stages';

interface HandoffButtonProps {
  visitId: string;
  currentStage: string;
  onHandoffSuccess?: () => void;
}

export default function HandoffButton({ visitId, currentStage, onHandoffSuccess }: HandoffButtonProps) {
  const { handoff, loading } = useHandoff();
  const [showConfirm, setShowConfirm] = useState(false);
  const [notes, setNotes] = useState('');

  const nextStage = getNextStage(currentStage);
  const nextStageLabel = nextStage ? getStageLabel(nextStage) : 'Complete';

  const handleHandoff = async () => {
    try {
      await handoff({
        visitId,
        notes: notes || undefined,
        onSuccess: () => {
          setShowConfirm(false);
          setNotes('');
          if (onHandoffSuccess) {
            onHandoffSuccess();
          }
        },
      });
    } catch (error) {
      console.error('Handoff failed:', error);
    }
  };

  if (!nextStage) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Transferring...
          </>
        ) : (
          <>
            <i className="ti ti-arrow-right me-1"></i>
            Transfer to {nextStageLabel}
          </>
        )}
      </button>

      {showConfirm && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transfer Patient to {nextStageLabel}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to transfer this patient to <strong>{nextStageLabel}</strong>?</p>
                <div className="mb-3">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes for the next stage..."
                    disabled={loading}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleHandoff}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Transferring...
                    </>
                  ) : (
                    'Confirm Transfer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
