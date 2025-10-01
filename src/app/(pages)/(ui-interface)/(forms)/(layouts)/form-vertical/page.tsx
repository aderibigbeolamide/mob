import FormVerticalComponent from "@/components/ui-intrerface/forms/form-layouts/formVertical";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vertical Form | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormVerticalPage(){
    return(
        <>
            <FormVerticalComponent />
        </>
    )
}