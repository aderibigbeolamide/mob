import PatientsComponent from "@/components/patients/patients";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Patient | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PatientsPage() {
  return (
    <>
      <PatientsComponent />
    </>
  );
}
