# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. It streamlines patient care, clinical workflows, billing, and communication across different hospital units, offering branch-specific and role-based access. The system aims to enhance efficiency and patient outcomes in a medical center environment. Key capabilities include patient management, appointment scheduling, clinical workflow management, billing and payments, messaging, and staff attendance tracking.

## User Preferences
The user prefers a development approach that emphasizes:
- **Clarity**: Simple, clear explanations for any proposed changes or issues.
- **Modularity**: Prioritize solutions that are modular and maintainable.
- **Security**: Focus on robust security measures, especially for patient data and access control.
- **Efficiency**: Optimize for performance and efficient resource usage within the Replit environment.
- **Iterative Development**: Develop features incrementally, allowing for regular feedback and adjustments.
- **Autonomy**: The agent should take initiative in identifying and fixing issues, but report them.

## System Architecture
The EMR system is built on Next.js 15 with the App Router, TypeScript, and React 19. It uses MongoDB with Mongoose for data persistence and NextAuth for authentication. The UI integrates Bootstrap 5, Ant Design, and React Bootstrap for a responsive and consistent user experience.

**Core Features:**
-   **Patient Management**: Registration, record keeping, document uploads, medical history, and vitals tracking.
-   **Appointment Scheduling**: Calendar-based booking, role-aware management, and patient self-service requests.
-   **Clinical Workflow**: Structured patient clocking system (Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Returned to Front Desk → Completed) for smooth patient handoffs.
-   **Billing & Payments**: Invoice generation, payment processing, and insurance claims management.
-   **Messaging & Notifications**: In-app communication, event-driven notifications, and email fallbacks.
-   **Staff Attendance**: Clock-in/out system for tracking attendance.

**User Roles:** The system supports 8 distinct role-based access levels: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, each with specific permissions and workflows.

**UI/UX Decisions:**
-   **Branding**: Uses "Life Point Medical Centre" with a navy blue (`#003366`), red (`#CC0000`), and white (`#FFFFFF`) color scheme.
-   **Components**: Leverages Ant Design and React Bootstrap.
-   **Data Visualization**: ApexCharts for data presentation and FullCalendar for scheduling.

**Technical Implementations:**
-   **State Management**: Redux Toolkit.
-   **Styling**: SCSS/Sass.
-   **Deployment**: Configured for Autoscale deployment on Replit.
-   **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations for Replit compatibility, and `output: 'standalone'` for optimized Docker deployment.

**System Design Choices:**
-   **Cross-Branch Viewing with Edit Restrictions**: Staff from any branch can VIEW patient records, appointments, and other data across all branches to enable inter-branch communication and coordination. However, EDIT/DELETE operations are restricted to same-branch only. Admins have full access to view and edit across all branches.
-   **API Endpoints**: Provides complete CRUD operations for all modules with read/write permission separation:
    - GET endpoints: Cross-branch viewing enabled by default for all staff
    - POST/PUT/DELETE endpoints: Strict branch isolation enforced
-   **Docker Deployment**: The application is fully containerized using a multi-stage Dockerfile optimized for Next.js 15, resulting in a smaller image size and secure runtime.

## Recent Changes (October 2025)

### Cross-Branch Viewing Implementation (October 4, 2025)
- **Viewing Permissions**: Enabled cross-branch viewing for all staff members across all modules (patients, appointments, visits, lab tests, prescriptions, billing, etc.)
- **Edit Restrictions**: Maintained strict branch-based restrictions for all write operations (POST, PUT, DELETE) to ensure data integrity
- **TypeScript Fixes**: 
  - Fixed `patient.phoneNumber` references to `patient.phone` in allPatientsList.tsx and notification.ts
  - Fixed `patient.branchId` references to `patient.branch` in allPatientsList.tsx
- **Query Helper Updates**:
  - Updated `applyBranchFilter()` to properly respect the `allowCrossBranch` parameter
  - Added comprehensive documentation explaining read vs write permission model
- **Security Model**: All authenticated staff can view cross-branch data, but can only edit/delete data from their own branch (admins have full access)

### Fresh GitHub Import - Replit Environment Setup (October 4, 2025)
- **Successfully configured for Replit**: The project has been successfully imported from GitHub and set up to run in the Replit environment
- **Dependencies Installed**: All npm packages (597 packages) installed successfully
- **Next.js Configuration**: Already includes `allowedDevOrigins: ['*']` for development mode to support Replit's proxy infrastructure
- **Environment Variables**: 
  - Created `.env.local` with default configuration for development
  - Configured production secrets for: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Workflow Configuration**: Dev server runs on port 5000 with host 0.0.0.0 to allow external access (`npm run dev -- -p 5000 -H 0.0.0.0`)
- **Deployment Configuration**: Set up for Autoscale deployment with build command `npm run build` and run command `npm start`
- **Mongoose Index Optimization**: Fixed duplicate index warnings by removing redundant explicit index declarations on fields with `unique: true`
  - Fixed models: StaffProfile, Appointment, Encounter, Invoice, Payment
  - Removed duplicate indexes on: userId, appointmentNumber, encounterId, invoiceNumber, paymentNumber
- **Production Authentication Fix**: Resolved NextAuth NO_SECRET error by configuring required environment variables
  - `NEXTAUTH_SECRET`: Secure random key for JWT encryption
  - `NEXTAUTH_URL`: Production deployment URL
  - `MONGODB_URI`: MongoDB Atlas connection string
- **Application Status**: ✅ Application is fully functional in both development and production
- **Known Setup Notes**: 
  - WebSocket warnings for HMR are expected in Replit environment and don't affect functionality
  - Cross-origin request warnings in development are expected and don't affect functionality (allowedDevOrigins is configured)

### Docker Build TypeScript Fixes
- **CommonSelect Enhancement**: Updated to support controlled mode with `value` and `onChange` props for proper form state management, while maintaining backward compatibility for uncontrolled usage
- **Date/Time Type Safety**: Resolved all Dayjs/Date type mismatches across appointment modal, patient add/edit forms by ensuring consistent Dayjs object handling throughout the component lifecycle
- **Type Definitions**: Added missing fields to type definitions:
  - Branch: `code` (string, optional) and `manager` (string, optional)
  - Patient: `profileImage` (string, optional)
- **Memory Optimization**: Increased Node.js memory allocation from 4GB to 8GB (`--max-old-space-size=8192`) in build script to prevent SIGKILL errors during Docker builds
- **Branch Reference Fix**: Updated editDoctors component to use `branchId` instead of `branch` property for consistency

### Known Issues
- Replit dev environment has memory constraints preventing full production builds locally (requires 8GB+)
- Docker deployments will succeed with the increased memory allocation

## External Dependencies
-   **Database**: MongoDB (with Mongoose ORM)
-   **Authentication**: NextAuth
-   **File Storage**: Cloudinary
-   **Email Services**: EmailJS
-   **Payment Gateway**: Paystack
-   **UI Libraries**: Bootstrap 5, Ant Design, React Bootstrap
-   **Calendar**: FullCalendar
-   **Charting**: ApexCharts
-   **Rich Text Editor**: React Quill
-   **Maps**: Leaflet (if integrated for location-based services)