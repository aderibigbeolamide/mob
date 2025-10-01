import AddDoctorsComponent from "@/components/doctors/addDoctors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Add doctors | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AddDoctorsPage() {
  return (
    <>
      <AddDoctorsComponent />
    </>
  );
}
