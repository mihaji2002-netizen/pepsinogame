"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsMentor } = useApp();
  const [email, setEmail] = useState("ava@pepsinolab.dev");

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-10 md:grid-cols-2 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Link href="/">
          <BrandMark />
        </Link>
        <div className="chip mt-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" />
          Season 26 in progress
        </div>
        <h1 className="display mt-5 text-5xl font-bold tracking-tight">
          Sign in to <span className="text-[var(--brand)]">the Lab</span>
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-[var(--ink-soft)]">
          MVP demo auth — choose a student email or enter the mentor console.
          Google and SMS come later.
        </p>
        <div className="mt-8 flex items-center gap-3 text-sm text-[var(--ink-faint)]">
          <ShieldCheck size={16} className="text-[var(--brand)]" />
          Your Student ID never changes. Labs do.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="surface p-6 md:p-8"
      >
        <label className="text-sm font-semibold">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field mt-2"
          placeholder="you@school.edu"
        />
        <div className="mt-6 flex flex-col gap-3">
          <Button
            className="py-3"
            onClick={() => {
              loginAsStudent(email);
              router.push("/student/dashboard");
            }}
          >
            Continue as Student
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="secondary"
            className="py-3"
            onClick={() => {
              loginAsMentor();
              router.push("/mentor/dashboard");
            }}
          >
            Continue as Mentor
          </Button>
        </div>
        <p className="mt-8 text-sm text-[var(--ink-soft)]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[var(--brand)]">
            Create a student account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
