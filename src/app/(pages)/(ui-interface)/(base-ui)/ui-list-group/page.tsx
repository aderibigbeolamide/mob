import UiListGroupComponent from "@/components/ui-intrerface/base-ui/ui-list-group/uiListGroup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Group | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIListGroup(){
    return(
        <>
            <UiListGroupComponent />
        </>
    )
}