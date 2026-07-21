"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flame,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { BRAND, LABS } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function LandingPage() {
  return (
    <div>
      <header className="no-print mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm text-[var(--ink-soft)] md:flex">
          <a href="#labs">Labs</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <Link href="/login" className="font-semibold text-[var(--ink)]">
            Sign in
          </Link>
        </nav>
        <Link href="/register">
          <Button>
            Enter the Lab
            <ArrowRight size={16} />
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-white"
          >
            <div className="display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              {BRAND.name}
            </div>
            <h1 className="mt-5 max-w-2xl text-2xl font-medium leading-snug text-white/90 md:text-3xl">
              The education OS where missions, mentors, and momentum live together.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
              Plan the week. Clear the board. Earn XP. Unlock Labs. Stay motivated
              for the entire season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button className="bg-white text-[var(--ink)] hover:bg-[var(--paper)]">
                  Start as Student
                  <Sparkles size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Mentor Console
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="labs" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div {...fadeUp}>
          <div className="display text-4xl font-bold md:text-5xl">Four Labs. One climb.</div>
          <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
            Neuro → Research → Catalyst → Pioneer. Each lab carries its own theme,
            badge, and energy as students level through the season.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {LABS.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="surface overflow-hidden p-5"
            >
              <div
                className="mb-5 h-28 rounded-2xl"
                style={{
                  background: `linear-gradient(145deg, ${lab.color}, #102027)`,
                }}
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
            <div className="display text-4xl font-bold">Built for daily return.</div>
            <p className="mt-3 text-[var(--ink-soft)]">
              Students see the mission first — not menus. Mentors run attendance,
              exams, stamps, and reports without paper.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Mission Board with Routine + 6 Targets",
                "XP, Coins, Levels, and Mentor Stamps",
                "Digital ID Card with permanent Student ID",
                "Mentor command center with PDF-ready reports",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 text-[var(--brand)]" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[24px] bg-[var(--ink)] p-6 text-white">
            <motion.div
              className="floaty absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand)]/40 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <Flame className="text-[var(--accent)]" />
              <div className="display mt-4 text-3xl font-bold">Today’s Mission</div>
              <p className="mt-2 text-white/70">
                Clear Target 1. Log the win. Earn XP before the stamp window closes.
              </p>
              <div className="mt-8 h-2 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[var(--brand)]"
                  initial={{ width: "18%" }}
                  whileInView={{ width: "62%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <div className="mt-3 text-sm text-white/60">Level progress · 62%</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div {...fadeUp}>
          <div className="display text-4xl font-bold">How it works</div>
          <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
            From registration to Pioneer — a single continuous loop of action and feedback.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { title: "Register", copy: "Get a permanent Student ID and Neuro Lab assignment." },
            { title: "Mission", copy: "Complete Routine and Targets. Reflect in the Logbook." },
            { title: "Stamp", copy: "Mentors approve quality and award growth stamps." },
            { title: "Ascend", copy: "Level up through Labs with XP and stamps." },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="surface p-5"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                0{i + 1}
              </div>
              <div className="display mt-3 text-2xl font-bold">{step.title}</div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div {...fadeUp} className="surface p-8 md:p-12">
          <div className="display text-4xl font-bold">FAQ</div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Does my Student ID change when I switch Labs?",
                a: "Never. IDs like PPL-250001 stay permanent. Labs evolve; identity does not.",
              },
              {
                q: "What is required to level up?",
                a: "1200 XP and 12 mentor stamps per level across 16 levels and 4 Labs.",
              },
              {
                q: "Can mentors export reports?",
                a: "Yes. Weekly, monthly, and season summaries are print/PDF ready.",
              },
              {
                q: "Is parent access available?",
                a: "Planned as a future read-only role for progress, attendance, and exams.",
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
          <Compass className="absolute right-10 top-10 opacity-20" size={120} />
          <div className="display relative max-w-2xl text-4xl font-bold md:text-5xl">
            Ready to run a season that students actually return to?
          </div>
          <p className="relative mt-4 max-w-xl text-white/75">
            Join PEPSINO LAB and turn daily study into a living operating system.
          </p>
          <div className="relative mt-8">
            <Link href="/register">
              <Button className="bg-white text-[var(--ink)] hover:bg-[var(--paper)]">
                Create student account
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--ink-soft)] md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div>Contact · studio@pepsinolab.dev</div>
        </div>
      </footer>
    </div>
  );
}
