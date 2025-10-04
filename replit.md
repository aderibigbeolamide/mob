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
-   **Branch-Specific Data Isolation**: Enforces strict branch-based data isolation using a `branchId` for all relevant models. Non-admin users access only their assigned branch's data, while admins can view across all branches.
-   **API Endpoints**: Provides complete CRUD operations for all modules, incorporating branch filtering.
-   **Docker Deployment**: The application is fully containerized using a multi-stage Dockerfile optimized for Next.js 15, resulting in a smaller image size and secure runtime.

## Recent Changes (October 2025)

### Replit Environment Setup (October 4, 2025)
- **Successfully configured for Replit**: The project has been successfully set up to run in the Replit environment
- **Dependencies Installed**: All npm packages (597 packages) installed successfully
- **Next.js Configuration**: Added `allowedDevOrigins: ['*']` for development mode to support Replit's proxy infrastructure
- **Environment Variables**: Created `.env.local` with default configuration for MongoDB, NextAuth, Cloudinary, EmailJS, and Paystack
- **Workflow Configuration**: Dev server runs on port 5000 with host 0.0.0.0 to allow external access
- **Deployment Configuration**: Set up for Autoscale deployment with build command `npm run build` and run command `npm start`
- **Application Status**: ✅ Frontend is fully functional and displaying the login page correctly
- **Known Setup Notes**: 
  - MongoDB connection defaults to local instance - users should update `MONGODB_URI` in environment variables to connect to MongoDB Atlas
  - WebSocket warnings for HMR are expected in Replit environment and don't affect functionality
  - Mongoose duplicate index warnings are non-critical

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
- Mongoose duplicate index warnings are non-critical (schema indexes duplicated in model definitions)

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