import TrackingInit from "@/components/TrackingInit";
import "./globals.css";

export const metadata = {
  title: "Tropix Distribution — Partner Inquiry",
  description:
    "Smokeshop and retail partners: tell us about your business and get lab-tested product and ordering info from Tropix Distribution.",
  metadataBase: new URL("https://ktropix.com"),
  icons: {
    icon: "/branding/kt-logo-icon.png",
    apple: "/branding/kt-logo-icon.png",
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
