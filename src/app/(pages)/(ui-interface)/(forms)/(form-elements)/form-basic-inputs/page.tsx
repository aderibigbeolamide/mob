import FormBasicInputsComponent from "@/components/ui-intrerface/forms/form-elements/formBasicInputs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic inputs | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormBasicInputsPage(){
    return(
        <>
            <FormBasicInputsComponent />
        </>
    )
}