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
import { useApp } from "@/lib/store";
import { stagger, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/student/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/student/missions", label: "مأموریت‌ها", icon: Target },
  { href: "/student/logbook", label: "دفترچه", icon: BookOpen },
  { href: "/student/planner", label: "برنامه‌ریز", icon: CalendarDays },
  { href: "/student/id-card", label: "کارت شناسایی", icon: CreditCard },
  { href: "/student/leaderboard", label: "رتبه‌بندی", icon: Trophy },
  { href: "/student/profile", label: "پروفایل", icon: UserRound },
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

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="no-print surface sticky top-4 h-fit w-full shrink-0 p-4 md:w-64"
      >
        <BrandMark />
        <motion.nav
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-6 space-y-1"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname === `${href}/`;
            return (
              <motion.div key={href} variants={fadeUp}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-[var(--ink)] text-[var(--mint)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]",
                  )}
                >
                  <motion.span whileHover={{ scale: 1.15, rotate: -6 }}>
                    <Icon size={18} />
                  </motion.span>
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
        <Button
          variant="ghost"
          className="mt-6 w-full justify-start"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut size={16} />
          خروج
        </Button>
      </motion.aside>
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0 flex-1 pb-10"
      >
        {children}
      </motion.main>
    </div>
  );
}
