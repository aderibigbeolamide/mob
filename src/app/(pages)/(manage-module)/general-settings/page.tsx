import GeneralSettingsComponent from "@/components/manage/settings/generalSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Settiings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function GeneralSettings(){
    return(
        <>
            <GeneralSettingsComponent />
        </>
    )
}