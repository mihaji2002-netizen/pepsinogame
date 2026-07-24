"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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
import { LabArt } from "@/components/LabArt";
import { HeroVisual } from "@/components/effects/HeroVisual";
import { GradientText, TextReveal } from "@/components/effects/TextReveal";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BRAND, BRAND_SLOGANS, LABS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

const heroStats = [
  { value: 16, label: "Level" },
  { value: 4, label: "Lab" },
  { value: 1200, label: "XP per Level" },
  { value: 12, label: "Stamp per Level" },
];

const marqueeItems = [
  "Mission Board",
  "XP & Coin",
  "Mentor Stamps",
  "Subject ID Card",
  "Weekly Planner",
  "Leaderboard",
  "Season Report",
  "Four Labs",
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 120], [0, -4]);

  const viewFade = {
    variants: fadeUp,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.25 },
  };

  return (
    <motion.div>
      {/* ---------- Nav ---------- */}
      <header className="no-print sticky top-0 z-40">
        <motion.div
          style={{ y: navY }}
          className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 md:px-6"
        >
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm text-[var(--ink-soft)] md:flex">
            <a href="#labs" className="transition hover:text-[var(--ink)]">
              Labs
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
              Enter Lab
              <ArrowRight size={15} className="rtl:rotate-180" />
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="chip">
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-[var(--brand)]"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: "0 0 12px var(--brand)" }}
              />
              ثبت‌نام فصل ۲۶ باز است
            </motion.div>
            <h1 className="fa-heading mt-8 text-[2.4rem] md:text-6xl">
              <TextReveal text="مطالعه را مثل یک" delay={0.15} />
              <br />
              <GradientText>
                <TextReveal text="فصل" delay={0.45} />
              </GradientText>{" "}
              <TextReveal text="تجربه کن." delay={0.55} />
            </h1>
            <motion.p
              variants={fadeUp}
              className="fa-body mt-7 max-w-lg text-lg text-[var(--ink-soft)]"
            >
              {BRAND.name} سیستم‌عامل آموزشی است که Missionها، منتورها، XP و
              شتاب را در یک اکوسیستم زنده جمع می‌کند.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="btn-shimmer px-7 py-3.5 text-base">
                  شروع به‌عنوان دانش‌آموز
                  <Sparkles size={17} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="px-7 py-3.5 text-base">
                  کنسول منتور
                  <ArrowUpRight size={17} />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="mt-12 grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:gap-x-10"
            >
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="fa-heading text-3xl text-[var(--brand)]">
                    <NumberTicker value={stat.value} delay={i * 120} />
                  </div>
                  <div className="mt-1 text-sm text-[var(--ink-faint)]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <HeroVisual />
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
        <motion.div {...viewFade}>
          <div className="eyebrow">صعود</div>
          <h2 className="display mt-3 text-4xl md:text-5xl">
            چهار Lab. یک صعود.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">
            NEURO LAB ← RESEARCH LAB ← CATALYST LAB ← PIONEER LAB. هر Lab تم،
            نشان و انرژی مخصوص خود را دارد.
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
                  background: `linear-gradient(165deg, ${lab.color}14 0%, rgba(8,8,16,0.9) 55%)`,
                }}
              >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition group-hover:opacity-50"
                style={{ background: lab.color }}
              />
              <div className="flex items-start justify-between gap-3">
                <LabArt lab={lab} size="lg" animate showBadge />
                <div className="mono text-[10px] text-[var(--ink-faint)]">
                  Level {i * 4 + 1}–{i * 4 + 4}
                </div>
              </div>
              <div className="display mt-5 text-2xl font-bold">{lab.nameEn}</div>
              <p className="mt-2 text-xs font-medium text-[var(--brand)]">{lab.focus}</p>
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
          {...viewFade}
          className="surface grid gap-10 overflow-hidden p-8 md:grid-cols-[1.05fr_0.95fr] md:p-12"
        >
          <div>
            <div className="eyebrow">ساخته‌شده برای بازگشت روزانه</div>
            <h2 className="display mt-3 text-4xl">
              اول اقدام. نه منو.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              دانش‌آموزان مستقیم روی Mission می‌نشینند — نه تنظیمات. منتورها
              حضور، آزمون، Stamp و گزارش را بدون کاغذ مدیریت می‌کنند.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "Mission Board با Routine + ۶ Target",
                "XP، Coin، Level و Stampهای منتور",
                "کارت Subject ID با شناسه دائمی",
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
                <span className="mono text-[10px]">
                  همین الان
                </span>
              </div>
              <div className="display mt-4 text-3xl font-bold">
                Mission امروز
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                Target 1 را پاک کن. برد را ثبت کن. قبل از بسته شدن پنجره Stamp،
                XP بگیر.
              </p>
              <div className="mt-8">
                <ProgressBar value={62} />
                <div className="mono mt-3 text-xs text-[var(--ink-faint)]">
                  Level Progress · ۶۲٪
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  [<Zap key="z" size={14} />, "۶۴۰", "XP"],
                  [<BookOpen key="b" size={14} />, "۵", "Stamp"],
                  [<CalendarDays key="c" size={14} />, "۸۸", "Coin"],
                ].map(([icon, value, label], idx) => (
                  <div key={idx} className="surface-flat p-3 text-center">
                    <div className="flex justify-center text-[var(--brand)]">
                      {icon}
                    </div>
                    <div className="display mt-1 text-lg font-bold">{value}</div>
                    <div className="mono text-[9px] text-[var(--ink-faint)]">
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
        <motion.div {...viewFade}>
          <div className="eyebrow">چطور کار می‌کند</div>
          <h2 className="display mt-3 text-4xl">چرخه</h2>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            از ثبت‌نام تا PIONEER LAB — یک چرخه پیوسته از اقدام و بازخورد.
          </p>
        </motion.div>
        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent md:block" />
          {[
            {
              title: "ثبت‌نام",
              copy: "Subject ID دائمی و تخصیص NEURO LAB دریافت کن.",
            },
            {
              title: "Mission",
              copy: "Routine و Targetها را کامل کن. در Logbook بازتاب بنویس.",
            },
            {
              title: "Stamp",
              copy: "منتورها کیفیت را تأیید و Stamp رشد اعطا می‌کنند.",
            },
            {
              title: "صعود",
              copy: "با XP و Stampها در Labها بالا برو.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              {...viewFade}
              className="surface relative p-6"
            >
              <div className="mono grid h-9 w-9 place-items-center rounded-full border border-[rgba(var(--brand-rgb),0.4)] bg-[rgba(var(--brand-rgb),0.1)] text-xs font-bold text-[var(--brand)]">
                0{i + 1}
              </div>
              <div className="display mt-5 text-2xl">{step.title}</div>
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
          {...viewFade}
          className="panel-dark grid gap-10 overflow-hidden p-8 md:grid-cols-2 md:p-12"
        >
          <div>
            <div className="eyebrow">برای منتورها</div>
            <h2 className="display mt-3 text-4xl">
              مرکز فرماندهی، نه صفحه‌گسترده.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              فهرست، تأییدها، حضور، آزمون، Coin، XP و گزارش‌های قابل چاپ —
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
              ["N-021", "NEURO LAB · س۳", "۸۲٪"],
              ["N-022", "NEURO LAB · س۲", "۷۴٪"],
              ["R-003", "RESEARCH LAB · س۵", "۹۱٪"],
            ].map(([id, lab, score], i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="surface-flat flex items-center justify-between px-4 py-3.5 text-sm"
              >
                <div>
                  <div className="mono font-semibold">{id}</div>
                  <div className="text-xs text-[var(--ink-faint)]">شناسه موضوعی</div>
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
        <motion.div {...viewFade}>
          <div className="eyebrow">سؤالات</div>
          <h2 className="display mt-3 text-4xl">پرسش‌های متداول</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "آیا Subject ID با تغییر Lab عوض می‌شود؟",
              a: "هرگز. شناسه‌هایی مثل N-021 دائمی‌اند. Labها تکامل می‌یابند؛ هویت نه.",
            },
            {
              q: "برای ارتقای Level چه چیزی لازم است؟",
              a: "۱۲۰۰ XP و ۱۲ Stamp منتور در هر Level، در ۱۶ Level و ۴ Lab.",
            },
            {
              q: "آیا منتورها می‌توانند گزارش صادر کنند؟",
              a: "بله. خلاصه‌های هفتگی، ماهانه و فصل آماده چاپ و PDF هستند.",
            },
            {
              q: "دسترسی والدین وجود دارد؟",
              a: "به‌عنوان نقش فقط‌خواندنی برای پیشرفت، حضور و آزمون در برنامه است.",
            },
          ].map((item) => (
            <motion.div
              key={item.q}
              {...viewFade}
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
          {...viewFade}
          className="relative overflow-hidden rounded-[28px] border border-[rgba(var(--brand-rgb),0.3)] px-8 py-16 text-center md:px-14"
          style={{
            background:
              "radial-gradient(700px 340px at 50% -40%, rgba(var(--brand-rgb),0.28), transparent 70%), linear-gradient(180deg, var(--deck), var(--bg))",
          }}
        >
          <div className="eyebrow text-[var(--brand)]">فصل ۲۶</div>
          <h2 className="display mx-auto mt-4 max-w-2xl text-4xl md:text-5xl">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <BrandMark />
            <div className="mono text-xs">studio@pepsinolab.dev</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {BRAND_SLOGANS.map((slogan) => (
              <span key={slogan} className="chip text-[11px]">
                {slogan}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
