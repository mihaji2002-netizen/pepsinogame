"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BRAND, LABS } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const heroStats = [
  { value: 16, label: "سطح" },
  { value: 4, label: "آزمایشگاه" },
  { value: 1200, label: "امتیاز در هر سطح" },
  { value: 12, label: "مهر در هر سطح" },
];

const marqueeItems = [
  "تخته ماموریت",
  "امتیاز و سکه",
  "مهرهای منتور",
  "کارت شناسایی دیجیتال",
  "برنامه هفتگی",
  "رتبه‌بندی",
  "گزارش فصل",
  "چهار آزمایشگاه",
];

export default function LandingPage() {
  return (
    <motion.div>
      {/* ---------- Nav ---------- */}
      <header className="no-print sticky top-0 z-40">
        <div className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 md:px-6">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm text-[var(--ink-soft)] md:flex">
            <a href="#labs" className="transition hover:text-[var(--ink)]">
              آزمایشگاه‌ها
            </a>
            <a href="#loop" className="transition hover:text-[var(--ink)]">
              چرخه
            </a>
            <a href="#mentor" className="transition hover:text-[var(--ink)]">
              منتورها
            </a>
            <a href="#faq" className="transition hover:text-[var(--ink)]">
              سؤالات
            </a>
            <Link href="/login" className="font-semibold text-[var(--ink)]">
              ورود
            </Link>
          </nav>
          <Link href="/register">
            <Button className="px-4 py-2">
              ورود به آزمایشگاه
              <ArrowRight size={15} className="rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 md:px-8 md:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" />
              ثبت‌نام فصل ۲۶ باز است
            </div>
            <h1 className="display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              مطالعه را مثل یک{" "}
              <span className="shimmer-text">فصل</span> تجربه کن، نه یک وظیفه.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink-soft)]">
              {BRAND.name} سیستم‌عامل آموزشی است که ماموریت‌ها، منتورها، امتیاز و
              شتاب را در یک جا جمع می‌کند. هفته را برنامه‌ریزی کن. تخته را پاک
              کن. از چهار آزمایشگاه عبور کن.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="btn-shimmer px-6 py-3 text-base">
                  شروع به‌عنوان دانش‌آموز
                  <Sparkles size={17} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="px-6 py-3 text-base">
                  کنسول منتور
                  <ArrowUpRight size={17} />
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="display text-2xl font-bold text-[var(--brand)]">
                    <NumberTicker value={stat.value} delay={i * 120} />
                  </div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <section className="border-y border-[var(--line)] py-5">
        <Marquee className="text-sm font-semibold text-[var(--ink-soft)]" duration={35}>
          {marqueeItems.map((item) => (
            <span key={item} className="chip mx-2 shrink-0">
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------- Labs ---------- */}
      <section id="labs" className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <motion.div {...fadeUp}>
          <div className="eyebrow">صعود</div>
          <h2 className="display mt-3 text-4xl font-bold md:text-5xl">
            چهار آزمایشگاه. یک صعود.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">
            نورو ← پژوهش ← کاتالیز ← پیشگام. هر آزمایشگاه تم، نشان و انرژی
            مخصوص خود را دارد.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {LABS.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              <SpotlightCard
                className="group rounded-[20px] border p-6"
                color={`${lab.color}26`}
                style={{
                  borderColor: `${lab.color}33`,
                  background: `linear-gradient(165deg, ${lab.color}14 0%, rgba(10,18,24,0.9) 55%)`,
                }}
              >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition group-hover:opacity-50"
                style={{ background: lab.color }}
              />
              <div className="flex items-center justify-between">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl border text-lg font-bold"
                  style={{
                    color: lab.color,
                    borderColor: `${lab.color}55`,
                    background: `${lab.color}14`,
                  }}
                >
                  {lab.badge}
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                  سطح {i * 4 + 1}–{i * 4 + 4}
                </div>
              </div>
              <div className="display mt-6 text-2xl font-bold">{lab.name}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {lab.tagline}
              </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Feature split ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <motion.div
          {...fadeUp}
          className="surface grid gap-10 overflow-hidden p-8 md:grid-cols-[1.05fr_0.95fr] md:p-12"
        >
          <div>
            <div className="eyebrow">ساخته‌شده برای بازگشت روزانه</div>
            <h2 className="display mt-3 text-4xl font-bold">
              اول اقدام. نه منو.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              دانش‌آموزان مستقیم روی ماموریت می‌نشینند — نه تنظیمات. منتورها
              حضور، آزمون، مهر و گزارش را بدون کاغذ مدیریت می‌کنند.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "تخته ماموریت با روتین + ۶ هدف",
                "امتیاز، سکه، سطح و مهرهای منتور",
                "کارت شناسایی دیجیتال با شناسه دائمی",
                "مرکز فرماندهی منتور با گزارش‌های آماده چاپ",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-[var(--brand)]"
                    size={18}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel-dark relative overflow-hidden p-6">
            <motion.div
              className="floaty absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[var(--brand)]/25 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <Flame size={18} />
                <span className="mono text-[10px] uppercase tracking-[0.24em]">
                  همین الان
                </span>
              </div>
              <div className="display mt-4 text-3xl font-bold">
                ماموریت امروز
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                هدف ۱ را پاک کن. برد را ثبت کن. قبل از بسته شدن پنجره مهر،
                امتیاز بگیر.
              </p>
              <div className="mt-8">
                <ProgressBar value={62} />
                <div className="mono mt-3 text-xs text-[var(--ink-faint)]">
                  پیشرفت سطح · ۶۲٪
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  [<Zap key="z" size={14} />, "۶۴۰", "امتیاز"],
                  [<BookOpen key="b" size={14} />, "۵", "مهر"],
                  [<CalendarDays key="c" size={14} />, "۸۸", "سکه"],
                ].map(([icon, value, label], idx) => (
                  <div key={idx} className="surface-flat p-3 text-center">
                    <div className="flex justify-center text-[var(--brand)]">
                      {icon}
                    </div>
                    <div className="display mt-1 text-lg font-bold">{value}</div>
                    <div className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------- The Loop ---------- */}
      <section id="loop" className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <motion.div {...fadeUp}>
          <div className="eyebrow">چطور کار می‌کند</div>
          <h2 className="display mt-3 text-4xl font-bold">چرخه</h2>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            از ثبت‌نام تا پیشگام — یک چرخه پیوسته از اقدام و بازخورد.
          </p>
        </motion.div>
        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent md:block" />
          {[
            {
              title: "ثبت‌نام",
              copy: "شناسه دائمی و تخصیص آزمایشگاه نورو دریافت کن.",
            },
            {
              title: "ماموریت",
              copy: "روتین و اهداف را کامل کن. در دفترچه بازتاب بنویس.",
            },
            {
              title: "مهر",
              copy: "منتورها کیفیت را تأیید و مهر رشد اعطا می‌کنند.",
            },
            {
              title: "صعود",
              copy: "با امتیاز و مهرها در آزمایشگاه‌ها بالا برو.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="surface relative p-6"
            >
              <div className="mono grid h-9 w-9 place-items-center rounded-full border border-[rgba(47,214,195,0.4)] bg-[rgba(47,214,195,0.1)] text-xs font-bold text-[var(--brand)]">
                0{i + 1}
              </div>
              <div className="display mt-5 text-2xl font-bold">{step.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {step.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Mentor strip ---------- */}
      <section id="mentor" className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <motion.div
          {...fadeUp}
          className="panel-dark grid gap-10 overflow-hidden p-8 md:grid-cols-2 md:p-12"
        >
          <div>
            <div className="eyebrow">برای منتورها</div>
            <h2 className="display mt-3 text-4xl font-bold">
              مرکز فرماندهی، نه صفحه‌گسترده.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              فهرست، تأییدها، حضور، آزمون، سکه، امتیاز و گزارش‌های قابل چاپ —
              همه دانش‌آموزان در یک نمای حرفه‌ای.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button variant="secondary">
                باز کردن کنسول منتور
                <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-2.5">
            {[
              ["آوا کریمی", "PPL-250001", "نورو · س۲", "۸۲٪"],
              ["نیما رستمی", "PPL-250002", "نورو · س۲", "۷۴٪"],
              ["سارا حسینی", "PPL-250003", "پژوهش · س۵", "۹۱٪"],
            ].map(([name, id, lab, score], i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="surface-flat flex items-center justify-between px-4 py-3.5 text-sm"
              >
                <div>
                  <div className="font-semibold">{name}</div>
                  <div className="mono text-xs text-[var(--ink-faint)]">{id}</div>
                </div>
                <div className="text-xs text-[var(--ink-soft)]">{lab}</div>
                <div className="mono font-bold text-[var(--brand)]">{score}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <motion.div {...fadeUp}>
          <div className="eyebrow">سؤالات</div>
          <h2 className="display mt-3 text-4xl font-bold">پرسش‌های متداول</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "آیا شناسه دانش‌آموزی با تغییر آزمایشگاه عوض می‌شود؟",
              a: "هرگز. شناسه‌هایی مثل PPL-250001 دائمی‌اند. آزمایشگاه‌ها تکامل می‌یابند؛ هویت نه.",
            },
            {
              q: "برای ارتقای سطح چه چیزی لازم است؟",
              a: "۱۲۰۰ امتیاز و ۱۲ مهر منتور در هر سطح، در ۱۶ سطح و ۴ آزمایشگاه.",
            },
            {
              q: "آیا منتورها می‌توانند گزارش صادر کنند؟",
              a: "بله. خلاصه‌های هفتگی، ماهانه و فصل آماده چاپ و PDF هستند.",
            },
            {
              q: "دسترسی والدین وجود دارد؟",
              a: "به‌عنوان نقش فقط‌خواندنی برای پیشرفت، حضور و آزمون در برنامه است.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.q}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="surface p-6"
            >
              <div className="font-semibold">{item.q}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[28px] border border-[rgba(47,214,195,0.3)] px-8 py-16 text-center md:px-14"
          style={{
            background:
              "radial-gradient(700px 340px at 50% -40%, rgba(47,214,195,0.28), transparent 70%), linear-gradient(180deg, #0b141a, #060b0f)",
          }}
        >
          <div className="eyebrow text-[var(--brand)]">فصل ۲۶</div>
          <h2 className="display mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
            آماده‌اید فصلی بسازید که دانش‌آموزان واقعاً برمی‌گردند؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--ink-soft)]">
            به {BRAND.name} بپیوندید و مطالعه روزانه را به یک سیستم‌عامل زنده
            تبدیل کنید.
          </p>
          <div className="mt-9">
            <Link href="/register">
              <Button className="px-7 py-3 text-base">
                ساخت حساب دانش‌آموزی
                <ArrowRight size={17} className="rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-10 text-sm text-[var(--ink-soft)] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div className="mono text-xs tracking-wider">
            studio@pepsinolab.dev
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
