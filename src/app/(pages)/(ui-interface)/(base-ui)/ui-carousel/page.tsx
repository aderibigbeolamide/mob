import UiCarouselComponent from "@/components/ui-intrerface/base-ui/ui-carousel/uiCarousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carousel | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};


export default function UICarousel(){
    return(
        <>
            <UiCarouselComponent />
        </>
    )
}