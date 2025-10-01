import DoctorDetailsComponent from "@/components/doctors/doctorDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Doctors Details | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function DoctorsDetailsPage() {
  return (
    <>
      <DoctorDetailsComponent />
    </>
  );
}
