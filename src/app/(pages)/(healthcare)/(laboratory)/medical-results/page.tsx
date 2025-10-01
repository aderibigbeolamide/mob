import MedicalResultsComponent from "@/components/laboratory/medical-results/medicalResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Medical result | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function MedicalResultPage() {
  return (
    <>
      <MedicalResultsComponent />
    </>
  );
}
