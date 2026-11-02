import TrackingInit from "@/components/TrackingInit";
import "./globals.css";

export const metadata = {
  title: {
    default: "Tropix Distribution",
    template: "%s | Tropix Distribution",
  },
  description:
    "Wholesale K Tropix for smokeshops and retail partners—lab-tested, GMP-certified products from Oregon.",
  metadataBase: new URL("https://ktropix.com"),
  icons: {
    icon: [
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: "/branding/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/branding/favicon-32.png",
  },
};

export const viewport = {
  themeColor: "#242424",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TrackingInit />
        {children}
      </body>
    </html>
  );
}
