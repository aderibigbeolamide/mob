import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import PatientVisit from '@/models/PatientVisit';
import Payment from '@/models/Payment';
import LabTest from '@/models/LabTest';
import Prescription from '@/models/Prescription';
import Billing from '@/models/Billing';
import Invoice from '@/models/Invoice';
import { requireAuth, UserRole } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const userRole = session.user.role as UserRole;
      const userId = session.user.id;
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

      const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      switch (userRole) {
        case UserRole.DOCTOR:
          return await getDoctorDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.NURSE:
          return await getNurseDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.LAB:
          return await getLabDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.PHARMACY:
          return await getPharmacyDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.BILLING:
          return await getBillingDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.ACCOUNTING:
          return await getAccountingDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.FRONT_DESK:
          return await getFrontDeskDashboardStats(userId, branchFilter, today, lastMonth, calculatePercentageChange);
        
        case UserRole.ADMIN:
        default:
          return await getAdminDashboardStats(branchFilter, today, lastMonth, calculatePercentageChange);
      }

    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard statistics', message: error.message },
        { status: 500 }
      );
    }
  });
}

async function getAdminDashboardStats(branchFilter: any, today: Date, lastMonth: Date, calculatePercentageChange: (current: number, previous: number) => number) {
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
  ]);

  const totalPaymentsAmount = totalPayments[0]?.total || 0;
  const lastMonthPaymentsAmount = paymentsLastMonth[0]?.total || 0;

  const stats = {
    role: UserRole.ADMIN,
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
  };

  return NextResponse.json(stats);
}

async function getDoctorDashboardStats(userId: string, branchFilter: any, today: Date, lastMonth: Date, calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    myPatientsTotal,
    myPatientsLastMonth,
    myVisitsToday,
    myAppointmentsTotal,
    myAppointmentsLastMonth,
    myPendingVisits,
    myPrescriptionsTotal,
    myLabTestsTotal,
  ] = await Promise.all([
    Appointment.distinct('patientId', { ...branchFilter, doctorId: userId }),
    Appointment.distinct('patientId', { 
      ...branchFilter, 
      doctorId: userId,
      createdAt: { $gte: lastMonth }
    }),
    PatientVisit.countDocuments({
      ...branchFilter,
      currentStage: 'doctor',
      status: 'in_progress'
    }),
    Appointment.countDocuments({ ...branchFilter, doctorId: userId }),
    Appointment.countDocuments({ 
      ...branchFilter,
      doctorId: userId,
      createdAt: { $gte: lastMonth }
    }),
    PatientVisit.find({
      ...branchFilter,
      currentStage: 'doctor',
      status: 'in_progress'
    })
      .populate('patient', 'firstName lastName profileImage patientId')
      .sort({ visitDate: 1 })
      .limit(5)
      .lean(),
    Prescription.countDocuments({ ...branchFilter, doctor: userId }),
    LabTest.countDocuments({ ...branchFilter, doctor: userId }),
  ]);

  const stats = {
    role: UserRole.DOCTOR,
    myPatients: {
      total: myPatientsTotal.length,
      change: calculatePercentageChange(myPatientsLastMonth.length, myPatientsTotal.length - myPatientsLastMonth.length),
      isIncrease: myPatientsLastMonth.length > (myPatientsTotal.length - myPatientsLastMonth.length)
    },
    myAppointmentsToday: {
      total: myVisitsToday,
      change: 0,
      isIncrease: false
    },
    prescriptions: {
      total: myPrescriptionsTotal,
      change: 0,
      isIncrease: false
    },
    labTests: {
      total: myLabTestsTotal,
      change: 0,
      isIncrease: false
    },
    visitsToday: myVisitsToday,
    pendingAppointments: myPendingVisits,
  };

  return NextResponse.json(stats);
}

