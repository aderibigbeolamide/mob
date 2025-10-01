import KanbanViewComponent from "@/components/application/kanbanView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Kanban View | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function KanbanViewPage() {
  return (
    <>
      <KanbanViewComponent />
    </>
  );
}
