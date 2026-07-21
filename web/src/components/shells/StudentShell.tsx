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
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
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
      <aside className="no-print surface sticky top-4 h-fit w-full shrink-0 p-4 md:w-64">
        <BrandMark />
        <nav className="mt-6 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname === `${href}/`;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[var(--brand)] text-white"
                    : "text-[var(--ink-soft)] hover:bg-white/70",
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
