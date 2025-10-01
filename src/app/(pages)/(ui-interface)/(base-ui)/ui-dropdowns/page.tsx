import UiDropdownsComponent from "@/components/ui-intrerface/base-ui/ui-dropdowns/uiDropdowns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dropdowns | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIDropdowns(){
    return(
        <>
            <UiDropdownsComponent />
        </>
    )
}