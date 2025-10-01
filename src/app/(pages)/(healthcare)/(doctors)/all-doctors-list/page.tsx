
import AllDoctorsListComponent from "@/components/doctors/allDoctorsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "All doctors list | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AllDoctorsListPage() {
  return (
    <>
      <AllDoctorsListComponent />
    </>
  );
}
