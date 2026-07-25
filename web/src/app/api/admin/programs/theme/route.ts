import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { getSubjectTheme } from "@/lib/program/program-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const name = request.nextUrl.searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "نام درس الزامی است" }, { status: 400 });
  }

  const theme = getSubjectTheme(name);
  if (!theme) {
    return NextResponse.json({ theme: null });
  }

  return NextResponse.json({ theme });
}
