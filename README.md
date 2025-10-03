# Life Point Medical Centre - EMR System

A comprehensive Electronic Medical Records (EMR) system built with Next.js 15, TypeScript, and MongoDB. This branch-specific, role-based platform streamlines patient care, clinical workflows, billing, and communication across different hospital units.

## 🚀 Quick Start (Replit)

This project is ready to run on Replit! The development server is already configured and running.

### Current Status
✅ Frontend is running on port 5000  
✅ All dependencies installed  
✅ Environment configured for Replit  
⚠️ **Database configuration required for full functionality**

### Database Setup

This app requires MongoDB for authentication and data persistence:

1. **Get a MongoDB Connection String**:
   - Option 1: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free tier available)
   - Option 2: Any other MongoDB hosting service

2. **Configure the Database**:
   - Open the Secrets tab in Replit (or edit `.env.local`)
   - Update `MONGODB_URI` with your connection string
   - Restart the server

3. **Seed Initial Data**:
   - Use the Replit Shell or any HTTP client
   - Make a POST request to `/api/seed`
   - This creates sample users and data

4. **Login Credentials** (after seeding):
   - **Admin**: admin@lifepointmedical.com / admin123
   - **Doctor**: dr.sarah@lifepointmedical.com / doctor123
   - **Front Desk**: frontdesk@lifepointmedical.com / desk123
   - **Nurse**: nurse@lifepointmedical.com / nurse123

## 🏗️ Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **UI**: React 19, Bootstrap 5, Ant Design
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth
- **Styling**: SCSS/Sass
- **Integrations**: Cloudinary, EmailJS, Paystack

## 👥 User Roles

- **ADMIN** - Full system access and configuration
- **FRONT_DESK** - Patient registration, appointments, checkout
- **NURSE** - Vitals, triage, patient handoff
- **DOCTOR** - Diagnosis, prescriptions, treatment
- **LAB** - Lab tests and results
- **PHARMACY** - Medication dispensing
- **BILLING** - Invoices and payments
- **ACCOUNTING** - Financial reports

## 📋 Core Features

- Patient Management (registration, records, documents)
- Appointment Scheduling
- Clinical Workflow & Patient Clocking System
- Billing & Payment Processing (Paystack integration)
- In-app Messaging & Notifications
- Staff Attendance Tracking
- Lab Results Management
- Pharmacy Management

## 🛠️ Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env.local
# Add your MongoDB URI and other credentials

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 📦 Deployment

This project is configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Deployment type: Autoscale (stateless web apps)

## 📚 Documentation

Full documentation is available in `replit.md`, including:
- Detailed project architecture
- API routes and endpoints
- Implementation progress
- Development guidelines

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Implement proper role-based access control
- Validate data on both client and server

## 📝 License

This project is private and proprietary.
