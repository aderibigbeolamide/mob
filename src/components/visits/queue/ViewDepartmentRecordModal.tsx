"use client";
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { apiClient } from '@/lib/services/api-client';
import { formatDistanceToNow, format } from 'date-fns';

interface ViewDepartmentRecordModalProps {
  visitId: string;
  patientInfo: {
    name: string;
    patientId: string;
  };
  show: boolean;
  onHide: () => void;
}

interface StaffInfo {
  _id: string;
  firstName: string;
  lastName: string;
}

interface VitalSigns {
  bloodPressure?: string;
  temperature?: number;
  pulse?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: number;
}

interface Prescription {
  _id: string;
  prescriptionNumber: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  status: string;
  doctor: StaffInfo;
  dispensedBy?: StaffInfo;
  dispensedAt?: Date;
  createdAt: Date;
}

interface LabTest {
  _id: string;
  testNumber: string;
  testName: string;
  status: string;
  result?: {
    value: string;
    unit: string;
    normalRange?: string;
    interpretation?: string;
    performedBy?: StaffInfo;
    performedAt?: Date;
  };
  doctor: StaffInfo;
  createdAt: Date;
}

interface StageData {
  clockedInBy?: StaffInfo;
  clockedInAt?: Date;
  clockedOutBy?: StaffInfo;
  clockedOutAt?: Date;
  notes?: string;
  vitalSigns?: VitalSigns;
  diagnosis?: string;
  nextAction?: string;
}

interface VisitData {
  _id: string;
  visitNumber: string;
  stages: {
    frontDesk?: StageData;
    nurse?: StageData;
    doctor?: StageData;
    lab?: StageData;
    pharmacy?: StageData;
    billing?: StageData;
  };
}

