import UiPlaceholdersComponent from "@/components/ui-intrerface/base-ui/ui-placeholders/uiPlaceholders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placeholders | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIPlaceholders(){
    return(
        <>
            <UiPlaceholdersComponent />
        </>
    )
}