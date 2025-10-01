import PatientDetailsCompoent from "@/components/patients/patientDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient Details | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsPage() {
  return (
    <>
      <PatientDetailsCompoent />
    </>
  );
}
