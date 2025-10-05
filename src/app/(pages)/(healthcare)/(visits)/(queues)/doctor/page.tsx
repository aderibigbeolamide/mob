import QueuePage from "@/components/visits/queue/QueuePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Queue | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function DoctorQueuePage() {
  return (
    <QueuePage
      requiredRole="DOCTOR"
      pageTitle="Doctor Queue"
      stageName="doctor"
    />
  );
}
