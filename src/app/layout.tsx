// app/layout.tsx
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../app/globals.scss";

import ClientProviders from "./providers"; // 👈 our client wrapper
import BootstrapJs from "@/core/common-components/bootstrap-js/bootstrapjs";

export const metadata: Metadata = {
  title: "Dashboard | Dreams EMR - Responsive Bootstrap 5 Medical Admin Template",
  description:
    "DreamsEMR is a flexible, powerful, modern, and responsive Bootstrap 5 admin template with endless potential.",
  icons: {
    icon: "favicon.png",
    shortcut: "favicon.png",
    apple: "apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
        <BootstrapJs/>
      </body>
    </html>
  );
}
