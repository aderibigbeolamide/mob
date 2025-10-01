import StarterPageComponent from "@/components/authentication/starter-page/starterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Starter Page | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function StarterPage(){
    return(
        <>
            <StarterPageComponent />
        </>
    )
}