import WidgetsComponent from "@/components/ui-intrerface/widgets/widgets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widgets | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function WidgetsPage(){
    return(
        <>
            <WidgetsComponent />
        </>
    )
}