import RoleDashboardRouter from "@/components/dashboard/RoleDashboardRouter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Dashboard | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function Dashboard() {
  return (
    <>
      <RoleDashboardRouter />
    </>
  );
}
