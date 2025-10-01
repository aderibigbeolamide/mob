import UiImagesComponent from "@/components/ui-intrerface/base-ui/ui-images/uiImages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIGrid(){
    return(
        <>
            <UiImagesComponent />
        </>
    )
}