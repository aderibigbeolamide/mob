import { UserRole } from '@/types/emr';
import { Session } from 'next-auth';

export interface RoleScopedFilter {
  branchFilter: Record<string, any>;
  doctorFilter?: Record<string, any>;
  nurseFilter?: Record<string, any>;
  labFilter?: Record<string, any>;
  pharmacyFilter?: Record<string, any>;
  billingFilter?: Record<string, any>;
  accountingFilter?: Record<string, any>;
  appointmentFilter?: Record<string, any>;
  patientFilter?: Record<string, any>;
}

export function buildRoleScopedFilters(session: Session): RoleScopedFilter {
  const userRole = session.user.role as UserRole;
  const userId = session.user.id;
  const branchId = session.user.branch?._id || session.user.branch;

  const baseFilter = {
    branchFilter: { branchId },
  };

  switch (userRole) {
    case UserRole.ADMIN:
      return {
        ...baseFilter,
        appointmentFilter: { branchId },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.DOCTOR:
      return {
        ...baseFilter,
        doctorFilter: { doctorId: userId },
        appointmentFilter: { branchId, doctorId: userId },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.NURSE:
      return {
        ...baseFilter,
        nurseFilter: { nurseId: userId },
        appointmentFilter: { branchId },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.FRONT_DESK:
      return {
        ...baseFilter,
        appointmentFilter: { branchId },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.LAB:
      return {
        ...baseFilter,
        labFilter: { branchId, status: { $in: ['pending', 'in_progress'] } },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.PHARMACY:
      return {
        ...baseFilter,
        pharmacyFilter: { branchId, status: { $in: ['pending', 'ready'] } },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.BILLING:
      return {
        ...baseFilter,
        billingFilter: { branchId, status: { $in: ['pending', 'partial'] } },
        patientFilter: { branchId, isActive: true },
      };

    case UserRole.ACCOUNTING:
      return {
        ...baseFilter,
        accountingFilter: { branchId },
        patientFilter: { branchId, isActive: true },
      };

    default:
      return baseFilter;
  }
}

export function canEditResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId?: string
): boolean {
  if (userRole === UserRole.ADMIN) {
    return true;
  }

  if (!resourceOwnerId) {
    return true;
  }

  return userId === resourceOwnerId;
}

export function canViewResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId?: string
): boolean {
  return true;
}
