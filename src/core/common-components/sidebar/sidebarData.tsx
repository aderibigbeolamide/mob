"use client";

import { all_routes } from "@/router/all_routes";

const route = all_routes;
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
      },
      {
        label: "Applications",
        link: "#",
        submenu: true,
        icon: "apps",
        submenuItems: [
          { label: "Chat", link: route.chat, submenu: false, submenuItems: [] },
          {
            label: "Calls",
            link: "#",
            submenu: true,
            submenuItems: [
              {
                label: "Voice Call",
                link: route.voiceCall,
                submenu: false,
                submenuItems: [],
              },
              {
                label: "Video Call",
                link: route.videoCall,
                submenu: false,
                submenuItems: [],
              },
            ],
          },
          {
            label: "Calendar",
            link: route.calendar,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Email",
            link: route.email,
            relatedRoutes: [
              route.emailCompose,
              route.emailDetails,
            ], 
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Contacts",
            link: route.contacts,
            relatedRoutes: [
              route.contactList,
            ], 
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Invoices",
            link: "#",
            submenu: true,
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
              },
              {
                label: "Invoice Details",
                link: route.invoiceDetails,
                submenu: false,
                submenuItems: [],
              },
            ],
          },
          {
            label: "To Do",
            link: route.todo,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Notes",
            link: route.notes,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Kanban Board",
            link: route.kanbanView,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "File Manager",
            link: route.fileManager,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Social Feed",
            link: route.socialFeed,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Search Result",
            link: route.searchResult,
            submenu: false,
            submenuItems: [],
          },
        ],
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
      },
      {
        label: "Laboratory",
        link: "#",
        submenu: true,
        icon: "test-pipe",
        submenuItems: [
          {
            label: "Lab Results",
            link: route.labResults,
            submenu: false,
            submenuItems: [],
          },
          {
            label: "Medical Rsults",
            link: route.medicalResults,
            submenu: false,
            submenuItems: [],
          },
        ],
      },
      {
        label: "Pharmacy",
        link: route.pharmacy,
        submenu: false,
        icon: "prescription",
        submenuItems: [],
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
      },
      {
        label: "Accounting",
        link: route.accounting,
        submenu: false,
        icon: "calculator",
        submenuItems: [],
        roles: ["ADMIN", "ACCOUNTING", "BILLING"],
      },
      {
        label: "Billing Department",
        link: route.billingDepartment,
        submenu: false,
        icon: "file-invoice",
        submenuItems: [],
        roles: ["ADMIN", "ACCOUNTING", "BILLING"],
      },
      {
        label: "Branch Management",
        link: route.branchManagement,
        submenu: false,
        icon: "building",
        submenuItems: [],
        adminOnly: true,
      },
      {
        label: "Notifications",
        link: route.notifications,
        submenu: false,
        icon: "bell",
        submenuItems: [],
      },
      {
        label: "Settings",
        link: route.generalSettings,
        relatedRoutes: [
          route.generalSettings,
          route.securitySettings,
          route.preferencesSettings,
          route.appearanceSettings,
          route.notificationsSettings,
          route.userPermissionsSettings,
          route.plansBillingsSettings,
        ],
        submenu: false,
        icon: "settings",
        submenuItems: [],
      },
    ],
  },
];
