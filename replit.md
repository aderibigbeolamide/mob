# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. Its primary purpose is to streamline patient care, clinical workflows, billing, and inter-departmental communication within a medical center. The system supports branch-specific and role-based access, aiming to enhance efficiency and patient outcomes. Key capabilities include patient management, appointment scheduling, clinical workflow management, billing and payments, messaging, and staff attendance tracking.

## Recent Changes
**Date: October 14, 2025**
- **Production Build Optimization**: Resolved build errors and configured production-ready build process:
  - Implemented Turbopack (`--turbo` flag) for efficient compilation and reduced memory usage
  - Removed `optimizePackageImports` that caused OOM errors with large libraries (FontAwesome, FullCalendar, react-icons)
  - Removed CPU/worker constraints (`cpus: 1`, `workerThreads: false`) to enable parallel compilation
  - Optimized memory allocation to 4GB for production builds
  - Added dedicated `npm run type-check` script for TypeScript validation (runs `tsc --noEmit` with 4GB heap)
  - TypeScript validation enabled in production builds (`ignoreBuildErrors: false`) for type safety
  - Fixed Mongoose duplicate schema index warning in Pharmacy model
  - Build successfully generates all 101 pages with zero TypeScript errors
  - Configured autoscale deployment with `npm run build` and `npm start` commands
  - Build Requirements: Minimum 4GB heap for production builds, Turbopack for optimal performance
- **Department Records - Prescribed Medications Display**: Enhanced Department Records modal to show prescribed medications in Doctor Consultation section for pharmacy staff:
  - Added "Prescribed Medications" table in Doctor Consultation section with columns: Medication, Dosage, Frequency, Duration, Instructions
  - Professional table format with pill icon for better visual identification
  - Shows "N/A" for missing instructions to ensure completeness
  - Prescription metadata (Rx number, status) displayed below table for cleaner presentation
  - Component: `src/components/visits/queue/ViewDepartmentRecordModal.tsx`
  - Purpose: Pharmacy staff can now see complete medication details when reviewing patient records before dispensing

- **Pharmacy Dashboard-Queue Data Synchronization Fix**: Resolved data mismatch between Pharmacy Queue and Pharmacist Dashboard:
  - Issue: Pharmacy Queue showed 2 patients but Dashboard showed different patients because dashboard counted Prescription records
  - Root Cause: Patients can be in pharmacy queue (currentStage: 'pharmacy') without having Prescription records dispensed yet
  - Solution: Updated `getPharmacyDashboardStats` in `/api/dashboard/stats` to count PatientVisit records with currentStage: 'pharmacy' for queue metrics
  - Dashboard now shows same patients as Pharmacy Queue (e.g., Joy Ola PT158961, Ibrahim Balogun PT647358)
  - Pending prescriptions count, dispensed today, and active prescriptions stats now accurately reflect actual patient queue status
  - Follows same synchronization pattern as Lab Dashboard-Queue fix

- **Lab Results & Medical Results Status Filtering**: Enhanced Lab Results and Medical Results pages with intelligent status filtering for improved record keeping:
  - Added status filter defaulting to "completed" tests for both Lab Results and Medical Results pages
  - Implemented status filter dropdown with options: Completed (default), In Progress, Pending, Cancelled, and All Statuses
  - Users can now easily view completed lab tests as historical records while maintaining flexibility to view other statuses when needed
  - Filter properly integrated with pagination, resetting to page 1 when status changes
  - Components: `src/components/laboratory/lab-results/labResults.tsx`, `src/components/laboratory/medical-results/medicalResults.tsx`
  - Purpose: Completed lab tests now serve as comprehensive record-keeping archives while still allowing lab staff to monitor pending and in-progress tests

- **Lab Dashboard-Queue Data Synchronization Fix**: Resolved data mismatch between Laboratory Queue and Lab Dashboard:
  - Issue: Lab Queue showed 2 patients but Dashboard showed 0 pending tests because dashboard only counted LabTest records
  - Root Cause: Patients can be in lab queue (currentStage: 'lab') without having LabTest records created yet
  - Solution: Updated `getLabDashboardStats` in `/api/dashboard/stats` to use same query logic as queue API
  - Dashboard now counts PatientVisit records with currentStage: 'lab' OR visits with pending lab tests, matching queue exactly
  - Pending lab tests count, completed today, and in-progress stats now accurately reflect actual patient queue status

