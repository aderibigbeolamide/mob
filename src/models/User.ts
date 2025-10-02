import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'front_desk' | 'nurse' | 'doctor' | 'lab' | 'pharmacy' | 'billing' | 'accounting';
  branch: mongoose.Types.ObjectId;
  specialization?: string;
  licenseNumber?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'front_desk', 'nurse', 'doctor', 'lab', 'pharmacy', 'billing', 'accounting'],
    required: true
  },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  specialization: { type: String },
  licenseNumber: { type: String },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
