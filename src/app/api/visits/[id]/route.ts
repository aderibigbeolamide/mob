import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import LabTest from '@/models/LabTest';
import Prescription from '@/models/Prescription';
import { requireAuth, checkRole, UserRole } from '@/lib/middleware/auth';
import { canAccessResource } from '@/lib/utils/queryHelpers';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { id } = params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: 'Invalid visit ID' },
          { status: 400 }
        );
      }

      const visit = await PatientVisit.findById(id)
        .populate('patient', 'firstName lastName patientId phoneNumber email allergies chronicConditions')
        .populate('branch', 'name address city state')
        .populate('appointment')
        .populate('stages.frontDesk.clockedInBy', 'firstName lastName')
        .populate('stages.frontDesk.clockedOutBy', 'firstName lastName')
        .populate('stages.nurse.clockedInBy', 'firstName lastName')
        .populate('stages.nurse.clockedOutBy', 'firstName lastName')
        .populate('stages.doctor.clockedInBy', 'firstName lastName')
        .populate('stages.doctor.clockedOutBy', 'firstName lastName')
        .populate('stages.lab.clockedInBy', 'firstName lastName')
        .populate('stages.lab.clockedOutBy', 'firstName lastName')
        .populate('stages.pharmacy.clockedInBy', 'firstName lastName')
        .populate('stages.pharmacy.clockedOutBy', 'firstName lastName')
        .populate('stages.billing.clockedInBy', 'firstName lastName')
        .populate('stages.billing.clockedOutBy', 'firstName lastName')
        .populate('finalClockOut.clockedOutBy', 'firstName lastName')
        .lean();

      if (!visit) {
        return NextResponse.json(
          { error: 'Visit not found' },
          { status: 404 }
        );
      }

      const visitBranchId = (visit.branch as any)?._id || visit.branch;
      
      if (!canAccessResource(session.user, visitBranchId)) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have access to this visit.' },
          { status: 403 }
        );
      }

      const [labTests, prescriptions] = await Promise.all([
        LabTest.find({ visit: id })
          .populate('doctor', 'firstName lastName')
          .populate('result.performedBy', 'firstName lastName')
          .lean(),
        Prescription.find({ visit: id })
          .populate('doctor', 'firstName lastName')
          .populate('dispensedBy', 'firstName lastName')
          .lean()
      ]);

      return NextResponse.json({
        visit,
        labTests,
        prescriptions
      });

    } catch (error: any) {
      console.error('Get visit error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visit', message: error.message },
        { status: 500 }
      );
    }
  });
}
