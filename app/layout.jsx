import TrackingInit from "@/components/TrackingInit";
import "./globals.css";

export const metadata = {
  title: "Tax Equity Professionals | Partner Survey",
  description:
    "See if advanced tax equity strategies may fit your situation. Quick survey for accredited and high-income taxpayers.",
  metadataBase: new URL("https://partners.taxequityprofessionals.info"),
  icons: {
    icon: "/branding/tep-badge-navy.png",
    apple: "/branding/tep-badge-navy.png",
  },
};

export const viewport = {
  themeColor: "#0a1d43",
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
