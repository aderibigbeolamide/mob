import Error404Component from "@/components/authentication/error-404/error404";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error 404 | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function Error404(){
    return(
        <>
            <Error404Component />
        </>
    )
}