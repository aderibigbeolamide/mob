
import NotificationsComponent from "@/components/manage/notifications/notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function Notifications(){
    return(
        <>
            <NotificationsComponent />
        </>
    )
}