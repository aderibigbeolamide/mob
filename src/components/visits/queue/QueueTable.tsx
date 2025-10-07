"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PatientVisit, Patient, UserRole } from '@/types/emr';
import { getStageBadgeClass, getStageLabel } from '@/lib/constants/stages';
import HandoffButton from './HandoffButton';
import NurseClockInModal from './NurseClockInModal';
import DoctorConsultationModal from './DoctorConsultationModal';
import LabClockInModal from './LabClockInModal';
import PharmacyClockInModal from './PharmacyClockInModal';
import AdmitPatientModal from '@/components/visits/modal/AdmitPatientModal';
import ViewDepartmentRecordModal from './ViewDepartmentRecordModal';
import AssignedDoctorCell from '../AssignedDoctorCell';
import { all_routes } from '@/router/all_routes';
import { formatDistanceToNow } from 'date-fns';

interface QueueTableProps {
  queue: PatientVisit[];
  loading: boolean;
  onHandoffSuccess: (visitId: string) => void;
  onClockInSuccess?: () => void;
}

export default function QueueTable({ queue, loading, onHandoffSuccess, onClockInSuccess }: QueueTableProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<PatientVisit | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctorVisit, setSelectedDoctorVisit] = useState<PatientVisit | null>(null);
  const [showLabModal, setShowLabModal] = useState(false);
  const [selectedLabVisit, setSelectedLabVisit] = useState<PatientVisit | null>(null);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [selectedPharmacyVisit, setSelectedPharmacyVisit] = useState<PatientVisit | null>(null);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedVisitForAdmission, setSelectedVisitForAdmission] = useState<PatientVisit | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedVisitForRecord, setSelectedVisitForRecord] = useState<PatientVisit | null>(null);
  const formatTimeWaiting = (clockedInAt?: Date) => {
    if (!clockedInAt) return 'N/A';
    try {
      return formatDistanceToNow(new Date(clockedInAt), { addSuffix: true });
    } catch {
      return 'N/A';
    }
  };

  const getPatientName = (patient: string | Patient) => {
    if (typeof patient === 'string') return 'Unknown';
    return `${patient.firstName} ${patient.lastName}`;
  };

  const getPatientId = (patient: string | Patient) => {
    if (typeof patient === 'string') return 'N/A';
    return patient.patientId || 'N/A';
  };

  const getCurrentStageClockIn = (visit: PatientVisit) => {
    const stage = visit.currentStage;
    switch (stage) {
      case 'front_desk':
        return visit.stages.frontDesk?.clockedInAt;
      case 'nurse':
        return visit.stages.nurse?.clockedInAt;
      case 'doctor':
        return visit.stages.doctor?.clockedInAt;
      case 'lab':
        return visit.stages.lab?.clockedInAt;
      case 'pharmacy':
        return visit.stages.pharmacy?.clockedInAt;
      case 'billing':
        return visit.stages.billing?.clockedInAt;
      case 'returned_to_front_desk':
        return visit.stages.returnedToFrontDesk?.clockedInAt;
      default:
        return undefined;
    }
  };

  const handleOpenClockInModal = (visit: PatientVisit) => {
    setSelectedVisit(visit);
    setShowClockInModal(true);
  };

  const handleCloseClockInModal = () => {
    setShowClockInModal(false);
    setSelectedVisit(null);
  };

  const handleClockInSuccess = () => {
    if (onClockInSuccess) {
      onClockInSuccess();
    }
    handleCloseClockInModal();
  };

  const handleOpenAdmitModal = (visit: PatientVisit) => {
    setSelectedVisitForAdmission(visit);
    setShowAdmitModal(true);
  };

  const handleCloseAdmitModal = () => {
    setShowAdmitModal(false);
    setSelectedVisitForAdmission(null);
  };

  const handleAdmitSuccess = () => {
    if (onClockInSuccess) {
      onClockInSuccess();
    }
    handleCloseAdmitModal();
  };

  const handleOpenDoctorModal = (visit: PatientVisit) => {
    setSelectedDoctorVisit(visit);
    setShowDoctorModal(true);
  };

  const handleCloseDoctorModal = () => {
    setShowDoctorModal(false);
    setSelectedDoctorVisit(null);
  };

  const handleDoctorClockInSuccess = () => {
    if (onClockInSuccess) {
      onClockInSuccess();
    }
    handleCloseDoctorModal();
  };

  const handleOpenLabModal = (visit: PatientVisit) => {
    setSelectedLabVisit(visit);
    setShowLabModal(true);
  };

  const handleCloseLabModal = () => {
    setShowLabModal(false);
    setSelectedLabVisit(null);
  };

  const handleLabClockInSuccess = () => {
    if (onClockInSuccess) {
      onClockInSuccess();
    }
    handleCloseLabModal();
  };

  const handleOpenPharmacyModal = (visit: PatientVisit) => {
    setSelectedPharmacyVisit(visit);
    setShowPharmacyModal(true);
  };

  const handleClosePharmacyModal = () => {
    setShowPharmacyModal(false);
    setSelectedPharmacyVisit(null);
  };

  const handlePharmacyClockInSuccess = () => {
    if (onClockInSuccess) {
      onClockInSuccess();
    }
    handleClosePharmacyModal();
  };

  const handleOpenRecordModal = (visit: PatientVisit) => {
    setSelectedVisitForRecord(visit);
    setShowRecordModal(true);
  };

  const handleCloseRecordModal = () => {
    setShowRecordModal(false);
    setSelectedVisitForRecord(null);
  };

  const renderActionButtons = (visit: PatientVisit) => {
    const patient = visit.patient;
    const isNurse = userRole === UserRole.NURSE;
    const isDoctor = userRole === UserRole.DOCTOR;
    const isLab = userRole === UserRole.LAB;
    const isPharmacy = userRole === UserRole.PHARMACY;
    const hasNurseClockedIn = !!visit.stages.nurse?.clockedInAt;
    const hasDoctorClockedIn = !!visit.stages.doctor?.clockedInAt;
    const hasLabClockedIn = !!visit.stages.lab?.clockedInAt;
    const hasPharmacyClockedIn = !!visit.stages.pharmacy?.clockedInAt;

    if (isNurse && visit.currentStage === 'nurse' && !hasNurseClockedIn) {
      return (
        <>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleOpenRecordModal(visit)}
          >
            <i className="ti ti-file-text me-1"></i>
            View Record
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleOpenClockInModal(visit)}
          >
            <i className="ti ti-stethoscope me-1"></i>
            Clock In & Record Vitals
          </button>
        </>
      );
    }

    if (isDoctor && visit.currentStage === 'doctor' && !hasDoctorClockedIn) {
      return (
        <>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleOpenRecordModal(visit)}
          >
            <i className="ti ti-file-text me-1"></i>
            View Record
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleOpenDoctorModal(visit)}
          >
            <i className="ti ti-stethoscope me-1"></i>
            Clock In & Start Consultation
          </button>
        </>
      );
    }

    if (isLab && visit.currentStage === 'lab' && !hasLabClockedIn) {
      return (
        <>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleOpenRecordModal(visit)}
          >
            <i className="ti ti-file-text me-1"></i>
            View Record
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleOpenLabModal(visit)}
            style={{ backgroundColor: '#6F42C1', borderColor: '#6F42C1' }}
          >
            <i className="ti ti-test-pipe-2 me-1"></i>
            Clock In & Add Results
          </button>
        </>
      );
    }

    if (isPharmacy && visit.currentStage === 'pharmacy' && !hasPharmacyClockedIn) {
      return (
        <>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleOpenRecordModal(visit)}
          >
            <i className="ti ti-file-text me-1"></i>
            View Record
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleOpenPharmacyModal(visit)}
            style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
          >
            <i className="ti ti-pill me-1"></i>
            Clock In & Dispense
          </button>
        </>
      );
    }

    if (isDoctor && visit.currentStage === 'doctor' && hasDoctorClockedIn) {
      return (
        <>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleOpenRecordModal(visit)}
          >
            <i className="ti ti-file-text me-1"></i>
            View Record
          </button>
          <button
            className="btn btn-sm btn-info"
            onClick={() => handleOpenAdmitModal(visit)}
          >
            <i className="ti ti-bed me-1"></i>
            Admit Patient
          </button>
          <HandoffButton
            visitId={visit._id!}
            currentStage={visit.currentStage}
            onHandoffSuccess={() => onHandoffSuccess(visit._id!)}
          />
        </>
      );
    }

    return (
      <>
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleOpenRecordModal(visit)}
        >
          <i className="ti ti-file-text me-1"></i>
          View Record
        </button>
        <HandoffButton
          visitId={visit._id!}
          currentStage={visit.currentStage}
          onHandoffSuccess={() => onHandoffSuccess(visit._id!)}
        />
      </>
    );
  };

  const renderSkeletonRow = (key: number) => (
    <tr key={key}>
      <td><span className="placeholder col-8"></span></td>
      <td><span className="placeholder col-10"></span></td>
      <td><span className="placeholder col-6"></span></td>
      <td><span className="placeholder col-8"></span></td>
      <td><span className="placeholder col-8"></span></td>
      <td><span className="placeholder col-6"></span></td>
      <td><span className="placeholder col-4"></span></td>
    </tr>
  );

  const renderMobileCard = (visit: PatientVisit) => {
    const patient = visit.patient;
    const clockInTime = getCurrentStageClockIn(visit);

    return (
      <div key={visit._id} className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="mb-1">
                <Link href={`${all_routes.patientDetails}?id=${typeof patient === 'string' ? patient : patient._id}`}>
                  {getPatientName(patient)}
                </Link>
              </h6>
              <p className="text-muted small mb-0">ID: {getPatientId(patient)}</p>
            </div>
            <span className={`badge ${getStageBadgeClass(visit.currentStage)}`}>
              {getStageLabel(visit.currentStage)}
            </span>
          </div>
          <div className="mb-2">
            <small className="text-muted d-block">Visit #: {visit.visitNumber}</small>
            <small className="text-muted d-block">Waiting: {formatTimeWaiting(clockInTime)}</small>
            <div className="mt-1">
              <small className="text-muted d-block">Assigned Doctor:</small>
              <AssignedDoctorCell
                visitId={visit._id!}
                assignedDoctor={visit.assignedDoctor as any}
                onUpdate={onClockInSuccess}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link
              href={`${all_routes.visits}?id=${visit._id}`}
              className="btn btn-sm btn-outline-primary flex-grow-1"
            >
              <i className="ti ti-eye me-1"></i>
              View
            </Link>
            {renderActionButtons(visit)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Visit Number</th>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Assigned Doctor</th>
                <th>Current Stage</th>
                <th>Time Waiting</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => renderSkeletonRow(index))
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <i className="ti ti-inbox fs-1 text-muted d-block mb-2"></i>
                    <p className="text-muted mb-0">No patients in queue</p>
                  </td>
                </tr>
              ) : (
                queue.map((visit) => {
                  const patient = visit.patient;
                  const clockInTime = getCurrentStageClockIn(visit);

                  return (
                    <tr key={visit._id}>
                      <td>
                        <Link href={`${all_routes.visits}?id=${visit._id}`} className="text-primary">
                          {visit.visitNumber}
                        </Link>
                      </td>
                      <td>
                        <Link href={`${all_routes.patientDetails}?id=${typeof patient === 'string' ? patient : patient._id}`}>
                          {getPatientName(patient)}
                        </Link>
                      </td>
                      <td>{getPatientId(patient)}</td>
                      <td>
                        <AssignedDoctorCell
                          visitId={visit._id!}
                          assignedDoctor={visit.assignedDoctor as any}
                          onUpdate={onClockInSuccess}
                        />
                      </td>
                      <td>
                        <span className={`badge ${getStageBadgeClass(visit.currentStage)}`}>
                          {getStageLabel(visit.currentStage)}
                        </span>
                      </td>
                      <td>{formatTimeWaiting(clockInTime)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Link
                            href={`${all_routes.visits}?id=${visit._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="ti ti-eye"></i>
                          </Link>
                          {renderActionButtons(visit)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-md-none">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <span className="placeholder col-12 mb-2"></span>
                <span className="placeholder col-8 mb-2"></span>
                <span className="placeholder col-6"></span>
              </div>
            </div>
          ))
        ) : queue.length === 0 ? (
          <div className="text-center py-5">
            <i className="ti ti-inbox fs-1 text-muted d-block mb-2"></i>
            <p className="text-muted mb-0">No patients in queue</p>
          </div>
        ) : (
          queue.map(renderMobileCard)
        )}
      </div>

      {selectedVisit && (
        <NurseClockInModal
          visitId={selectedVisit._id!}
          patientInfo={{
            name: getPatientName(selectedVisit.patient),
            patientId: getPatientId(selectedVisit.patient),
          }}
          onSuccess={handleClockInSuccess}
          show={showClockInModal}
          onHide={handleCloseClockInModal}
        />
      )}

      {selectedDoctorVisit && (
        <DoctorConsultationModal
          visit={selectedDoctorVisit}
          patientInfo={{
            name: getPatientName(selectedDoctorVisit.patient),
            patientId: getPatientId(selectedDoctorVisit.patient),
          }}
          onSuccess={handleDoctorClockInSuccess}
          show={showDoctorModal}
          onHide={handleCloseDoctorModal}
        />
      )}

      {selectedLabVisit && (
        <LabClockInModal
          visit={selectedLabVisit}
          patientInfo={{
            name: getPatientName(selectedLabVisit.patient),
            patientId: getPatientId(selectedLabVisit.patient),
          }}
          onSuccess={handleLabClockInSuccess}
          show={showLabModal}
          onHide={handleCloseLabModal}
        />
      )}

      {selectedVisitForAdmission && (
        <AdmitPatientModal
          show={showAdmitModal}
          onHide={handleCloseAdmitModal}
          visitId={selectedVisitForAdmission._id!}
          patientId={typeof selectedVisitForAdmission.patient === 'string' ? selectedVisitForAdmission.patient : selectedVisitForAdmission.patient._id!}
          patientName={getPatientName(selectedVisitForAdmission.patient)}
          assignedDoctorId={typeof selectedVisitForAdmission.assignedDoctor === 'string' ? selectedVisitForAdmission.assignedDoctor : selectedVisitForAdmission.assignedDoctor?._id}
          onSuccess={handleAdmitSuccess}
        />
      )}

      {selectedPharmacyVisit && (
        <PharmacyClockInModal
          visit={selectedPharmacyVisit}
          patientInfo={{
            name: getPatientName(selectedPharmacyVisit.patient),
            patientId: getPatientId(selectedPharmacyVisit.patient),
          }}
          onSuccess={handlePharmacyClockInSuccess}
          show={showPharmacyModal}
          onHide={handleClosePharmacyModal}
        />
      )}

      {selectedVisitForRecord && (
        <ViewDepartmentRecordModal
          visitId={selectedVisitForRecord._id!}
          patientInfo={{
            name: getPatientName(selectedVisitForRecord.patient),
            patientId: getPatientId(selectedVisitForRecord.patient),
          }}
          show={showRecordModal}
          onHide={handleCloseRecordModal}
        />
      )}
    </>
  );
}
