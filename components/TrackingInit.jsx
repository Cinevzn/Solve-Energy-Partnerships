"use client";

import { useEffect } from "react";
import { initMetaPixel } from "@/lib/metaPixel";
import { initTrackingFromUrl } from "@/lib/tracking";

export default function TrackingInit() {
  useEffect(() => {
    initTrackingFromUrl();
    initMetaPixel();
  }, []);

  return null;
}
