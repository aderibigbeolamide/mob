import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  patientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: string;
  city: string;
  state: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil?: Date;
  };
  medicalHistory?: string;
  allergies?: string[];
  avatar?: string;
  branch: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, lowercase: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  bloodGroup: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  insurance: {
    provider: { type: String },
    policyNumber: { type: String },
    validUntil: { type: Date }
  },
  medicalHistory: { type: String },
  allergies: [{ type: String }],
  avatar: { type: String },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
