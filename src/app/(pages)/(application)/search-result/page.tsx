
import SearchResultComponent from "@/components/application/searchResult";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Search Result | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function SearchResultPage() {
  return (
    <>
      <SearchResultComponent />
    </>
  );
}
