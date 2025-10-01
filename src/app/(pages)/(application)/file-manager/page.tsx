import FileManagerComponent from "@/components/application/fileManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "File Manager | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function KanbanViewPage() {
  return (
    <>
      <FileManagerComponent />
    </>
  );
}
