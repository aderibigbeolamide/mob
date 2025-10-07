import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const body = await req.json();

      if (!body.visitId) {
        return NextResponse.json(
          { error: 'Visit ID is required' },
          { status: 400 }
        );
      }

      if (!body.diagnosis || !body.diagnosis.trim()) {
        return NextResponse.json(
          { error: 'Diagnosis is required' },
          { status: 400 }
        );
      }

      const userRole = session.user.role as UserRole;

      if (userRole !== UserRole.DOCTOR && userRole !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: 'Only doctors can clock in and record consultation' },
          { status: 403 }
        );
      }

      const visit = await PatientVisit.findById(body.visitId)
        .populate('patient', 'patientId firstName lastName phoneNumber email');

      if (!visit) {
        return NextResponse.json(
          { error: 'Visit not found' },
          { status: 404 }
        );
      }

      if (visit.status !== 'in_progress') {
        return NextResponse.json(
          { error: 'Visit is not in progress' },
          { status: 400 }
        );
      }

      if (visit.currentStage !== 'doctor') {
        return NextResponse.json(
          { 
            error: `Cannot clock in. Patient is currently at ${visit.currentStage} stage`,
            currentStage: visit.currentStage
          },
          { status: 400 }
        );
      }

      if (visit.stages.doctor?.clockedInAt) {
        return NextResponse.json(
          { error: 'Doctor has already clocked in for this visit' },
          { status: 400 }
        );
      }

      const updateData: any = {
        'stages.doctor.clockedInBy': session.user.id,
        'stages.doctor.clockedInAt': new Date(),
        'stages.doctor.diagnosis': body.diagnosis.trim()
      };

      if (body.chiefComplaint && body.chiefComplaint.trim()) {
        updateData['stages.doctor.chiefComplaint'] = body.chiefComplaint.trim();
      }

      if (body.historyOfPresentIllness && body.historyOfPresentIllness.trim()) {
        updateData['stages.doctor.historyOfPresentIllness'] = body.historyOfPresentIllness.trim();
      }

      if (body.physicalExamination && body.physicalExamination.trim()) {
        updateData['stages.doctor.physicalExamination'] = body.physicalExamination.trim();
      }

      if (body.treatmentPlan && body.treatmentPlan.trim()) {
        updateData['stages.doctor.treatmentPlan'] = body.treatmentPlan.trim();
      }

      if (body.prescriptions && Array.isArray(body.prescriptions) && body.prescriptions.length > 0) {
        updateData['stages.doctor.prescriptions'] = body.prescriptions;
      }

      if (body.labOrders && Array.isArray(body.labOrders) && body.labOrders.length > 0) {
        updateData['stages.doctor.labOrders'] = body.labOrders;
      }

      if (body.followUpInstructions && body.followUpInstructions.trim()) {
        updateData['stages.doctor.followUpInstructions'] = body.followUpInstructions.trim();
      }

      if (body.notes && body.notes.trim()) {
        updateData['stages.doctor.notes'] = body.notes.trim();
      }

      const updatedVisit = await PatientVisit.findByIdAndUpdate(
        body.visitId,
        updateData,
        { new: true }
      )
        .populate('patient', 'patientId firstName lastName phoneNumber email dateOfBirth gender')
        .populate('appointment')
        .populate('branchId', 'name address city state')
        .populate('assignedDoctor', 'firstName lastName email')
        .populate('stages.frontDesk.clockedInBy', 'firstName lastName email role')
        .populate('stages.frontDesk.clockedOutBy', 'firstName lastName email role')
        .populate('stages.nurse.clockedInBy', 'firstName lastName email role')
        .populate('stages.nurse.clockedOutBy', 'firstName lastName email role')
        .populate('stages.doctor.clockedInBy', 'firstName lastName email role')
        .populate('stages.doctor.clockedOutBy', 'firstName lastName email role')
        .populate('stages.lab.clockedInBy', 'firstName lastName email role')
        .populate('stages.lab.clockedOutBy', 'firstName lastName email role')
        .populate('stages.pharmacy.clockedInBy', 'firstName lastName email role')
        .populate('stages.pharmacy.clockedOutBy', 'firstName lastName email role')
        .populate('stages.billing.clockedInBy', 'firstName lastName email role')
        .populate('stages.billing.clockedOutBy', 'firstName lastName email role')
        .populate('stages.returnedToFrontDesk.clockedInBy', 'firstName lastName email role')
        .populate('stages.returnedToFrontDesk.clockedOutBy', 'firstName lastName email role');

      return NextResponse.json(
        {
          message: 'Consultation recorded and clocked in successfully',
          visit: updatedVisit
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error('Doctor clock-in error:', error);
      return NextResponse.json(
        { error: 'Failed to clock in and record consultation', message: error.message },
        { status: 500 }
      );
    }
  });
}
