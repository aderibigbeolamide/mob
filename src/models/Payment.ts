import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentNumber: string;
  billing: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'paystack';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  paystackReference?: string;
  paystackStatus?: string;
  paystackData?: any;
  
  transactionReference?: string;
  receiptNumber?: string;
  notes?: string;
  
  processedBy: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  paymentNumber: { type: String, required: true, unique: true },
  billing: { type: Schema.Types.ObjectId, ref: 'Billing', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'insurance', 'paystack'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paystackReference: { type: String },
  paystackStatus: { type: String },
  paystackData: { type: Schema.Types.Mixed },
  
  transactionReference: { type: String },
  receiptNumber: { type: String },
  notes: { type: String },
  
  processedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
  paymentDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
