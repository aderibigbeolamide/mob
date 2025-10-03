import { NextRequest } from 'next/server';
import { UserRole } from '@/types/emr';

export interface BranchFilterOptions {
  allowCrossBranch?: boolean;
  requireBranch?: boolean;
}

export function extractBranchId(session: any): string | null {
  if (!session?.user?.branch) {
    return null;
  }
  return session.user.branch._id?.toString() || session.user.branch.toString();
}

export function shouldApplyBranchFilter(
  session: any,
  req: NextRequest,
  options: BranchFilterOptions = {}
): boolean {
  const userRole = session?.user?.role as UserRole;
  
  if (userRole === UserRole.ADMIN) {
    const { searchParams } = new URL(req.url);
    const allBranches = searchParams.get('allBranches') === 'true';
    
    if (options.allowCrossBranch && allBranches) {
      return false;
    }
  }
  
  return userRole !== UserRole.ADMIN;
}

export function getBranchFilterFromSession(
  session: any,
  req: NextRequest,
  options: BranchFilterOptions = {}
): string | null {
  const shouldFilter = shouldApplyBranchFilter(session, req, options);
  
  if (!shouldFilter) {
    return null;
  }
  
  const branchId = extractBranchId(session);
  
  if (!branchId && options.requireBranch) {
    throw new Error('User branch not found in session');
  }
  
  return branchId;
}

export function applyBranchFilterToQuery(
  query: any,
  session: any,
  req: NextRequest,
  options: BranchFilterOptions = {}
): void {
  const branchId = getBranchFilterFromSession(session, req, options);
  
  if (branchId) {
    const branchIdField = query.branchId !== undefined ? 'branchId' : 'branch';
    query[branchIdField] = branchId;
  }
}

export function validateBranchAccess(
  session: any,
  resourceBranchId: string | undefined | null
): boolean {
  const userRole = session?.user?.role as UserRole;
  
  if (userRole === UserRole.ADMIN) {
    return true;
  }
  
  if (!resourceBranchId) {
    return false;
  }
  
  const userBranchId = extractBranchId(session);
  
  if (!userBranchId) {
    return false;
  }
  
  return userBranchId.toString() === resourceBranchId.toString();
}
