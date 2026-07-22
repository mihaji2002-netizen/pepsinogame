"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Flame,
  Sparkles,
  Stamp,
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
  { value: 16, label: "Levels" },
  { value: 4, label: "Labs" },
  { value: 1200, label: "XP per level" },
  { value: 12, label: "Stamps per level" },
];

const marqueeItems = [
  "Mission Board",
  "XP & Coins",
  "Mentor Stamps",
  "Digital ID Card",
  "Weekly Planner",
  "Leaderboards",
  "Season Reports",
  "Four Labs",
];

const heroMissions = [
  { title: "Routine", xp: 40, done: true },
  { title: "Target 1 · Deep work", xp: 60, done: true },
  { title: "Target 2 · Practice set", xp: 60, done: false },
  { title: "Target 3 · Review gaps", xp: 50, done: false },
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
              Labs
            </a>
            <a href="#loop" className="transition hover:text-[var(--ink)]">
              The Loop
            </a>
            <a href="#mentor" className="transition hover:text-[var(--ink)]">
              Mentors
            </a>
            <a href="#faq" className="transition hover:text-[var(--ink)]">
              FAQ
            </a>
            <Link href="/login" className="font-semibold text-[var(--ink)]">
              Sign in
            </Link>
          </nav>
          <Link href="/register">
            <Button className="px-4 py-2">
              Enter the Lab
              <ArrowRight size={15} />
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
              Season 26 enrollment open
            </div>
            <h1 className="display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Study like it&apos;s{" "}
              <span className="shimmer-text">a season</span>, not a chore.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink-soft)]">
              {BRAND.name} is the education OS where missions, mentors, XP, and
              momentum live together. Plan the week. Clear the board. Level
              through four Labs.
            </p>
            <motion.div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="btn-shimmer px-6 py-3 text-base">
                  Start as Student
                  <Sparkles size={17} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="px-6 py-3 text-base">
                  Mentor Console
                  <ArrowUpRight size={17} />
                </Button>
              </Link>
            </motion.div>
            <motion.div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
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
            </motion.div>
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
          <div className="eyebrow">The Climb</div>
          <h2 className="display mt-3 text-4xl font-bold md:text-5xl">
            Four Labs. One climb.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">
            Neuro → Research → Catalyst → Pioneer. Each Lab carries its own
            theme, badge, and energy as students level through the season.
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
                  Levels {i * 4 + 1}–{i * 4 + 4}
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
            <div className="eyebrow">Built for daily return</div>
            <h2 className="display mt-3 text-4xl font-bold">
              Action first. Menus never.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              Students land on the mission — not settings. Mentors run
              attendance, exams, stamps, and reports without paper.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "Mission Board with Routine + 6 Targets",
                "XP, Coins, Levels, and Mentor Stamps",
                "Digital ID Card with permanent Student ID",
                "Mentor command center with PDF-ready reports",
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
                  Live now
                </span>
              </div>
              <div className="display mt-4 text-3xl font-bold">
                Today&apos;s Mission
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                Clear Target 1. Log the win. Earn XP before the stamp window
                closes.
              </p>
              <div className="mt-8">
                <ProgressBar value={62} />
                <div className="mono mt-3 text-xs text-[var(--ink-faint)]">
                  LEVEL PROGRESS · 62%
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  [<Zap key="z" size={14} />, "640", "XP"],
                  [<BookOpen key="b" size={14} />, "5", "Stamps"],
                  [<CalendarDays key="c" size={14} />, "88", "Coins"],
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
          <div className="eyebrow">How it works</div>
          <h2 className="display mt-3 text-4xl font-bold">The Loop</h2>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            From registration to Pioneer — a single continuous loop of action
            and feedback.
          </p>
        </motion.div>
        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent md:block" />
          {[
            {
              title: "Register",
              copy: "Get a permanent Student ID and Neuro Lab assignment.",
            },
            {
              title: "Mission",
              copy: "Complete Routine and Targets. Reflect in the Logbook.",
            },
            {
              title: "Stamp",
              copy: "Mentors approve quality and award growth stamps.",
            },
            {
              title: "Ascend",
              copy: "Level up through Labs with XP and stamps.",
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
            <div className="eyebrow">For mentors</div>
            <h2 className="display mt-3 text-4xl font-bold">
              A command center, not a spreadsheet.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">
              Roster, approvals, attendance, exams, coins, XP, and printable
              reports — every student in one professional view.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button variant="secondary">
                Open Mentor Console
                <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-2.5">
            {[
              ["Ava Karimi", "PPL-250001", "Neuro · L2", "82%"],
              ["Nima Rostami", "PPL-250002", "Neuro · L2", "74%"],
              ["Sara Hosseini", "PPL-250003", "Research · L5", "91%"],
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
          <div className="eyebrow">Questions</div>
          <h2 className="display mt-3 text-4xl font-bold">FAQ</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
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
          <div className="eyebrow text-[var(--brand)]">Season 26</div>
          <h2 className="display mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
            Ready to run a season students actually return to?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--ink-soft)]">
            Join {BRAND.name} and turn daily study into a living operating
            system.
          </p>
          <div className="mt-9">
            <Link href="/register">
              <Button className="px-7 py-3 text-base">
                Create student account
                <ArrowRight size={17} />
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
