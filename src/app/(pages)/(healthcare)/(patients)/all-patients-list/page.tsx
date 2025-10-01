import AllPatientsListComponent from "@/components/patients/allPatientsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "All Patients List | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AllPatientsListPage() {
  return (
    <>
      <AllPatientsListComponent />
    </>
  );
}
