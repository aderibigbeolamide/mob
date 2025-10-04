import { NextRequest } from 'next/server';
import { UserRole } from '@/types/emr';

export interface QueryFilterOptions {
  allowCrossBranch?: boolean;
  requireBranch?: boolean;
}

/**
 * Apply branch-based filtering to database queries
 * - Admin users bypass all filtering
 * - When allowCrossBranch is true, non-admin users can view data from all branches
 * - When allowCrossBranch is false, non-admin users can only view their branch's data
 * 
 * Cross-branch viewing is enabled by default for READ operations to allow inter-branch
 * communication and coordination. WRITE operations should always enforce branch restrictions.
 */
export function applyBranchFilter(
  query: any,
  user: any,
  allowCrossBranch: boolean = false,
  fieldName: string = 'branchId'
): any {
  const userRole = user?.role as UserRole;
  
  if (userRole === UserRole.ADMIN) {
    return query;
  }
  
  if (allowCrossBranch) {
    return query;
  }
  
  if (user?.branch) {
    const branchId = user.branch._id || user.branch;
    query[fieldName] = branchId;
  }
  
  return query;
}

export function getBranchFilter(
  user: any,
  allowCrossBranch: boolean = false
): any {
  const userRole = user?.role as UserRole;
  
  if (userRole === UserRole.ADMIN) {
    return {};
  }
  
  if (allowCrossBranch) {
    return {};
  }
  
  if (user?.branch) {
    const branchId = user.branch._id || user.branch;
    return { branchId };
  }
  
  return {};
}

export function shouldAllowCrossBranch(req: NextRequest): boolean {
  const { searchParams } = new URL(req.url);
  return searchParams.get('allBranches') === 'true';
}

export function getUserBranchId(user: any): string | null {
  if (!user?.branch) {
    return null;
  }
  return user.branch._id?.toString() || user.branch.toString();
}

export function isAdminUser(user: any): boolean {
  return user?.role === UserRole.ADMIN;
}

/**
 * Check if a user can EDIT/DELETE a resource based on branch ownership
 * - Admin users have full access
 * - Non-admin users can only edit/delete resources from their own branch
 * 
 * Note: This function enforces WRITE restrictions. For READ operations,
 * cross-branch viewing is enabled by default (see applyBranchFilter).
 */
export function canAccessResource(
  user: any,
  resourceBranchId: string | undefined | null
): boolean {
  if (isAdminUser(user)) {
    return true;
  }
  
  if (!resourceBranchId) {
    return false;
  }
  
  const userBranchId = getUserBranchId(user);
  
  if (!userBranchId) {
    return false;
  }
  
  return userBranchId === resourceBranchId.toString();
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export function extractPaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20')
  };
}

export function buildPaginationResponse(
  currentPage: number,
  totalCount: number,
  limit: number
) {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    currentPage,
    totalPages,
    totalCount,
    limit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}
