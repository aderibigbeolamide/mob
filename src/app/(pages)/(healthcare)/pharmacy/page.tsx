
import PharmacyComponent from "@/components/pharmacy/pharmacy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Pharmacy | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PharmacyPage() {
  return (
    <>
      <PharmacyComponent />
    </>
  );
}
