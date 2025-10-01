import DoctorsComponent from "@/components/doctors/doctors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Doctors | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function DoctorsPage() {
  return (
    <>
      <DoctorsComponent />
    </>
  );
}
