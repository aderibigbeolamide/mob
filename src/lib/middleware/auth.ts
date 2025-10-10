import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/emr';
import { 
  hasPermission, 
  hasAllPermissions, 
  ResourceAction 
} from '@/lib/middleware/rbac';

export { UserRole };
export type { ResourceAction };

export async function getServerAuthSession(req?: any, res?: any) {
  return await getServerSession(req, res, authOptions);
}

export { getServerAuthSession as getServerSession };

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    // Create a mock res object for NextAuth compatibility
    const mockRes = {
      getHeader: () => null,
      setHeader: () => {},
      getCookies: () => ({}),
      setCookie: () => {},
    };
    
    const session = await getServerSession(req as any, mockRes as any, authOptions);

    if (!session || !session.user) {
      console.log('[requireAuth] No session found');
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    return await handler(req, session);
  } catch (error) {
    console.error('[requireAuth] Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

export function checkRole(allowedRoles: UserRole[]) {
  return async (
    req: NextRequest,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Unauthorized. Please log in.' },
          { status: 401 }
        );
      }

      const userRole = session.user.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { 
            error: 'Forbidden. You do not have permission to access this resource.',
            requiredRoles: allowedRoles,
            userRole: userRole
          },
          { status: 403 }
        );
      }

      return await handler(req, session);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authorization error' },
        { status: 500 }
      );
    }
  };
}

export async function checkBranch(
  req: NextRequest,
  resourceBranchId: string,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;
    const userBranchId = session.user.branch?._id || session.user.branch;

    if (userRole === UserRole.ADMIN) {
      return await handler(req, session);
    }

    if (userBranchId.toString() !== resourceBranchId.toString()) {
      return NextResponse.json(
        { 
          error: 'Forbidden. You do not have access to this branch.',
          userBranch: userBranchId,
          resourceBranch: resourceBranchId
        },
        { status: 403 }
      );
    }

    return await handler(req, session);
  } catch (error) {
    return NextResponse.json(
      { error: 'Branch authorization error' },
      { status: 500 }
    );
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (
    req: NextRequest,
    session: any,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { 
          error: `Forbidden. Required role: ${allowedRoles.join(' or ')}`,
          requiredRoles: allowedRoles,
          userRole: userRole
        },
        { status: 403 }
      );
    }

    return await handler(req, session);
  };
}

export function requirePermission(permission: ResourceAction) {
  return async (
    req: NextRequest,
    session: any,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;

    if (!hasPermission(userRole, permission)) {
      return NextResponse.json(
        { 
          error: `Forbidden. Required permission: ${permission}`,
          requiredPermission: permission,
          userRole: userRole
        },
        { status: 403 }
      );
    }

    return await handler(req, session);
  };
}

export function requireAllPermissions(permissions: ResourceAction[]) {
  return async (
    req: NextRequest,
    session: any,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;

    if (!hasAllPermissions(userRole, permissions)) {
      const missingPermissions = permissions.filter(
        permission => !hasPermission(userRole, permission)
      );

      return NextResponse.json(
        { 
          error: `Forbidden. Missing required permissions: ${missingPermissions.join(', ')}`,
          requiredPermissions: permissions,
          missingPermissions: missingPermissions,
          userRole: userRole
        },
        { status: 403 }
      );
    }

    return await handler(req, session);
  };
}

export function withBranchScope(getResourceBranchId: (req: NextRequest) => string | Promise<string>) {
  return async (
    req: NextRequest,
    session: any,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;
    const userBranchId = session.user.branch?._id || session.user.branch;
    
    // Check if user has a branch assigned (except admins)
    if (userRole !== UserRole.ADMIN && !userBranchId) {
      return NextResponse.json(
        { error: 'Forbidden. No branch assigned to your account. Please contact your administrator.' },
        { status: 403 }
      );
    }
    
    // Admins can access all branches
    if (userRole === UserRole.ADMIN) {
      return await handler(req, session);
    }
    
    // Get resource branch ID
    const resourceBranchId = await getResourceBranchId(req);
    
    // Compare branches
    if (!resourceBranchId || userBranchId.toString() !== resourceBranchId.toString()) {
      return NextResponse.json(
        { 
          error: 'Forbidden. You can only access resources from your branch.',
          userBranch: userBranchId,
          resourceBranch: resourceBranchId
        },
        { status: 403 }
      );
    }

    return await handler(req, session);
  };
}

export function canModifyResource(resourceOwnerId: string) {
  return async (
    req: NextRequest,
    session: any,
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
  ) => {
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userRole = session.user.role as UserRole;
    const userId = session.user.id;

    if (userRole === UserRole.ADMIN) {
      return await handler(req, session);
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Forbidden. User ID not found.' },
        { status: 403 }
      );
    }

    if (!resourceOwnerId || userId.toString() !== resourceOwnerId.toString()) {
      return NextResponse.json(
        { error: 'Forbidden. You can only modify your own resources.' },
        { status: 403 }
      );
    }

    return await handler(req, session);
  };
}

export interface AuthMiddleware {
  requireAuth: typeof requireAuth;
  checkRole: typeof checkRole;
  checkBranch: typeof checkBranch;
  requireRole: typeof requireRole;
  requirePermission: typeof requirePermission;
  requireAllPermissions: typeof requireAllPermissions;
  withBranchScope: typeof withBranchScope;
  canModifyResource: typeof canModifyResource;
}
