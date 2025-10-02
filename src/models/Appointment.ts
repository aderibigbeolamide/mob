import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  appointmentNumber: string;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  type: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  appointmentNumber: { type: String, required: true, unique: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  duration: { type: Number, default: 30 },
  type: {
    type: String,
    enum: ['consultation', 'follow_up', 'emergency', 'routine_checkup'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  reason: { type: String, required: true },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cancelReason: { type: String },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
