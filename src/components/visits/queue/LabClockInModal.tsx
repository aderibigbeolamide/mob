"use client";
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/services/api-client';
import { PatientVisit } from '@/types/emr';

interface LabClockInModalProps {
  visit: PatientVisit;
  patientInfo: {
    name: string;
    patientId: string;
  };
  onSuccess: () => void;
  show: boolean;
  onHide: () => void;
}

interface LabResult {
  testName: string;
  result: string;
  normalRange: string;
  remarks: string;
}

export default function LabClockInModal({
  visit,
  patientInfo,
  onSuccess,
  show,
  onHide,
}: LabClockInModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
  });
  const [labResults, setLabResults] = useState<LabResult[]>([
    { testName: '', result: '', normalRange: '', remarks: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const frontDeskNotes = visit.stages?.frontDesk?.notes;
  const vitalSigns = visit.stages?.nurse?.vitalSigns;
  const nurseNotes = visit.stages?.nurse?.notes;
  const doctorData = visit.stages?.doctor;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check if at least one lab result is filled
    const hasLabResults = labResults.some(result => 
      result.testName.trim() || result.result.trim()
    );

    if (!hasLabResults) {
      newErrors.general = 'Please add at least one lab test result';
    }

    // Validate each lab result that has data
    labResults.forEach((result, index) => {
      if (result.testName || result.result || result.normalRange || result.remarks) {
        if (!result.testName.trim()) {
          newErrors[`labResult_${index}_testName`] = 'Test name is required';
        }
        if (!result.result.trim()) {
          newErrors[`labResult_${index}_result`] = 'Result is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const filledLabResults = labResults.filter(
        r => r.testName.trim() && r.result.trim()
      );

      await apiClient.post(
        '/api/clocking/lab-clock-in',
        {
          visitId: visit._id,
          labResults: filledLabResults,
          notes: formData.notes || undefined,
        },
        { successMessage: 'Lab results recorded and clocked in successfully' }
      );

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error('Clock-in failed:', error);
      toast.error(error.message || 'Failed to record lab results and clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      notes: '',
    });
    setLabResults([
      { testName: '', result: '', normalRange: '', remarks: '' }
    ]);
    setErrors({});
    onHide();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLabResultChange = (index: number, field: keyof LabResult, value: string) => {
    const newLabResults = [...labResults];
    newLabResults[index] = { ...newLabResults[index], [field]: value };
    setLabResults(newLabResults);

    const errorKey = `labResult_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    // Clear general error when user starts entering data
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const addLabResult = () => {
    setLabResults([...labResults, { testName: '', result: '', normalRange: '', remarks: '' }]);
  };

  const removeLabResult = (index: number) => {
    if (labResults.length > 1) {
      const newLabResults = labResults.filter((_, i) => i !== index);
      setLabResults(newLabResults);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ti ti-test-pipe-2 me-2" style={{ color: '#6F42C1' }}></i>
          Clock In & Record Lab Results
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-2">
                  Patient: <span className="text-primary">{patientInfo.name}</span>
                </h6>
                <p className="text-muted mb-0">ID: {patientInfo.patientId}</p>
              </div>
              {visit.labOnly && (
                <span className="badge bg-info">
                  <i className="ti ti-flask me-1"></i>
                  Lab-Only Visit
                </span>
              )}
            </div>
            
            {visit.labOnly && visit.supervisingDoctor && (
              <div className="mt-2">
                <small className="text-muted">Supervising Doctor:</small>
                <p className="mb-0">
                  <strong>
                    Dr. {(visit.supervisingDoctor as any).firstName} {(visit.supervisingDoctor as any).lastName}
                  </strong>
                </p>
              </div>
            )}
          </div>

          <hr />

          {/* Patient Journey Information */}
          <div className="mb-4">
            <h6 className="mb-3 text-secondary">
              <i className="ti ti-timeline me-2"></i>
              Patient Journey Record
            </h6>

            {/* Front Desk Notes */}
            {frontDeskNotes && (
              <div className="mb-3">
                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <h6 className="mb-2 text-muted small">
                      <i className="ti ti-user-check me-1"></i>
                      Front Desk Notes
                    </h6>
                    <p className="mb-0 small">{frontDeskNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nurse Vital Signs */}
            {vitalSigns && (
              <div className="mb-3">
                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <h6 className="mb-2 text-muted small">
                      <i className="ti ti-stethoscope me-1"></i>
                      Nurse - Vital Signs
                    </h6>
                    <div className="row g-2">
                      {vitalSigns.bloodPressure && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">Blood Pressure</small>
                            <strong className="small">{vitalSigns.bloodPressure}</strong>
                          </div>
                        </div>
                      )}
                      {vitalSigns.temperature && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">Temperature</small>
                            <strong className="small">{vitalSigns.temperature}°C</strong>
                          </div>
                        </div>
                      )}
                      {vitalSigns.pulse && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">Pulse</small>
                            <strong className="small">{vitalSigns.pulse} bpm</strong>
                          </div>
                        </div>
                      )}
                      {vitalSigns.weight && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">Weight</small>
                            <strong className="small">{vitalSigns.weight} kg</strong>
                          </div>
                        </div>
                      )}
                      {vitalSigns.height && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">Height</small>
                            <strong className="small">{vitalSigns.height} cm</strong>
                          </div>
                        </div>
                      )}
                      {vitalSigns.bmi && (
                        <div className="col-md-3 col-6">
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block">BMI</small>
                            <strong className="small">{vitalSigns.bmi}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                    {nurseNotes && (
                      <div className="mt-2">
                        <small className="text-muted d-block">Notes:</small>
                        <p className="mb-0 small">{nurseNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Diagnosis and Orders */}
            {doctorData && (
              <div className="mb-3">
                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <h6 className="mb-2 text-muted small">
                      <i className="ti ti-user-star me-1"></i>
                      Doctor - Diagnosis & Lab Orders
                    </h6>
                    
                    {doctorData.diagnosis && (
                      <div className="mb-2">
                        <small className="text-muted d-block">Diagnosis:</small>
                        <p className="mb-0 small"><strong>{doctorData.diagnosis}</strong></p>
                      </div>
                    )}

                    {doctorData.labOrders && doctorData.labOrders.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted d-block">Lab Orders:</small>
                        <ul className="mb-0 ps-3 small">
                          {doctorData.labOrders.map((order, index) => (
                            <li key={index}><strong>{order}</strong></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {doctorData.notes && (
                      <div className="mt-2">
                        <small className="text-muted d-block">Notes:</small>
                        <p className="mb-0 small">{doctorData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr />

          {/* Lab Results Entry */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                <i className="ti ti-test-pipe me-2" style={{ color: '#6F42C1' }}></i>
                Lab Test Results
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addLabResult}
                disabled={loading}
              >
                <i className="ti ti-plus me-1"></i>
                Add Test
              </button>
            </div>

            {errors.general && (
              <div className="alert alert-danger py-2 small" role="alert">
                <i className="ti ti-alert-circle me-1"></i>
                {errors.general}
              </div>
            )}

            {labResults.map((result, index) => (
              <div key={index} className="card mb-3 border">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 small text-muted">Test #{index + 1}</h6>
                    {labResults.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => removeLabResult(index)}
                        disabled={loading}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small">
                        Test Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors[`labResult_${index}_testName`] ? 'is-invalid' : ''}`}
                        placeholder="e.g., Complete Blood Count (CBC)"
                        value={result.testName}
                        onChange={(e) => handleLabResultChange(index, 'testName', e.target.value)}
                        disabled={loading}
                      />
                      {errors[`labResult_${index}_testName`] && (
                        <div className="invalid-feedback">{errors[`labResult_${index}_testName`]}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small">
                        Result <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors[`labResult_${index}_result`] ? 'is-invalid' : ''}`}
                        placeholder="e.g., WBC: 8.5 x10^9/L"
                        value={result.result}
                        onChange={(e) => handleLabResultChange(index, 'result', e.target.value)}
                        disabled={loading}
                      />
                      {errors[`labResult_${index}_result`] && (
                        <div className="invalid-feedback">{errors[`labResult_${index}_result`]}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small">Normal Range</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 4-11 x10^9/L"
                        value={result.normalRange}
                        onChange={(e) => handleLabResultChange(index, 'normalRange', e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small">Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Within normal limits"
                        value={result.remarks}
                        onChange={(e) => handleLabResultChange(index, 'remarks', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Additional Notes</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter any additional lab notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={loading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Clocking In...
              </>
            ) : (
              <>
                <i className="ti ti-check me-2"></i>
                Clock In & Save Results
              </>
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
