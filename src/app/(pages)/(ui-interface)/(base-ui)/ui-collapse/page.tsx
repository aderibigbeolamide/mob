import UiCollapseComponent from "@/components/ui-intrerface/base-ui/ui-collapse/uiCollapse";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collapse | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UICollapse(){
    return(
        <>
            <UiCollapseComponent />
        </>
    )
}