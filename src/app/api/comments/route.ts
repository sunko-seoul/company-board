import { createComment } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const comment = await createComment(body);
  return NextResponse.json(comment);
}
