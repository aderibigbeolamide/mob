import TablesBasicComponent from "@/components/ui-intrerface/table/tables-basic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Table | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function TablesBasicPage(){
    return(
        <>
            <TablesBasicComponent />
        </>
    )
}