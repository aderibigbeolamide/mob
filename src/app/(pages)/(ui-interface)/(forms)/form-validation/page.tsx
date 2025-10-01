import FormValidationComponent from "@/components/ui-intrerface/forms/form-validation/formValidation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Validation | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormValidationPage(){
    return(
        <>
            <FormValidationComponent />
        </>
    )
}