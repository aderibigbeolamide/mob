import { NextRequest, NextResponse } from 'next/server';
import { getServerSession as nextAuthGetServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/emr';

export { UserRole };

export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions);
}

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    return await handler(req, session);
  } catch (error) {
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
      const session = await getServerSession();

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
    const session = await getServerSession();

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

export interface AuthMiddleware {
  requireAuth: typeof requireAuth;
  checkRole: typeof checkRole;
  checkBranch: typeof checkBranch;
  getServerSession: typeof getServerSession;
}
