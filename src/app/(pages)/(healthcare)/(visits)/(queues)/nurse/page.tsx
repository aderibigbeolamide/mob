import QueuePage from "@/components/visits/queue/QueuePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nurse Queue | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function NurseQueuePage() {
  return (
    <QueuePage
      requiredRole="NURSE"
      pageTitle="Nurse Queue"
      stageName="nurse"
    />
  );
}
