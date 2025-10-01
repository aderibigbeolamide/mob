
import LoginComponent from "@/components/authentication/Login/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function Login(){
    return(
        <><LoginComponent/></>
    )
}