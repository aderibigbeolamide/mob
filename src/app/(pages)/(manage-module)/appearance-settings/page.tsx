import AppearanceSettingsComponent from "@/components/manage/settings/appearanceSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appearance Settings | Life Point Medical Centre - EMR System",
};

export default function AppearanceSettings(){
    return(
        <>
            <AppearanceSettingsComponent />
        </>
    )
}
