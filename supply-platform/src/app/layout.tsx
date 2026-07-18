import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "التوريد العالمي — منصة طلبات التوريد",
    template: "%s | التوريد العالمي",
  },
  description:
    "منصة توريد عالمية تربط العملاء بمصادر توريد موثوقة لأي فئة من المنتجات والخدمات، مع بوابة قانونية إلزامية ومتابعة كاملة لكل طلب.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
