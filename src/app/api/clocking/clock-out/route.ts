import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PatientVisit from '@/models/PatientVisit';
import Appointment from '@/models/Appointment';
import { checkRole, UserRole } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  return checkRole([UserRole.FRONT_DESK, UserRole.ADMIN])(
    req,
    async (req: NextRequest, session: any) => {
      try {
        await dbConnect();

        const body = await req.json();

        if (!body.visitId) {
          return NextResponse.json(
            { error: 'Visit ID is required' },
            { status: 400 }
          );
        }

        const visit = await PatientVisit.findById(body.visitId);

        if (!visit) {
          return NextResponse.json(
            { error: 'Visit not found' },
            { status: 404 }
          );
        }

        if (visit.status === 'completed') {
          return NextResponse.json(
            { error: 'Visit is already completed' },
            { status: 400 }
          );
        }

        if (visit.currentStage !== 'returned_to_front_desk') {
          return NextResponse.json(
            { 
              error: 'Visit must be in returned_to_front_desk stage to be completed. Current stage: ' + visit.currentStage,
              currentStage: visit.currentStage 
            },
            { status: 400 }
          );
        }

        const updateData: any = {
          status: 'completed',
          currentStage: 'completed',
          'finalClockOut.clockedOutBy': session.user.id,
          'finalClockOut.clockedOutAt': new Date()
        };

        if (body.notes) {
          updateData['finalClockOut.notes'] = body.notes;
        }

        await PatientVisit.findByIdAndUpdate(body.visitId, updateData);

        // Update appointment status to COMPLETED
        if (visit.appointment) {
          await Appointment.findByIdAndUpdate(
            visit.appointment,
            { status: 'COMPLETED' },
            { new: true }
          );
        }

        const updatedVisit = await PatientVisit.findById(body.visitId)
          .populate('patient', 'patientId firstName lastName phoneNumber email')
          .populate('finalClockOut.clockedOutBy', 'firstName lastName email role');

        return NextResponse.json(
          {
            message: 'Patient visit completed successfully',
            visit: updatedVisit
          },
          { status: 200 }
        );

      } catch (error: any) {
        console.error('Clock-out error:', error);
        return NextResponse.json(
          { error: 'Failed to clock out patient', message: error.message },
          { status: 500 }
        );
      }
    }
  );
}
