
import EmailDetailsComponent from "@/components/application/emailDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Email Details | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function EmailDetailsPage() {
  return (
    <>
      <EmailDetailsComponent />
    </>
  );
}
