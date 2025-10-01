import UiTooltipsComponent from "@/components/ui-intrerface/base-ui/ui-tooltips/uiTooltips";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tooltips | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UITooltips(){
    return(
        <>
            <UiTooltipsComponent />
        </>
    )
}