import PatientDetailsDocumentsComponent from "@/components/patients/patientDetailsDocuments";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Patient Details Documents | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsDocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientDetailsDocumentsComponent />
    </Suspense>
  );
}
