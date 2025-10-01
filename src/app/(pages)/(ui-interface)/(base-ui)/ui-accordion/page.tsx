import UiAccordionComponent from "@/components/ui-intrerface/base-ui/ui-accordion/uiAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accordion | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIAccordion(){
    return(
        <>
            <UiAccordionComponent />
        </>
    )
}