
import EditPatientComponent from "@/components/patients/editPatient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Edit Patient | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function EditPatientsPage() {
  return (
    <>
      <EditPatientComponent />
    </>
  );
}
