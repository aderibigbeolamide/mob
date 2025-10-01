import UiProgressComponent from "@/components/ui-intrerface/base-ui/ui-progress/uiProgress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIProgress(){
    return(
        <>
            <UiProgressComponent />
        </>
    )
}