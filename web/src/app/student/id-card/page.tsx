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
        <div className="eyebrow">Permanent identity</div>
        <h1 className="display mt-2 text-4xl font-bold">Digital ID Card</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Automatically generated. Premium design. Downloadable. Future wallet
          support.
        </p>
      </div>
      <div className="print-sheet">
        <IdCard student={currentStudent} />
      </div>
      <div className="no-print flex flex-wrap items-center gap-3">
        <Button onClick={() => window.print()}>
          <Download size={16} />
          Download / Print PDF
        </Button>
        <div className="chip">
          <ShieldCheck size={13} className="text-[var(--brand)]" />
          Student ID never changes · Lab can change
        </div>
      </div>
    </div>
  );
}
