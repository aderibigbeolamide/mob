import UiAlertsComponent from "@/components/ui-intrerface/base-ui/ui-alerts/uiAlerts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alerts | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIAlerts(){
    return(
        <>
            <UiAlertsComponent />
        </>
    )
}