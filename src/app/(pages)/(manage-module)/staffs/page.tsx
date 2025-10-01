import StaffsComponent from "@/components/manage/staffs/staffs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Staffs | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function StaffsPage() {
  return (
    <>
      <StaffsComponent />
    </>
  );
}
