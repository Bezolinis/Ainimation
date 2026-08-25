import type { Metadata } from "next";
import { Vazirmatn, Unbounded } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const unbounded = Unbounded({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "متن به انیمیشن | تولید ویدیو با هوش مصنوعی",
  description:
    "متن خودت رو بنویس و بذار هوش مصنوعی برات یه انیمیشن ویدیویی بسازه.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 -z-20 h-full w-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 -z-10 bg-background/70" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
