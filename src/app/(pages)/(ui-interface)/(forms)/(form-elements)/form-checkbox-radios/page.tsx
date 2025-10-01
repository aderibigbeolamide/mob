import FormCheckboxRadiosComponent from "@/components/ui-intrerface/forms/form-elements/formCheckboxRadios";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkbox radios | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormCheckboxRadiosPage(){
    return(
        <>
            <FormCheckboxRadiosComponent />
        </>
    )
}