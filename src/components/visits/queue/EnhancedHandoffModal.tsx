"use client";
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/services/api-client';
import { useHandoff } from './useHandoff';
import { getAllowedTransitions, getStageLabel } from '@/lib/constants/stages';
import { PatientVisit, Patient } from '@/types/emr';
import { formatDistanceToNow } from 'date-fns';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface EnhancedHandoffModalProps {
  visit: PatientVisit;
  currentStage: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EnhancedHandoffModal({ 
  visit, 
  currentStage,
  onSuccess, 
  onClose 
}: EnhancedHandoffModalProps) {
  const [step, setStep] = useState<'select' | 'confirm'>(visit.currentStage === 'returned_to_front_desk' ? 'select' : 'select');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(visit.assignedDoctor?._id || '');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notes, setNotes] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const { handoff, loading } = useHandoff();

  const allowedTransitions = getAllowedTransitions(currentStage);
  const patient = typeof visit.patient === 'string' ? null : visit.patient as Patient;

  useEffect(() => {
    if (currentStage === 'returned_to_front_desk' || selectedStage === 'doctor') {
      fetchDoctors();
    }
  }, [currentStage, selectedStage]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await apiClient.get<{ doctors: Doctor[] }>(
        '/api/doctors?limit=1000',
        { showErrorToast: true }
      );
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleStageSelect = (stage: string) => {
    setSelectedStage(stage);
    setStep('confirm');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedStage('');
  };

  const handleConfirm = async () => {
    if (!selectedStage) return;

    try {
      if ((currentStage === 'returned_to_front_desk' || selectedStage === 'doctor') && selectedDoctor && selectedDoctor !== visit.assignedDoctor?._id) {
        await apiClient.put(
          `/api/visits/${visit._id}`,
          { assignedDoctor: selectedDoctor },
          { showErrorToast: true }
        );
      }

      await handoff({
        visitId: visit._id!,
        currentStage,
        targetStage: selectedStage,
        notes: notes || undefined,
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    } catch (error) {
      console.error('Failed to handoff:', error);
    }
  };

  const getWaitingTime = () => {
    const clockInTime = visit.stages[currentStage as keyof typeof visit.stages]?.clockedInAt;
    if (!clockInTime) return 'N/A';
    try {
      return formatDistanceToNow(new Date(clockInTime), { addSuffix: false });
    } catch {
      return 'N/A';
    }
  };

  const getVitalsSummary = () => {
    if (!visit.stages.nurse?.vitalSigns) return null;
    const vitals = visit.stages.nurse.vitalSigns;
    return (
      <div className="alert alert-info mb-3">
        <h6 className="alert-heading mb-2">
          <i className="ti ti-heartbeat me-2"></i>
          Recent Vital Signs
        </h6>
        <div className="row g-2 small">
          {vitals.bloodPressure && (
            <div className="col-6">
              <strong>BP:</strong> {vitals.bloodPressure}
            </div>
          )}
          {vitals.temperature && (
            <div className="col-6">
              <strong>Temp:</strong> {vitals.temperature}°C
            </div>
          )}
          {vitals.pulse && (
            <div className="col-6">
              <strong>Pulse:</strong> {vitals.pulse} bpm
            </div>
          )}
          {vitals.weight && (
            <div className="col-6">
              <strong>Weight:</strong> {vitals.weight} kg
            </div>
          )}
        </div>
      </div>
    );
  };

  const selectedDoctorInfo = doctors.find(d => d._id === selectedDoctor);
  const isCompletingVisit = selectedStage === 'completed';

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-bottom" style={{ backgroundColor: '#003366', color: 'white' }}>
            <h5 className="modal-title d-flex align-items-center">
              <i className={`ti ${isCompletingVisit ? 'ti-check-circle' : 'ti-transfer'} me-2`}></i>
              {isCompletingVisit ? 'Complete Visit' : 'Transfer Patient'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body">
            {patient && (
              <div className="card bg-light mb-3">
                <div className="card-body py-2">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="mb-0" style={{ color: '#003366' }}>
                        {patient.firstName} {patient.lastName}
                      </h6>
                      <small className="text-muted">
                        Visit #{visit.visitNumber} • ID: {patient.patientId}
                      </small>
                    </div>
                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                      <span className="badge" style={{ backgroundColor: '#4A90E2', color: 'white' }}>
                        {getStageLabel(currentStage)}
                      </span>
                      <div className="small text-muted mt-1">
                        Waiting: {getWaitingTime()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'select' && (
              <div className="handoff-step-select">
                <h6 className="mb-3" style={{ color: '#003366' }}>
                  <i className="ti ti-arrow-right me-2"></i>
                  Select Transfer Destination
                </h6>

                <div className="list-group">
                  {allowedTransitions.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => handleStageSelect(stage)}
                      disabled={loading}
                      style={{ 
                        borderLeft: `4px solid ${stage === 'completed' ? '#09800F' : '#4A90E2'}`,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`ti ${stage === 'completed' ? 'ti-check-circle' : 'ti-arrow-right'} me-3 fs-5`} 
                           style={{ color: stage === 'completed' ? '#09800F' : '#4A90E2' }}></i>
                        <div>
                          <div className="fw-medium">
                            {stage === 'completed' ? 'Complete Visit' : `Transfer to ${getStageLabel(stage)}`}
                          </div>
                          <small className="text-muted">
                            {stage === 'completed' 
                              ? 'Mark this visit as complete' 
                              : `Send patient to ${getStageLabel(stage).toLowerCase()} queue`}
                          </small>
                        </div>
                      </div>
                      <i className="ti ti-chevron-right text-muted"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="handoff-step-confirm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0" style={{ color: '#003366' }}>
                    <i className="ti ti-clipboard-check me-2"></i>
                    Confirm Transfer Details
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    <i className="ti ti-arrow-left me-1"></i>
                    Back
                  </button>
                </div>

                <div className="alert mb-3" style={{ 
                  backgroundColor: isCompletingVisit ? '#E8F5E9' : '#E3F2FD',
                  borderLeft: `4px solid ${isCompletingVisit ? '#09800F' : '#003366'}`,
                  color: '#0F172A'
                }}>
                  <div className="d-flex align-items-center">
                    <i className={`ti ${isCompletingVisit ? 'ti-check-circle' : 'ti-arrow-right'} fs-4 me-3`} 
                       style={{ color: isCompletingVisit ? '#09800F' : '#003366' }}></i>
                    <div>
                      <strong>
                        {isCompletingVisit 
                          ? 'This visit will be marked as complete' 
                          : `Patient will be transferred to ${getStageLabel(selectedStage)}`}
                      </strong>
                      <div className="small mt-1">
                        Current stage: <span className="badge badge-soft-secondary">{getStageLabel(currentStage)}</span>
                        <i className="ti ti-arrow-right mx-2"></i>
                        Next: <span className={`badge ${isCompletingVisit ? 'badge-soft-success' : 'badge-soft-primary'}`}>
                          {isCompletingVisit ? 'Completed' : getStageLabel(selectedStage)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {getVitalsSummary()}

                {(currentStage === 'returned_to_front_desk' || selectedStage === 'doctor') && (
                  <div className="mb-3">
                    <label className="form-label">
                      Assigned Doctor {currentStage === 'returned_to_front_desk' && <span className="text-danger">*</span>}
                    </label>
                    <select
                      className="form-select"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      disabled={loadingDoctors || loading}
                    >
                      <option value="">-- Select a Doctor --</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </select>
                    {selectedDoctorInfo && (
                      <div className="mt-2 small" style={{ color: '#4A90E2' }}>
                        <i className="ti ti-info-circle me-1"></i>
                        Patient will be assigned to Dr. {selectedDoctorInfo.firstName} {selectedDoctorInfo.lastName}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    Handoff Notes {!isCompletingVisit && <span className="text-muted">(Optional)</span>}
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isCompletingVisit 
                        ? 'Add any closing notes or summary...' 
                        : `Add notes for ${getStageLabel(selectedStage).toLowerCase()} team...`
                    }
                    disabled={loading}
                  ></textarea>
                  <div className="form-text">
                    <i className="ti ti-info-circle me-1"></i>
                    These notes will be visible to the receiving department
                  </div>
                </div>

                <div className="border rounded p-3" style={{ backgroundColor: '#F8F9FA' }}>
                  <h6 className="small text-muted mb-2">Transfer Summary</h6>
                  <ul className="list-unstyled mb-0 small">
                    <li><strong>Patient:</strong> {patient?.firstName} {patient?.lastName}</li>
                    <li><strong>From:</strong> {getStageLabel(currentStage)}</li>
                    <li><strong>To:</strong> {isCompletingVisit ? 'Completed' : getStageLabel(selectedStage)}</li>
                    {selectedDoctorInfo && (
                      <li><strong>Doctor:</strong> Dr. {selectedDoctorInfo.firstName} {selectedDoctorInfo.lastName}</li>
                    )}
                    <li><strong>Time in current stage:</strong> {getWaitingTime()}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={step === 'confirm' ? handleBack : onClose}
              disabled={loading}
            >
              {step === 'confirm' ? (
                <>
                  <i className="ti ti-arrow-left me-1"></i>
                  Back
                </>
              ) : (
                'Cancel'
              )}
            </button>
            {step === 'confirm' && (
              <button
                type="button"
                className="btn"
                style={{ 
                  backgroundColor: isCompletingVisit ? '#09800F' : '#003366',
                  color: 'white'
                }}
                onClick={handleConfirm}
                disabled={loading || (currentStage === 'returned_to_front_desk' && !selectedDoctor)}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isCompletingVisit ? 'Completing...' : 'Transferring...'}
                  </>
                ) : (
                  <>
                    <i className={`ti ${isCompletingVisit ? 'ti-check' : 'ti-arrow-right'} me-1`}></i>
                    {isCompletingVisit ? 'Confirm Complete' : 'Confirm Transfer'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
