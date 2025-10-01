
import PatientDetailsVisitHistoryComponent from "@/components/patients/patientDetailsVisitHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient Details Vital History | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsVitalHistoryPage() {
  return (
    <>
      <PatientDetailsVisitHistoryComponent />
    </>
  );
}
