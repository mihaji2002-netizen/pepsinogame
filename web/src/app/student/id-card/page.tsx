"use client";

import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function IdCardPage() {
  const { currentStudent } = useApp();
  if (!currentStudent) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">کارت شناسایی دیجیتال</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          خودکار ساخته می‌شود. طراحی پریمیوم. قابل دانلود. پشتیبانی کیف پول در آینده.
        </p>
      </div>
      <div className="print-sheet">
        <IdCard student={currentStudent} />
      </div>
      <div className="no-print flex flex-wrap gap-3">
        <Button onClick={() => window.print()}>دانلود / چاپ PDF</Button>
        <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--ink-soft)]">
          شناسه دانش‌آموز ثابت است · لاب می‌تواند عوض شود
        </div>
      </div>
    </div>
  );
}
