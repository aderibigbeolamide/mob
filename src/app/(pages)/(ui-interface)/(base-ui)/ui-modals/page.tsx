import UiModalsComponent from "@/components/ui-intrerface/base-ui/ui-modals/uiModals";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modals | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIModals(){
    return(
        <>
            <UiModalsComponent />
        </>
    )
}