**Date: October 11, 2025**
- **Real-Time Dashboard-Queue Synchronization**: Implemented comprehensive synchronization system ensuring "My Upcoming Appointments" on dashboards immediately reflects queue changes across all 8 departments:
  - Created global event system (`src/lib/utils/queue-events.ts`) using CustomEvent API for instant communication between queue and dashboards
  - Implemented `emitHandoffEvent()` and `useHandoffListener()` React hook for event-driven updates with automatic cleanup
  - Handoff operations now dispatch events immediately after successful patient transfers via `useHandoff` hook
  - All department dashboards (Doctor, Nurse, Lab, Pharmacy, Billing, Front Desk, Admin, Accounting) subscribe to handoff events for instant refresh
  - Updated Doctor dashboard stats to query `PatientVisit` with `currentStage: 'doctor'` instead of Appointments for accurate queue state alignment
  - Reduced dashboard auto-refresh interval from 30 seconds to 10 seconds as a safety fallback mechanism
  - Dashboard data now matches queue data exactly - when a patient is transferred between departments, they immediately disappear from the previous department's dashboard (no 30-second delay)
  - Proper React patterns with useCallback for stable references, cleanup handlers, and debounce guards to prevent race conditions
  - System provides instant feedback to all departments when patients move through the clinical workflow
- **Test Data Cleanup**: Removed all test/demo lab test records from database to ensure clean production state

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
- **Patient Management**: Registration, record keeping, document uploads, medical history, and vitals.
- **Appointment Scheduling**: Calendar-based booking and patient self-service.
- **Clinical Workflow**: Structured patient clocking system (e.g., Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Completed) for seamless handoffs, managed by a central `PatientVisit` record. Supports "Lab-Only" visits for walk-in lab requests, skipping consultation stages.
- **Billing & Payments**: Invoice generation, payment processing, insurance claims, and comprehensive debt management, with automatic invoice generation upon visit completion.
- **Messaging & Notifications**: In-app communication and event-driven notifications, including a real-time header notification system.
- **Staff Attendance**: Clock-in/out system.
- **Real-Time Queue Management**: Department-specific queue dashboards with auto-refresh, role-based filtering, mobile responsiveness, and administrator monitoring with wait time analytics.
- **Patient Handoff System**: Flexible stage transfers with interactive UI, visual patient timelines, and in-app notifications.
- **Doctor Consultation Workflow**: Comprehensive consultation system including recording chief complaints, history, physical exams, diagnosis, treatment plans, prescriptions (with medicine autocomplete from inventory), lab orders, and follow-up instructions.
- **Lab Clock-In Workflow**: Lab technician workflow for viewing patient journey, adding test results, and integrating with queue management.
- **Pharmacy Clock-In Workflow**: Pharmacist workflow for reviewing patient journey and prescribed medications before dispensing.
- **Department Record Viewing**: Staff can view comprehensive patient records from all previous departments.
- **Session Management & Multi-User Support**: Robust session handling, proper role routing, and secure logout.
- **Settings Management**: Streamlined essential settings (General, Security, Notifications).

**User Roles:** Eight distinct role-based access levels: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, with granular permissions, dynamic sidebar filtering, role-specific dashboards, and API route protection. Doctor role has view-only access for lab tests.

**UI/UX Decisions:**
- **Components**: Leverages Ant Design and React Bootstrap.
- **Data Visualization**: ApexCharts for data presentation and FullCalendar for scheduling.
- **Branding**: Consistent use of navy blue, red, and white color scheme with professional logo display.
- **Location Integration**: Comprehensive Nigerian administrative location system (State → LGA → Ward) for patient and branch management.

**Technical Implementations:**
- **State Management**: Redux Toolkit.
- **Styling**: SCSS/Sass.
- **Deployment**: Configured for Autoscale deployment on Replit, using `output: 'standalone'`.
- **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations for Replit compatibility.

**System Design Choices:**
- **Cross-Branch Viewing with Edit Restrictions**: Staff can view data across all branches, but edit/delete operations are restricted to their own branch. Admins have full cross-branch access.
- **API Endpoints**: Complete CRUD operations with read/write permission separation: GET endpoints allow cross-branch viewing, while POST/PUT/DELETE enforce strict branch isolation.
- **Docker Deployment**: Fully containerized using a multi-stage Dockerfile optimized for Next.js 15.
- **Inter-Departmental Data Flow**: A central `PatientVisit` record tracks patient journeys, with each department updating the same record and `currentStage` field.

## External Dependencies
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: NextAuth
- **File Storage**: Cloudinary
- **Email Services**: EmailJS
- **Payment Gateway**: Paystack
- **UI Libraries**: Bootstrap 5, Ant Design, React Bootstrap
- **Calendar**: FullCalendar
- **Charting**: ApexCharts
- **Rich Text Editor**: React Quill