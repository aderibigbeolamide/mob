"use client";
import { useEffect } from "react";

interface BillingItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'consultation' | 'procedure' | 'medication' | 'lab_test' | 'other';
}

interface BillingRecord {
  _id: string;
  invoiceNumber: string;
  patient: {
    _id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    insurance?: {
      provider: string;
      policyNumber: string;
    };
  };
  branch: {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
  items: BillingItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: 'pending' | 'partially_paid' | 'paid' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  insurance?: {
    provider: string;
    policyNumber: string;
    claimAmount: number;
    claimStatus: 'pending' | 'approved' | 'rejected';
    approvalNumber?: string;
  };
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BillingViewModalProps {
  record: BillingRecord | null;
  onClose: () => void;
}

const BillingViewModal = ({ record, onClose }: BillingViewModalProps) => {
  useEffect(() => {
    if (record) {
      const modalElement = document.getElementById("view_billing");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();

        const handleHidden = () => {
          onClose();
        };
        modalElement.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
          modalElement.removeEventListener('hidden.bs.modal', handleHidden);
          modal.dispose();
        };
      }
    }
  }, [record, onClose]);

  if (!record) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'badge-soft-success';
      case 'pending':
        return 'badge-soft-warning';
      case 'partially_paid':
        return 'badge-soft-info';
      case 'cancelled':
        return 'badge-soft-danger';
      default:
        return 'badge-soft-secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'partially_paid':
        return 'Partially Paid';
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'consultation':
        return 'Consultation';
      case 'procedure':
        return 'Procedure';
      case 'medication':
        return 'Medication';
      case 'lab_test':
        return 'Lab Test';
      case 'other':
        return 'Other';
      default:
        return category;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal fade"
      id="view_billing"
      tabIndex={-1}
      aria-labelledby="view_billing_label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="view_billing_label">
              Billing Record Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="card bg-light mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="text-muted mb-2">Invoice Information</h6>
                    <p className="mb-1">
                      <strong>Invoice #:</strong> {record.invoiceNumber}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong> {formatDate(record.createdAt)}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong>{' '}
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Patient Information</h6>
                    <p className="mb-1">
                      <strong>Name:</strong> {record.patient?.firstName} {record.patient?.lastName}
                    </p>
                    <p className="mb-1">
                      <strong>Patient ID:</strong> {record.patient?.patientId}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {record.patient?.phoneNumber}
                    </p>
                    {record.patient?.email && (
                      <p className="mb-0">
                        <strong>Email:</strong> {record.patient.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h6 className="mb-2">Branch Information</h6>
              <p className="mb-1">
                <strong>Branch:</strong> {record.branch?.name}
              </p>
              <p className="mb-0 text-muted">
                {record.branch?.address}, {record.branch?.city}, {record.branch?.state}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="mb-2">Billing Items</h6>
              <div className="table-responsive">
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>
                          <span className="badge badge-soft-info">
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 offset-md-6">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="text-end"><strong>Subtotal:</strong></td>
                      <td className="text-end">{formatCurrency(record.subtotal)}</td>
                    </tr>
                    <tr>
                      <td className="text-end"><strong>Tax:</strong></td>
                      <td className="text-end">{formatCurrency(record.tax)}</td>
                    </tr>
                    <tr>
                      <td className="text-end"><strong>Discount:</strong></td>
                      <td className="text-end">-{formatCurrency(record.discount)}</td>
                    </tr>
                    <tr className="table-light">
                      <td className="text-end"><strong>Total Amount:</strong></td>
                      <td className="text-end"><strong>{formatCurrency(record.totalAmount)}</strong></td>
                    </tr>
                    <tr>
                      <td className="text-end"><strong>Amount Paid:</strong></td>
                      <td className="text-end text-success">{formatCurrency(record.amountPaid)}</td>
                    </tr>
                    <tr className="table-warning">
                      <td className="text-end"><strong>Balance Due:</strong></td>
                      <td className="text-end"><strong>{formatCurrency(record.balance)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {record.insurance && (
              <div className="mb-3">
                <h6 className="mb-2">Insurance Information</h6>
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Provider:</strong> {record.insurance.provider}
                        </p>
                        <p className="mb-0">
                          <strong>Policy Number:</strong> {record.insurance.policyNumber}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Claim Amount:</strong> {formatCurrency(record.insurance.claimAmount)}
                        </p>
                        <p className="mb-1">
                          <strong>Claim Status:</strong>{' '}
                          <span className={`badge ${
                            record.insurance.claimStatus === 'approved' 
                              ? 'badge-soft-success' 
                              : record.insurance.claimStatus === 'rejected'
                              ? 'badge-soft-danger'
                              : 'badge-soft-warning'
                          }`}>
                            {record.insurance.claimStatus.charAt(0).toUpperCase() + record.insurance.claimStatus.slice(1)}
                          </span>
                        </p>
                        {record.insurance.approvalNumber && (
                          <p className="mb-0">
                            <strong>Approval #:</strong> {record.insurance.approvalNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {record.notes && (
              <div className="mb-3">
                <h6 className="mb-2">Notes</h6>
                <p className="text-muted mb-0">{record.notes}</p>
              </div>
            )}

            <div className="border-top pt-3">
              <p className="text-muted mb-0 small">
                <strong>Created:</strong> {formatDate(record.createdAt)}
              </p>
              {record.updatedAt && (
                <p className="text-muted mb-0 small">
                  <strong>Last Updated:</strong> {formatDate(record.updatedAt)}
                </p>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrint}
            >
              <i className="ti ti-printer me-1" />
              Print
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingViewModal;
