"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/mentor/dashboard", label: "مرکز فرمان", icon: LayoutDashboard },
  { href: "/mentor/attendance", label: "حضور و غیاب", icon: ClipboardList },
  { href: "/mentor/exams", label: "آزمون‌ها", icon: GraduationCap },
  { href: "/mentor/reports", label: "گزارش‌ها", icon: FileText },
];

export function MentorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, user, logout, students } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "mentor") router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== "mentor") {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--ink-soft)]">
        در حال بارگذاری کنسول منتور…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
      <aside className="no-print surface sticky top-4 h-fit w-full shrink-0 p-4 md:w-72">
        <BrandMark />
        <div className="mt-5 rounded-2xl bg-[var(--paper-deep)] p-3 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <Users size={16} />
            فهرست فعال
          </div>
          <div className="mt-1 text-[var(--ink-soft)]">{students.length} دانش‌آموز</div>
        </div>
        <nav className="mt-6 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[var(--ink)] text-white"
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
