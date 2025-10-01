import DataTablesComponent from "@/components/ui-intrerface/table/data-tables";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Table | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function DataTablesPage(){
    return(
        <>
            <DataTablesComponent />
        </>
    )
}