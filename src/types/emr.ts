export enum UserRole {
  ADMIN = 'ADMIN',
  FRONT_DESK = 'FRONT_DESK',
  NURSE = 'NURSE',
  DOCTOR = 'DOCTOR',
  LAB = 'LAB',
  PHARMACY = 'PHARMACY',
  BILLING = 'BILLING',
  ACCOUNTING = 'ACCOUNTING'
}

export enum ClockStatus {
  CLOCKED_IN = 'CLOCKED_IN',
  WITH_NURSE = 'WITH_NURSE',
  WITH_DOCTOR = 'WITH_DOCTOR',
  WITH_LAB = 'WITH_LAB',
  WITH_PHARMACY = 'WITH_PHARMACY',
  WITH_BILLING = 'WITH_BILLING',
  COMPLETED = 'COMPLETED',
  CHECKED_OUT = 'CHECKED_OUT'
}

export interface Branch {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Patient {
  _id?: string;
  patientId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  branch: string | Branch;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  _id?: string;
  appointmentId: string;
  patient: string | Patient;
  doctor?: string;
  branch: string | Branch;
  appointmentDate: Date;
  appointmentTime: string;
  reason: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  clockStatus?: ClockStatus;
  notes?: string;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    pulse?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };
  diagnosis?: string;
  prescription?: string;
  labTests?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffProfile {
  _id?: string;
  userId: string;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  bio?: string;
  profileImage?: string;
  workSchedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Doctor {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  branchId: string | Branch;
  isActive: boolean;
  profile?: StaffProfile;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Staff {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  branchId: string | Branch;
  isActive: boolean;
  profile?: StaffProfile;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
