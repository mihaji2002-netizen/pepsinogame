import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { createEmptyProgram } from "@/lib/program/defaults";
import {
  deleteWeeklyProgram,
  getWeeklyProgram,
  listWeeklyPrograms,
  upsertWeeklyProgram,
} from "@/lib/program/program-service";
import type { WeeklyProgram } from "@/lib/program/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const program = getWeeklyProgram(id);
    if (!program) {
      return NextResponse.json({ error: "برنامه یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ program });
  }

  const programs = listWeeklyPrograms();
  return NextResponse.json({ programs });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const program = (body.program ?? createEmptyProgram(body.name)) as WeeklyProgram;
    const saved = upsertWeeklyProgram(program);
    return NextResponse.json({ program: saved });
  } catch {
    return NextResponse.json({ error: "خطا در ذخیره برنامه" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "شناسه برنامه الزامی است" }, { status: 400 });
  }
  deleteWeeklyProgram(id);
  return NextResponse.json({ success: true });
}
