# متن به انیمیشن (AI Text-to-Video)

سایت تولید انیمیشن با هوش مصنوعی: کاربر متن می‌نویسد، سایت درخواست رو به یک سرویس تولید ویدیو می‌فرسته و نتیجه رو نمایش می‌ده.

## اجرای پروژه

```bash
npm install
npm run dev
```

سپس آدرس [http://localhost:3000](http://localhost:3000) رو باز کن.

فعلاً پروژه با یک **provider آزمایشی (mock)** کار می‌کنه که یه ویدیوی نمونه رو بعد از چند ثانیه شبیه‌سازی «در حال تولید» برمی‌گردونه؛ یعنی الان بدون هیچ API واقعی هم کل UI و جریان کار قابل تست هست.

## اتصال به API واقعی تولید ویدیو

وقتی API خودت رو (مثلاً Replicate، Runway، یا هر سرویس دیگه) آماده کردی:

1. فایل `.env.local.example` رو کپی کن به `.env.local`.
2. اگر از **Replicate** استفاده می‌کنی:
   ```
   VIDEO_PROVIDER=replicate
   REPLICATE_API_TOKEN=توکن_تو
   REPLICATE_MODEL_VERSION=شناسه_نسخه_مدل_متن‌به‌ویدیو
   ```
   پیاده‌سازی آماده در [lib/providers/replicate.ts](lib/providers/replicate.ts) هست.
3. اگر از **PixVerse** استفاده می‌کنی:
   ```
   VIDEO_PROVIDER=pixverse
   PIXVERSE_API_KEY=کلید_API_تو
   ```
   پیاده‌سازی آماده در [lib/providers/pixverse.ts](lib/providers/pixverse.ts) هست.
4. اگر سرویس دیگه‌ای می‌خوای وصل کنی (Runway، Veo، یا هر API دیگه):
   - یک فایل جدید مثل `lib/providers/my-provider.ts` بساز که اینترفیس `VideoProvider` از [lib/providers/types.ts](lib/providers/types.ts) رو پیاده‌سازی کنه (دو تابع `startGeneration` و `getJob`).
   - اون رو در [lib/providers/index.ts](lib/providers/index.ts) به `getProvider()` اضافه کن.
   - با تنظیم `VIDEO_PROVIDER=my-provider` در `.env.local` فعالش کن.

با این ساختار، بقیه‌ی سایت (فرم، API route ها، UI) بدون تغییر باقی می‌مونه و فقط کافیه provider جدید رو وصل کنی.

## ساختار پروژه

- `app/page.tsx` — صفحه اصلی
- `components/GenerateForm.tsx` — فرم ورود متن، وضعیت تولید، و نمایش ویدیوی نهایی
- `app/api/generate/route.ts` — شروع یک درخواست تولید ویدیو
- `app/api/jobs/[id]/route.ts` — استعلام وضعیت/پیشرفت یک درخواست
- `lib/providers/` — لایه انتزاعی برای اتصال به سرویس‌های مختلف تولید ویدیو با AI

## افزودن خرید اشتراک (Stripe)

در این پروژه یک مسیر ساده برای خرید اشتراک ماهانه با استفاده از Stripe اضافه شده است:

- صفحه‌ی پرداخت: `/subscribe`
- ایجاد سشن پرداخت: `POST /api/stripe/create-session`
- وبهوک دریافت رویدادها: `POST /api/stripe/webhook`

پیش‌نیازها (متغیرهای محیطی):

```
STRIPE_SECRET_KEY=sk_live_... 
STRIPE_PRICE_ID=price_...   # شناسه قیمت ماهانه در داشبورد Stripe
STRIPE_WEBHOOK_SECRET=whsec_...
```

نحوه‌ی راه‌اندازی محلی:

1. وابستگی‌ها را نصب کن:
```bash
npm install
```
2. متغیرهای بالا را در `.env.local` قرار بده.
3. برای تست وبهوک‌ها محلی می‌تونی از Stripe CLI استفاده کنی و به آدرس وبهوک فوروارد کنی:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. سرور dev را اجرا کن:
```bash
npm run dev
```

سپس به `http://localhost:3000/subscribe` برو و دکمه‌ی "مشترک شدن" را بزن. پس از وارد کردن اطلاعات کارت، Stripe کاربر را به `success_url` یا `cancel_url` بازمی‌گرداند.

نکته: شناسه قیمت (`STRIPE_PRICE_ID`) را باید در داشبورد Stripe برای محصول/پلن ماهیانه خود بسازی و مقدار آن را قرار دهی.
