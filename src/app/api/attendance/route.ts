import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const body = await req.json();

      const userId = body.userId || session.user.id;
      const branchId = body.branchId || session.user.branch?._id || session.user.branch;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttendance = await Attendance.findOne({
        user: userId,
        date: today
      });

      if (existingAttendance) {
        return NextResponse.json(
          { error: 'Attendance already recorded for today' },
          { status: 409 }
        );
      }

      const attendanceData = {
        user: userId,
        branchId: branchId,
        date: today,
        clockIn: new Date(),
        status: 'present',
        notes: body.notes
      };

      const attendance = await Attendance.create(attendanceData);

      const populatedAttendance = await Attendance.findById(attendance._id)
        .populate('user', 'firstName lastName email')
        .populate('branchId', 'name');

      return NextResponse.json(
        {
          message: 'Clock-in successful',
          attendance: populatedAttendance
        },
        { status: 201 }
      );

    } catch (error: any) {
      console.error('Clock-in error:', error);

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
        { error: 'Failed to record attendance', message: error.message },
        { status: 500 }
      );
    }
  });
}

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);

      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '30');
      const userId = searchParams.get('user');
      const branchId = searchParams.get('branch');
      const status = searchParams.get('status');
      const dateFrom = searchParams.get('dateFrom');
      const dateTo = searchParams.get('dateTo');

      const query: any = {};

      if (userId) {
        query.user = userId;
      }

      if (branchId) {
        query.branchId = branchId;
      }

      if (status && ['present', 'absent', 'on_leave', 'half_day'].includes(status)) {
        query.status = status;
      }

      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) {
          query.date.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.date.$lte = new Date(dateTo);
        }
      }

      const userRole = session.user.role as UserRole;
      if (userRole !== UserRole.ADMIN && userRole !== UserRole.FRONT_DESK) {
        if (!userId || userId !== session.user.id) {
          query.user = session.user.id;
        }
      }

      if (userRole !== UserRole.ADMIN && session.user.branch) {
        const userBranchId = session.user.branch._id || session.user.branch;
        if (!branchId || branchId !== userBranchId.toString()) {
          query.branchId = userBranchId;
        }
      }

      const skip = (page - 1) * limit;

      const [attendanceRecords, totalCount] = await Promise.all([
        Attendance.find(query)
          .populate('user', 'firstName lastName email role')
          .populate('branchId', 'name')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Attendance.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        attendance: attendanceRecords,
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
      console.error('Get attendance error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendance records', message: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const body = await req.json();

      const userId = body.userId || session.user.id;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await Attendance.findOne({
        user: userId,
        date: today
      });

      if (!attendance) {
        return NextResponse.json(
          { error: 'No attendance record found for today' },
          { status: 404 }
        );
      }

      if (attendance.clockOut) {
        return NextResponse.json(
          { error: 'Already clocked out for today' },
          { status: 400 }
        );
      }

      const clockOutTime = new Date();
      const workHours = (clockOutTime.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60);

      attendance.clockOut = clockOutTime;
      attendance.workHours = parseFloat(workHours.toFixed(2));
      
      if (workHours < 4) {
        attendance.status = 'half_day';
      }

      if (body.notes) {
        attendance.notes = body.notes;
      }

      await attendance.save();

      const populatedAttendance = await Attendance.findById(attendance._id)
        .populate('user', 'firstName lastName email')
        .populate('branchId', 'name');

      return NextResponse.json({
        message: 'Clock-out successful',
        attendance: populatedAttendance
      });

    } catch (error: any) {
      console.error('Clock-out error:', error);
      return NextResponse.json(
        { error: 'Failed to clock out', message: error.message },
        { status: 500 }
      );
    }
  });
}
