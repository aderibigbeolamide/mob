import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LabTest from '@/models/LabTest';
import Patient from '@/models/Patient';
import { requireAuth, checkRole, UserRole } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  return checkRole([UserRole.DOCTOR, UserRole.LAB, UserRole.ADMIN])(
    req,
    async (req: NextRequest, session: any) => {
      try {
        await dbConnect();

        const body = await req.json();

        const requiredFields = [
          'patient',
          'doctor',
          'visit',
          'branch',
          'testName',
          'testCategory'
        ];

        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
          return NextResponse.json(
            { error: `Missing required fields: ${missingFields.join(', ')}` },
            { status: 400 }
          );
        }

        const patient = await Patient.findById(body.patient);
        if (!patient) {
          return NextResponse.json(
            { error: 'Patient not found' },
            { status: 404 }
          );
        }

        const testCount = await LabTest.countDocuments();
        const testNumber = `TE${String(testCount + 1).padStart(6, '0')}`;

        const labTestData = {
          testNumber,
          patient: body.patient,
          doctor: body.doctor,
          visit: body.visit,
          branch: body.branch,
          testName: body.testName,
          testCategory: body.testCategory,
          description: body.description,
          priority: body.priority || 'routine',
          requestedBy: session.user.id,
          requestedAt: new Date()
        };

        const labTest = await LabTest.create(labTestData);

        const populatedLabTest = await LabTest.findById(labTest._id)
          .populate('patient', 'firstName lastName patientId phoneNumber')
          .populate('doctor', 'firstName lastName')
          .populate('branch', 'name')
          .populate('requestedBy', 'firstName lastName');

        return NextResponse.json(
          {
            message: 'Lab test created successfully',
            labTest: populatedLabTest
          },
          { status: 201 }
        );

      } catch (error: any) {
        console.error('Create lab test error:', error);

        if (error.name === 'ValidationError') {
          const validationErrors = Object.keys(error.errors).map(
            key => error.errors[key].message
          );
          return NextResponse.json(
            { error: 'Validation error', details: validationErrors },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to create lab test', message: error.message },
          { status: 500 }
        );
      }
    }
  );
}

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
      const doctorId = searchParams.get('doctor');
      const visitId = searchParams.get('visit');
      const status = searchParams.get('status');
      const priority = searchParams.get('priority');
      const category = searchParams.get('category');

      const query: any = {};

      if (search) {
        query.$or = [
          { testNumber: { $regex: search, $options: 'i' } },
          { testName: { $regex: search, $options: 'i' } },
          { testCategory: { $regex: search, $options: 'i' } }
        ];
      }

      if (branchId) {
        query.branch = branchId;
      }

      if (patientId) {
        query.patient = patientId;
      }

      if (doctorId) {
        query.doctor = doctorId;
      }

      if (visitId) {
        query.visit = visitId;
      }

      if (status && ['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        query.status = status;
      }

      if (priority && ['routine', 'urgent', 'stat'].includes(priority)) {
        query.priority = priority;
      }

      if (category) {
        query.testCategory = { $regex: category, $options: 'i' };
      }

      const userRole = session.user.role as UserRole;
      if (userRole !== UserRole.ADMIN && session.user.branch) {
        const userBranchId = session.user.branch._id || session.user.branch;
        if (!branchId || branchId !== userBranchId.toString()) {
          query.branch = userBranchId;
        }
      }

      const skip = (page - 1) * limit;

      const [labTests, totalCount] = await Promise.all([
        LabTest.find(query)
          .populate('patient', 'firstName lastName patientId phoneNumber')
          .populate('doctor', 'firstName lastName')
          .populate('branch', 'name')
          .populate('requestedBy', 'firstName lastName')
          .populate('result.performedBy', 'firstName lastName')
          .sort({ requestedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        LabTest.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        labTests,
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
      console.error('Get lab tests error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lab tests', message: error.message },
        { status: 500 }
      );
    }
  });
}
