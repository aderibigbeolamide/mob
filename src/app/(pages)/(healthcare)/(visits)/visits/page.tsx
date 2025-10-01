import VisitsComponent from "@/components/visits/visits";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Visits | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function VisitsPage() {
  return (
    <>
      <VisitsComponent />
    </>
  );
}
