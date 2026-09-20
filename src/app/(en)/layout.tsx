import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/layout/RootDocument";
import { SITE_URL } from "@/lib/config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument language="en">{children}</RootDocument>;
}
