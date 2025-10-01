
import LockScreenComponent from "@/components/authentication/lock-screen/lockScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lock Screen | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function LockScreen(){
    return(
        <>
            <LockScreenComponent />s
        </>
    )
}