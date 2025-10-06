"use client";
import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/services/api-client";

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

interface PendingInvoice {
  _id: string;
  patientId: PatientInfo;
  totalAmount: number;
  status: string;
  dueDate: string;
}

interface DashboardStats {
  pendingInvoices: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  processedToday: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  revenueToday: {
    total: number;
    change: number;
    isIncrease: boolean;
  };
  visitsToday: number;
  pendingAppointments: PendingInvoice[];
}

const BillingDashboard = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const userName = session?.user?.name || 'Billing Staff';

  return (
    <div className="page-wrapper" id="main-content">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div className="breadcrumb-arrow">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge" style={{ backgroundColor: '#F59E0B', color: 'white', padding: '6px 12px', fontSize: '13px' }}>
                <i className="ti ti-receipt me-1" />
                Billing Staff
              </span>
            </div>
            <h4 className="mb-1 d-flex align-items-center gap-2">
              <i className="ti ti-file-invoice" style={{ color: '#F59E0B' }} />
              Welcome, {userName}
            </h4>
            <p className="mb-0">
              You have {loading ? '...' : stats?.pendingInvoices.total || 0} pending invoices
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
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#F59E0B' }}>
                    <i className="ti ti-file-invoice fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">Pending Invoices</p>
                    <h5 className="mb-0">
                      {loading ? '...' : stats?.pendingInvoices.total || 0}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.pendingInvoices.isIncrease ? 'danger' : 'success'}`}>
                      {stats.pendingInvoices.isIncrease ? '+' : ''}{stats.pendingInvoices.change}%
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
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#F59E0B' }}>
                    <i className="ti ti-check fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">Processed Today</p>
                    <h5 className="mb-0">
                      {loading ? '...' : stats?.processedToday.total || 0}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.processedToday.isIncrease ? 'success' : 'danger'}`}>
                      {stats.processedToday.isIncrease ? '+' : ''}{stats.processedToday.change}%
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
                  <span className="avatar rounded-circle flex-shrink-0" style={{ backgroundColor: '#D97706' }}>
                    <i className="ti ti-moneybag fs-20" />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <p className="mb-1 text-truncate">Revenue Today</p>
                    <h5 className="mb-0">
                      {loading ? '...' : `$${stats?.revenueToday?.total?.toFixed(2) || '0.00'}`}
                    </h5>
                  </div>
                </div>
                <div className="text-end">
                  {!loading && stats && (
                    <span className={`badge badge-soft-${stats.revenueToday.isIncrease ? 'success' : 'danger'}`}>
                      {stats.revenueToday.isIncrease ? '+' : ''}{stats.revenueToday.change}%
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
                <h5 className="fw-bold mb-0">Pending Invoices</h5>
                <Link
                  href="/billing-queue"
                  className="btn btn-sm btn-outline-light flex-shrink-0"
                >
                  View Queue
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
                        {stats.pendingAppointments.filter(invoice => invoice.patientId).map((invoice) => {
                          const patient = invoice.patientId;
                          return (
                            <tr key={invoice._id}>
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
                                    <p className="mb-0 fs-13 text-muted">
                                      Amount: ${invoice.totalAmount?.toFixed(2) || '0.00'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-soft-warning">
                                  Pending Payment
                                </span>
                              </td>
                              <td className="text-end border-0">
                                <Link
                                  href="/billing-queue"
                                  className="btn btn-sm btn-primary"
                                >
                                  Process Payment
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No pending invoices</p>
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

export default BillingDashboard;
