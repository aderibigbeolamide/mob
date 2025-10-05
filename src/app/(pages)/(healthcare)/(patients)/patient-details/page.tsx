import PatientDetailsCompoent from "@/components/patients/patientDetails";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Patient Details | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientDetailsCompoent />
    </Suspense>
  );
}
