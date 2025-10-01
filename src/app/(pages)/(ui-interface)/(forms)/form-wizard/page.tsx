import FormWizardComponent from "@/components/ui-intrerface/forms/form-wizard/formWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wizard | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormWizardPage(){
    return(
        <>
            <FormWizardComponent />
        </>
    )
}