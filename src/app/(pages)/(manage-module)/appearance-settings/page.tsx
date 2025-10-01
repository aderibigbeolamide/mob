import AppearanceSettingsComponent from "@/components/manage/settings/appearanceSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appearence Settings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function AppearanceSttings(){
    return(
        <>
            <AppearanceSettingsComponent />
        </>
    )
}