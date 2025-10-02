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
      address: '123 Medical Avenue',
      city: 'Lagos',
      state: 'Lagos',
      phone: '+234-800-LIFEPOINT',
      email: 'info@lifepointmedical.com',
      isActive: true,
    });

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'admin@lifepointmedical.com',
      password: hashedPassword,
      phone: '+234-800-ADMIN',
      role: 'admin',
      branch: mainBranch._id,
      isActive: true,
    });

    // Create sample doctors
    const doctor1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'dr.sarah@lifepointmedical.com',
      password: await bcrypt.hash('doctor123', 10),
      phone: '+234-801-2345678',
      role: 'doctor',
      branch: mainBranch._id,
      specialization: 'General Physician',
      licenseNumber: 'DOC-2024-001',
      isActive: true,
    });

    const doctor2 = await User.create({
      name: 'Dr. Michael Chen',
      email: 'dr.michael@lifepointmedical.com',
      password: await bcrypt.hash('doctor123', 10),
      phone: '+234-802-3456789',
      role: 'doctor',
      branch: mainBranch._id,
      specialization: 'Cardiologist',
      licenseNumber: 'DOC-2024-002',
      isActive: true,
    });

    // Create front desk staff
    await User.create({
      name: 'Jane Smith',
      email: 'frontdesk@lifepointmedical.com',
      password: await bcrypt.hash('desk123', 10),
      phone: '+234-803-4567890',
      role: 'front_desk',
      branch: mainBranch._id,
      isActive: true,
    });

    // Create nurse
    await User.create({
      name: 'Mary Williams',
      email: 'nurse@lifepointmedical.com',
      password: await bcrypt.hash('nurse123', 10),
      phone: '+234-804-5678901',
      role: 'nurse',
      branch: mainBranch._id,
      isActive: true,
    });

    // Create sample patients
    await Patient.create({
      patientId: 'LP-2024-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+234-805-1234567',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'male',
      bloodGroup: 'O+',
      address: '45 Victoria Street',
      city: 'Lagos',
      state: 'Lagos',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+234-806-1234567',
        relationship: 'Wife',
      },
      branch: mainBranch._id,
      createdBy: superAdmin._id,
      isActive: true,
    });

    await Patient.create({
      patientId: 'LP-2024-002',
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.j@email.com',
      phone: '+234-807-2345678',
      dateOfBirth: new Date('1990-08-20'),
      gender: 'female',
      bloodGroup: 'A+',
      address: '78 Allen Avenue',
      city: 'Lagos',
      state: 'Lagos',
      emergencyContact: {
        name: 'Robert Johnson',
        phone: '+234-808-2345678',
        relationship: 'Husband',
      },
      insurance: {
        provider: 'NHIS',
        policyNumber: 'NHIS-2024-5678',
        validUntil: new Date('2025-12-31'),
      },
      allergies: ['Penicillin', 'Peanuts'],
      branch: mainBranch._id,
      createdBy: superAdmin._id,
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
