"use client";

import { all_routes } from "@/router/all_routes";
import { UserRole } from "@/types/emr";

const route = all_routes;

const ALL_ROLES = [
  UserRole.ADMIN,
  UserRole.DOCTOR,
  UserRole.NURSE,
  UserRole.LAB,
  UserRole.PHARMACY,
  UserRole.BILLING,
  UserRole.ACCOUNTING,
  UserRole.FRONT_DESK
];

export const SidebarData = [
  {
    tittle: "MAIN",
    submenuItems: [
      {
        label: "Dashboard",
        link: route.dashboard,
        submenu: false,
        icon: "layout-board",
        submenuItems: [],
        allowedRoles: ALL_ROLES,
      },
    ],
  },
  {
    tittle: "Healthcare",
    submenuItems: [
      {
        label: "Patients",
        link: route.patients,
        relatedRoutes: [
          route.addPatient,
          route.editPatient,
          route.allPatientsList,
          route.patientDetails,
          route.patientDetailsAppointment,
          route.patientDetailsVitalSign,
          route.patientDetailsVisitHistory,
          route.patientDetailsLabResults,
          route.patientdetailsPrescription,
          route.patientetailsMedicalHistory,
          route.patientetailsDocuments,
        ], 
        submenu: false,
        icon: "users",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.FRONT_DESK, UserRole.BILLING, UserRole.ACCOUNTING, UserRole.LAB, UserRole.PHARMACY],
      },
      {
        label: "Doctors",
        link: route.doctors,
        relatedRoutes: [
          route.allDoctorsList,
          route.doctorDetails,
          route.addDoctors,
          route.editDoctors,
        ], 
        submenu: false,
        icon: "stethoscope",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN],
      },
      {
        label: "Appointments",
        link: route.appointments,
         relatedRoutes: [
          route.appointmentConsultation,
         
        ], 
        submenu: false,
        icon: "calendar-time",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.FRONT_DESK, UserRole.LAB, UserRole.PHARMACY, UserRole.BILLING, UserRole.ACCOUNTING],
      },
      {
        label: "Admissions",
        link: route.admissions,
        relatedRoutes: [], 
        submenu: false,
        icon: "bed",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.FRONT_DESK],
      },
      {
        label: "Visits",
        link: route.visits,
         relatedRoutes: [
          route.startVisits,
         
        ], 
        submenu: false,
        icon: "e-passport",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.FRONT_DESK],
      },
      {
        label: "Laboratory",
        link: "#",
        submenu: true,
        icon: "test-pipe",
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB, UserRole.NURSE],
        submenuItems: [
          {
            label: "Lab Results",
            link: route.labResults,
            submenu: false,
            submenuItems: [],
            allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB, UserRole.NURSE],
          },
          {
            label: "Medical Rsults",
            link: route.medicalResults,
            submenu: false,
            submenuItems: [],
            allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB, UserRole.NURSE],
          },
        ],
      },
      {
        label: "Pharmacy",
        link: route.pharmacy,
        submenu: false,
        icon: "prescription",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACY, UserRole.NURSE],
      },
    ],
  },
  {
    tittle: "MANAGE",
    submenuItems: [
      {
        label: "Staff",
        link: route.staff,
        submenu: false,
        icon: "users-group",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN],
      },
      {
        label: "Accounting",
        link: route.accounting,
        submenu: false,
        icon: "calculator",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.ACCOUNTING],
      },
      {
        label: "Billing Department",
        link: route.billingDepartment,
        submenu: false,
        icon: "file-invoice",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.BILLING, UserRole.FRONT_DESK],
      },
      {
        label: "Invoices",
        link: "#",
        submenu: true,
        icon: "receipt",
        allowedRoles: [UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.BILLING, UserRole.FRONT_DESK],
        submenuItems: [
          {
            label: "Invoices",
            link: route.invoice,
            relatedRoutes: [
              route.addInvoice,
              route.editInvoice,
            ], 
            submenu: false,
            submenuItems: [],
            allowedRoles: [UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.BILLING, UserRole.FRONT_DESK],
          },
          {
            label: "Invoice Details",
            link: route.invoiceDetails,
            submenu: false,
            submenuItems: [],
            allowedRoles: [UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.BILLING, UserRole.FRONT_DESK],
          },
        ],
      },
      {
        label: "Branch Management",
        link: route.branchManagement,
        submenu: false,
        icon: "building",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN],
      },
      {
        label: "Queue Monitoring",
        link: route.queueMonitoring,
        submenu: false,
        icon: "chart-bar",
        submenuItems: [],
        allowedRoles: [UserRole.ADMIN],
      },
      {
        label: "Notifications",
        link: route.notifications,
        submenu: false,
        icon: "bell",
        submenuItems: [],
        allowedRoles: ALL_ROLES,
      },
      {
        label: "Settings",
        link: route.generalSettings,
        relatedRoutes: [
          route.generalSettings,
          route.securitySettings,
          route.notificationsSettings,
        ],
        submenu: false,
        icon: "settings",
        submenuItems: [],
        allowedRoles: ALL_ROLES,
      },
    ],
  },
];
