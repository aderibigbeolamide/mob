import FormFloatingLabelsComponent from "@/components/ui-intrerface/forms/form-layouts/formFloatingLabels";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floating labels | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormFloatingLabelsPage(){
    return(
        <>
            <FormFloatingLabelsComponent />
        </>
    )
}