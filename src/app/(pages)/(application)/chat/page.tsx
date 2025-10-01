import ChatComponent from "@/components/application/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Chat | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function ChatPage() {
  return (
    <>
      <ChatComponent />
    </>
  );
}
