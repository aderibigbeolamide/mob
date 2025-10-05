import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import PatientVisit from '@/models/PatientVisit';
import Payment from '@/models/Payment';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const userBranchId = session.user.branch?._id || session.user.branch;

      if (!userBranchId) {
        return NextResponse.json(
          { error: 'Branch ID is required. Please contact your administrator.' },
          { status: 400 }
        );
      }

      const branchFilter = { branchId: userBranchId };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const [
        totalPatients,
        patientsLastMonth,
        totalAppointments,
        appointmentsLastMonth,
        totalDoctors,
        doctorsLastMonth,
        totalPayments,
        paymentsLastMonth,
        totalVisitsToday,
        pendingAppointments,
        recentPatients
      ] = await Promise.all([
        Patient.countDocuments({ ...branchFilter, isActive: true }),
        Patient.countDocuments({ 
          ...branchFilter, 
          isActive: true,
          createdAt: { $gte: lastMonth }
        }),
        
        Appointment.countDocuments(branchFilter),
        Appointment.countDocuments({ 
          ...branchFilter,
          createdAt: { $gte: lastMonth }
        }),
        
        User.countDocuments({ 
          ...branchFilter, 
          role: UserRole.DOCTOR,
          isActive: true
        }),
        User.countDocuments({ 
          ...branchFilter, 
          role: UserRole.DOCTOR,
          isActive: true,
          createdAt: { $gte: lastMonth }
        }),
        
        Payment.aggregate([
          { $match: branchFilter },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Payment.aggregate([
          { $match: { ...branchFilter, createdAt: { $gte: lastMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        
        PatientVisit.countDocuments({
          ...branchFilter,
          visitDate: { $gte: today },
          status: { $in: ['in_progress', 'completed'] }
        }),
        
        Appointment.find({
          ...branchFilter,
          status: 'SCHEDULED'
        })
          .populate('patientId', 'firstName lastName profileImage patientId')
          .sort({ appointmentDate: 1 })
          .limit(5)
          .lean(),
        
        Patient.find({ ...branchFilter, isActive: true })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ]);

      const totalPaymentsAmount = totalPayments[0]?.total || 0;
      const lastMonthPaymentsAmount = paymentsLastMonth[0]?.total || 0;

      const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      const stats = {
        patients: {
          total: totalPatients,
          change: calculatePercentageChange(patientsLastMonth, totalPatients - patientsLastMonth),
          isIncrease: patientsLastMonth > (totalPatients - patientsLastMonth)
        },
        appointments: {
          total: totalAppointments,
          change: calculatePercentageChange(appointmentsLastMonth, totalAppointments - appointmentsLastMonth),
          isIncrease: appointmentsLastMonth > (totalAppointments - appointmentsLastMonth)
        },
        doctors: {
          total: totalDoctors,
          change: calculatePercentageChange(doctorsLastMonth, totalDoctors - doctorsLastMonth),
          isIncrease: doctorsLastMonth > (totalDoctors - doctorsLastMonth)
        },
        transactions: {
          total: totalPaymentsAmount,
          change: calculatePercentageChange(lastMonthPaymentsAmount, totalPaymentsAmount - lastMonthPaymentsAmount),
          isIncrease: lastMonthPaymentsAmount > (totalPaymentsAmount - lastMonthPaymentsAmount)
        },
        visitsToday: totalVisitsToday,
        pendingAppointments,
        recentPatients
      };

      return NextResponse.json(stats);

    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard statistics', message: error.message },
        { status: 500 }
      );
    }
  });
}