export default function ViewDepartmentRecordModal({
  visitId,
  patientInfo,
  show,
  onHide,
}: ViewDepartmentRecordModalProps) {
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);

  useEffect(() => {
    if (show && visitId) {
      fetchVisitData();
    }
  }, [show, visitId]);

  const fetchVisitData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{
        visit: VisitData;
        prescriptions: Prescription[];
        labTests: LabTest[];
      }>(`/api/visits/${visitId}`, { showErrorToast: true });

      setVisitData(response.visit);
      setPrescriptions(response.prescriptions || []);
      setLabTests(response.labTests || []);
    } catch (error) {
      console.error('Error fetching visit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy hh:mm a');
    } catch {
      return 'N/A';
    }
  };

  const getStaffName = (staff?: StaffInfo) => {
    if (!staff) return 'N/A';
    return `${staff.firstName} ${staff.lastName}`;
  };

  const renderFrontDeskRecord = () => {
    const stage = visitData?.stages?.frontDesk;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.notes) return null;

    return (
      <div className="card mb-3">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">
            <i className="ti ti-user-check me-2"></i>
            Front Desk
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Attended By</small>
              <strong>{getStaffName(stage.clockedInBy)}</strong>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Time</small>
              <strong>{formatDateTime(stage.clockedInAt)}</strong>
            </div>
            {stage.notes && (
              <div className="col-12 mb-2">
                <small className="text-muted d-block">Notes</small>
                <p className="mb-0">{stage.notes}</p>
              </div>
            )}
            {stage.nextAction && (
              <div className="col-12">
                <small className="text-muted d-block">Next Action</small>
                <p className="mb-0">{stage.nextAction}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNurseRecord = () => {
    const stage = visitData?.stages?.nurse;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.vitalSigns && !stage?.notes) return null;

    return (
      <div className="card mb-3">
        <div className="card-header bg-success text-white">
          <h6 className="mb-0">
            <i className="ti ti-nurse me-2"></i>
            Nurse Assessment
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Attended By</small>
              <strong>{getStaffName(stage.clockedInBy)}</strong>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Time</small>
              <strong>{formatDateTime(stage.clockedInAt)}</strong>
            </div>
          </div>

          {stage.vitalSigns && (
            <div className="mt-3">
              <h6 className="mb-2">Vital Signs</h6>
              <div className="row">
                {stage.vitalSigns.bloodPressure && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">Blood Pressure</small>
                    <strong>{stage.vitalSigns.bloodPressure} mmHg</strong>
                  </div>
                )}
                {stage.vitalSigns.temperature && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">Temperature</small>
                    <strong>{stage.vitalSigns.temperature}°C</strong>
                  </div>
                )}
                {stage.vitalSigns.pulse && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">Pulse</small>
                    <strong>{stage.vitalSigns.pulse} bpm</strong>
                  </div>
                )}
                {stage.vitalSigns.weight && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">Weight</small>
                    <strong>{stage.vitalSigns.weight} kg</strong>
                  </div>
                )}
                {stage.vitalSigns.height && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">Height</small>
                    <strong>{stage.vitalSigns.height} cm</strong>
                  </div>
                )}
                {stage.vitalSigns.bmi && (
                  <div className="col-md-4 mb-2">
                    <small className="text-muted d-block">BMI</small>
                    <strong>{stage.vitalSigns.bmi}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {stage.notes && (
            <div className="mt-3">
              <small className="text-muted d-block">Notes</small>
              <p className="mb-0">{stage.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDoctorRecord = () => {
    const stage = visitData?.stages?.doctor;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.diagnosis && !stage?.notes) return null;

    return (
      <div className="card mb-3">
        <div className="card-header bg-warning text-dark">
          <h6 className="mb-0">
            <i className="ti ti-stethoscope me-2"></i>
            Doctor Consultation
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Attended By</small>
              <strong>{getStaffName(stage.clockedInBy)}</strong>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Time</small>
              <strong>{formatDateTime(stage.clockedInAt)}</strong>
            </div>
          </div>

          {stage.diagnosis && (
            <div className="mt-3">
              <small className="text-muted d-block">Diagnosis</small>
              <p className="mb-0"><strong>{stage.diagnosis}</strong></p>
            </div>
          )}

          {prescriptions.length > 0 && (
            <div className="mt-3">
              <h6 className="mb-2">Prescriptions</h6>
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted">Rx #{prescription.prescriptionNumber}</small>
                    <span className={`badge ${prescription.status === 'dispensed' ? 'bg-success' : 'bg-warning'}`}>
                      {prescription.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Medications:</strong>
                    <ul className="mb-0 mt-1">
                      {prescription.medications.map((med, index) => (
                        <li key={index}>
                          <strong>{med.name}</strong> - {med.dosage}, {med.frequency} for {med.duration}
                          {med.instructions && <div className="text-muted small">Instructions: {med.instructions}</div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stage.notes && (
            <div className="mt-3">
              <small className="text-muted d-block">Notes</small>
              <p className="mb-0">{stage.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLabRecord = () => {
    const stage = visitData?.stages?.lab;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.notes && labTests.length === 0) return null;

    return (
      <div className="card mb-3">
        <div className="card-header text-white" style={{ backgroundColor: '#6F42C1' }}>
          <h6 className="mb-0">
            <i className="ti ti-test-pipe-2 me-2"></i>
            Laboratory
          </h6>
        </div>
        <div className="card-body">
          {stage?.clockedInAt && (
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <small className="text-muted d-block">Attended By</small>
                <strong>{getStaffName(stage.clockedInBy)}</strong>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted d-block">Time</small>
                <strong>{formatDateTime(stage.clockedInAt)}</strong>
              </div>
            </div>
          )}

          {labTests.length > 0 && (
            <div className="mt-3">
              <h6 className="mb-2">Lab Tests</h6>
              {labTests.map((test) => (
                <div key={test._id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{test.testName}</strong>
                      <div className="text-muted small">Test #{test.testNumber}</div>
                    </div>
                    <span className={`badge ${test.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                      {test.status}
                    </span>
                  </div>
                  {test.result && (
                    <div className="mt-2">
                      <div><strong>Result:</strong> {test.result.value} {test.result.unit}</div>
                      {test.result.normalRange && (
                        <div className="text-muted small">Normal Range: {test.result.normalRange}</div>
                      )}
                      {test.result.interpretation && (
                        <div className="text-muted small">Interpretation: {test.result.interpretation}</div>
                      )}
                      {test.result.performedBy && (
                        <div className="text-muted small mt-1">
                          Performed by: {getStaffName(test.result.performedBy)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {stage?.notes && (
            <div className="mt-3">
              <small className="text-muted d-block">Notes</small>
              <p className="mb-0">{stage.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPharmacyRecord = () => {
    const stage = visitData?.stages?.pharmacy;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.notes) return null;

    const dispensedPrescriptions = prescriptions.filter(p => p.status === 'dispensed');

    return (
      <div className="card mb-3">
        <div className="card-header text-white" style={{ backgroundColor: '#8B5CF6' }}>
          <h6 className="mb-0">
            <i className="ti ti-pill me-2"></i>
            Pharmacy
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Attended By</small>
              <strong>{getStaffName(stage.clockedInBy)}</strong>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Time</small>
              <strong>{formatDateTime(stage.clockedInAt)}</strong>
            </div>
          </div>

          {dispensedPrescriptions.length > 0 && (
            <div className="mt-3">
              <h6 className="mb-2">Dispensed Medications</h6>
              {dispensedPrescriptions.map((prescription) => (
                <div key={prescription._id} className="border rounded p-2 mb-2">
                  <div className="mb-2">
                    <small className="text-muted">Rx #{prescription.prescriptionNumber}</small>
                    {prescription.dispensedBy && (
                      <div className="text-muted small">
                        Dispensed by: {getStaffName(prescription.dispensedBy)} on {formatDateTime(prescription.dispensedAt)}
                      </div>
                    )}
                  </div>
                  <ul className="mb-0">
                    {prescription.medications.map((med, index) => (
                      <li key={index}>
                        <strong>{med.name}</strong> - {med.dosage}, Qty: {med.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {stage.notes && (
            <div className="mt-3">
              <small className="text-muted d-block">Notes</small>
              <p className="mb-0">{stage.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBillingRecord = () => {
    const stage = visitData?.stages?.billing;
    if (!stage?.clockedInAt && !stage?.clockedOutAt && !stage?.notes) return null;

    return (
      <div className="card mb-3">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">
            <i className="ti ti-receipt me-2"></i>
            Billing
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Attended By</small>
              <strong>{getStaffName(stage.clockedInBy)}</strong>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted d-block">Time</small>
              <strong>{formatDateTime(stage.clockedInAt)}</strong>
            </div>
          </div>

          {stage.notes && (
            <div className="mt-3">
              <small className="text-muted d-block">Notes</small>
              <p className="mb-0">{stage.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ti ti-file-text me-2"></i>
          Department Records
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6 className="text-muted mb-0">Patient: <strong>{patientInfo.name}</strong></h6>
          <small className="text-muted">ID: {patientInfo.patientId}</small>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading department records...</p>
          </div>
        ) : (
          <div>
            {renderFrontDeskRecord()}
            {renderNurseRecord()}
            {renderDoctorRecord()}
            {renderLabRecord()}
            {renderPharmacyRecord()}
            {renderBillingRecord()}

            {!visitData?.stages?.frontDesk?.clockedInAt &&
             !visitData?.stages?.nurse?.clockedInAt &&
             !visitData?.stages?.doctor?.clockedInAt &&
             !visitData?.stages?.lab?.clockedInAt &&
             !visitData?.stages?.pharmacy?.clockedInAt &&
             !visitData?.stages?.billing?.clockedInAt && (
              <div className="text-center py-5">
                <i className="ti ti-info-circle fs-1 text-muted d-block mb-2"></i>
                <p className="text-muted mb-0">No department records available yet</p>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
