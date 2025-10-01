import EmailComponent from "@/components/application/email";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Email | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function EmailPage() {
  return (
    <>
      <EmailComponent />
    </>
  );
}
