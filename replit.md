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
- **Dependencies Installed**: All npm packages (600 packages) installed successfully using `npm install --legacy-peer-deps`
- **Next.js Configuration**: Already includes `allowedDevOrigins: ['*']` for development mode to support Replit's proxy infrastructure - no changes needed
- **Environment Variables**: 
  - Created `.env.local` with development configuration
  - Included placeholders for: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_*`, `PAYSTACK_*`, `EMAILJS_*`
  - MongoDB defaults to `mongodb://localhost:27017/lifepoint-emr` for local development
  - Users must configure MongoDB Atlas connection string for full functionality
- **Workflow Configuration**: Dev server already configured to run on port 5000 with host 0.0.0.0 (`npm run dev -- -p 5000 -H 0.0.0.0`)
- **Deployment Configuration**: Set up for Autoscale deployment with:
  - Build command: `npm run build`
  - Run command: `npm start`
  - Deployment type: Autoscale (stateless web application)
- **Application Status**: ✅ Application is fully functional and running in development mode
  - Frontend accessible at http://localhost:5000
  - Login page loads correctly with Life Point Medical Centre branding
  - All static assets and styles loading properly
- **Known Setup Notes**: 
  - WebSocket warnings for HMR are expected in Replit environment and don't affect functionality
  - To enable full functionality, users must configure MongoDB Atlas (see MONGODB_SETUP.md)
  - Optional services (Cloudinary, Paystack, EmailJS) can be configured via environment variables

### Docker Build TypeScript Fixes
- **CommonSelect Enhancement**: Updated to support controlled mode with `value` and `onChange` props for proper form state management, while maintaining backward compatibility for uncontrolled usage
- **Date/Time Type Safety**: Resolved all Dayjs/Date type mismatches across appointment modal, patient add/edit forms by ensuring consistent Dayjs object handling throughout the component lifecycle
- **Type Definitions**: Added missing fields to type definitions:
  - Branch: `code` (string, optional) and `manager` (string, optional)
  - Patient: `profileImage` (string, optional)
- **Memory Optimization**: Increased Node.js memory allocation from 4GB to 8GB (`--max-old-space-size=8192`) in build script to prevent SIGKILL errors during Docker builds
- **Branch Reference Fix**: Updated editDoctors component to use `branchId` instead of `branch` property for consistency

### Doctor Management Complete Overhaul (October 4, 2025)
- **TypeScript Fixes**:
  - Fixed date of birth (dob) field type mismatch in addDoctors.tsx (changed from string to Dayjs | null)
  - Created Bootstrap type declarations (src/types/bootstrap.d.ts) to resolve build errors
  - Production build now succeeds without TypeScript errors
- **Security Enhancements**:
  - **ImageWithBasePath XSS Prevention**: Added comprehensive URL validation to block dangerous protocols
    - Blocks javascript:, vbscript:, and other executable protocols
    - Restricts data: URIs to safe image MIME types only (png, jpeg, jpg, gif, webp)
    - Prevents stored XSS attacks via SVG data URIs with embedded JavaScript
    - Allows only safe protocols: http://, https://, blob:, data: (with MIME validation), and relative paths
  - **Admin-Only Access Control**: Added role-based access restrictions to add/edit doctor pages
    - Non-admin users are redirected with proper error messages
    - Prevents 403 errors and provides better UX
    - Aligns frontend authorization with backend API requirements
- **Profile Image Management**:
  - Fixed ImageWithBasePath component to properly handle base64 images and relative paths
  - Added profile image upload capability to edit doctor form (matching add doctor functionality)
  - Images now display correctly in both grid and list views
- **UI/UX Improvements**:
  - Fixed three-dot dropdown menu in doctor grid view (changed from Link to button element)
  - Added Bootstrap dropdown initialization after doctors data loads
  - Dropdown now properly shows edit/view/delete options when clicked
- **API Enhancements**:
  - **Duplicate Prevention**: Enhanced email validation with normalization (.toLowerCase().trim())
  - **MongoDB Error Handling**: Added duplicate key error (code 11000) handling for race conditions
  - **Pagination Fix**: Corrected pagination when department/specialization filters are applied
  - **BranchId Sync**: Added logic to sync branchId updates from User to StaffProfile model
  - **Improved Error Messages**: Better user feedback for duplicate email and validation errors
- **CRUD Operations**: All doctor CRUD operations verified and working correctly:
  - CREATE: Prevents duplicate emails, validates required fields, creates User and StaffProfile
  - READ: Proper population of related data, pagination works correctly, no duplicates
  - UPDATE: Supports all fields including profileImage, syncs branchId, checks permissions
  - DELETE: Soft delete (isActive: false), admin-only access, branch permissions enforced

### Patient Management UI Enhancement (October 5, 2025)
- **Icon Button Implementation**:
  - Replaced dropdown menus (three dots) with direct icon buttons in both grid and list views
  - Matches doctor list view implementation for consistency
  - Eye icon (ti-eye) for view, Edit icon (ti-edit) for edit, Trash icon (ti-trash) for delete
  - All buttons use `btn btn-sm btn-icon btn-light` classes for consistency
