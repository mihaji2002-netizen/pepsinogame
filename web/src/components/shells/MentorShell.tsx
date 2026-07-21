"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
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
import { fadeUp, stagger } from "@/lib/motion";
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
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="no-print surface sticky top-4 h-fit w-full shrink-0 p-4 md:w-72"
      >
        <BrandMark />
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-5 bg-[var(--ink)] p-3 text-sm text-white"
        >
          <div className="flex items-center gap-2 font-semibold text-[var(--mint)]">
            <Users size={16} />
            فهرست فعال
          </div>
          <div className="mt-1 text-white/60">{students.length} دانش‌آموز</div>
        </motion.div>
        <motion.nav
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-6 space-y-1"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
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
                  <Icon size={18} />
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
