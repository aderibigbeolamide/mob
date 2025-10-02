import PlansBillingsSettingsComponent from "@/components/manage/settings/plansBillingsSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans & Billing Settings | Life Point Medical Centre - EMR System",
};

export default function PlansBillingsSettings(){
    return(
        <>
            <PlansBillingsSettingsComponent />
        </>
    )
}
