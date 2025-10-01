import UiScrollspyComponent from "@/components/ui-intrerface/base-ui/ui-scrollspy/uiScrollspy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scrollspy | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIScrollspy(){
    return(
        <>
            <UiScrollspyComponent />
        </>
    )
}