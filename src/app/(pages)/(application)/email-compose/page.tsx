
import EmailComposeComponent from "@/components/application/emailCompose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Email Compose | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function EmailComposePage() {
  return (
    <>
      <EmailComposeComponent />
    </>
  );
}
