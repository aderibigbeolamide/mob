import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import StaffProfile from '@/models/StaffProfile';
import Appointment from '@/models/Appointment';
import { requireAuth, checkRole, UserRole } from '@/lib/middleware/auth';
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
          { error: 'Invalid doctor ID' },
          { status: 400 }
        );
      }

      const doctor = await User.findOne({ _id: id, role: UserRole.DOCTOR })
        .populate('branchId', 'name address city state country phone email')
        .lean();

      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        );
      }

      const userRole = session.user.role as UserRole;
      if (userRole !== UserRole.ADMIN) {
        const userBranchId = session.user.branch?._id || session.user.branch;
        const doctorBranchId = (doctor.branchId as any)?._id || doctor.branchId;

        if (userBranchId.toString() !== doctorBranchId.toString()) {
          return NextResponse.json(
            { error: 'Forbidden. You do not have access to this doctor.' },
            { status: 403 }
          );
        }
      }

      const staffProfile = await StaffProfile.findOne({ userId: id }).lean();

      const upcomingAppointments = await Appointment.find({
        doctor: id,
        appointmentDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
      })
        .sort({ appointmentDate: 1 })
        .limit(10)
        .populate('patient', 'firstName lastName patientId phoneNumber')
        .populate('branch', 'name')
        .lean();

      return NextResponse.json({
        doctor: {
          ...doctor,
          profile: staffProfile
        },
        upcomingAppointments
      });

    } catch (error: any) {
      console.error('Get doctor error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch doctor', message: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
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
            { error: 'Invalid doctor ID' },
            { status: 400 }
          );
        }

        const existingDoctor = await User.findOne({ _id: id, role: UserRole.DOCTOR });

        if (!existingDoctor) {
          return NextResponse.json(
            { error: 'Doctor not found' },
            { status: 404 }
          );
        }

        const body = await req.json();

        const updateData: any = {};
        const allowedUserFields = [
          'firstName',
          'lastName',
          'phoneNumber',
          'branchId'
        ];

        allowedUserFields.forEach(field => {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        });

        if (body.email && body.email.toLowerCase() !== existingDoctor.email) {
          const emailExists = await User.findOne({
            email: body.email.toLowerCase(),
            _id: { $ne: id }
          });

          if (emailExists) {
            return NextResponse.json(
              { error: 'Email already exists' },
              { status: 409 }
            );
          }

          updateData.email = body.email;
        }

        if (body.password) {
          updateData.password = body.password;
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        )
          .populate('branchId', 'name address city state');

        const profileUpdateData: any = {};
        const allowedProfileFields = [
          'specialization',
          'licenseNumber',
          'department',
          'bio',
          'profileImage',
          'workSchedule'
        ];

        allowedProfileFields.forEach(field => {
          if (body[field] !== undefined) {
            profileUpdateData[field] = body[field];
          }
        });

        let updatedProfile = null;
        if (Object.keys(profileUpdateData).length > 0) {
          updatedProfile = await StaffProfile.findOneAndUpdate(
            { userId: id },
            { $set: profileUpdateData },
            { new: true, upsert: true, runValidators: true }
          );
        } else {
          updatedProfile = await StaffProfile.findOne({ userId: id });
        }

        return NextResponse.json({
          message: 'Doctor updated successfully',
          doctor: {
            ...updatedUser?.toObject(),
            profile: updatedProfile
          }
        });

      } catch (error: any) {
        console.error('Update doctor error:', error);

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
          { error: 'Failed to update doctor', message: error.message },
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
            { error: 'Invalid doctor ID' },
            { status: 400 }
          );
        }

        const doctor = await User.findOne({ _id: id, role: UserRole.DOCTOR });

        if (!doctor) {
          return NextResponse.json(
            { error: 'Doctor not found' },
            { status: 404 }
          );
        }

        await User.findByIdAndUpdate(
          id,
          { $set: { isActive: false } },
          { new: true }
        );

        return NextResponse.json({
          message: 'Doctor deactivated successfully',
          doctorId: doctor._id
        });

      } catch (error: any) {
        console.error('Delete doctor error:', error);
        return NextResponse.json(
          { error: 'Failed to deactivate doctor', message: error.message },
          { status: 500 }
        );
      }
    }
  );
}
