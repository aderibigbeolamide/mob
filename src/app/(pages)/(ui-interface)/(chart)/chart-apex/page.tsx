import ChartApexComponent from "@/components/ui-intrerface/charts/apexcharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apex Chart | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function ApexChart(){
    return(
        <>
            <ChartApexComponent />
        </>
    )
}