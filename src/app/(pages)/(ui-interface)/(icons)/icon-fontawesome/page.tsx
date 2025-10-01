import IconFontawesomeComponent from "@/components/ui-intrerface/icons/iconFontawesome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fontawesome | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function FontawesomePage(){
    return(
        <>
            <IconFontawesomeComponent />
        </>
    )
}