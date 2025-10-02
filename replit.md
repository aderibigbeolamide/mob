# Life Point Medical Centre - EMR System

## Overview
Life Point Medical Centre EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15 and TypeScript. This branch-specific, role-based platform streamlines patient care, clinical workflows, billing, and communication across different hospital units.

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **UI Framework**: React 19
- **CSS Framework**: Bootstrap 5.3.7
- **State Management**: Redux Toolkit
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth (planned)
- **Styling**: SCSS/Sass
- **Integrations**:
  - Cloudinary (media/file storage)
  - EmailJS (email notifications)
  - Paystack (payment processing)
- **Additional Libraries**: 
  - Ant Design components
  - React Bootstrap
  - FullCalendar for scheduling
  - ApexCharts for data visualization
  - React Quill for rich text editing
  - Leaflet for maps

### Project Structure
```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (backend endpoints)
│   ├── (authentication)/         # Auth pages (login, signup, etc.)
│   ├── (pages)/                  # Main application pages
│   │   ├── (healthcare)/         # Healthcare modules
│   │   │   ├── (patients)/       # Patient management
│   │   │   ├── (doctors)/        # Doctor management
│   │   │   ├── (appointments)/   # Appointment scheduling
│   │   │   ├── (laboratory)/     # Lab results and tests
│   │   │   └── pharmacy/         # Pharmacy management
│   │   ├── (application)/        # General app features
│   │   ├── (ui-interface)/       # UI components (template examples)
│   │   └── (main-module)/        # Dashboard and main views
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # Client providers wrapper
│   ├── page.tsx                  # Root page (landing page)
│   └── globals.scss              # Global styles
├── components/                   # Reusable components
├── core/                         # Core utilities and common components
├── hooks/                        # Custom React hooks
├── lib/                          # Server-side utilities and services
│   ├── dbConnect.ts              # MongoDB connection utility
│   ├── services/                 # Integration services (Cloudinary, Paystack, EmailJS)
│   ├── middleware/               # Auth middleware, role checking
│   └── utils/                    # Utility functions
├── models/                       # Mongoose schemas (to be created)
├── router/                       # Routing configuration
├── types/                        # TypeScript type definitions
│   ├── emr.ts                    # EMR-specific types (roles, patients, appointments)
│   └── next-auth.d.ts            # NextAuth type extensions
└── style/                        # Styling assets
    ├── css/                      # Compiled CSS
    ├── scss/                     # SCSS source files
    └── icon/                     # Icon fonts and assets
```

## User Roles
The system supports 8 role-based access levels:
- **ADMIN** - Full system access and configuration
- **FRONT_DESK** - Patient registration, appointments, final patient checkout
- **NURSE** - Vitals, triage, patient handoff to doctor
- **DOCTOR** - Diagnosis, prescriptions, treatment plans
- **LAB** - Lab tests, results entry
- **PHARMACY** - Dispensing medication, inventory
- **BILLING** - Invoice generation, payment processing
- **ACCOUNTING** - Financial reports, reconciliation

## Core Features (Planned)

### Landing Page
- Public-facing homepage with hospital information
- Hero section with call-to-action
- Services, insurance information, and contact details
- Staff and patient login gateways

### Patient Management
- Patient registration and record management
- Document uploads (Cloudinary integration)
- Medical history, vitals tracking
- Patient search and filtering

### Appointment Scheduling
- Calendar-based booking system (FullCalendar)
- Role-aware appointment management
- Patient self-service appointment requests

### Clinical Workflow (Patient Clocking)
- Patient status pipeline (clocked in → nurse → doctor → lab → pharmacy → billing → checkout)
- Staff-to-staff handoff system with notifications
- Front Desk performs final checkout

### Billing & Payments
- Invoice generation
- Paystack payment integration
- Insurance claims management
- Payment reconciliation

### Messaging & Notifications
- In-app messaging between staff
- Event-driven notifications
- Email fallbacks (EmailJS)

### Staff Attendance
- Clock-in/out system
- Attendance tracking and reports
- Branch-specific time logs

## Development Setup

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# EmailJS
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key

# Paystack
PAYSTACK_PUBLIC_KEY=your_public_key
PAYSTACK_SECRET_KEY=your_secret_key

# Environment
NODE_ENV=development
```

### Running Locally

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and database connection

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will run on `http://localhost:3000`

4. **For Replit environment:**
   ```bash
   npm run dev -- -p 5000 -H 0.0.0.0
   ```
   
   This is automatically configured in the workflow.

### Building for Production

```bash
npm run build
npm start
```

### Replit Setup Notes (Oct 2, 2025)

This project has been configured to run on Replit:

1. **Dependencies**: Installed with `--legacy-peer-deps` flag due to React 19 and react-paystack compatibility. The `.npmrc` file ensures this flag is used automatically.

2. **Environment Variables**: Created `.env.local` with:
   - `MONGODB_URI`: MongoDB connection string (set to local MongoDB, update for production)
   - `NEXTAUTH_SECRET`: Generated secret for session encryption
   - `NEXTAUTH_URL`: Set to http://localhost:5000 (for Replit development)

