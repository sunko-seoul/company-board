import { createPost } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await createPost(body);
  return NextResponse.json(post);
}
