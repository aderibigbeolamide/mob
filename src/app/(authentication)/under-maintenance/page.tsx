import UnderMaintenanceComponent from "@/components/authentication/under-maintenance/underMaintenance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function underMaintenance(){
    return(
        <>
            <UnderMaintenanceComponent />
        </>
    )
}