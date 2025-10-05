"use client";
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/services/api-client';

interface HandoffButtonProps {
  visitId: string;
  currentStage: string;
  patientName: string;
  onSuccess?: () => void;
  variant?: 'primary' | 'success' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STAGE_OPTIONS: Record<string, { label: string; nextStages: string[] }> = {
  'front_desk': { 
    label: 'Front Desk', 
    nextStages: ['nurse'] 
  },
  'nurse': { 
    label: 'Nurse', 
    nextStages: ['doctor'] 
  },
  'doctor': { 
    label: 'Doctor', 
    nextStages: ['lab', 'pharmacy', 'billing'] 
  },
  'lab': { 
    label: 'Lab', 
    nextStages: ['pharmacy', 'billing'] 
  },
  'pharmacy': { 
    label: 'Pharmacy', 
    nextStages: ['billing'] 
  },
  'billing': { 
    label: 'Billing', 
    nextStages: ['returned_to_front_desk'] 
  }
};

const STAGE_LABELS: Record<string, string> = {
  'nurse': 'Nurse',
  'doctor': 'Doctor',
  'lab': 'Lab',
  'pharmacy': 'Pharmacy',
  'billing': 'Billing',
  'returned_to_front_desk': 'Returned to Front Desk'
};

export default function HandoffButton({
  visitId,
  currentStage,
  patientName,
  onSuccess,
  variant = 'primary',
  size = 'md',
  className = ''
}: HandoffButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [targetStage, setTargetStage] = useState('');

  const stageInfo = STAGE_OPTIONS[currentStage];
  const availableNextStages = stageInfo?.nextStages || [];

  const handleOpen = () => {
    setShowModal(true);
    setTargetStage(availableNextStages[0] || '');
  };

  const handleClose = () => {
    setShowModal(false);
    setNotes('');
    setNextAction('');
    setTargetStage('');
  };

  const handleHandoff = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        '/api/clocking/handoff',
        {
          visitId,
          targetStage: targetStage || undefined,
          notes,
          nextAction
        },
        { successMessage: `Patient successfully handed off to ${STAGE_LABELS[targetStage] || 'next stage'}` }
      );

      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Handoff failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (availableNextStages.length === 1) {
      return `Send to ${STAGE_LABELS[availableNextStages[0]]}`;
    }
    return 'Hand Off Patient';
  };

  const getButtonIcon = () => {
    switch (currentStage) {
      case 'front_desk':
        return 'ti-arrow-right';
      case 'nurse':
        return 'ti-stethoscope';
      case 'doctor':
        return 'ti-arrow-forward';
      case 'lab':
        return 'ti-test-pipe';
      case 'pharmacy':
        return 'ti-pill';
      case 'billing':
        return 'ti-receipt';
      default:
        return 'ti-arrow-right';
    }
  };

  if (!stageInfo || availableNextStages.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''} ${className}`}
      >
        <i className={`ti ${getButtonIcon()} me-2`}></i>
        {getButtonLabel()}
      </button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Hand Off Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6 className="mb-2">Patient: <span className="text-primary">{patientName}</span></h6>
            <p className="text-muted mb-0">
              Current Stage: <span className="badge badge-soft-info">{stageInfo.label}</span>
            </p>
          </div>

          {availableNextStages.length > 1 && (
            <div className="mb-3">
              <label className="form-label">Send To <span className="text-danger">*</span></label>
              <select
                className="form-select"
                value={targetStage}
                onChange={(e) => setTargetStage(e.target.value)}
                required
              >
                {availableNextStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
              <small className="text-muted">
                Choose where to send the patient next
              </small>
            </div>
          )}

          {availableNextStages.length === 1 && (
            <div className="mb-3">
              <label className="form-label">Next Stage</label>
              <div className="alert alert-info mb-0">
                <i className="ti ti-info-circle me-2"></i>
                Patient will be sent to <strong>{STAGE_LABELS[availableNextStages[0]]}</strong>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes for the next department..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Next Action Required</label>
            <input
              type="text"
              className="form-control"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g., Check blood pressure, Review test results"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClose}
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
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Handing Off...
              </>
            ) : (
              <>
                <i className="ti ti-check me-2"></i>
                Confirm Handoff
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
