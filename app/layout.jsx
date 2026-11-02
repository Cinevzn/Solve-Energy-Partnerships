import TrackingInit from "@/components/TrackingInit";
import "./globals.css";

export const metadata = {
  title: "Tropix Distribution — Partner Inquiry",
  description:
    "Smokeshop and retail partners: tell us about your business and get lab-tested product and ordering info from Tropix Distribution.",
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
