"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const { t, toggle } = useLanguage();

  return (
    <header className="w-full py-10 px-6 text-center flex flex-col items-center gap-3 relative">
      <button
        onClick={toggle}
        className="absolute top-6 left-6 text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-primary transition-colors"
      >
        {t.switchTo}
      </button>

      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Ainimation"
          width={1070}
          height={745}
          priority
          className="h-12 sm:h-16 w-auto"
        />
        <span className="logo-text gradient-text text-3xl sm:text-4xl font-extrabold">
          Ainimation
        </span>
      </div>
      <span className="text-xs tracking-wide text-muted px-3 py-1 rounded-full border border-border">
        {t.header.badge}
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold">
        {t.header.titlePrefix}
        <span className="gradient-text">{t.header.titleHighlight}</span>
        {t.header.titleSuffix}
      </h1>
      <p className="text-muted max-w-xl">{t.header.subtitle}</p>
    </header>
  );
}
