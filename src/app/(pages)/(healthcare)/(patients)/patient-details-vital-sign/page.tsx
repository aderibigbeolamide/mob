import PatientDetailsVitalSignsComponent from "@/components/patients/patientDetailsVitalSigns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient Details Vital Sign | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsDetailsVitalSignPage() {
  return (
    <>
      <PatientDetailsVitalSignsComponent />
    </>
  );
}