- **Mobile Responsive Design**:
  - Buttons use flexbox with `d-flex gap-2` for proper spacing
  - Small button size (btn-sm) optimized for mobile screens
  - Right-aligned in list view with `justify-content-end`
- **Access Control**:
  - Delete button only visible to ADMIN users via isAdmin session check
  - Delete confirmation modal properly wired with Bootstrap modal trigger
  - Delete handler calls API, clears state, and refreshes patient list
- **CRUD Operations**: All patient CRUD operations verified and working:
  - CREATE: Validates required fields, checks duplicate patient IDs, handles image upload
  - READ: Cross-branch viewing enabled, pagination and search working correctly
  - UPDATE: Branch-level access control enforced, supports all fields including profile image
  - DELETE: Admin-only soft delete (isActive: false), branch permissions enforced
- **Performance Optimizations**:
  - Added priority prop to life-point-logo.png images for LCP optimization
  - Added data-scroll-behavior="smooth" to <html> element for future Next.js compatibility
- **Build Verification**: Production build successful with no errors, only minor linting warnings

### Visit Management Complete Implementation (October 5, 2025)
- **Visit Creation Modal**: Fully functional modal integrated into visits list page
  - Fetches real patient data from API (/api/patients)
  - Fetches branch data for branch selection (/api/branches)
  - Creates visits via POST /api/visits
  - Auto-refreshes visit list after successful creation
  - Form validation with required fields
- **Visit List View**: Icon-based actions matching patients pattern
  - Eye icon (ti-eye) for viewing visit details
  - Edit icon (ti-edit) for editing visits (hidden for completed/cancelled)
  - Trash icon (ti-trash) for cancelling visits (admin-only access)
- **Visit Details Page**: Comprehensive view/edit functionality
  - Displays patient information with avatar
  - Shows complete visit timeline with all stages (front desk, nurse, doctor, lab, pharmacy, billing)
  - Displays vital signs, diagnosis, and notes for each stage
  - Edit mode allows updating visit date, current stage, and status
  - Proper API integration with GET/PUT /api/visits/[id]
- **Access Control**: Admin-only delete functionality properly implemented
- **Mobile Responsive**: Bootstrap grid classes ensure proper display on all screen sizes
- **CRUD Operations**: All visit CRUD operations verified and working:
  - CREATE: Modal form with API integration
  - READ: Cross-branch viewing enabled, proper pagination
  - UPDATE: Edit mode with form validation, branch-level access control
  - DELETE: Admin-only cancellation with confirmation modal

### Lab Results Page - Full CRUD Implementation (October 5, 2025)
- **Data Fetching**: Connected to backend API using labTestService.getAll()
  - Fetches real lab test data from the database
  - Displays populated patient and doctor information
  - Shows test ID, patient name, gender, requested date, referring doctor, test name, and status
- **State Management**: Implemented comprehensive state management with React hooks
  - useState for labTests, loading, pagination, search, and sort order
  - useEffect for automatic data fetching on component mount and filter changes
- **Pagination**: Full pagination support with page numbers
  - Shows current page, total pages, and total count
  - Next/Previous navigation with disabled states
  - Page number buttons with ellipsis for large page counts
  - Displays "Showing X to Y of Z results" information
- **Search Functionality**: Real-time search with API integration
  - Searches by test ID, test name, or test category
  - Debounced search to avoid excessive API calls
  - Clear button to reset search
  - Resets to page 1 on new search
- **Sort Functionality**: Sort by newest or oldest
  - Dropdown menu to select sort order
  - Automatically fetches data with new sort order
- **Loading States**: Professional loading spinner with message
  - Shows while fetching data
  - Disables buttons during loading
  - Smooth transitions between states
- **Error Handling**: Graceful error handling with toast notifications
  - Uses react-toastify for user-friendly error messages
  - Catches and displays API errors
  - Success toast for refresh action
- **Empty States**: User-friendly empty state messages
  - Different messages for no results vs. no search results
  - Icon and helpful text to guide users
- **Mobile Responsive Design**: Table adapts to different screen sizes
  - Hides less critical columns on mobile (gender, requested date, referred by)
  - Shows patient ID on mobile under patient name
  - Shows test category on mobile under test name
  - Icon-based actions buttons (view and delete)
  - Responsive search bar and pagination
- **Status Badges**: Color-coded status badges for quick visual recognition
  - Completed/Received: Green (badge-soft-success)
  - In Progress: Blue (badge-soft-info)
  - Pending: Yellow (badge-soft-warning)
  - Cancelled: Red (badge-soft-danger)
- **Refresh Functionality**: Manual refresh button with spinning icon animation
- **UI Consistency**: Matches existing patterns from Patient and Visit management
  - Icon-based action buttons (ti-eye for view, ti-trash for delete)
  - Bootstrap styling and responsive classes
  - Consistent card layout and table structure

### Known Issues
- Production build requires high memory allocation (8GB) due to large codebase
- ESLint warnings present (unused variables) - non-blocking, for future cleanup

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