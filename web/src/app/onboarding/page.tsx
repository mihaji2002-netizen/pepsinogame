"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

const steps = ["welcome", "id", "lab", "mission", "start"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { hydrated, currentStudent, completeOnboarding, user } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "student" || !currentStudent) {
      router.replace("/register");
      return;
    }
    if (currentStudent.hasCompletedOnboarding) {
      router.replace("/student/dashboard");
    }
  }, [hydrated, user, currentStudent, router]);

  if (!currentStudent) {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--ink-soft)]">
        Preparing your Lab…
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const key = steps[step];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <AnimatePresence mode="wait">
        {key === "welcome" && (
          <motion.div
            key="welcome"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <div className="display text-5xl font-bold md:text-6xl">
              Welcome to PEPSINO LAB
            </div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              Your season starts now. Identity first. Then the mission.
            </p>
            <Button className="mt-8" onClick={() => setStep(1)}>
              Reveal my ID Card
            </Button>
          </motion.div>
        )}

        {key === "id" && (
          <motion.div
            key="id"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div>
              <div className="display text-4xl font-bold">Your Digital ID</div>
              <p className="mt-2 text-[var(--ink-soft)]">
                Permanent Student ID · never encodes Lab · never changes.
              </p>
            </div>
            <IdCard student={currentStudent} />
            <Button onClick={() => setStep(2)}>Continue</Button>
          </motion.div>
        )}

        {key === "lab" && (
          <motion.div
            key="lab"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface p-8"
          >
            <div
              className="h-36 rounded-[24px]"
              style={{
                background: `linear-gradient(145deg, ${lab.color}, #102027)`,
              }}
            />
            <div className="display mt-6 text-4xl font-bold">{lab.name} Lab</div>
            <p className="mt-3 text-[var(--ink-soft)]">{lab.tagline}</p>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              You begin at Level 1. Climb through Research, Catalyst, and Pioneer
              with XP and mentor stamps.
            </p>
            <Button className="mt-6" onClick={() => setStep(3)}>
              Meet the Mission Board
            </Button>
          </motion.div>
        )}

        {key === "mission" && (
          <motion.div
            key="mission"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface p-8"
          >
            <div className="display text-4xl font-bold">First Mission</div>
            <p className="mt-3 text-[var(--ink-soft)]">
              Complete Routine, then Targets 1–6. Each action grants XP. Mentors
              approve quality and award stamps.
            </p>
            <div className="mt-6 rounded-2xl bg-[var(--paper-deep)] p-4">
              <div className="text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                Today
              </div>
              <div className="display mt-2 text-2xl font-bold">Routine</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                Complete your daily study ritual and warm-up. +40 XP
              </p>
            </div>
            <Button className="mt-6" onClick={() => setStep(4)}>
              Ready
            </Button>
          </motion.div>
        )}

        {key === "start" && (
          <motion.div
            key="start"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="display text-5xl font-bold">Enter the dashboard</div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              Mission. Progress. XP. Level. Coins. Action first.
            </p>
            <Button
              className="mt-8"
              onClick={() => {
                completeOnboarding();
                router.push("/student/dashboard");
              }}
            >
              Start
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
