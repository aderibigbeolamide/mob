import FormMaskComponent from "@/components/ui-intrerface/forms/input-masks/inputMasks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mask input | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormMaskInputPage(){
    return(
        <>
            <FormMaskComponent />
        </>
    )
}