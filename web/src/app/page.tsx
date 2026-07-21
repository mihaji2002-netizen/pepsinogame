"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { KineticText } from "@/components/ui/kinetic-text";
import { Magnetic } from "@/components/ui/magnetic";
import { easeOut, fadeUp, scaleIn, stagger, wipeIn } from "@/lib/motion";

const marqueeItems = [
  "مأموریت",
  "حضور",
  "آزمون",
  "XP",
  "سطح",
  "کارنامه",
  "لاب",
  "منتور",
];

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const slashX = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--paper)] text-[var(--ink)]">
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-10"
      >
        <BrandMark compact />
        <nav className="flex items-center gap-1">
          <Link href="/login">
            <Button variant="ghost" className="px-4 py-2">
              ورود
            </Button>
          </Link>
          <Magnetic>
            <Link href="/register">
              <Button variant="flare" className="px-4 py-2">
                شروع
              </Button>
            </Link>
          </Magnetic>
        </nav>
      </motion.header>

      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <div className="mesh">
            <div className="mesh-blob mesh-blob--a" />
            <div className="mesh-blob mesh-blob--b" />
            <div className="mesh-blob mesh-blob--c" />
            <motion.div className="mesh-slash" style={{ x: slashX }} aria-hidden />
          </div>
        </motion.div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-24">
          <div className="max-w-3xl">
            <KineticText
              text="PEPSINO"
              className="display block text-[clamp(3.6rem,14vw,8.5rem)] leading-[0.86] text-[var(--ink)]"
            />
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.7, ease: easeOut }}
            >
              <span className="display block text-[clamp(3.6rem,14vw,8.5rem)] leading-[0.86] text-[var(--brand)]">
                LAB
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.55 }}
              className="display mt-8 max-w-xl text-2xl md:text-4xl"
            >
              آزمایشگاه سیگنال برای مسیر تحصیلی
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.55, ease: easeOut }}
              className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] md:text-lg"
            >
              مأموریت، حضور، آزمون و کارنامه — یک سیستم زنده برای دانش‌آموز و منتور.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.55, ease: easeOut }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Magnetic strength={22}>
                <Link href="/register">
                  <Button variant="flare" className="px-8 py-4 text-base">
                    ورود به آزمایشگاه
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={14}>
                <Link href="/login">
                  <Button variant="ink" className="px-8 py-4 text-base">
                    قبلاً حساب دارم
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 h-1.5 origin-right bg-[var(--flare)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: easeOut }}
          style={{ width: "100%" }}
        />
      </section>

      {/* Kinetic marquee strip */}
      <div className="overflow-hidden border-y border-[var(--line)] bg-white py-4">
        <div className="marquee-track" dir="ltr">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="display whitespace-nowrap text-2xl text-[var(--ink)] md:text-3xl"
            >
              {item}
              <span className="mx-4 text-[var(--flare)]">/</span>
            </span>
          ))}
        </div>
      </div>

      <motion.section
        variants={wipeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="lab-band lab-band--ink"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <p className="display text-sm tracking-[0.18em] text-[var(--mint)]">برای دانش‌آموز</p>
            <h2 className="display mt-4 text-3xl md:text-5xl">هر روز یک سیگنال واضح</h2>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 md:flex md:flex-col md:justify-end"
          >
            <p className="max-w-xl text-lg leading-relaxed text-white/75">
              داشبورد، مأموریت‌ها، لاگ‌بوک و کارت شناسایی — پیشرفت را مثل یک مسیر زنده
              می‌بینی، نه یک جدول خشک.
            </p>
            <div className="mt-8">
              <Magnetic>
                <Link href="/register">
                  <Button variant="flare">ساخت حساب دانش‌آموز</Button>
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="lab-band lab-band--brand"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-7 md:order-2">
            <p className="display text-sm tracking-[0.18em] text-white/70">برای منتور</p>
            <h2 className="display mt-4 text-3xl text-white md:text-5xl">
              کلاس را مثل یک اتاق کنترل ببین
            </h2>
          </div>
          <div className="md:col-span-5 md:order-1 md:flex md:flex-col md:justify-end">
            <p className="max-w-md text-lg leading-relaxed text-white/80">
              حضور، آزمون، گزارش و وضعیت هر دانش‌آموز — بدون شلوغی داشبوردهای اداری.
            </p>
            <div className="mt-8">
              <Magnetic>
                <Link href="/register">
                  <Button variant="ink">حساب منتور</Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="display max-w-2xl text-3xl md:text-5xl"
          >
            از ثبت‌نام تا کارنامه — یک جریان پیوسته.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-14 grid gap-px bg-[var(--line)] md:grid-cols-3"
          >
            {[
              { n: "۰۱", t: "هویت", d: "ثبت‌نام، نقش، و کارت شناسایی شخصی." },
              { n: "۰۲", t: "اجرا", d: "مأموریت روزانه، حضور، و آزمون‌های زمان‌دار." },
              { n: "۰۳", t: "بازتاب", d: "لاگ‌بوک، سطح، و گزارش قابل چاپ." },
            ].map((step) => (
              <motion.div
                key={step.n}
                variants={scaleIn}
                whileHover={{ y: -6, backgroundColor: "#ffffff" }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="bg-[var(--paper)] p-8"
              >
                <p className="display text-5xl text-[var(--flare)]">{step.n}</p>
                <h3 className="display mt-4 text-2xl">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{step.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white px-5 py-10 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <BrandMark />
            <p className="mt-3 text-sm text-[var(--ink-soft)]">Gamified Education OS</p>
          </div>
          <p className="text-xs text-[var(--ink-soft)]">© {new Date().getFullYear()} PEPSINO LAB</p>
        </motion.div>
      </footer>
    </div>
  );
}
