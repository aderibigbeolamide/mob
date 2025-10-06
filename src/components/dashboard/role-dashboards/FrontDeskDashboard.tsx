"use client";
import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { apiClient } from "@/lib/services/api-client";
import { toast } from "react-toastify";

import ChartOne from "../chart/chart1";
import ChartTwo from "../chart/chart2";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import PredefinedDatePicker from "@/core/common-components/common-date-range-picker/PredefinedDatePicker";
import ImageWithBasePath from "@/core/common-components/image-with-base-path";

interface PatientInfo {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  patientId: string;
}

interface PendingCheckIn {
  _id: string;
  patient: PatientInfo;
  patientId: PatientInfo;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  status: string;
}

interface DashboardStats {
  appointmentsToday: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  newPatientsToday: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  pendingCheckIns: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  visitsToday: number;
  pendingAppointments: PendingCheckIn[];
}

const FrontDeskDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingVisit, setStartingVisit] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<DashboardStats>('/api/dashboard/stats', {
        showErrorToast: false
      });
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleStartVisit = async (appointment: PendingCheckIn) => {
    const appointmentId = appointment._id;
    const patient = appointment.patient || appointment.patientId;
    
    if (!patient?._id) {
      toast.error('Patient information is missing. Cannot start visit.');
      return;
    }

    try {
      setStartingVisit(appointmentId);
      
      const visitData = {
        patient: patient._id,
        branchId: session?.user?.branch?._id || session?.user?.branch,
        visitDate: new Date().toISOString(),
        appointment: appointmentId,
      };

      const response = await apiClient.post<{ visit: { _id: string } }>(
        '/api/visits',
        visitData,
        { 
          successMessage: 'Visit started successfully. Redirecting...',
          showErrorToast: true 
        }
      );

      if (response?.visit?._id) {
        router.push(`${all_routes.startVisits}?id=${response.visit._id}`);
      }
    } catch (error: any) {
      console.error('Failed to start visit:', error);
      toast.error(error.message || 'Failed to start visit. Please try again.');
    } finally {
      setStartingVisit(null);
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const userName = session?.user?.name || 'Front Desk';

  return (
    <div className="page-wrapper" id="main-content">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div className="breadcrumb-arrow">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge" style={{ backgroundColor: '#CC0000', color: 'white', padding: '6px 12px', fontSize: '13px' }}>
                <i className="ti ti-calendar-user me-1" />
                Front Desk
              </span>
            </div>
            <h4 className="mb-1 d-flex align-items-center gap-2">
              <i className="ti ti-building-community" style={{ color: '#CC0000' }} />
              Welcome, {userName}
            </h4>
            <p className="mb-0">
              Today you have {loading ? '...' : stats?.appointmentsToday.total || 0} appointments
            </p>
          </div>
          <PredefinedDatePicker />
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-xl-4 col-md-6 d-flex">
            <div className="card pb-2 flex-fill">
              <div className="d-flex align-items-center justify-content-between gap-1 card-body pb-0 mb-1">
                <div className="d-flex align-items-center overflow-hidden">
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#CC0000' }}>
                    <i className="ti ti-calendar-check fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">Appointments Today</p>
                    <h5 className="mb-0">
                      {loading ? '...' : stats?.appointmentsToday.total || 0}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.appointmentsToday.isIncrease ? 'success' : 'danger'}`}>
                      {stats.appointmentsToday.isIncrease ? '+' : ''}{stats.appointmentsToday.change}%
                    </span>
                  )}
                </div>
              </div>
              <Suspense fallback={<div />}>
                <ChartOne />
              </Suspense>
            </div>
          </div>

          <div className="col-xl-4 col-md-6 d-flex">
            <div className="card pb-2 flex-fill">
              <div className="d-flex align-items-center justify-content-between gap-1 card-body pb-0 mb-1">
                <div className="d-flex align-items-center overflow-hidden">
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#DC2626' }}>
                    <i className="ti ti-user-plus fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">New Patients Today</p>
                    <h5 className="mb-0">
                      {loading ? '...' : stats?.newPatientsToday.total || 0}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.newPatientsToday.isIncrease ? 'success' : 'danger'}`}>
                      {stats.newPatientsToday.isIncrease ? '+' : ''}{stats.newPatientsToday.change}%
                    </span>
                  )}
                </div>
              </div>
              <Suspense fallback={<div />}>
                <ChartTwo />
              </Suspense>
            </div>
          </div>

          <div className="col-xl-4 col-md-6 d-flex">
            <div className="card pb-2 flex-fill">
              <div className="d-flex align-items-center justify-content-between gap-1 card-body pb-0 mb-1">
                <div className="d-flex align-items-center overflow-hidden">
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#EF4444' }}>
                    <i className="ti ti-clipboard-check fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">Pending Check-ins</p>
                    <h5 className="mb-0">
                      {loading ? '...' : stats?.pendingCheckIns.total || 0}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.pendingCheckIns.isIncrease ? 'danger' : 'success'}`}>
                      {stats.pendingCheckIns.isIncrease ? '+' : ''}{stats.pendingCheckIns.change}%
                    </span>
                  )}
                </div>
              </div>
              <Suspense fallback={<div />}>
                <ChartOne />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h5 className="fw-bold mb-0">Pending Check-ins</h5>
                <Link
                  href={all_routes.appointments}
                  className="btn btn-sm btn-outline-light flex-shrink-0"
                >
                  View All
                </Link>
              </div>
              <div className="card-body p-1 py-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : stats?.pendingAppointments && stats.pendingAppointments.length > 0 ? (
                  <div className="table-responsive table-nowrap">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        {stats.pendingAppointments.filter(appointment => appointment.patient || appointment.patientId).map((appointment) => {
                          const patient = appointment.patient || appointment.patientId;
                          return (
                            <tr key={appointment._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link
                                    href={all_routes.patientDetails}
                                    className="avatar me-2"
                                  >
                                    {patient.profileImage ? (
                                      <ImageWithBasePath
                                        src={patient.profileImage}
                                        alt="patient"
                                        className="rounded"
                                      />
                                    ) : (
                                      <span className="avatar-text bg-primary rounded">
                                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                                      </span>
                                    )}
                                  </Link>
                                  <div>
                                    <h6 className="fs-14 mb-1 fw-semibold">
                                      <Link href={all_routes.patientDetails}>
                                        {patient.firstName} {patient.lastName}
                                      </Link>
                                    </h6>
                                    <div className="d-flex align-items-center">
                                      <p className="mb-0 fs-13 d-inline-flex align-items-center text-body">
                                        <i className="ti ti-calendar me-1" />
                                        {formatAppointmentDate(appointment.appointmentDate)}
                                      </p>
                                      <span>
                                        <i className="ti ti-minus-vertical text-light fs-14 mx-1" />
                                      </span>
                                      <p className="mb-0 fs-13 d-inline-flex align-items-center text-body">
                                        <i className="ti ti-clock-hour-7 me-1" />
                                        {appointment.appointmentTime}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-soft-warning">
                                  {appointment.reasonForVisit || 'Check-in'}
                                </span>
                              </td>
                              <td className="text-end border-0">
                                <button
                                  onClick={() => handleStartVisit(appointment)}
                                  className="btn btn-sm btn-primary"
                                  disabled={startingVisit === appointment._id}
                                >
                                  {startingVisit === appointment._id ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                      Starting...
                                    </>
                                  ) : (
                                    'Check In & Start Visit'
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No pending check-ins</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
