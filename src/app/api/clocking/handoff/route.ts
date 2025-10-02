import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import User from '@/models/User';
import { requireAuth, UserRole } from '@/lib/middleware/auth';
import { sendBulkNotifications } from '@/lib/services/notification';

const STAGE_WORKFLOW: Record<string, string> = {
  'front_desk': 'nurse',
  'nurse': 'doctor',
  'doctor': 'lab',
  'lab': 'pharmacy',
  'pharmacy': 'billing',
  'billing': 'returned_to_front_desk'
};

const ROLE_TO_STAGE: Record<string, string> = {
  [UserRole.FRONT_DESK]: 'front_desk',
  [UserRole.NURSE]: 'nurse',
  [UserRole.DOCTOR]: 'doctor',
  [UserRole.LAB]: 'lab',
  [UserRole.PHARMACY]: 'pharmacy',
  [UserRole.BILLING]: 'billing'
};

const STAGE_TO_ROLE: Record<string, UserRole> = {
  'nurse': UserRole.NURSE,
  'doctor': UserRole.DOCTOR,
  'lab': UserRole.LAB,
  'pharmacy': UserRole.PHARMACY,
  'billing': UserRole.BILLING,
  'returned_to_front_desk': UserRole.FRONT_DESK
};

function getStageFieldName(stage: string): string {
  const stageMap: Record<string, string> = {
    'front_desk': 'frontDesk',
    'nurse': 'nurse',
    'doctor': 'doctor',
    'lab': 'lab',
    'pharmacy': 'pharmacy',
    'billing': 'billing',
    'returned_to_front_desk': 'returnedToFrontDesk'
  };
  return stageMap[stage] || stage;
}

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

      const userRole = session.user.role as UserRole;
      const expectedStage = ROLE_TO_STAGE[userRole];

      if (!expectedStage) {
        return NextResponse.json(
          { error: 'Your role cannot perform handoffs' },
          { status: 403 }
        );
      }

      if (visit.currentStage === 'returned_to_front_desk' && userRole === UserRole.FRONT_DESK) {
        return NextResponse.json(
          { 
            error: 'Patient has been returned to Front Desk. Please use the clock-out endpoint to complete the visit.',
            currentStage: visit.currentStage
          },
          { status: 400 }
        );
      }

      if (visit.currentStage !== expectedStage) {
        return NextResponse.json(
          { 
            error: `Cannot hand off from this stage. Patient is currently at ${visit.currentStage} stage`,
            currentStage: visit.currentStage,
            yourStage: expectedStage
          },
          { status: 400 }
        );
      }

      const currentStage = visit.currentStage;
      const nextStage = STAGE_WORKFLOW[currentStage as keyof typeof STAGE_WORKFLOW];
      
      if (!nextStage) {
        return NextResponse.json(
          { error: 'Invalid current stage or workflow' },
          { status: 400 }
        );
      }

      const requiredRole = STAGE_TO_ROLE[currentStage as keyof typeof STAGE_TO_ROLE];
      if (requiredRole && session.user.role !== requiredRole && session.user.role !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: 'You cannot hand off from this stage' },
          { status: 403 }
        );
      }

      const currentStageField = getStageFieldName(visit.currentStage);
      const updateData: any = {
        currentStage: nextStage,
        [`stages.${currentStageField}.clockedOutBy`]: session.user.id,
        [`stages.${currentStageField}.clockedOutAt`]: new Date()
      };

      if (body.notes) {
        updateData[`stages.${currentStageField}.notes`] = body.notes;
      }

      if (body.nextAction) {
        updateData[`stages.${currentStageField}.nextAction`] = body.nextAction;
      }

      if (body.vitalSigns && currentStageField === 'nurse') {
        updateData[`stages.nurse.vitalSigns`] = body.vitalSigns;
      }

      if (body.diagnosis && currentStageField === 'doctor') {
        updateData[`stages.doctor.diagnosis`] = body.diagnosis;
      }

      if (nextStage !== 'completed') {
        const nextStageField = getStageFieldName(nextStage);
        updateData[`stages.${nextStageField}.clockedInBy`] = session.user.id;
        updateData[`stages.${nextStageField}.clockedInAt`] = new Date();

        const nextRole = STAGE_TO_ROLE[nextStage];
        if (nextRole) {
          const nextStaffMembers = await User.find({
            role: nextRole,
            branchId: visit.branch,
            isActive: true
          });

          if (nextStaffMembers.length > 0) {
            const notifications = nextStaffMembers.map(staff => ({
              recipient: staff.email,
              subject: `New Patient Handoff - ${(visit.patient as any).firstName} ${(visit.patient as any).lastName}`,
              message: `A patient has been handed off to ${nextRole}.\n\nVisit Number: ${visit.visitNumber}\nPatient: ${(visit.patient as any).firstName} ${(visit.patient as any).lastName}\nStage: ${nextStage}\n\nPlease attend to the patient.`,
              type: 'email' as const
            }));

            await sendBulkNotifications(notifications);
          }
        }
      } else {
        updateData.status = 'completed';
      }

      const updatedVisit = await PatientVisit.findByIdAndUpdate(
        body.visitId,
        updateData,
        { new: true }
      )
        .populate('patient', 'patientId firstName lastName phoneNumber email dateOfBirth gender')
        .populate('appointment')
        .populate('branch', 'name address city state')
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
          message: `Patient handed off to ${nextStage} successfully`,
          visit: updatedVisit
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error('Handoff error:', error);
      return NextResponse.json(
        { error: 'Failed to hand off patient', message: error.message },
        { status: 500 }
      );
    }
  });
}
