# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. Its primary purpose is to streamline patient care, clinical workflows, billing, and inter-departmental communication within a medical center. The system supports branch-specific and role-based access, aiming to enhance efficiency and patient outcomes. Key capabilities include patient management, appointment scheduling, clinical workflow management, billing and payments, messaging, and staff attendance tracking.

## Recent Changes
**Date: October 8, 2025**
- **Build Issue Resolution**: Fixed prerender error in invoice-details page by adding `export const dynamic = 'force-dynamic'` to support runtime rendering with useSearchParams(). Build now completes successfully without errors.
- **Currency System Update**: Completed comprehensive conversion from US Dollars ($) to Nigerian Naira (₦) across the entire application:
  - Updated all JSON data files (invoiceListData.ts, dataTablesData.ts) with Naira symbols
  - Converted all UI components (widgets, tables, search results, forms) to display ₦
  - Updated input masks and default values to use Naira formatting
  - Invoice, billing, pharmacy, and accounting modules now use NGN currency with proper formatting (en-NG locale)
- **Invoice System Enhancement**: Updated invoice components to fetch and display actual patient data from the database instead of static placeholders. Invoices now show real patient names, addresses, contact information, and dynamic line items.
- **Branding Update**: Replaced Dreams EMR logo with custom Life Point Medical Centre logo (lifepoint-logo-dark.svg and lifepoint-logo.svg) across all invoice pages.
- **Invoice Details Component**: Implemented dynamic data fetching from `/api/billing/invoices/[id]` with proper loading states, error handling, and patient address formatting with fallbacks.
- **Build Configuration**: Verified Dockerfile has optimal memory allocation (16GB via NODE_OPTIONS) for production builds.

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
-   **Clinical Workflow**: Structured patient clocking system (Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Returned to Front Desk → Completed) for seamless handoffs, managed by a central `PatientVisit` record.
-   **Billing & Payments**: Invoice generation, payment processing, insurance claims, and comprehensive debt management.
-   **Messaging & Notifications**: In-app communication and event-driven notifications.
-   **Staff Attendance**: Clock-in/out system.
-   **Real-Time Queue Management**: Department-specific queue dashboards with auto-refresh, role-based filtering, and mobile responsiveness.
-   **Admin Queue Monitoring**: Comprehensive real-time monitoring dashboard for administrators showing all department queues, wait times with color-coded status (green <30min, yellow 30-60min, red >60min), patient counts, and busiest department analytics. Features auto-refresh every 30 seconds with manual refresh option.
-   **Patient Handoff System**: Flexible stage transfers with interactive UI, visual patient timelines, and in-app notifications.
-   **Doctor Consultation Workflow**: Comprehensive doctor consultation system with clock-in functionality, patient vitals review, and detailed consultation forms. Doctors can record chief complaints, history of present illness, physical examination findings, diagnosis, treatment plans, prescriptions (with dosage, frequency, duration), lab orders, and follow-up instructions. All consultation data is saved to the visit record and displayed in the timeline.
-   **Lab Clock-In Workflow**: Complete lab technician workflow with clock-in modal showing full patient journey. Lab technicians can view Front Desk notes, Nurse vitals, and Doctor diagnosis/lab orders before adding test results. Supports multiple test results per visit with validation, and integrates seamlessly with the queue management system.
-   **Pharmacy Clock-In Workflow**: Complete pharmacy workflow with clock-in modal displaying patient journey, prescribed medications, and dosage information. Pharmacists can review all previous department records before dispensing medications.
-   **Department Record Viewing**: Staff can view comprehensive patient records from all previous departments before clocking in. The ViewDepartmentRecordModal displays front desk notes, vital signs, doctor consultations, prescriptions with drugs/dosage, lab results, and billing information with staff attribution for each department.
-   **Automatic Invoice Generation**: Invoices auto-generated on visit completion, combining all charges with intelligent pricing and insurance support.
-   **Real-Time Notification System**: Header notification dropdown with department-based filtering, unread badges, and interactive read/unread functionality.
-   **Session Management & Multi-User Support**: Robust session handling, proper role routing, and secure logout.
-   **Settings Management**: Streamlined settings with only essential sections (General, Security, Notifications).

**User Roles:** Eight distinct role-based access levels are supported: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, each with specific permissions. A comprehensive RBAC system is implemented with granular permissions, dynamic sidebar filtering, role-specific dashboards, and API route protection.

**UI/UX Decisions:**
-   **Components**: Leverages Ant Design and React Bootstrap.
-   **Data Visualization**: ApexCharts for data presentation and FullCalendar for scheduling.
-   **Branding**: Consistent use of navy blue, red, and white color scheme, with properly sized and professional logo display.

**Technical Implementations:**
-   **State Management**: Redux Toolkit.
-   **Styling**: SCSS/Sass.
-   **Deployment**: Configured for Autoscale deployment on Replit, using `output: 'standalone'` for optimized Docker deployment.
-   **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations for Replit compatibility.

**System Design Choices:**
-   **Cross-Branch Viewing with Edit Restrictions**: Staff can view data across all branches, but edit/delete operations are restricted to their own branch. Admins have full cross-branch access.
-   **API Endpoints**: Complete CRUD operations with read/write permission separation: GET endpoints allow cross-branch viewing, while POST/PUT/DELETE enforce strict branch isolation.
-   **Docker Deployment**: The application is fully containerized using a multi-stage Dockerfile optimized for Next.js 15.
-   **Inter-Departmental Data Flow**: A central `PatientVisit` record tracks patient journeys through the clinic, with each department updating the same record and `currentStage` field.

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