import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);
