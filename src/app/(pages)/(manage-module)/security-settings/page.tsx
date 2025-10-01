import SecuritySettingsComponent from "@/components/manage/settings/securitySettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Settiings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function SecuritySettings(){
    return(
        <>
            <SecuritySettingsComponent />
        </>
    )
}