async function getNurseDashboardStats(userId: string, branchFilter: any, today: Date, _lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    patientsToday,
    vitalsRecorded,
    pendingVisits,
  ] = await Promise.all([
    PatientVisit.countDocuments({
      ...branchFilter,
      visitDate: { $gte: today },
      status: { $in: ['in_progress'] },
      currentStage: 'nurse'
    }),
    PatientVisit.countDocuments({
      ...branchFilter,
      visitDate: { $gte: today },
      'stages.nurse.clockedInBy': userId,
      'stages.nurse.vitalSigns': { $exists: true }
    }),
    PatientVisit.find({
      ...branchFilter,
      status: 'in_progress',
      currentStage: 'nurse'
    })
      .populate('patient', 'firstName lastName profileImage patientId')
      .sort({ visitDate: 1 })
      .limit(10)
      .lean(),
  ]);

  const stats = {
    role: UserRole.NURSE,
    patientsToday: {
      total: patientsToday,
      change: 0,
      isIncrease: false
    },
    vitalsRecorded: {
      total: vitalsRecorded,
      change: 0,
      isIncrease: false
    },
    pendingVitals: {
      total: pendingVisits.length,
      change: 0,
      isIncrease: false
    },
    visitsToday: patientsToday,
    pendingAppointments: pendingVisits,
  };

  return NextResponse.json(stats);
}

async function getLabDashboardStats(userId: string, branchFilter: any, today: Date, _lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    pendingTests,
    completedToday,
    inProgress,
    pendingTestsList,
  ] = await Promise.all([
    LabTest.countDocuments({
      ...branchFilter,
      status: 'pending'
    }),
    LabTest.countDocuments({
      ...branchFilter,
      status: 'completed',
      'result.completedAt': { $gte: today }
    }),
    LabTest.countDocuments({
      ...branchFilter,
      status: 'in_progress'
    }),
    LabTest.find({
      ...branchFilter,
      status: 'pending'
    })
      .populate('patient', 'firstName lastName profileImage patientId')
      .populate('doctor', 'firstName lastName')
      .sort({ priority: -1, requestedAt: 1 })
      .limit(10)
      .lean(),
  ]);

  const stats = {
    role: UserRole.LAB,
    pendingTests: {
      total: pendingTests,
      change: 0,
      isIncrease: false
    },
    completedToday: {
      total: completedToday,
      change: 0,
      isIncrease: false
    },
    inProgress: {
      total: inProgress,
      change: 0,
      isIncrease: false
    },
    visitsToday: pendingTests + inProgress,
    pendingAppointments: pendingTestsList,
  };

  return NextResponse.json(stats);
}

async function getPharmacyDashboardStats(userId: string, branchFilter: any, today: Date, _lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    pendingPrescriptions,
    dispensedToday,
    activePrescriptions,
    pendingPrescriptionsList,
  ] = await Promise.all([
    Prescription.countDocuments({
      ...branchFilter,
      status: 'active'
    }),
    Prescription.countDocuments({
      ...branchFilter,
      status: 'dispensed',
      dispensedAt: { $gte: today }
    }),
    Prescription.countDocuments({
      ...branchFilter,
      status: 'active'
    }),
    Prescription.find({
      ...branchFilter,
      status: 'active'
    })
      .populate('patient', 'firstName lastName profileImage patientId')
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: 1 })
      .limit(10)
      .lean(),
  ]);

  const stats = {
    role: UserRole.PHARMACY,
    pendingPrescriptions: {
      total: pendingPrescriptions,
      change: 0,
      isIncrease: false
    },
    dispensedToday: {
      total: dispensedToday,
      change: 0,
      isIncrease: false
    },
    activePrescriptions: {
      total: activePrescriptions,
      change: 0,
      isIncrease: false
    },
    visitsToday: pendingPrescriptions,
    pendingAppointments: pendingPrescriptionsList,
  };

  return NextResponse.json(stats);
}

