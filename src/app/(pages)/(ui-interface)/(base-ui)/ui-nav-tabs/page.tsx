import UiNavTabsComponent from "@/components/ui-intrerface/base-ui/ui-nav-tabs/uiNavTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nav Tabs | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UINavTabs(){
    return(
        <>
            <UiNavTabsComponent />
        </>
    )
}