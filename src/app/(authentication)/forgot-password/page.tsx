
import ForgotPasswordComponent from "@/components/authentication/forgot-password/forgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function ForgotPasswordPage(){
    return(
        <>
            <ForgotPasswordComponent />
        </>
    )
}