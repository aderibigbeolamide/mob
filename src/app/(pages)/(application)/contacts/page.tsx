import ContactsComponent from "@/components/application/contacts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contacts | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function ContactsPage() {
  return (
    <>
      <ContactsComponent />
    </>
  );
}
