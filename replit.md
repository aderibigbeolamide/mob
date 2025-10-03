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

## Branch-Specific Data Isolation
The system enforces strict branch-based data isolation:
- **Branch Model**: Each branch has a unique code and manages its own operations
- **User Assignment**: All users (staff) are assigned to a specific branch via `branchId`
- **Data Filtering**: All models (Patient, Appointment, Visit, LabTest, etc.) include `branchId` for isolation
- **Access Control**: 
  - Non-admin users can only access data from their assigned branch
  - Admins can view and manage data across all branches
  - Branch filtering is automatically applied via middleware helpers
- **Cross-Branch Access**: Admins can use `?allBranches=true` query parameter to view all branch data

## API Endpoints (Complete CRUD)
All modules have full CRUD operations with branch filtering:
- **Branches** (`/api/branches`): Admin-only management of hospital branches
- **Doctors** (`/api/doctors`): Complete doctor management with staff profiles
- **Patients** (`/api/patients`): Patient registration and records
- **Appointments** (`/api/appointments`): Appointment scheduling and management
- **Visits** (`/api/visits`): Patient visit tracking and clinical workflow
- **Lab Tests** (`/api/lab-tests`): Laboratory test requests and results
- **Prescriptions** (`/api/prescriptions`): Medication prescriptions
- **Billing/Invoices** (`/api/billing/invoices`): Invoice generation and payments
- **Staff** (`/api/staff`): Staff member management
- **Messages** (`/api/messages`): Inter-staff communication
- **Notifications** (`/api/notifications`): System notifications

## Docker Deployment

### Production Deployment with Docker
The application is fully containerized using a multi-stage Dockerfile optimized for Next.js 15:

**Build the Docker image:**
```bash
docker build -t lifepoint-emr:latest .
```

**Run the container:**
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI="your_mongodb_connection_string" \
  -e NEXTAUTH_SECRET="your_secret_key" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  lifepoint-emr:latest
```

**With Docker Compose:**
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=your_mongodb_uri
      - NEXTAUTH_SECRET=your_secret
      - NEXTAUTH_URL=https://yourdomain.com
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

### Docker Configuration Details
- **Base Image**: Node.js 20 Alpine (minimal footprint)
- **Multi-stage Build**: Separate stages for dependencies, build, and runtime
- **Standalone Output**: Uses Next.js standalone mode for ~80% smaller image size
- **Security**: Runs as non-root user (nextjs:nodejs)
- **Port**: Exposes port 5000 (configured for Life Point EMR)
- **Production Optimized**: Telemetry disabled, production environment variables

### Environment Variables for Docker
Required environment variables:
```
NODE_ENV=production
MONGODB_URI=<your_mongodb_connection_string>
NEXTAUTH_SECRET=<your_secure_secret_key>
NEXTAUTH_URL=<your_production_url>
PORT=5000
HOSTNAME=0.0.0.0
```

Optional (for full features):
```
CLOUDINARY_CLOUD_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<cloudinary_key>
CLOUDINARY_API_SECRET=<cloudinary_secret>
EMAILJS_SERVICE_ID=<emailjs_service>
EMAILJS_TEMPLATE_ID=<emailjs_template>
EMAILJS_PUBLIC_KEY=<emailjs_public>
EMAILJS_PRIVATE_KEY=<emailjs_private>
PAYSTACK_PUBLIC_KEY=<paystack_public>
PAYSTACK_SECRET_KEY=<paystack_secret>
```

## Recent Updates (Oct 3, 2025)

### GitHub Import & Setup
✅ Successfully imported from GitHub and configured for Replit
- All 596 npm dependencies installed with `--legacy-peer-deps` flag
- Environment variables configured in `.env.local`
- Development server running on port 5000
- Next.js 15 with Turbopack enabled

### Branch Management System
✅ Complete branch CRUD API implemented
- Admin-only branch creation, update, and deletion
- Branch filtering middleware enforces data isolation
- All API endpoints properly apply branch-based filtering
- Cross-branch access available to admins with query parameter

### Docker Deployment Ready
✅ Production-ready containerization
- Multi-stage Dockerfile with Next.js 15 standalone mode
- `.dockerignore` configured for optimal build
- `next.config.ts` updated with `output: 'standalone'`
- Image size optimized (~200-250MB vs 1GB+)

### Admin Capabilities
✅ Full CRUD access implemented for admins:
- Create, Read, Update, Delete operations on all modules
- Branch management (create, update, delete branches)
- Doctor management (add, update, remove doctors)
- Patient management (register, update, manage patients)
- Staff management (add, update, remove staff members)
- All other modules (appointments, visits, lab tests, prescriptions, billing)
- Cross-branch data viewing with `?allBranches=true` parameter