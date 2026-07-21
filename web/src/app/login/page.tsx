"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsMentor } = useApp();
  const [email, setEmail] = useState("ava@pepsinolab.dev");

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
      <div>
        <BrandMark />
        <h1 className="display mt-8 text-5xl font-bold tracking-tight">
          Sign in to the Lab
        </h1>
        <p className="mt-3 max-w-md text-[var(--ink-soft)]">
          MVP demo auth — choose a student email or enter the mentor console.
          Google and SMS come later.
        </p>
      </div>

      <div className="surface p-6 md:p-8">
        <label className="block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
          placeholder="you@school.edu"
        />
        <div className="mt-5 flex flex-col gap-3">
          <Button
            onClick={() => {
              loginAsStudent(email);
              router.push("/student/dashboard");
            }}
          >
            Continue as Student
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              loginAsMentor();
              router.push("/mentor/dashboard");
            }}
          >
            Continue as Mentor
          </Button>
        </div>
        <p className="mt-6 text-sm text-[var(--ink-soft)]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[var(--brand-deep)]">
            Create a student account
          </Link>
        </p>
      </div>
    </div>
  );
}
