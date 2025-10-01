import IconWeatherComponent from "@/components/ui-intrerface/icons/iconWeather";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function WeatherPage(){
    return(
        <>
            <IconWeatherComponent />
        </>
    )
}