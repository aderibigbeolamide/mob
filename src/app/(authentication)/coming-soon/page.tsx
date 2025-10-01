import ComingSoonComponent from "@/components/authentication/coming-soon/comingSoon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming soon | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function StarterPage(){
    return(
        <>
            <ComingSoonComponent />
        </>
    )
}