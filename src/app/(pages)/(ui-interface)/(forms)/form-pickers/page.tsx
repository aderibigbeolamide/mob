import FormPickersComponent from "@/components/ui-intrerface/forms/form-pickers/formPickers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pickers | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormPickersPage(){
    return(
        <>
            <FormPickersComponent />
        </>
    )
}