import { NextResponse } from "next/server";

export async function GET() {
  const envVars: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("APPHUB") || key.startsWith("APP_") || key === "DATABASE_URL" || key === "API_URL" || key === "PORT") {
      envVars[key] = key.toLowerCase().includes("key") || key.toLowerCase().includes("secret") || key.toLowerCase().includes("password")
        ? `${(value || "").substring(0, 8)}...`
        : value || "";
    }
  }

  const apiKey = process.env.APPHUB_API_KEY || "";
  const slug = "company-board";

  // Try multiple URL patterns to find the correct one
  const candidates = [
    `https://hub.jocodingax.ai/api/v1/apps/${slug}/tables/posts/records`,
    `https://hub.jocodingax.ai/api/v1/tables/posts/records`,
    `https://hub.jocodingax.ai/v1/apps/${slug}/tables/posts/records`,
    `https://hub.jocodingax.ai/apps/${slug}/tables/posts/records`,
    `https://hub.jocodingax.ai/api/apps/${slug}/tables/posts/records`,
  ];

  const results: Record<string, string> = {};
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const body = await res.text();
      results[url] = `${res.status} - ${body.substring(0, 150)}`;
    } catch (e: unknown) {
      results[url] = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json({ envVars, hasApiKey: !!apiKey, results });
}