3. **Development Server**: Configured to run on port 5000 with host 0.0.0.0 to work with Replit's proxy:
   ```bash
   npm run dev -- -p 5000 -H 0.0.0.0
   ```

4. **Deployment**: Configured for autoscale deployment with:
   - Build: `npm run build`
   - Run: `npm start`

5. **Replit Proxy Configuration**: Next.js config updated with `allowedOrigins: ['*']` in experimental serverActions to work with Replit's iframe proxy.

6. **Known Issues**:
   - React hydration warning in development (doesn't affect functionality)
   - Webpack warning with Turbopack (can be ignored or Turbopack config can be added)

## Configuration

### Next.js Configuration
The Next.js config (`next.config.ts`) includes:
- `serverExternalPackages` for Mongoose compatibility with Next.js server components
- Webpack configuration for top-level await support
- Server runs with `-H 0.0.0.0` flag for Replit proxy compatibility

### Deployment
The project is configured for Autoscale deployment:
- **Build command**: `npm run build`
- **Run command**: `npm start`
- **Deployment type**: Autoscale (suitable for stateless web applications)

## Implementation Progress

### ✅ Phase 1 - Foundation (Completed - Oct 2, 2025)
- [x] Environment variables structure (.env.local created)
- [x] Backend folder structure (lib/services, lib/middleware, lib/utils)
- [x] TypeScript types for EMR (UserRole, ClockStatus, Branch, Patient, Appointment)
- [x] MongoDB connection utility (graceful error handling)
- [x] Project structure documented
- [x] Replit environment setup complete
- [x] Dependencies installed with legacy-peer-deps flag
- [x] Development workflow configured (port 5000)
- [x] Deployment settings configured (autoscale)
- [x] NextAuth authentication setup complete
- [x] Mongoose models created (User, Patient, Appointment, Invoice, etc.)

### ✅ Phase 2 - Core Platform (Completed - Oct 2, 2025)
- [x] NextAuth authentication implementation with credentials provider
- [x] Role-based middleware and guards (8 roles: ADMIN, FRONT_DESK, NURSE, DOCTOR, LAB, PHARMACY, BILLING, ACCOUNTING)
- [x] RBAC permission system with 40+ granular permissions
- [x] Cloudinary service integration for file uploads
- [x] Paystack service integration for payments
- [x] Notification service for system alerts

### ✅ Phase 3 - Feature Development (Completed - Oct 2, 2025)
- [x] Patient Management module (CRUD, search, filtering, Cloudinary integration)
- [x] Appointment Scheduling module (conflict detection, notifications)
- [x] Clinical Workflow & Clocking System (patient handoff: CHECKED_IN → NURSE → DOCTOR → LAB → PHARMACY → BILLING → RETURNED_TO_FRONT_DESK → COMPLETED)
- [x] Billing & Payments (invoice generation, Paystack integration, payment verification)
- [x] In-app Messaging & Notifications (staff communication, system alerts)
- [x] Staff Attendance tracking (via clocking system)

### ✅ Phase 4 - Polish & Deployment (Completed - Oct 2, 2025)
- [x] Landing page with Life Point branding
- [x] Logo and color scheme
- [x] Template cleanup (removed UI demos, documentation pages)
- [x] Security hardening (workflow bypass protection, role validation)
- [x] Environment configuration optimized

## Branding
- **Hospital Name**: Life Point Medical Centre
- **Logo**: `/public/life-point-logo.png` (to be updated)
- **Primary Colors**: 
  - Navy Blue: `#003366` (from logo)
  - Red: `#CC0000` (from logo)
  - White: `#FFFFFF`

## Notes
- The project uses Turbopack for faster development builds
- React 19 requires `--legacy-peer-deps` flag for some dependencies
- All static assets and icon fonts are included
- MongoDB connection handles missing MONGODB_URI gracefully with helpful errors
- Template UI demo pages retained as reference (can be removed later)

## Key Routes (Current Template)
- `/` - Landing page (to be redesigned)
- `/login` - User authentication
- `/dashboard` - Main dashboard
- `/patients` - Patient management
- `/doctors` - Doctor management
- `/appointments` - Appointment scheduling
- `/pharmacy` - Pharmacy management
- `/laboratory` - Lab results management

## Development Guidelines

### Code Organization
- Keep API routes in `src/app/api/`
- Put shared utilities in `src/lib/utils/`
- Integration services go in `src/lib/services/`
- Mongoose models in `src/models/`
- TypeScript types in `src/types/`

### Best Practices
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Implement proper error handling
- Use environment variables for secrets
- Write reusable components
- Implement role-based access control
- Validate data on both client and server

### Testing
- Test API endpoints with proper authentication
- Verify role-based access restrictions
- Check mobile responsiveness
- Test payment flows in sandbox mode
- Validate email notifications

## Support & Documentation
- Next.js Docs: https://nextjs.org/docs
- MongoDB/Mongoose: https://mongoosejs.com/
- NextAuth: https://next-auth.js.org/
- Cloudinary: https://cloudinary.com/documentation
- Paystack: https://paystack.com/docs
- EmailJS: https://www.emailjs.com/docs/
