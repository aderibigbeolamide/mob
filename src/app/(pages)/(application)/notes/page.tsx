import NotesComponent from "@/components/application/notes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Notes | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function NotesPage() {
  return (
    <>
      <NotesComponent />
    </>
  );
}
