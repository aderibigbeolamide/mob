import TodoComponent from "@/components/application/todo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Todo | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
};

export default function TodoPage() {
  return (
    <>
      <TodoComponent />
    </>
  );
}
