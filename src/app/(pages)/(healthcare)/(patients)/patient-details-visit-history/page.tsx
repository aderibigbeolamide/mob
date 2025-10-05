
import PatientDetailsVisitHistoryComponent from "@/components/patients/patientDetailsVisitHistory";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Patient Details Vital History | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsVitalHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientDetailsVisitHistoryComponent />
    </Suspense>
  );
}
