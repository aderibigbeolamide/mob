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
-   **Clinical Workflow**: Structured patient clocking system (Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Returned to Front Desk → Completed) for seamless handoffs, managed by a central `PatientVisit` record.
-   **Billing & Payments**: Invoice generation, payment processing, insurance claims, and comprehensive debt management.
-   **Messaging & Notifications**: In-app communication and event-driven notifications.
-   **Staff Attendance**: Clock-in/out system.
-   **Real-Time Queue Management**: Department-specific queue dashboards with auto-refresh, role-based filtering, and mobile responsiveness.
-   **Admin Queue Monitoring**: Comprehensive real-time monitoring dashboard for administrators showing all department queues, wait times with color-coded status (green <30min, yellow 30-60min, red >60min), patient counts, and busiest department analytics. Features auto-refresh every 30 seconds with manual refresh option.
-   **Patient Handoff System**: Flexible stage transfers with interactive UI, visual patient timelines, and in-app notifications.
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