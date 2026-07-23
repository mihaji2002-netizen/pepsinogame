"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Target,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { LABS } from "@/lib/constants";
import { fa } from "@/lib/fa";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/student/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/student/missions", label: "ماموریت‌ها", icon: Target },
  { href: "/student/logbook", label: "دفترچه", icon: BookOpen },
  { href: "/student/planner", label: "برنامه هفتگی", icon: CalendarDays },
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
        {fa.loading.app}
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
      <aside className="no-print glass sticky top-4 z-30 h-fit w-full shrink-0 rounded-[20px] p-4 md:w-64">
        <BrandMark />

        {/* Identity strip */}
        <div
          className="mt-5 rounded-2xl border p-3.5"
          style={{
            borderColor: `${lab.color}33`,
            background: `linear-gradient(150deg, ${lab.color}14, transparent 70%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl border text-sm font-bold"
              style={{
                color: lab.color,
                borderColor: `${lab.color}55`,
                background: `${lab.color}14`,
              }}
            >
              {currentStudent.avatar}
            </div>
            <div className="min-w-0">
              <div className="mono truncate text-sm font-bold">
                {currentStudent.studentId}
              </div>
              <div className="truncate text-[10px] text-[var(--ink-faint)]">
                {lab.nameEn}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span style={{ color: lab.color }} className="font-bold">
              {lab.name} · سطح {currentStudent.level}
            </span>
            <span className="mono flex items-center gap-1 text-[var(--ink-soft)]">
              <Zap size={11} className="text-[var(--brand)]" />
              {currentStudent.xp}
            </span>
          </div>
        </div>

        <nav className="mt-5 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[var(--brand)] font-bold text-[var(--brand-ink)] shadow-[0_8px_24px_rgba(80,200,120,0.3)]"
                    : "text-[var(--ink-soft)] hover:bg-[rgba(80,200,120,0.08)] hover:text-[var(--ink)]",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
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
      </aside>
      <main className="min-w-0 flex-1 pb-10">{children}</main>
    </div>
  );
}
