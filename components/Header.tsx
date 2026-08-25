export default function Header() {
  return (
    <header className="w-full py-10 px-6 text-center flex flex-col items-center gap-3">
      <span className="text-xs tracking-wide text-muted px-3 py-1 rounded-full border border-border">
        متن به انیمیشن با هوش مصنوعی
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold">
        متنت رو بنویس، <span className="gradient-text">انیمیشنش</span> رو تحویل بگیر
      </h1>
      <p className="text-muted max-w-xl">
        توصیف صحنه‌ای که تو ذهنته رو بنویس، هوش مصنوعی برات یه ویدیوی انیمیشنی می‌سازه.
      </p>
    </header>
  );
}
