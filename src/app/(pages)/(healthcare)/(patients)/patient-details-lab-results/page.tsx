import PatientDetailsLabResultsComponent from "@/components/patients/patientDetailsLabResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient Details Lab Result | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsLabResultPage() {
  return (
    <>
      <PatientDetailsLabResultsComponent />
    </>
  );
}
