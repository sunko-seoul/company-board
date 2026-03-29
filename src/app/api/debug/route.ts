import { NextResponse } from "next/server";
import { getPosts } from "@/lib/api";

export async function GET() {
  const envVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("APPHUB") || key.startsWith("APP_") || key === "PORT") {
      envVars[key] = key.toLowerCase().includes("key")
        ? `${(value || "").substring(0, 12)}...`
        : value || "";
    }
  }

  let result: unknown = null;
  let error: string | null = null;
  try {
    result = await getPosts();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({ envVars, result, error });
}
