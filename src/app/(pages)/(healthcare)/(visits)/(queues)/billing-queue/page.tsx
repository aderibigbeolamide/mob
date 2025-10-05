import QueuePage from "@/components/visits/queue/QueuePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Queue | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function BillingQueuePage() {
  return (
    <QueuePage
      requiredRole="BILLING"
      pageTitle="Billing Queue"
      stageName="billing"
    />
  );
}
