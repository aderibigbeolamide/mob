import FormHorizontalComponent from "@/components/ui-intrerface/forms/form-layouts/formHorizontal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizantal Form | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormHorizantalPage(){
    return(
        <>
            <FormHorizontalComponent />
        </>
    )
}