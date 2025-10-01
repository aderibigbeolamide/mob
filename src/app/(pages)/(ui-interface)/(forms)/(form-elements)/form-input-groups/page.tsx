import FormInputGroupsComponent from "@/components/ui-intrerface/forms/form-elements/formInputGroups";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Input Groups | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormInputGroupsPage(){
    return(
        <>
            <FormInputGroupsComponent />
        </>
    )
}