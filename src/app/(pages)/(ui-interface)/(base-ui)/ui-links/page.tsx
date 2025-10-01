import UiLinksComponent from "@/components/ui-intrerface/base-ui/ui-links/uiLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UILinks(){
    return(
        <>
            <UiLinksComponent />
        </>
    )
}