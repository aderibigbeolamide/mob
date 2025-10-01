import UiToastsComponent from "@/components/ui-intrerface/base-ui/ui-toasts/uiToasts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toasts | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIToasts(){
    return(
        <>
            <UiToastsComponent />
        </>
    )
}