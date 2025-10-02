import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import StaffProfile from '@/models/StaffProfile';
import { requireAuth, checkRole, UserRole } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  return checkRole([UserRole.ADMIN])(
    req,
    async (req: NextRequest, session: any) => {
      try {
        await dbConnect();

        const body = await req.json();

        const requiredFields = [
          'email',
          'password',
          'firstName',
          'lastName',
          'phoneNumber',
          'branchId'
        ];

        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
          return NextResponse.json(
            { error: `Missing required fields: ${missingFields.join(', ')}` },
            { status: 400 }
          );
        }

        const existingUser = await User.findOne({ email: body.email.toLowerCase() });
        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 409 }
          );
        }

        const userData = {
          email: body.email,
          password: body.password,
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNumber: body.phoneNumber,
          role: UserRole.DOCTOR,
          branchId: body.branchId,
          isActive: true
        };

        const user = await User.create(userData);

        const staffProfileData = {
          userId: user._id,
          specialization: body.specialization,
          licenseNumber: body.licenseNumber,
          department: body.department,
          bio: body.bio,
          profileImage: body.profileImage,
          workSchedule: body.workSchedule || []
        };

        await StaffProfile.create(staffProfileData);

        const populatedUser = await User.findById(user._id)
          .populate('branchId', 'name address city state')
          .lean();

        const staffProfile = await StaffProfile.findOne({ userId: user._id }).lean();

        return NextResponse.json(
          {
            message: 'Doctor created successfully',
            doctor: {
              ...populatedUser,
              profile: staffProfile
            }
          },
          { status: 201 }
        );

      } catch (error: any) {
        console.error('Create doctor error:', error);

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
          { error: 'Failed to create doctor', message: error.message },
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
      const department = searchParams.get('department');
      const specialization = searchParams.get('specialization');
      const status = searchParams.get('status');

      const query: any = { role: UserRole.DOCTOR };

      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ];
      }

      if (branchId) {
        query.branchId = branchId;
      }

      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      const userRole = session.user.role as UserRole;
      if (userRole !== UserRole.ADMIN && session.user.branch) {
        const userBranchId = session.user.branch._id || session.user.branch;
        if (!branchId || branchId !== userBranchId.toString()) {
          query.branchId = userBranchId;
        }
      }

      const skip = (page - 1) * limit;

      const [doctors, totalCount] = await Promise.all([
        User.find(query)
          .populate('branchId', 'name address city state')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query)
      ]);

      const doctorIds = doctors.map(doc => doc._id);
      const staffProfiles = await StaffProfile.find({ 
        userId: { $in: doctorIds } 
      }).lean();

      const profileMap = new Map(
        staffProfiles.map(profile => [profile.userId.toString(), profile])
      );

      const doctorsWithProfiles = doctors.map(doctor => ({
        ...doctor,
        profile: profileMap.get((doctor._id as any).toString()) || null
      }));

      let filteredDoctors = doctorsWithProfiles;
      
      if (department) {
        filteredDoctors = filteredDoctors.filter(
          doc => doc.profile?.department?.toLowerCase().includes(department.toLowerCase())
        );
      }

      if (specialization) {
        filteredDoctors = filteredDoctors.filter(
          doc => doc.profile?.specialization?.toLowerCase().includes(specialization.toLowerCase())
        );
      }

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        doctors: filteredDoctors,
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
      console.error('Get doctors error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch doctors', message: error.message },
        { status: 500 }
      );
    }
  });
}
