import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "نخبة التداول — منصة التداول المباشر والاستراتيجيات",
    template: "%s | نخبة التداول",
  },
  description:
    "منصة خاصة تقدّم استراتيجيات تداول احترافية بشرح مفصّل، ومساعد ذكي يجيب على أسئلتك، بدخول محصور بموافقة الإدارة فقط.",
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
