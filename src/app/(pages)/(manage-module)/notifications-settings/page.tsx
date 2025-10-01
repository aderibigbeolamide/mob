import NotificationsSettingsComponent from "@/components/manage/settings/notificationsSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications Settings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function NotificationsSettings(){
    return(
        <>
            <NotificationsSettingsComponent />
        </>
    )
}