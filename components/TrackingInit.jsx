"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  initMetaPixel,
  trackPageView,
  trackViewContentForPath,
} from "@/lib/metaPixel";
import { initTrackingFromUrl } from "@/lib/tracking";

export default function TrackingInit() {
  const pathname = usePathname();

  useEffect(() => {
    initTrackingFromUrl();
  }, []);

  useEffect(() => {
    initMetaPixel();
    trackPageView();
    trackViewContentForPath(pathname);
  }, [pathname]);

  return null;
}