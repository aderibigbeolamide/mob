import CalendarComponent from "@/components/application/calendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Calendar | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function CalendarPage() {
  return (
    <>
      <CalendarComponent />
    </>
  );
}
