
import UserPermissionsSettingsComponent from "@/components/manage/settings/userPermissionsSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User permissions Settings | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UserPermissionsSttings(){
    return(
        <>
            <UserPermissionsSettingsComponent />
        </>
    )
}