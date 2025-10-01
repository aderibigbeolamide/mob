
import AddPatientComponent from "@/components/patients/addPatient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Add Patient | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AddPatientsPage() {
  return (
    <>
      <AddPatientComponent />
    </>
  );
}
