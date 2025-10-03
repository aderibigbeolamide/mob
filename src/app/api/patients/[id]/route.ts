import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import PatientVisit from '@/models/PatientVisit';
import { requireAuth, checkRole, checkBranch, UserRole } from '@/lib/middleware/auth';
import { uploadPatientImage } from '@/lib/services/cloudinary';
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
          { error: 'Invalid patient ID' },
          { status: 400 }
        );
      }

      const patient = await Patient.findById(id)
        .populate('branchId', 'name address city state country phone email')
        .populate('registeredBy', 'name email role')
        .lean();

      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 }
        );
      }

      const patientBranchId = (patient.branchId as any)?._id || patient.branchId;
      
      if (!canAccessResource(session.user, patientBranchId)) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have access to this patient.' },
          { status: 403 }
        );
      }

      const recentVisits = await PatientVisit.find({ patient: id })
        .sort({ visitDate: -1 })
        .limit(10)
        .populate('branch', 'name')
        .populate('appointment')
        .lean();

      return NextResponse.json({
        patient,
        recentVisits,
        clockingData: recentVisits
      });

    } catch (error: any) {
      console.error('Get patient error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch patient', message: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return checkRole([UserRole.FRONT_DESK, UserRole.DOCTOR, UserRole.ADMIN])(
    req,
    async (req: NextRequest, session: any) => {
      try {
        await dbConnect();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json(
            { error: 'Invalid patient ID' },
            { status: 400 }
          );
        }

        const existingPatient = await Patient.findById(id);

        if (!existingPatient) {
          return NextResponse.json(
            { error: 'Patient not found' },
            { status: 404 }
          );
        }

        if (!canAccessResource(session.user, existingPatient.branchId)) {
          return NextResponse.json(
            { error: 'Forbidden. You do not have access to update this patient.' },
            { status: 403 }
          );
        }

        const body = await req.json();

        let profileImageUrl = body.profileImage;
        if (body.profileImage && body.profileImage.startsWith('data:')) {
          try {
            const uploadResult = await uploadPatientImage(
              body.profileImage,
              existingPatient.patientId
            );
            profileImageUrl = uploadResult.secure_url;
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
          }
        }

        const updateData: any = {};

        const allowedFields = [
          'firstName',
          'lastName',
          'middleName',
          'dateOfBirth',
          'gender',
          'bloodGroup',
          'phoneNumber',
          'email',
          'address',
          'city',
          'state',
          'country',
          'emergencyContact',
          'allergies',
          'chronicConditions',
          'medications',
          'insurance'
        ];

        allowedFields.forEach(field => {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        });

        if (profileImageUrl) {
          updateData.profileImage = profileImageUrl;
        }

        if (body.patientId && body.patientId.toUpperCase() !== existingPatient.patientId) {
          const patientIdExists = await Patient.findOne({ 
            patientId: body.patientId.toUpperCase(),
            _id: { $ne: id }
          });
          
          if (patientIdExists) {
            return NextResponse.json(
              { error: 'Patient ID already exists' },
              { status: 409 }
            );
          }
          
          updateData.patientId = body.patientId.toUpperCase();
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        )
          .populate('branchId', 'name address city state')
          .populate('registeredBy', 'name email');

        return NextResponse.json({
          message: 'Patient updated successfully',
          patient: updatedPatient
        });

      } catch (error: any) {
        console.error('Update patient error:', error);

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
          { error: 'Failed to update patient', message: error.message },
          { status: 500 }
        );
      }
    }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return checkRole([UserRole.ADMIN])(
    req,
    async (req: NextRequest, session: any) => {
      try {
        await dbConnect();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json(
            { error: 'Invalid patient ID' },
            { status: 400 }
          );
        }

        const patient = await Patient.findById(id);

        if (!patient) {
          return NextResponse.json(
            { error: 'Patient not found' },
            { status: 404 }
          );
        }

        await Patient.findByIdAndUpdate(
          id,
          { $set: { isActive: false } },
          { new: true }
        );

        return NextResponse.json({
          message: 'Patient deactivated successfully',
          patientId: patient.patientId
        });

      } catch (error: any) {
        console.error('Delete patient error:', error);
        return NextResponse.json(
          { error: 'Failed to deactivate patient', message: error.message },
          { status: 500 }
        );
      }
    }
  );
}
