
import EditDoctorsComponent from "@/components/doctors/editDoctors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Edit doctors | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export const dynamic = 'force-dynamic';

export default function EditDoctorsPage() {
  return (
    <>
      <EditDoctorsComponent />
    </>
  );
}
