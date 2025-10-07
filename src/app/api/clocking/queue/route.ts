import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

const ROLE_TO_STAGE: Record<string, string> = {
  [UserRole.FRONT_DESK]: 'front_desk',
  [UserRole.NURSE]: 'nurse',
  [UserRole.DOCTOR]: 'doctor',
  [UserRole.LAB]: 'lab',
  [UserRole.PHARMACY]: 'pharmacy',
  [UserRole.BILLING]: 'billing'
};

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const userRole = session.user.role as UserRole;
      const userStage = ROLE_TO_STAGE[userRole];

      if (!userStage && userRole !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: 'Your role does not have a queue' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const search = searchParams.get('search') || '';

      const query: any = {
        status: 'in_progress'
      };

      if (userRole === UserRole.ADMIN) {
        const stageFilter = searchParams.get('stage');
        if (stageFilter) {
          query.currentStage = stageFilter;
        }
      } else {
        query.currentStage = userStage;
      }

      const userBranchId = session.user.branch?._id || session.user.branch;
      if (userRole !== UserRole.ADMIN && userBranchId) {
        query.branchId = userBranchId;
      }

      if (search) {
        const Patient = (await import('@/models/Patient')).default;
        const patients = await Patient.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { patientId: { $regex: search, $options: 'i' } }
          ]
        }).select('_id');

        const patientIds = patients.map(p => p._id);

        query.$or = [
          { patient: { $in: patientIds } },
          { visitNumber: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;

      const [visits, totalCount] = await Promise.all([
        PatientVisit.find(query)
          .populate('patient', 'patientId firstName lastName phoneNumber email dateOfBirth gender')
          .populate('appointment', 'appointmentNumber reasonForVisit')
          .populate('assignedDoctor', 'firstName lastName email role')
          .populate('branchId', 'name address city state')
          .populate('stages.frontDesk.clockedInBy', 'firstName lastName email role')
          .populate('stages.nurse.clockedInBy', 'firstName lastName email role')
          .populate('stages.doctor.clockedInBy', 'firstName lastName email role')
          .populate('stages.lab.clockedInBy', 'firstName lastName email role')
          .populate('stages.pharmacy.clockedInBy', 'firstName lastName email role')
          .populate('stages.billing.clockedInBy', 'firstName lastName email role')
          .sort({ visitDate: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PatientVisit.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        queue: visits,
        currentStage: userStage || 'all',
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error: any) {
      console.error('Get queue error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch queue', message: error.message },
        { status: 500 }
      );
    }
  });
}
