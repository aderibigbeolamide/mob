

import InvoiceDetailsComponent from "@/components/application/invoiceDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Invoice Details | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function InvoiceDetailsPage() {
  return (
    <>
      <InvoiceDetailsComponent />
    </>
  );
}
