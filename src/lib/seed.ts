import bcrypt from 'bcryptjs';
import dbConnect from './dbConnect';
import User from '@/models/User';
import Branch from '@/models/Branch';
import Patient from '@/models/Patient';

export async function seedDatabase() {
  try {
    await dbConnect();

    // Check if data already exists
    const existingBranch = await Branch.findOne();
    if (existingBranch) {
      console.log('Database already seeded');
      return { success: true, message: 'Database already seeded' };
    }

    // Create main branch
    const mainBranch = await Branch.create({
      name: 'Life Point Medical Centre - Main Branch',
      code: 'LPMC-MAIN',
      address: '123 Medical Avenue',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      phone: '+234-800-LIFEPOINT',
      email: 'info@lifepointmedical.com',
      isActive: true,
    });

    // Create super admin - password will be hashed by pre-save hook
    const superAdmin = await User.create({
      firstName: 'Super',
      lastName: 'Administrator',
      email: 'admin@lifepointmedical.com',
      password: 'admin123',
      phoneNumber: '+234-800-ADMIN',
      role: 'ADMIN',
      branchId: mainBranch._id,
      isActive: true,
    });

    // Create sample doctors - passwords will be hashed by pre-save hook
    const doctor1 = await User.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'dr.sarah@lifepointmedical.com',
      password: 'doctor123',
      phoneNumber: '+234-801-2345678',
      role: 'DOCTOR',
      branchId: mainBranch._id,
      isActive: true,
    });

    const doctor2 = await User.create({
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'dr.michael@lifepointmedical.com',
      password: 'doctor123',
      phoneNumber: '+234-802-3456789',
      role: 'DOCTOR',
      branchId: mainBranch._id,
      isActive: true,
    });

    // Create front desk staff
    await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'frontdesk@lifepointmedical.com',
      password: 'desk123',
      phoneNumber: '+234-803-4567890',
      role: 'FRONT_DESK',
      branchId: mainBranch._id,
      isActive: true,
    });

    // Create nurse
    await User.create({
      firstName: 'Mary',
      lastName: 'Williams',
      email: 'nurse@lifepointmedical.com',
      password: 'nurse123',
      phoneNumber: '+234-804-5678901',
      role: 'NURSE',
      branchId: mainBranch._id,
      isActive: true,
    });

    // Create sample patients
    await Patient.create({
      patientId: 'LP-2024-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phoneNumber: '+234-805-1234567',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      address: '45 Victoria Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      emergencyContact: {
        name: 'Jane Doe',
        phoneNumber: '+234-806-1234567',
        relationship: 'Wife',
      },
      branchId: mainBranch._id,
      registeredBy: superAdmin._id,
      isActive: true,
    });

    await Patient.create({
      patientId: 'LP-2024-002',
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.j@email.com',
      phoneNumber: '+234-807-2345678',
      dateOfBirth: new Date('1990-08-20'),
      gender: 'Female',
      bloodGroup: 'A+',
      address: '78 Allen Avenue',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      emergencyContact: {
        name: 'Robert Johnson',
        phoneNumber: '+234-808-2345678',
        relationship: 'Husband',
      },
      insurance: {
        provider: 'NHIS',
        policyNumber: 'NHIS-2024-5678',
        validUntil: new Date('2025-12-31'),
      },
      allergies: ['Penicillin', 'Peanuts'],
      branchId: mainBranch._id,
      registeredBy: superAdmin._id,
      isActive: true,
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@lifepointmedical.com / admin123');
    console.log('Doctor: dr.sarah@lifepointmedical.com / doctor123');
    console.log('Front Desk: frontdesk@lifepointmedical.com / desk123');
    console.log('Nurse: nurse@lifepointmedical.com / nurse123');

    return {
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        admin: { email: 'admin@lifepointmedical.com', password: 'admin123' },
        doctor: { email: 'dr.sarah@lifepointmedical.com', password: 'doctor123' },
      }
    };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
}
