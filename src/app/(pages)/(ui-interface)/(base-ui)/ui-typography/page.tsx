import UiTypographyComponent from "@/components/ui-intrerface/base-ui/ui-typography/uiTypography";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typography | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UITypography(){
    return(
        <>
            <UiTypographyComponent />
        </>
    )
}