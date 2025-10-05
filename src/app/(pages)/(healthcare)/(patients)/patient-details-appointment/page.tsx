import PatientDetailsAppointmentsComponent from "@/components/patients/patientDetailsAppointments";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Patient Details Appointment | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsAppointmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientDetailsAppointmentsComponent />
    </Suspense>
  );
}
