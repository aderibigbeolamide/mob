import SocialFeedComponent from "@/components/application/socialFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Social Feed | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function NotesPage() {
  return (
    <>
      <SocialFeedComponent />
    </>
  );
}
