
import AddInvoiceComponent from "@/components/application/addInvoice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Add Invoice | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AddInvoicePage() {
  return (
    <>
      <AddInvoiceComponent />
    </>
  );
}
