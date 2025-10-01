import UiLightboxesComponent from "@/components/ui-intrerface/ui-advance/uiLightbox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Lightbox | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function LightboxPage() {
  return (
    <>
      <UiLightboxesComponent />
    </>
  );
}
