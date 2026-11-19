import { getMetaPixelId } from "@/lib/metaPixel";

export default function MetaPixelNoscript() {
  const pixelId = getMetaPixelId();
  if (!pixelId) return null;

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}