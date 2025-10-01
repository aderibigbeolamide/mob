import PrivacyPolicyComponent from "@/components/authentication/privacy-policy/privacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function PrivacyPolicy(){
    return(
        <>
            <PrivacyPolicyComponent />
        </>
    )
}