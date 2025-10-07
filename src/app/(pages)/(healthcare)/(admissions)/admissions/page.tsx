import AdmissionsComponent from "@/components/admissions/admissions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admissions | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AdmissionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdmissionsComponent />
    </Suspense>
  );
}
