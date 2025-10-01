import UiCardsComponent from "@/components/ui-intrerface/base-ui/ui-cards/uiCards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cards | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UICards(){
    return(
        <>
            <UiCardsComponent />
        </>
    )
}