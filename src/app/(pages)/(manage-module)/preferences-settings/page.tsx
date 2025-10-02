import PreferencesSettingsComponent from "@/components/manage/settings/preferencesSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preferences Settings | Life Point Medical Centre - EMR System",
};

export default function PreferencesSettings(){
    return(
        <>
            <PreferencesSettingsComponent />
        </>
    )
}
