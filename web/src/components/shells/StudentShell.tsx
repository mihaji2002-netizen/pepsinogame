"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/student/dashboard", label: "LAB SHEET", icon: LayoutDashboard },
  { href: "/student/missions", label: "MISSIONS", icon: Target },
  { href: "/student/logbook", label: "LOGBOOK", icon: BookOpen },
  { href: "/student/planner", label: "PLANNER", icon: CalendarDays },
  { href: "/student/id-card", label: "ID CARD", icon: CreditCard },
  { href: "/student/leaderboard", label: "LEGEND", icon: Trophy },
  { href: "/student/profile", label: "PROFILE", icon: UserRound },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, user, currentStudent, logout } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "student" || !currentStudent) {
      router.replace("/login");
      return;
    }
    if (!currentStudent.hasCompletedOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [hydrated, user, currentStudent, router, pathname]);

  if (!hydrated || !currentStudent) {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--ink-soft)]">
        در حال بارگذاری PEPSINO LAB…
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const isSheet = pathname.includes("/dashboard");

  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen flex-col gap-4 px-3 py-4 md:flex-row md:px-4",
        isSheet ? "max-w-[1400px]" : "max-w-7xl",
      )}
      style={{ ["--lab" as string]: lab.color, ["--lab-accent" as string]: lab.accent }}
    >
      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="no-print sticky top-3 h-fit w-full shrink-0 border border-black/10 bg-white p-3 md:w-52"
      >
        <BrandMark compact size={48} />
        <div className="mt-3 px-1 text-[10px] font-extrabold tracking-[0.14em]" style={{ color: lab.color }}>
          {lab.nameEn}
        </div>
        <nav className="mt-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname === `${href}/`;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 text-[11px] font-extrabold tracking-wide transition",
                  active ? "text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
                style={active ? { background: lab.color } : undefined}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start px-2 text-xs"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut size={14} />
          خروج
        </Button>
      </motion.aside>
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-w-0 flex-1 pb-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
