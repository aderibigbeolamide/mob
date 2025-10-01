
import AppointmentConsultationComponent from "@/components/appointments/appointmentsConsultation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Appointment Consultation | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function AppointmentConsultationPage() {
  return (
    <>
      <AppointmentConsultationComponent />
    </>
  );
}
