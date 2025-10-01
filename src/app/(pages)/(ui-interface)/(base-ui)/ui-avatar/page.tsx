import UiAvatarComponent from "@/components/ui-intrerface/base-ui/ui-avatar/uiAvatar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avatar | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UIAvatar(){
    return(
        <>
            <UiAvatarComponent />
        </>
    )
}