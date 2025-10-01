import VoiceCallComponent from "@/components/application/voiceCall";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Voice Call | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function VoiceCallPage() {
  return (
    <>
      <VoiceCallComponent />
    </>
  );
}
