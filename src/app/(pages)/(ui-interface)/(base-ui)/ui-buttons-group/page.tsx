import UiButtonsGroupComponent from "@/components/ui-intrerface/base-ui/ui-buttons-group/uiButtonsGroup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buttons Group | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIButtonsGroup(){
    return(
        <>
            <UiButtonsGroupComponent />
        </>
    )
}