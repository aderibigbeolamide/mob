import PreferencesSettingsComponent from "@/components/manage/settings/preferencesSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function PreferencesSttings(){
    return(
        <>
            <PreferencesSettingsComponent />
        </>
    )
}