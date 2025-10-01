import TermsAndConditionsComponent from "@/components/authentication/terms-and-conditions/termsAndConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function TermsAndConditions(){
    return(
        <>
            <TermsAndConditionsComponent />
        </>
    )
}