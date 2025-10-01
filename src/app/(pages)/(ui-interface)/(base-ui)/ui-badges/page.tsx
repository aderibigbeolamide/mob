import UiBadgesComponent from "@/components/ui-intrerface/base-ui/ui-badges/uiBadges";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badges | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIBadges(){
    return(
        <>
            <UiBadgesComponent />
        </>
    )
}