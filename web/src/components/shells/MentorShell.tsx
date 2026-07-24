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
  ClipboardCheck,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { fa } from "@/lib/fa";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/mentor/dashboard", label: "مرکز فرماندهی", icon: LayoutDashboard },
  { href: "/mentor/attendance", label: "حضور و غیاب", icon: ClipboardList },
  { href: "/mentor/exams", label: "آزمون‌ها", icon: GraduationCap },
  { href: "/admin", label: "برگزاری آزمون", icon: ClipboardCheck },
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
        {fa.loading.mentor}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
      <aside className="no-print glass sticky top-4 z-30 h-fit w-full shrink-0 rounded-[20px] p-4 md:w-72">
        <BrandMark />
        <div className="surface-flat mt-5 p-3.5 text-sm">
          <div className="flex items-center gap-2 font-bold">
            <Users size={15} className="text-[var(--accent)]" />
            فهرست فعال
          </div>
          <div className="mono mt-1.5 text-xs text-[var(--ink-soft)]">
            {students.length} دانش‌آموز · فصل ۲۶
          </div>
        </div>
        <nav className="mt-5 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[var(--accent)] font-bold text-[#2b1c02] shadow-[0_8px_24px_rgba(242,181,68,0.28)]"
                    : "text-[var(--ink-soft)] hover:bg-[rgba(var(--brand-rgb),0.08)] hover:text-[var(--ink)]",
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
