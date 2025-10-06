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

**User Roles:** Eight distinct role-based access levels are supported: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, and ACCOUNTING, each with specific permissions.

**Role-Based Access Control (RBAC) - Completed October 6, 2025:**
-   **Comprehensive Permission System**: Complete ROLE_PERMISSIONS mapping in `rbac.ts` defining granular permissions for all 8 roles across patients, appointments, vitals, prescriptions, lab tests, pharmacy, billing, accounting, and system management.
-   **Sidebar Menu Filtering**: Dynamic sidebar menu filtering via `filterMenuByRole()` function ensures each role only sees authorized menu items based on their `allowedRoles` configuration.
-   **Role-Specific Dashboards**: Dedicated dashboard components for each role (AdminDashboard, DoctorDashboard, NurseDashboard, LabDashboard, PharmacyDashboard, BillingDashboard, AccountingDashboard, FrontDeskDashboard) with `RoleDashboardRouter` handling role-based routing.
-   **API Route Protection**: All API routes protected with `checkRole` middleware for write operations (POST/PUT/DELETE) and enhanced GET endpoint protection for sensitive data (staff, billing/invoices, prescriptions, patient documents).
-   **Security Enhancements**: Applied role-based access control to sensitive GET endpoints - Staff (admin-only), Billing/Invoices (billing, accounting, admin, front desk), Prescriptions (doctor, pharmacy, nurse, admin), Documents (admin, doctor, nurse, front desk).
-   **Permission Utilities**: `usePermissions` hook for frontend permission checks, `PermissionGate` component for conditional UI rendering, and comprehensive middleware stack (`requireAuth`, `checkRole`, `requirePermission`, `withBranchScope`, `canModifyResource`).
-   **Data-Level Security**: Branch-scoped queries via `buildRoleScopedFilters()` ensure multi-location data isolation; role hierarchy system for permission inheritance; owner-based access control for user data.
-   **Documentation**: Comprehensive RBAC verification matrix (`RBAC_VERIFICATION_MATRIX.md`) documenting all roles, permissions, sidebar access, dashboard features, API permissions, and test credentials.
-   **Architect Review**: All RBAC implementations reviewed and approved by system architect with PASS verdict confirming production readiness.

**Department Queue Dashboards (Completed - October 2025):**
-   **Real-Time Queue Management**: Each department (Nurse, Doctor, Lab, Pharmacy, Billing) has a dedicated queue dashboard showing patients waiting at their stage.
-   **Auto-Refresh System**: Configurable 30-second auto-refresh with countdown timer, toggle control, and automatic disabling during search operations to prevent data conflicts.
-   **Role-Based Queue Filtering**: Staff members see only patients in their department's queue from their branch; admins can view all queues across all branches with optional stage filtering.
-   **Mobile-Responsive Design**: Queue dashboards feature responsive table views for desktop and card-based layouts for mobile devices, ensuring accessibility across all screen sizes.
-   **Real-Time Patient Tracking**: Displays visit number, patient information, current stage, waiting time, and action buttons for seamless patient handoffs between departments.
-   **Search & Pagination**: Built-in search functionality for patient names, IDs, and visit numbers with paginated results for efficient queue management.
-   **Testing**: Comprehensive Playwright test suite covering authentication, navigation, auto-refresh, mobile responsiveness, and data display for all queue types.
-   **Technical Stack**: React hooks (`useQueue`), custom components (`QueuePage`, `QueueTable`), API endpoint (`/api/clocking/queue`), and type-safe interval management for performance.

**Patient Handoff System (Completed - October 2025):**
-   **Flexible Stage Transfers**: Enhanced handoff API supports flexible routing - doctors can send patients directly to pharmacy (bypassing lab) or billing based on clinical needs.
-   **Interactive Handoff UI**: Reusable `HandoffButton` component with modal interface for adding notes, specifying next actions, and selecting target department.
-   **Visual Patient Timeline**: Enhanced `VisitTimeline` component with animated progress indicators, color-coded stages, and comprehensive display of vitals, diagnosis, and timestamps.
-   **In-App Notifications**: Automatic notification creation in database when patients are handed off, alerting next department staff with patient details and visit information.
-   **One-Click Handoffs**: Staff can transfer patients with a single click from visit details page or queue dashboards, with automatic page refresh on success.
-   **Stage-Specific Options**: Doctors see options to send to Lab, Pharmacy, or Billing; other departments follow sequential workflow unless admin overrides.
-   **Components**: `HandoffButton` (src/components/visits/handoff/), `VisitTimeline` (src/components/visits/), enhanced API endpoint (`/api/clocking/handoff`).
-   **Integration Points**: Visit details page, queue dashboards, notification service with database persistence.

