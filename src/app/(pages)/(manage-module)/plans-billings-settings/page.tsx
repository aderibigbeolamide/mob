import PlansBillingsSettingsComponent from "@/components/manage/settings/plansBillingsSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans and Billings Settings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function PlansAndBillingsSettings(){
    return(
        <>
            <PlansBillingsSettingsComponent />
        </>
    )
}