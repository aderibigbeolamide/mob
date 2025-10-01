import InvoiceComponent from "@/components/application/invoice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Invoice | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function InvoicePage() {
  return (
    <>
      <InvoiceComponent />
    </>
  );
}
