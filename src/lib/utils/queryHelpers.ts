import { NextRequest } from 'next/server';
import { UserRole } from '@/types/emr';

export interface QueryFilterOptions {
  allowCrossBranch?: boolean;
  requireBranch?: boolean;
}

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
