import QueuePage from "@/components/visits/queue/QueuePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratory Queue | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function LabQueuePage() {
  return (
    <QueuePage
      requiredRole="LAB"
      pageTitle="Laboratory Queue"
      stageName="lab"
    />
  );
}
