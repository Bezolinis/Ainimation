"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "fa" | "en";

interface TranslationDict {
  switchTo: string;
  header: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
  };
  form: {
    label: string;
    placeholder: string;
    suggestions: string[];
    aspectRatioLabel: string;
    aspectRatios: Record<"16:9" | "9:16" | "1:1", string>;
    submitIdle: string;
    submitBusy: string;
    statusQueued: string;
    statusProcessing: string;
    download: string;
    historyTitle: string;
    errorGeneric: string;
    errorFailed: string;
    errorNetwork: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    loading: string;
    secure: string;
    errorGeneric: string;
    errorNetwork: string;
  };
  subscribe: {
    title: string;
    subtitle: string;
    success: string;
    canceled: string;
    cta: string;
    loading: string;
    back: string;
  };
}

const translations: Record<Language, TranslationDict> = {
  fa: {
    switchTo: "English",
    header: {
      badge: "متن به انیمیشن با هوش مصنوعی",
      titlePrefix: "متنت رو بنویس، ",
      titleHighlight: "انیمیشنش",
      titleSuffix: " رو تحویل بگیر",
      subtitle:
        "توصیف صحنه‌ای که تو ذهنته رو بنویس، هوش مصنوعی برات یه ویدیوی انیمیشنی می‌سازه.",
    },
    form: {
      label: "متن انیمیشن رو توصیف کن",
      placeholder: "مثلاً: یک گربه فضانورد که روی ماه قدم می‌زند...",
      suggestions: [
        "یک روباه کارتونی که زیر نور مهتاب در جنگل می‌دود",
        "شهر آینده‌نگر با ماشین‌های پرنده در غروب آفتاب",
        "یک فنجان قهوه که بخار از آن به شکل قلب بالا می‌رود",
      ],
      aspectRatioLabel: "نسبت تصویر",
      aspectRatios: {
        "16:9": "افقی (16:9)",
        "9:16": "عمودی (9:16)",
        "1:1": "مربعی (1:1)",
      },
      submitIdle: "ساخت ویدیو",
      submitBusy: "در حال ساخت انیمیشن...",
      statusQueued: "در صف پردازش...",
      statusProcessing: "در حال تولید انیمیشن...",
      download: "دانلود ویدیو",
      historyTitle: "ویدیوهای این نشست",
      errorGeneric: "خطایی رخ داد.",
      errorFailed: "تولید ویدیو ناموفق بود.",
      errorNetwork: "ارتباط با سرور برقرار نشد.",
    },
    pricing: {
      title: "اشتراک ماهانه",
      subtitle:
        "با فعال‌سازی اشتراک، بدون محدودیت و با اولویت بالاتر ویدیوهای انیمیشنی بساز.",
      price: "$19.99",
      period: "/ ماه",
      features: [
        "تولید نامحدود ویدیوی انیمیشنی از متن",
        "دسترسی به کیفیت‌های بالاتر خروجی",
        "پردازش با اولویت بالاتر در صف تولید",
        "پشتیبانی از طریق ایمیل",
      ],
      cta: "شروع اشتراک ماهانه",
      loading: "در حال هدایت به درگاه پرداخت...",
      secure:
        "پرداخت به‌صورت امن از طریق Stripe انجام می‌شود و هر زمان می‌توانی اشتراکت را لغو کنی.",
      errorGeneric: "خطا در ایجاد سشن پرداخت",
      errorNetwork: "خطای شبکه",
    },
    subscribe: {
      title: "خرید اشتراک ماهانه",
      subtitle: "با کلیک روی دکمه‌ی زیر به صفحه‌ی پرداخت Stripe منتقل می‌شوی.",
      success: "پرداخت با موفقیت انجام شد. اشتراک ماهانه‌ات فعال شد. 🎉",
      canceled: "پرداخت لغو شد. هر وقت خواستی می‌تونی دوباره اقدام کنی.",
      cta: "مشترک شدن - ماهیانه",
      loading: "در حال هدایت...",
      back: "بازگشت به صفحه اصلی",
    },
  },
  en: {
    switchTo: "فارسی",
    header: {
      badge: "AI Text-to-Animation",
      titlePrefix: "Write your text, get your ",
      titleHighlight: "animation",
      titleSuffix: "",
      subtitle:
        "Describe the scene in your mind and let AI turn it into an animated video.",
    },
    form: {
      label: "Describe your animation",
      placeholder: "e.g. An astronaut cat walking on the moon...",
      suggestions: [
        "A cartoon fox running through a moonlit forest",
        "A futuristic city with flying cars at sunset",
        "A cup of coffee with steam rising in the shape of a heart",
      ],
      aspectRatioLabel: "Aspect ratio",
      aspectRatios: {
        "16:9": "Landscape (16:9)",
        "9:16": "Portrait (9:16)",
        "1:1": "Square (1:1)",
      },
      submitIdle: "Generate video",
      submitBusy: "Generating animation...",
      statusQueued: "Queued for processing...",
      statusProcessing: "Generating your animation...",
      download: "Download video",
      historyTitle: "Videos from this session",
      errorGeneric: "Something went wrong.",
      errorFailed: "Video generation failed.",
      errorNetwork: "Could not connect to the server.",
    },
    pricing: {
      title: "Monthly Subscription",
      subtitle:
        "Subscribe to create unlimited animated videos with higher priority.",
      price: "$19.99",
      period: "/ month",
      features: [
        "Unlimited text-to-video generation",
        "Access to higher output quality",
        "Higher priority in the generation queue",
        "Email support",
      ],
      cta: "Start monthly subscription",
      loading: "Redirecting to checkout...",
      secure: "Payment is securely processed via Stripe. Cancel anytime.",
      errorGeneric: "Failed to create checkout session",
      errorNetwork: "Network error",
    },
    subscribe: {
      title: "Get Monthly Subscription",
      subtitle: "Click the button below to go to Stripe checkout.",
      success: "Payment successful. Your monthly subscription is now active. 🎉",
      canceled: "Payment canceled. You can try again anytime.",
      cta: "Subscribe - Monthly",
      loading: "Redirecting...",
      back: "Back to home",
    },
  },
};

type LanguageContextValue = {
  lang: Language;
  t: TranslationDict;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fa");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "en" || stored === "fa") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  function toggle() {
    setLang((prev) => (prev === "fa" ? "en" : "fa"));
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
