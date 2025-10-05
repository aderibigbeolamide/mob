import QueuePage from "@/components/visits/queue/QueuePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pharmacy Queue | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function PharmacyQueuePage() {
  return (
    <QueuePage
      requiredRole="PHARMACY"
      pageTitle="Pharmacy Queue"
      stageName="pharmacy"
    />
  );
}
