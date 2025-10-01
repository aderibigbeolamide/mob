import LabResultsComponent from "@/components/laboratory/lab-results/labResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Lab result | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function LabResultPage() {
  return (
    <>
      <LabResultsComponent />
    </>
  );
}
