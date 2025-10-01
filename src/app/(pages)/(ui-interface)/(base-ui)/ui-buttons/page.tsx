import UiButtonsComponent from "@/components/ui-intrerface/base-ui/ui-buttons/uiButtons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buttons | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIButtons(){
    return(
        <>
            <UiButtonsComponent />
        </>
    )
}