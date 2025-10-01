
import FormSelect2Component from "@/components/ui-intrerface/forms/form-select2/formSelect2";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormSelectPage(){
    return(
        <>
            <FormSelect2Component />
        </>
    )
}