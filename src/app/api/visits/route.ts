import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import Patient from '@/models/Patient';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);

      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const search = searchParams.get('search') || '';
      const branchId = searchParams.get('branch');
      const patientId = searchParams.get('patient');
      const currentStage = searchParams.get('stage');
      const status = searchParams.get('status');
      const dateFrom = searchParams.get('dateFrom');
      const dateTo = searchParams.get('dateTo');

      const query: any = {};

      if (search) {
        const patients = await Patient.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { patientId: { $regex: search, $options: 'i' } }
          ]
        }).select('_id');

        const patientIds = patients.map(p => p._id);
        query.$or = [
          { visitNumber: { $regex: search, $options: 'i' } },
          { patient: { $in: patientIds } }
        ];
      }

      if (branchId) {
        query.branch = branchId;
      }

      if (patientId) {
        query.patient = patientId;
      }

      if (currentStage) {
        query.currentStage = currentStage;
      }

      if (status && ['in_progress', 'completed', 'cancelled'].includes(status)) {
        query.status = status;
      }

      if (dateFrom || dateTo) {
        query.visitDate = {};
        if (dateFrom) {
          query.visitDate.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.visitDate.$lte = new Date(dateTo);
        }
      }

      const userRole = session.user.role as UserRole;
      if (userRole !== UserRole.ADMIN && session.user.branch) {
        const userBranchId = session.user.branch._id || session.user.branch;
        if (!branchId || branchId !== userBranchId.toString()) {
          query.branch = userBranchId;
        }
      }

      const skip = (page - 1) * limit;

      const [visits, totalCount] = await Promise.all([
        PatientVisit.find(query)
          .populate('patient', 'firstName lastName patientId phoneNumber')
          .populate('branch', 'name')
          .populate('appointment')
          .sort({ visitDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PatientVisit.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        visits,
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
      console.error('Get visits error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visits', message: error.message },
        { status: 500 }
      );
    }
  });
}
