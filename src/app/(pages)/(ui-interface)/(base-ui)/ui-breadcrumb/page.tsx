import UiBreadcrumbComponent from "@/components/ui-intrerface/base-ui/ui-breadcrumb/uiBreadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Breadcrumb | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIBreadcrumb(){
    return(
        <>
            <UiBreadcrumbComponent />
        </>
    )
}