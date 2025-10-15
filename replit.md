# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. Its primary purpose is to streamline patient care, clinical workflows, billing, and inter-departmental communication within a medical center. The system supports branch-specific and role-based access, aiming to enhance efficiency and patient outcomes. Key capabilities include patient management, appointment scheduling, clinical workflow management, billing and payments, messaging, and staff attendance tracking. The system integrates insurance management into patient registration to streamline verification and billing processes.

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
- **Patient Management**: Registration, record keeping, document uploads, medical history, vitals, and insurance integration.
- **Appointment Scheduling**: Calendar-based booking and patient self-service.
- **Clinical Workflow**: Structured patient clocking system (e.g., Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Completed) for seamless handoffs, managed by a central `PatientVisit` record. Supports "Lab-Only" visits.
- **Billing & Payments**: Invoice generation, payment processing, insurance claims, and debt management.
- **Messaging & Notifications**: In-app communication and real-time event-driven notifications.
- **Staff Attendance**: Clock-in/out system.
- **Real-Time Queue Management**: Department-specific queue dashboards with auto-refresh and role-based filtering, synchronized via a global event system.
- **Patient Handoff System**: Flexible stage transfers with interactive UI and in-app notifications.
- **Doctor Consultation Workflow**: Comprehensive consultation system including chief complaints, history, physical exams, diagnosis, treatment plans, prescriptions, and lab orders.
- **Lab & Pharmacy Clock-In Workflows**: Department-specific workflows for processing lab tests and dispensing medications, including viewing prescribed medications.
- **Department Record Viewing**: Staff can view comprehensive patient records across departments, with intelligent status filtering for lab and medical results.
- **Session Management & Multi-User Support**: Robust session handling, role routing, and secure logout.
- **Settings Management**: Streamlined general, security, and notification settings.

**User Roles:** Eight distinct role-based access levels: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, with granular permissions, dynamic sidebar filtering, and API route protection.

**UI/UX Decisions:**
- **Components**: Leverages Ant Design and React Bootstrap.
- **Data Visualization**: ApexCharts for data presentation and FullCalendar for scheduling.
- **Branding**: Consistent use of navy blue, red, and white color scheme.
- **Location Integration**: Comprehensive Nigerian administrative location system (State → LGA → Ward).

**Technical Implementations:**
- **State Management**: Redux Toolkit.
- **Styling**: SCSS/Sass.
- **Deployment**: Configured for Autoscale deployment on Replit using `output: 'standalone'`, optimized with Turbopack.
- **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations.

**System Design Choices:**
- **Cross-Branch Viewing with Edit Restrictions**: Staff can view data across all branches, but edit/delete operations are restricted to their own branch. Admins have full cross-branch access.
- **API Endpoints**: Complete CRUD operations with read/write permission separation, enforcing branch isolation for write operations. Utilizes Next.js 15 Route Handlers with async params.
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