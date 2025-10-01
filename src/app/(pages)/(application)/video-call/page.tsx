import VideoCallComponent from "@/components/application/videoCall";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Video Call | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function VideoCallPage() {
  return (
    <>
      <VideoCallComponent />
    </>
  );
}
