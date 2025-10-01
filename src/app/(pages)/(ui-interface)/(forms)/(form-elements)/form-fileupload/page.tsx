import FileUploadPageComponent from "@/components/ui-intrerface/forms/form-elements/formFileupload";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fileupload | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function FormFileuploadPage(){
    return(
        <>
            <FileUploadPageComponent />
        </>
    )
}