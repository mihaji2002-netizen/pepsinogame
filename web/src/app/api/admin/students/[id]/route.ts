import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import {
  adjustStudentRewards,
  getStudentAdminDetail,
} from "@/lib/exam/pepsino-students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await context.params;
  const detail = getStudentAdminDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "دانش‌آموز یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const xpDelta = Number(body.xp_delta ?? 0);
    const coinsDelta = Number(body.coins_delta ?? 0);
    const reason = typeof body.reason === "string" ? body.reason : undefined;

    if (!Number.isFinite(xpDelta) || !Number.isFinite(coinsDelta)) {
      return NextResponse.json({ error: "مقادیر نامعتبر" }, { status: 400 });
    }

    const student = adjustStudentRewards(id, xpDelta, coinsDelta, reason);
    if (!student) {
      return NextResponse.json({ error: "دانش‌آموز یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch {
    return NextResponse.json({ error: "خطا در به‌روزرسانی" }, { status: 500 });
  }
}
