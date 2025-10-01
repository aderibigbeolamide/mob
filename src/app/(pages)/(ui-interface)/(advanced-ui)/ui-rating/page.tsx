import UiRatingComponent from "@/components/ui-intrerface/ui-advance/uiRating";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Rating | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function RatingPage() {
  return (
    <>
      <UiRatingComponent />
    </>
  );
}
