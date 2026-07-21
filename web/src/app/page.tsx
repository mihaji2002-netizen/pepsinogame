"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  Flame,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { BRAND, LABS } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 1, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function LandingPage() {
  return (
    <div>
      <header className="no-print mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm text-[var(--ink-soft)] md:flex">
          <a href="#labs">لاب‌ها</a>
          <a href="#how">چطور کار می‌کند</a>
          <a href="#faq">سوالات پرتکرار</a>
          <Link href="/login" className="font-semibold text-[var(--ink)]">
            ورود
          </Link>
        </nav>
        <Link href="/register">
          <Button>
            ورود به لاب
            <ArrowLeft size={16} />
          </Button>
        </Link>
      </header>

      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(11,95,99,0.92) 0%, rgba(16,32,39,0.88) 45%, rgba(15,138,138,0.75) 100%), url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22%3E%3Cpath fill=%22none%22 stroke=%22rgba(255,255,255,0.08)%22 stroke-width=%221%22 d=%22M0 40h160M0 80h160M0 120h160M40 0v160M80 0v160M120 0v160%22/%3E%3C/svg%3E')",
            backgroundSize: "cover, 160px 160px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--paper)] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col justify-end px-5 pb-16 pt-20 md:px-8 md:pb-24">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <div className="display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              {BRAND.name}
            </div>
            <h1 className="mt-5 max-w-2xl text-2xl font-medium leading-snug text-white/90 md:text-3xl">
              سیستم‌عامل آموزشی که مأموریت، منتور و انگیزه را در یک جا جمع می‌کند.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
              هفته را برنامه‌ریزی کن. بورد را پاک کن. XP بگیر. لاب‌ها را باز کن.
              تا پایان فصل باانگیزه بمان.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button className="bg-white text-[var(--ink)] hover:bg-[var(--paper)]">
                  شروع به‌عنوان دانش‌آموز
                  <Sparkles size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  کنسول منتور
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="labs" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div {...fadeUp}>
          <div className="display text-4xl font-bold md:text-5xl">چهار لاب. یک صعود.</div>
          <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
            نورو → ریسرچ → کاتالیست → پایونیر. هر لاب تم، نشان و انرژی خودش را دارد.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {LABS.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="surface surface-interactive overflow-hidden p-5"
            >
              <div
                className="mb-5 h-28 rounded-2xl"
                style={{ background: `linear-gradient(145deg, ${lab.color}, #102027)` }}
              />
              <div className="display text-2xl font-bold">{lab.name}</div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{lab.tagline}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <motion.div {...fadeUp} className="surface grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div>
            <div className="display text-4xl font-bold">برای برگشت هرروزه ساخته شده.</div>
            <p className="mt-3 text-[var(--ink-soft)]">
              دانش‌آموز اول مأموریت را می‌بیند — نه منو. منتور بدون کاغذ، حضور و آزمون و مهر را مدیریت می‌کند.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "بورد مأموریت با روتین + ۶ هدف",
                "XP، سکه، سطح و مهر منتور",
                "کارت شناسایی دیجیتال با شناسه ثابت",
                "مرکز فرمان منتور با گزارش قابل چاپ",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 text-[var(--brand)]" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[24px] bg-[var(--ink)] p-6 text-white">
            <div className="floaty absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand)]/40 blur-2xl" />
            <div className="relative">
              <Flame className="text-[var(--accent)]" />
              <div className="display mt-4 text-3xl font-bold">مأموریت امروز</div>
              <p className="mt-2 text-white/70">
                هدف ۱ را تمام کن. برد را ثبت کن. قبل از بسته شدن پنجره مهر، XP بگیر.
              </p>
              <div className="mt-8 h-2 rounded-full bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-[var(--brand)]" />
              </div>
              <div className="mt-3 text-sm text-white/60">پیشرفت سطح · ۶۲٪</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div {...fadeUp}>
          <div className="display text-4xl font-bold">چطور کار می‌کند</div>
          <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
            از ثبت‌نام تا پایونیر — یک حلقه پیوسته از عمل و بازخورد.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { title: "ثبت‌نام", copy: "شناسه ثابت بگیر و وارد لاب نورو شو." },
            { title: "مأموریت", copy: "روتین و هدف‌ها را کامل کن. در دفترچه بازتاب بنویس." },
            { title: "مهر", copy: "منتور کیفیت را تأیید و مهر رشد می‌دهد." },
            { title: "صعود", copy: "با XP و مهر از لاب‌ها بالا برو." },
          ].map((step, i) => (
            <motion.div key={step.title} {...fadeUp} className="surface surface-interactive p-5">
              <div className="text-xs text-[var(--ink-soft)]">۰{i + 1}</div>
              <div className="display mt-3 text-2xl font-bold">{step.title}</div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div {...fadeUp} className="surface p-8 md:p-12">
          <div className="display text-4xl font-bold">سوالات پرتکرار</div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                q: "با عوض شدن لاب، شناسه دانش‌آموز عوض می‌شود؟",
                a: "هرگز. شناسه‌هایی مثل PPL-250001 ثابت می‌مانند. لاب عوض می‌شود؛ هویت نه.",
              },
              {
                q: "برای ارتقای سطح چه لازم است؟",
                a: "در هر سطح ۱۲۰۰ XP و ۱۲ مهر منتور؛ در مجموع ۱۶ سطح و ۴ لاب.",
              },
              {
                q: "منتور می‌تواند گزارش بگیرد؟",
                a: "بله. خلاصه هفتگی، ماهانه و فصلی آماده چاپ/PDF است.",
              },
              {
                q: "دسترسی والدین هست؟",
                a: "در آینده به‌صورت فقط‌خواندنی برای پیشرفت، حضور و آزمون‌ها اضافه می‌شود.",
              },
            ].map((item) => (
              <div key={item.q}>
                <div className="font-semibold">{item.q}</div>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[32px] bg-[var(--brand-deep)] px-8 py-14 text-white md:px-14"
        >
          <Compass className="absolute left-10 top-10 opacity-20" size={120} />
          <div className="display relative max-w-2xl text-4xl font-bold md:text-5xl">
            آماده‌ای فصلی بسازی که دانش‌آموز واقعاً برگردد؟
          </div>
          <p className="relative mt-4 max-w-xl text-white/75">
            به PEPSINO LAB بپیوند و مطالعه روزانه را به یک سیستم‌عامل زنده تبدیل کن.
          </p>
          <div className="relative mt-8">
            <Link href="/register">
              <Button className="bg-white text-[var(--ink)] hover:bg-[var(--paper)]">
                ساخت حساب دانش‌آموز
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--ink-soft)] md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div>تماس · studio@pepsinolab.dev</div>
        </div>
      </footer>
    </div>
  );
}
