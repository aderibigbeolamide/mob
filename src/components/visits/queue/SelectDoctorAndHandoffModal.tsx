"use client";
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/services/api-client';
import { useHandoff } from './useHandoff';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SelectDoctorAndHandoffModalProps {
  visitId: string;
  currentDoctor?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | null;
  onSuccess: () => void;
  onClose: () => void;
}

export default function SelectDoctorAndHandoffModal({ 
  visitId, 
  currentDoctor,
  onSuccess, 
  onClose 
}: SelectDoctorAndHandoffModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState(currentDoctor?._id || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { handoff, loading: handoffLoading } = useHandoff();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ doctors: Doctor[] }>(
        '/api/doctors?limit=1000',
        { showErrorToast: true }
      );
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      return;
    }

    try {
      // First update the assigned doctor if changed
      if (selectedDoctor !== currentDoctor?._id) {
        await apiClient.put(
          `/api/visits/${visitId}`,
          { assignedDoctor: selectedDoctor },
          { showErrorToast: true }
        );
      }

      // Then handoff to doctor stage
      await handoff({
        visitId,
        currentStage: 'returned_to_front_desk',
        targetStage: 'doctor',
        notes: notes || undefined,
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    } catch (error) {
      console.error('Failed to assign doctor and handoff:', error);
    }
  };

  const selectedDoctorInfo = doctors.find(d => d._id === selectedDoctor);

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="ti ti-user-plus me-2"></i>
              Select Doctor & Handoff
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={handoffLoading}
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">
              Select a doctor to assign and transfer this patient to the doctor's queue.
            </p>
            
            <div className="mb-3">
              <label className="form-label">
                Select Doctor <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={loading || handoffLoading}
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctorInfo && (
              <div className="alert alert-info">
                <i className="ti ti-info-circle me-2"></i>
                Patient will be transferred to <strong>Dr. {selectedDoctorInfo.firstName} {selectedDoctorInfo.lastName}</strong>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="form-control"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes for the doctor..."
                disabled={handoffLoading}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={handoffLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedDoctor || handoffLoading || loading}
            >
              {handoffLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="ti ti-user-check me-1"></i>
                  Assign & Handoff to Doctor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
