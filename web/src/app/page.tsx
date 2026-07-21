"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BRAND, LABS } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="hero-stage min-h-screen">
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-16 pt-6 md:px-8">
          <header className="no-print flex items-center justify-between py-3">
            <BrandMark invert />
            <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
              <a href="#labs" className="hover:text-[var(--signal)]">
                لاب‌ها
              </a>
              <a href="#how" className="hover:text-[var(--signal)]">
                مسیر
              </a>
              <a href="#faq" className="hover:text-[var(--signal)]">
                سوالات
              </a>
              <Link href="/login" className="font-semibold text-white">
                ورود
              </Link>
            </nav>
            <Link href="/register" className="hidden sm:block">
              <Button variant="signal" className="py-2.5">
                ورود به لاب
                <ArrowLeft size={16} />
              </Button>
            </Link>
          </header>

          <div className="flex flex-1 flex-col justify-end gap-10 pb-6 pt-20 md:pb-10">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="signal-chip mb-6">
                <span className="signal-dot" />
                سیستم‌عامل آموزشی زنده
              </div>
              <h1 className="display text-[clamp(3.4rem,12vw,8.5rem)] text-white">
                {BRAND.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-2xl">
                مأموریت. منتور. XP. صعود.
                <br className="hidden md:block" />
                یک اکوسیستم که دانش‌آموز را هر روز برمی‌گرداند.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/register">
                  <ShimmerButton
                    className="gap-2 text-base font-bold"
                    background="var(--signal)"
                    shimmerColor="#061416"
                  >
                    <span className="text-[var(--void)]">شروع فصل</span>
                    <Sparkles size={18} className="text-[var(--void)]" />
                  </ShimmerButton>
                </Link>
                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    کنسول منتور
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              className="grid max-w-3xl grid-cols-3 gap-3 md:gap-5"
            >
              {[
                { label: "سطح", value: 16 },
                { label: "لاب", value: 4 },
                { label: "XP / سطح", value: 1200 },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="glass-dark rounded-[20px] p-4 md:p-5"
                >
                  <div className="display text-3xl text-[var(--signal)] md:text-5xl">
                    <NumberTicker value={item.value} delay={0.15 * i} />
                  </div>
                  <div className="mt-2 text-xs text-white/55 md:text-sm">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="labs" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold text-[var(--brand)]">مسیر فصل</div>
            <h2 className="display mt-2 text-5xl md:text-7xl">چهار لاب. یک صعود.</h2>
          </div>
          <p className="max-w-md text-[var(--ink-soft)]">
            از نورو تا پایونیر — هر لاب تم، رنگ، نشان و انرژی خودش را دارد.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {LABS.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={false}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative overflow-hidden rounded-[28px] p-6 text-white md:min-h-[280px] md:p-8"
              style={{
                background: `linear-gradient(145deg, ${lab.color} 0%, #061416 70%)`,
              }}
            >
              <div className="absolute inset-0 opacity-30 transition duration-500 group-hover:opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35), transparent 40%)",
                }}
              />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="flex items-start justify-between">
                  <div className="display text-5xl md:text-6xl">{lab.name}</div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                    Lab 0{i + 1}
                  </div>
                </div>
                <p className="max-w-sm text-white/75">{lab.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="overflow-hidden rounded-[32px] bg-[var(--void)] px-6 py-10 text-white md:px-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="signal-chip mb-5">
                <Zap size={14} />
                اولویت داشبورد
              </div>
              <h2 className="display text-4xl md:text-6xl">اول مأموریت. بعد همه‌چیز.</h2>
              <p className="mt-4 max-w-xl text-white/70">
                دانش‌آموز وارد که می‌شود، مأموریت امروز، پیشرفت، XP، سطح و سکه را
                می‌بیند — نه منو و تنظیمات.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "بورد مأموریت با روتین + ۶ هدف",
                  "مهر منتور برای کیفیت واقعی",
                  "کارت شناسایی دیجیتال دائمی",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[var(--signal)]" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="floaty absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[var(--signal)]/25 blur-3xl" />
              <div className="relative">
                <div className="text-xs text-white/50">مأموریت امروز</div>
                <div className="display mt-2 text-4xl">هدف ۱</div>
                <p className="mt-3 text-sm text-white/65">
                  بلاک تمرکز عمیق را کامل کن و XP بگیر.
                </p>
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-[var(--signal)]" />
                </div>
                <div className="mt-3 flex justify-between text-xs text-white/50">
                  <span>پیشرفت سطح</span>
                  <span>۶۸٪</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <h2 className="display text-5xl md:text-6xl">مسیر صعود</h2>
        <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
          از ثبت‌نام تا پایونیر — حلقهٔ عمل و بازخورد.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { n: "۰۱", t: "ثبت‌نام", d: "شناسه ثابت و لاب نورو" },
            { n: "۰۲", t: "مأموریت", d: "روتین، هدف‌ها، دفترچه" },
            { n: "۰۳", t: "مهر", d: "تأیید کیفیت توسط منتور" },
            { n: "۰۴", t: "صعود", d: "سطح، لاب، دستاورد" },
          ].map((step) => (
            <div key={step.n} className="surface surface-interactive p-6">
              <div className="text-sm font-bold text-[var(--brand)]">{step.n}</div>
              <div className="display mt-4 text-3xl">{step.t}</div>
              <p className="mt-3 text-sm text-[var(--ink-soft)]">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="surface p-8 md:p-12">
          <h2 className="display text-5xl">سوالات پرتکرار</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              {
                q: "شناسه با عوض شدن لاب تغییر می‌کند؟",
                a: "هرگز. مثل PPL-250001 ثابت می‌ماند.",
              },
              {
                q: "شرط ارتقا چیست؟",
                a: "۱۲۰۰ XP و ۱۲ مهر منتور در هر سطح.",
              },
              {
                q: "گزارش منتور داریم؟",
                a: "بله — هفتگی، ماهانه و فصلی، آماده چاپ.",
              },
              {
                q: "والدین چه زمانی؟",
                a: "نقش فقط‌خواندنی در آینده اضافه می‌شود.",
              },
            ].map((item) => (
              <div key={item.q}>
                <div className="text-lg font-bold">{item.q}</div>
                <p className="mt-2 text-[var(--ink-soft)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#0c9b8a_0%,#061416_55%,#ff6a3d_140%)] px-8 py-16 text-white md:px-14">
          <div className="display relative max-w-3xl text-5xl md:text-7xl">
            فصلی بساز که دانش‌آموز عاشقش شود.
          </div>
          <p className="relative mt-5 max-w-xl text-white/75">
            PEPSINO LAB مطالعه را به یک سیستم زنده تبدیل می‌کند.
          </p>
          <div className="relative mt-10">
            <Link href="/register">
              <ShimmerButton
                background="#ffffff"
                shimmerColor="#0c9b8a"
                className="text-base font-bold"
              >
                <span className="text-[var(--void)]">ساخت حساب دانش‌آموز</span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div className="text-sm text-[var(--ink-soft)]">studio@pepsinolab.dev</div>
        </div>
      </footer>
    </div>
  );
}
