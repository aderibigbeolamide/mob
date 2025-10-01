import UiPaginationComponent from "@/components/ui-intrerface/base-ui/ui-pagination/uiPagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagination | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function UIPagination(){
    return(
        <>
            <UiPaginationComponent />
        </>
    )
}