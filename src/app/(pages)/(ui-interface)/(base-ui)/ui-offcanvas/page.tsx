import UiOffcanvasComponent from "@/components/ui-intrerface/base-ui/ui-offcanvas/uiOffcanvas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offcanvas | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIOffcanvas(){
    return(
        <>
            <UiOffcanvasComponent />
        </>
    )
}