"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { apiClient } from '@/lib/services/api-client';
import { PatientVisit } from '@/types/emr';
import PaymentReceipt from '@/components/manage/billing/PaymentReceipt';

interface BillingClockInModalProps {
  visit: PatientVisit;
  patientInfo: {
    name: string;
    patientId: string;
  };
  onSuccess: () => void;
  show: boolean;
  onHide: () => void;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  balance: number;
  insuranceClaim?: {
    provider: string;
    claimAmount: number;
    status: string;
  };
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'INSURANCE', label: 'Insurance' },
];

export default function BillingClockInModal({
  visit,
  patientInfo,
  onSuccess,
  show,
  onHide,
}: BillingClockInModalProps) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Payment_Receipt_${paymentData?.payment?.paymentNumber || 'Receipt'}`,
  });

  useEffect(() => {
    if (show) {
      fetchOrGenerateInvoice();
      setPaymentSuccess(false);
      setPaymentData(null);
    }
  }, [show, visit._id]);

  const fetchOrGenerateInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const checkResponse = await apiClient.get<{ invoice: Invoice | null }>(`/api/billing/generate-from-visit?visitId=${visit._id}`);
      
      let invoiceData = checkResponse.invoice;
      
      if (!invoiceData) {
        console.log('No existing invoice found, generating new invoice...');
        const generateResponse = await apiClient.post<{ invoice: Invoice }>(
          '/api/billing/generate-from-visit',
          { visitId: visit._id }
        );
        invoiceData = generateResponse.invoice;
      }
      
      if (!invoiceData) {
        throw new Error('Failed to load or generate invoice');
      }
      
      setInvoice(invoiceData);
      setPaymentAmount(invoiceData.balance.toString());
    } catch (error: any) {
      console.error('Failed to fetch/generate invoice:', error);
      toast.error(error.message || 'Failed to load invoice');
      setInvoice(null);
    } finally {
      setLoadingInvoice(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(paymentAmount);
    if (!paymentAmount) {
      newErrors.paymentAmount = 'Payment amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.paymentAmount = 'Payment amount must be greater than 0';
    } else if (invoice && amount > invoice.balance) {
      newErrors.paymentAmount = `Amount cannot exceed balance of ₦${invoice.balance.toLocaleString()}`;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!invoice) {
      toast.error('Invoice not loaded. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/api/clocking/billing-clock-in',
        {
          visitId: visit._id,
          invoiceId: invoice._id,
          paymentAmount: parseFloat(paymentAmount),
          paymentMethod,
          notes: notes || undefined,
        },
        { successMessage: 'Payment processed and clocked in successfully' }
      );

      setPaymentData(response);
      setPaymentSuccess(true);
    } catch (error: any) {
      console.error('Billing clock-in failed:', error);
      toast.error(error.message || 'Failed to process payment and clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentAmount('');
    setPaymentMethod('CASH');
    setNotes('');
    setErrors({});
    setInvoice(null);
    setPaymentSuccess(false);
    setPaymentData(null);
    onHide();
  };

  const handleComplete = () => {
    handleClose();
    onSuccess();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'paymentAmount') {
      setPaymentAmount(value);
    } else if (field === 'paymentMethod') {
      setPaymentMethod(value);
    } else if (field === 'notes') {
      setNotes(value);
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {paymentSuccess ? 'Payment Receipt' : 'Billing - Clock In & Process Payment'}
        </Modal.Title>
      </Modal.Header>
      {paymentSuccess && paymentData ? (
        <>
          <Modal.Body>
            <div className="alert alert-success mb-4">
              <h5 className="alert-heading">
                <i className="fa fa-check-circle me-2"></i>
                Payment Successful!
              </h5>
              <p className="mb-0">
                The payment has been processed successfully. You can now print or download the receipt.
              </p>
            </div>
            
            <div style={{ display: 'none' }}>
              <PaymentReceipt
                ref={receiptRef}
                payment={{
                  paymentNumber: paymentData.payment.paymentNumber,
                  amount: paymentData.payment.amount,
                  paymentMethod: paymentData.payment.paymentMethod,
                  paymentReference: paymentData.payment.paymentReference,
                  paymentDate: paymentData.payment.paymentDate,
                  receivedBy: paymentData.payment.receivedBy,
                }}
                patient={{
                  patientId: patientInfo.patientId,
                  firstName: patientInfo.name.split(' ')[0],
                  lastName: patientInfo.name.split(' ').slice(1).join(' '),
                }}
                visit={{
                  visitNumber: visit.visitNumber,
                  visitDate: visit.visitDate,
                }}
                invoice={{
                  invoiceNumber: paymentData.invoice.invoiceNumber,
                  items: paymentData.invoice.items,
                  subtotal: paymentData.invoice.subtotal,
                  tax: paymentData.invoice.tax,
                  discount: paymentData.invoice.discount,
                  grandTotal: paymentData.invoice.grandTotal,
                  paidAmount: paymentData.invoice.paidAmount,
                  balance: paymentData.invoice.balance,
                  insuranceClaim: paymentData.invoice.insuranceClaim,
                }}
              />
            </div>

            <div className="receipt-preview border rounded p-3 bg-light" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <PaymentReceipt
                payment={{
                  paymentNumber: paymentData.payment.paymentNumber,
                  amount: paymentData.payment.amount,
                  paymentMethod: paymentData.payment.paymentMethod,
                  paymentReference: paymentData.payment.paymentReference,
                  paymentDate: paymentData.payment.paymentDate,
                  receivedBy: paymentData.payment.receivedBy,
                }}
                patient={{
                  patientId: patientInfo.patientId,
                  firstName: patientInfo.name.split(' ')[0],
                  lastName: patientInfo.name.split(' ').slice(1).join(' '),
                }}
                visit={{
                  visitNumber: visit.visitNumber,
                  visitDate: visit.visitDate,
                }}
                invoice={{
                  invoiceNumber: paymentData.invoice.invoiceNumber,
                  items: paymentData.invoice.items,
                  subtotal: paymentData.invoice.subtotal,
                  tax: paymentData.invoice.tax,
                  discount: paymentData.invoice.discount,
                  grandTotal: paymentData.invoice.grandTotal,
                  paidAmount: paymentData.invoice.paidAmount,
                  balance: paymentData.invoice.balance,
                  insuranceClaim: paymentData.invoice.insuranceClaim,
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
            >
              <i className="fa fa-print me-2"></i>
              Print Receipt
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleComplete}
            >
              <i className="fa fa-check me-2"></i>
              Complete
            </button>
          </Modal.Footer>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
          <div className="mb-4">
            <h6 className="mb-3">Patient Information</h6>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Name:</strong> {patientInfo.name}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Patient ID:</strong> {patientInfo.patientId}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Visit Number:</strong> {visit.visitNumber}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Visit Date:</strong>{' '}
                  {new Date(visit.visitDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <hr />

          {loadingInvoice ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading invoice...</span>
              </div>
              <p className="mt-2">Generating invoice...</p>
            </div>
          ) : invoice ? (
            <>
              <div className="mb-4">
                <h6 className="mb-3">Invoice Details</h6>
                <p className="mb-2">
                  <strong>Invoice Number:</strong> {invoice.invoiceNumber}
                </p>

                <div className="table-responsive mt-3">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Description</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td className="text-end">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-end">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-end">
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">{formatCurrency(invoice.subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-end">
                          <strong>Tax (7.5%):</strong>
                        </td>
                        <td className="text-end">{formatCurrency(invoice.tax)}</td>
                      </tr>
                      {invoice.discount > 0 && (
                        <tr>
                          <td colSpan={3} className="text-end">
                            <strong>Discount:</strong>
                          </td>
                          <td className="text-end text-danger">
                            -{formatCurrency(invoice.discount)}
                          </td>
                        </tr>
                      )}
                      <tr className="table-primary">
                        <td colSpan={3} className="text-end">
                          <strong>Grand Total:</strong>
                        </td>
                        <td className="text-end">
                          <strong>{formatCurrency(invoice.grandTotal)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {invoice.insuranceClaim && (
                  <div className="alert alert-info mt-3">
                    <h6 className="alert-heading">Insurance Claim</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <small>
                          <strong>Provider:</strong> {invoice.insuranceClaim.provider}
                        </small>
                      </div>
                      <div className="col-md-4">
                        <small>
                          <strong>Claim Amount:</strong>{' '}
                          {formatCurrency(invoice.insuranceClaim.claimAmount)}
                        </small>
                      </div>
                      <div className="col-md-4">
                        <small>
                          <strong>Status:</strong>{' '}
                          <span className="badge bg-warning">
                            {invoice.insuranceClaim.status}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row mt-3">
                  {invoice.paidAmount > 0 && (
                    <div className="col-md-6">
                      <div className="alert alert-success">
                        <strong>Paid Amount:</strong> {formatCurrency(invoice.paidAmount)}
                      </div>
                    </div>
                  )}
                  <div className="col-md-6">
                    <div className="alert alert-warning">
                      <strong>Outstanding Balance:</strong>{' '}
                      {formatCurrency(invoice.balance)}
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <h6 className="mb-3">Payment Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">
                      Payment Amount <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.paymentAmount ? 'is-invalid' : ''}`}
                      value={paymentAmount}
                      onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                      placeholder="Enter amount"
                      step="0.01"
                      min="0"
                    />
                    {errors.paymentAmount && (
                      <div className="invalid-feedback">{errors.paymentAmount}</div>
                    )}
                    <small className="text-muted">
                      Maximum: {formatCurrency(invoice.balance)}
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Payment Method <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
                      value={paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <div className="invalid-feedback">{errors.paymentMethod}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
            </>
          ) : (
            <div className="alert alert-danger">
              Failed to load invoice. Please try again.
            </div>
          )}
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
            disabled={loading || loadingInvoice || !invoice}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Processing...
              </>
            ) : (
              'Process Payment & Clock In'
            )}
          </button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
}
