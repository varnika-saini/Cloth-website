import "@/styles/globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuickViewMount } from "@/components/QuickViewMount";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: {
    default: "ShortKurti — Elegant Short Kurtis for Every Occasion",
    template: "%s · ShortKurti",
  },
  description:
    "Discover beautifully crafted short kurtis in soft fabrics, dreamy prints, and elegant silhouettes. Floral, embroidered, festive and everyday styles.",
  keywords: [
    "short kurti",
    "women kurti",
    "ethnic wear",
    "kurti online",
    "festive kurti",
  ],
  openGraph: {
    title: "ShortKurti — Elegant Short Kurtis for Every Occasion",
    description:
      "Soft fabrics, dreamy prints and elegant silhouettes — handcrafted short kurtis for every day and every celebration.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#fbf7f2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen pb-16 font-sans lg:pb-0">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <QuickViewMount />
        <MobileBottomNav />
      </body>
    </html>
  );
}
