
import EditInvoiceComponent from "@/components/application/editInvoice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Edit Invoice | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function EditInvoicePage() {
  return (
    <>
      <EditInvoiceComponent />
    </>
  );
}
