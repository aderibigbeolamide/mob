# Dreams EMR - Healthcare Management System

## Overview
Dreams EMR is a comprehensive Electronic Medical Records (EMR) system built with Next.js 15. It provides a modern, responsive Bootstrap 5 admin template for healthcare management with features for managing patients, doctors, appointments, pharmacy, laboratory, and more.

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Runtime**: Node.js 20
- **UI Framework**: React 19
- **CSS Framework**: Bootstrap 5.3.7
- **State Management**: Redux Toolkit
- **Styling**: SCSS/Sass
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
│   ├── (authentication)/         # Auth pages (login, signup, etc.)
│   ├── (pages)/                  # Main application pages
│   │   ├── (healthcare)/         # Healthcare modules
│   │   │   ├── (patients)/       # Patient management
│   │   │   ├── (doctors)/        # Doctor management
│   │   │   ├── (appointments)/   # Appointment scheduling
│   │   │   ├── (laboratory)/     # Lab results and tests
│   │   │   └── pharmacy/         # Pharmacy management
│   │   ├── (application)/        # General app features
│   │   ├── (ui-interface)/       # UI components and examples
│   │   └── (main-module)/        # Dashboard and main views
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # Client providers wrapper
│   ├── page.tsx                  # Root page (redirects to dashboard)
│   └── globals.scss              # Global styles
├── components/                   # Reusable components
├── core/                         # Core utilities and common components
├── hooks/                        # Custom React hooks
├── router/                       # Routing configuration
└── style/                        # Styling assets
    ├── css/                      # Compiled CSS
    ├── scss/                     # SCSS source files
    └── icon/                     # Icon fonts and assets
```

## Development Setup

### Running Locally
The project is configured to run on port 5000 with the following command:
```bash
npm run dev -- -p 5000 -H 0.0.0.0
```

This is automatically set up in the workflow and will start when you click "Run".

### Key Routes
- `/` - Redirects to dashboard
- `/dashboard` - Main dashboard with statistics and overview
- `/login` - User authentication
- `/patients` - Patient management
- `/doctors` - Doctor management
- `/appointments` - Appointment scheduling
- `/pharmacy` - Pharmacy management
- `/laboratory` - Lab results management

## Configuration

### Next.js Configuration
The Next.js config (`next.config.ts`) includes:
- `allowedDevOrigins` for Replit proxy support (*.replit.dev, *.repl.co, *.replit.app)

### Deployment
The project is configured for Autoscale deployment:
- **Build command**: `npm run build`
- **Run command**: Should be `npm start` (Note: When publishing, ensure the run command is set to `npm start` in the deployment settings)
- **Deployment type**: Autoscale (suitable for stateless web applications)

## Recent Changes (October 2, 2025)
- ✅ Installed all Node.js dependencies
- ✅ Configured Next.js for Replit environment with allowed dev origins
- ✅ Created root page with redirect to dashboard
- ✅ Set up development workflow on port 5000
- ✅ Verified application is running successfully
- ✅ Configured deployment settings for production

## Current State
The application is fully functional and running on Replit. The dashboard displays healthcare statistics including patient count, appointments, doctors, and transaction data. All UI components, forms, tables, and healthcare modules are accessible through the navigation sidebar.

## Notes
- The project uses Turbopack for faster development builds
- All static assets and icon fonts are included in the repository
- The application uses client-side rendering with Redux for state management
- Bootstrap JavaScript components are loaded dynamically on the client side
