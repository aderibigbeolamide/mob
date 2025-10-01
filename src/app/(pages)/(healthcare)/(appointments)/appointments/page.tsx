import AppointmentComponent from "@/components/appointments/appointments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Appointments | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AppointmentsPage() {
  return (
    <>
      <AppointmentComponent />
    </>
  );
}
