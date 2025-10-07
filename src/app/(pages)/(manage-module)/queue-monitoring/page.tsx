import QueueMonitoringDashboard from "@/components/dashboard/QueueMonitoringDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Queue Monitoring | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
  description: "Real-time monitoring of all department queues",
};

export default function QueueMonitoringPage() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <QueueMonitoringDashboard />
      </div>
    </div>
  );
}
