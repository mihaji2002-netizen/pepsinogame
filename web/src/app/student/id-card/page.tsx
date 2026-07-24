"use client";

import { Download, ShieldCheck } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function IdCardPage() {
  const { currentStudent } = useApp();
  if (!currentStudent) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <div className="eyebrow">هویت دائمی</div>
        <h1 className="display mt-2 text-4xl">کارت شناسایی دیجیتال</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          به‌صورت خودکار از سطح و آزمایشگاه شما ساخته می‌شود. با لول‌آپ، آواتار و
          تم کارت عوض می‌شود — از نورو تا پیشگام.
        </p>
      </div>
      <div className="print-sheet">
        <IdCard student={currentStudent} />
      </div>
      <div className="no-print flex flex-wrap items-center gap-3">
        <Button onClick={() => window.print()}>
          <Download size={16} />
          دانلود / چاپ PDF
        </Button>
        <div className="chip">
          <ShieldCheck size={13} className="text-[var(--brand)]" />
          شناسه موضوعی هرگز تغییر نمی‌کند · آزمایشگاه با لول‌آپ عوض می‌شود
        </div>
      </div>
    </div>
  );
}
