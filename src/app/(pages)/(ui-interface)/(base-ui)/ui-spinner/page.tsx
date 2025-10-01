import UiSpinnerComponent from "@/components/ui-intrerface/base-ui/ui-spinner/uiSpinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spinner | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UISpinner(){
    return(
        <>
            <UiSpinnerComponent />
        </>
    )
}