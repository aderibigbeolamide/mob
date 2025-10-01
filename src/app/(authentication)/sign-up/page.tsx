import SignUpComponent from "@/components/authentication/register/signUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function Sign(){
    return(
        <>
            <SignUpComponent />
        </>
    )
}