async function getBillingDashboardStats(userId: string, branchFilter: any, today: Date, _lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    pendingInvoices,
    processedToday,
    totalRevenueToday,
    pendingInvoicesList,
  ] = await Promise.all([
    Invoice.countDocuments({
      ...branchFilter,
      status: { $in: ['PENDING', 'PARTIALLY_PAID'] }
    }),
    Payment.countDocuments({
      ...branchFilter,
      createdAt: { $gte: today }
    }),
    Payment.aggregate([
      { $match: { ...branchFilter, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Invoice.find({
      ...branchFilter,
      status: { $in: ['PENDING', 'PARTIALLY_PAID'] }
    })
      .populate('patientId', 'firstName lastName profileImage patientId')
      .sort({ createdAt: 1 })
      .limit(10)
      .lean(),
  ]);

  const stats = {
    role: UserRole.BILLING,
    pendingInvoices: {
      total: pendingInvoices,
      change: 0,
      isIncrease: false
    },
    processedToday: {
      total: processedToday,
      change: 0,
      isIncrease: false
    },
    revenueToday: {
      total: totalRevenueToday[0]?.total || 0,
      change: 0,
      isIncrease: false
    },
    visitsToday: processedToday,
    pendingAppointments: pendingInvoicesList,
  };

  return NextResponse.json(stats);
}

async function getAccountingDashboardStats(_userId: string, branchFilter: any, today: Date, lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    totalRevenueToday,
    totalRevenueMonth,
    totalPaymentsToday,
    totalPaymentsMonth,
    recentTransactions,
  ] = await Promise.all([
    Payment.aggregate([
      { $match: { ...branchFilter, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { ...branchFilter, createdAt: { $gte: lastMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.countDocuments({
      ...branchFilter,
      createdAt: { $gte: today }
    }),
    Payment.countDocuments({
      ...branchFilter,
      createdAt: { $gte: lastMonth }
    }),
    Payment.find(branchFilter)
      .populate('patient', 'firstName lastName profileImage patientId')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const stats = {
    role: UserRole.ACCOUNTING,
    revenueToday: {
      total: totalRevenueToday[0]?.total || 0,
      change: 0,
      isIncrease: false
    },
    revenueMonth: {
      total: totalRevenueMonth[0]?.total || 0,
      change: 0,
      isIncrease: false
    },
    paymentsToday: {
      total: totalPaymentsToday,
      change: 0,
      isIncrease: false
    },
    paymentsMonth: {
      total: totalPaymentsMonth,
      change: 0,
      isIncrease: false
    },
    visitsToday: totalPaymentsToday,
    pendingAppointments: recentTransactions,
  };

  return NextResponse.json(stats);
}

async function getFrontDeskDashboardStats(userId: string, branchFilter: any, today: Date, _lastMonth: Date, _calculatePercentageChange: (current: number, previous: number) => number) {
  const [
    appointmentsToday,
    newPatientsToday,
    todayAppointments,
  ] = await Promise.all([
    Appointment.countDocuments({
      ...branchFilter,
      appointmentDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }),
    Patient.countDocuments({
      ...branchFilter,
      createdAt: { $gte: today }
    }),
    Appointment.find({
      ...branchFilter,
      appointmentDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] }
    })
      .populate('patientId', 'firstName lastName profileImage patientId')
      .populate('doctorId', 'firstName lastName')
      .sort({ appointmentTime: 1 })
      .limit(20)
      .lean(),
  ]);

  // Fetch visit information for appointments
  const appointmentIds = todayAppointments.map(apt => apt._id);
  const visits = await PatientVisit.find({
    appointment: { $in: appointmentIds },
    status: { $in: ['in_progress', 'completed'] }
  }).lean();

  // Create a map of appointment ID to visit
  const visitMap = new Map();
  visits.forEach(visit => {
    if (visit.appointment) {
      visitMap.set(visit.appointment.toString(), visit);
    }
  });

  // Enhance appointments with visit information
  const enhancedAppointments = todayAppointments.map((apt: any) => {
    const visit = visitMap.get(apt._id.toString());
    return {
      ...apt,
      visit: visit || null,
      currentStage: visit?.currentStage || null,
      visitStatus: visit?.status || null
    };
  });

  const pendingCheckIns = enhancedAppointments.filter((apt: any) => 
    apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
  ).length;

  const stats = {
    role: UserRole.FRONT_DESK,
    appointmentsToday: {
      total: appointmentsToday,
      change: 0,
      isIncrease: false
    },
    newPatientsToday: {
      total: newPatientsToday,
      change: 0,
      isIncrease: false
    },
    pendingCheckIns: {
      total: pendingCheckIns,
      change: 0,
      isIncrease: false
    },
    visitsToday: appointmentsToday,
    pendingAppointments: enhancedAppointments,
  };

  return NextResponse.json(stats);
}
