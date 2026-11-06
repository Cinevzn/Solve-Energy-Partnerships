import TrackingInit from "@/components/TrackingInit";
import "./globals.css";

export const metadata = {
  title: {
    default: "Solve Energy — Investor inquiry",
    template: "%s | Solve Energy",
  },
  description:
    "Learn about Solve Energy's expansion and share your investor background. Renewable solar across Western Canada.",
  metadataBase: new URL("https://solveenergy.ca"),
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
  themeColor: "#e8ebe0",
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
