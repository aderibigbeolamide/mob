import UiGridComponent from "@/components/ui-intrerface/base-ui/ui-grid/uiGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grid | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIGrid(){
    return(
        <>
            <UiGridComponent />
        </>
    )
}