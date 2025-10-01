import PatientDetailsAppointmentsComponent from "@/components/patients/patientDetailsAppointments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient Details Appointment | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsAppointmentPage() {
  return (
    <>
      <PatientDetailsAppointmentsComponent />
    </>
  );
}
