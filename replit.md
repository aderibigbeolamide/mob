# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. Its primary purpose is to streamline patient care, clinical workflows, billing, and inter-departmental communication within a medical center. The system supports branch-specific and role-based access, aiming to enhance efficiency and patient outcomes. Key capabilities include patient management, appointment scheduling, clinical workflow management, billing and payments, messaging, and staff attendance tracking.

## User Preferences
The user prefers a development approach that emphasizes:
- **Clarity**: Simple, clear explanations for any proposed changes or issues.
- **Modularity**: Prioritize solutions that are modular and maintainable.
- **Security**: Focus on robust security measures, especially for patient data and access control.
- **Efficiency**: Optimize for performance and efficient resource usage within the Replit environment.
- **Iterative Development**: Develop features incrementally, allowing for regular feedback and adjustments.
- **Autonomy**: The agent should take initiative in identifying and fixing issues, but report them.

## System Architecture
The EMR system utilizes Next.js 15 with the App Router, TypeScript, and React 19. Data persistence is managed by MongoDB with Mongoose, and authentication is handled by NextAuth. The UI integrates Bootstrap 5, Ant Design, and React Bootstrap for a responsive user experience.

**Core Features:**
-   **Patient Management**: Registration, record keeping, document uploads, medical history, and vitals.
-   **Appointment Scheduling**: Calendar-based booking and patient self-service.
-   **Clinical Workflow**: Structured patient clocking system (Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Returned to Front Desk → Completed) for seamless handoffs.
-   **Billing & Payments**: Invoice generation, payment processing, and insurance claims.
-   **Messaging & Notifications**: In-app communication and event-driven notifications.
-   **Staff Attendance**: Clock-in/out system.

**User Roles:** Eight distinct role-based access levels are supported: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, each with specific permissions.

**UI/UX Decisions:**
-   **Branding**: "Life Point Medical Centre" with a navy blue (`#003366`), red (`#CC0000`), and white (`#FFFFFF`) color scheme.
-   **Components**: Leverages Ant Design and React Bootstrap.
-   **Data Visualization**: ApexCharts for data presentation and FullCalendar for scheduling.

**Technical Implementations:**
-   **State Management**: Redux Toolkit.
-   **Styling**: SCSS/Sass.
-   **Deployment**: Configured for Autoscale deployment on Replit, using `output: 'standalone'` for optimized Docker deployment.
-   **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations for Replit compatibility.

**System Design Choices:**
-   **Cross-Branch Viewing with Edit Restrictions**: Staff can view patient records, appointments, and data across all branches, but edit/delete operations are restricted to their own branch. Admins have full cross-branch access.
-   **API Endpoints**: Complete CRUD operations with read/write permission separation: GET endpoints allow cross-branch viewing, while POST/PUT/DELETE enforce strict branch isolation.
-   **Docker Deployment**: The application is fully containerized using a multi-stage Dockerfile optimized for Next.js 15 for smaller image size and secure runtime.

## Recent Changes (October 2025)

### Migration & Stabilization Fixes
1. **Appointments Component Error Fix** (Critical)
   - Added defensive null safety checks using optional chaining for patientId, doctorId, and branchId fields
   - Prevents runtime crashes when API data is loading or missing
   - Graceful "N/A" fallbacks for missing data
   - API already populates references correctly with `.populate()` calls

2. **Accounting Module Implementation** (New Feature)
   - Created new accounting department module accessible at `/accounting`
   - Implemented role-based access control: only ADMIN, ACCOUNTING, and BILLING roles can access
   - Integrated into sidebar navigation with role checking
   - Displays payment transactions and revenue statistics
   - Connected to `/api/billing/payments` endpoint

3. **Database & API Fixes**
   - Fixed Mongoose duplicate index warning in Pharmacy model
   - Cleaned up 21+ API route files: removed unused imports, fixed TypeScript warnings
   - Verified backend-database connectivity is working correctly
   - All API endpoints properly populate referenced documents (patient, doctor, branch)

4. **Build & Production Readiness**
   - Successfully runs production build (compiles in ~3.7 minutes)
   - Only non-blocking ESLint warnings remain (unused variables, missing dependencies)
   - No critical errors blocking deployment

5. **Translation and Localization**
   - Added "Accounting" translation keys to i18n configuration
   - Supports 4 languages: English, German (Buchhaltung), French (Comptabilité), Arabic (المحاسبة)
   - Fixed sidebar label display from "sidebar.Accounting" to "Accounting"

### Known Considerations
- Invoice pages have UI in place but may need additional API wiring based on business requirements
- Next.js config has deprecation warnings (devIndicators.buildActivityPosition) - non-blocking
- Some ESLint warnings about unused variables and missing useEffect dependencies - code quality improvements for future iteration
- Initial 401 errors on first page load are expected NextAuth behavior - session loads on subsequent requests

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