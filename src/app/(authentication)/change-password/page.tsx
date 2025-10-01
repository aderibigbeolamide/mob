import ChangePasswordComponent from "@/components/authentication/change-password/change-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change password | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function ChangePassword(){
    return(
        <>
            <ChangePasswordComponent />
        </>
    )
}