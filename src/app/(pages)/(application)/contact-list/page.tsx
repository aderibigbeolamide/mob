
import ContactListComponent from "@/components/application/contactList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact List | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function ContactListePage() {
  return (
    <>
      <ContactListComponent />
    </>
  );
}