**Automatic Invoice Generation System (Completed - October 2025):**
-   **Auto-Generation on Visit Completion**: When a visit is handed off to the billing stage (after Lab/Pharmacy services), the system automatically generates an invoice combining all charges from consultation, lab tests, and prescriptions.
-   **Atomic Invoice Creation**: Utilizes MongoDB's findOneAndUpdate with upsert to ensure exactly one invoice per visit, preventing duplicate invoices even under concurrent requests.
-   **Unique Invoice Numbers**: Each invoice receives a unique identifier generated from timestamp + cryptographically secure random suffix (format: `INV-{timestamp}-{random}`).
-   **Intelligent Pricing**: Automatically aggregates charges including consultation fees (default ₦5,000), lab tests (default ₦3,000 per test), and medications with configurable pharmacy markup (default 1.2x).
-   **Insurance Support**: Automatically applies insurance deductions when patient has active insurance coverage, generating insurance claims with pending status.
-   **Manual Invoice Access**: Billing staff and front desk can manually generate or view invoices through the API endpoint `/api/billing/generate-from-visit`.
-   **Role-Based Access**: Invoice generation restricted to BILLING, FRONT_DESK, and ADMIN roles; viewing allowed for ACCOUNTING role as well.
-   **Non-Blocking Handoffs**: Invoice generation failures don't block patient handoffs; errors are logged and staff can manually generate invoices later.
-   **Duplicate Prevention**: Unique sparse index on `encounterId` ensures one invoice per visit; subsequent generation attempts return existing invoice.
-   **Components**: Invoice generation service (`src/lib/services/invoiceService.ts`), API endpoint (`/api/billing/generate-from-visit`), integrated handoff logic (`/api/clocking/handoff`).
-   **Testing**: Comprehensive Playwright test suite covering automatic generation, concurrent requests, and invoice uniqueness validation.

**Real-Time Notification System (Completed - October 6, 2025):**
-   **Header Notification Dropdown**: Live notification system integrated into the header navigation with auto-refresh every 30 seconds.
-   **Department-Based Filtering**: Admin users see all notifications across their branch with `viewAll=true` parameter; other department staff see only notifications assigned to them (tasks handed off to their department).
-   **Unread Notification Badge**: Dynamic badge displays count of unread notifications on the notification bell icon.
-   **Interactive Notifications**: Click any notification to mark as read via PUT API endpoint; notifications show icons based on type (success, error, warning, appointment, info).
-   **Real-Time Updates**: Notifications fetch on mount and refresh periodically to keep staff informed of patient handoffs, appointments, and system alerts.
-   **Consistent UI**: Notification dropdown styling matches the main notifications page for a cohesive user experience.
-   **API Integration**: `/api/notifications` endpoint with role-based filtering, pagination support, and mark-as-read functionality.

**Logo & Branding (Updated - October 6, 2025):**
-   **Logo Dimensions**: Fixed logo aspect ratio to 1:1 (square) across all states - Header (42×42 regular, 32×32 small), Sidebar (50×50 expanded, 36×36 collapsed).
-   **Professional Appearance**: Logo now displays without distortion in both expanded and collapsed sidebar states, maintaining brand identity consistency.
-   **Branding Colors**: Navy blue (`#003366`), red (`#CC0000`), and white (`#FFFFFF`) color scheme maintained throughout the application.

**Settings Management (Streamlined - October 6, 2025):**
-   **Essential Settings Only**: Reduced settings tabs from 7 to 3 core sections appropriate for medical EMR operations.
-   **Kept Settings**: General Settings (profile, contact info, address), Security Settings (password, 2FA, authentication), Notifications Settings (push/email/SMS preferences).
-   **Removed Settings**: Preferences (module toggles - minimal functionality), Appearance (theme customization - not critical), User Permissions (redundant with Staff management), Plans & Billing (subscription billing - inappropriate for EMR user settings).
-   **Clean Navigation**: Updated sidebar and router configurations to only include essential settings routes, removing obsolete route constants and page components.
-   **404 Handling**: Removed settings pages now properly return 404 errors, preventing access to deprecated functionality.

**UI/UX Decisions:**
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