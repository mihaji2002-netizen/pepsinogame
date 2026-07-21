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
        <h1 className="display text-4xl font-bold">Digital ID Card</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Automatically generated. Premium design. Downloadable. Future wallet support.
        </p>
      </div>
      <div className="print-sheet">
        <IdCard student={currentStudent} />
      </div>
      <div className="no-print flex flex-wrap gap-3">
        <Button onClick={() => window.print()}>Download / Print PDF</Button>
        <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--ink-soft)]">
          Student ID never changes · Lab can change
        </div>
      </div>
    </div>
  );
}
