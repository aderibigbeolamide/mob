# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. This platform streamlines patient care, clinical workflows, billing, and communication across different hospital units through branch-specific and role-based access. The system aims to enhance efficiency and patient outcomes in a medical center environment.

## User Preferences
The user prefers a development approach that emphasizes:
- **Clarity**: Simple, clear explanations for any proposed changes or issues.
- **Modularity**: Prioritize solutions that are modular and maintainable.
- **Security**: Focus on robust security measures, especially for patient data and access control.
- **Efficiency**: Optimize for performance and efficient resource usage within the Replit environment.
- **Iterative Development**: Develop features incrementally, allowing for regular feedback and adjustments.
- **Autonomy**: The agent should take initiative in identifying and fixing issues, but report them.

## System Architecture
The EMR system is built on Next.js 15 with the App Router, utilizing TypeScript for type safety and React 19 for the UI. MongoDB with Mongoose handles data persistence, and NextAuth manages authentication. The UI incorporates Bootstrap 5, Ant Design, and React Bootstrap for a consistent and responsive experience.

**Core Features:**
-   **Patient Management**: Registration, record keeping, document uploads via Cloudinary, medical history, and vitals tracking.
-   **Appointment Scheduling**: Calendar-based booking (FullCalendar), role-aware management, and patient self-service requests.
-   **Clinical Workflow**: A structured patient clocking system (Checked In → Nurse → Doctor → Lab → Pharmacy → Billing → Returned to Front Desk → Completed) ensures smooth patient handoffs.
-   **Billing & Payments**: Invoice generation, payment processing through Paystack, and insurance claims management.
-   **Messaging & Notifications**: In-app communication, event-driven notifications, and email fallbacks using EmailJS.
-   **Staff Attendance**: Clock-in/out system for tracking attendance.

**User Roles:** The system supports 8 distinct role-based access levels: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, each with specific permissions and workflows.

**UI/UX Decisions:**
-   **Branding**: Uses "Life Point Medical Centre" with a navy blue (`#003366`), red (`#CC0000`), and white (`#FFFFFF`) color scheme.
-   **Components**: Leverages Ant Design and React Bootstrap for a professional and consistent user interface.
-   **Data Visualization**: ApexCharts is used for presenting data, and FullCalendar for scheduling.

**Technical Implementations:**
-   **State Management**: Redux Toolkit is used for predictable state management.
-   **Styling**: SCSS/Sass for maintainable stylesheets.
-   **Deployment**: Configured for Autoscale deployment on Replit, with specific build and run commands.
-   **Next.js Configuration**: Includes `serverExternalPackages` for Mongoose and Webpack configurations for Replit compatibility.

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