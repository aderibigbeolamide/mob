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