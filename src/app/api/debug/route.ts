import { NextResponse } from "next/server";

export async function GET() {
  const envVars: Record<string, string> = {};

  // Collect all APPHUB_ environment variables (mask the API key)
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("APPHUB") || key.startsWith("APP_") || key === "DATABASE_URL" || key === "API_URL" || key === "PORT") {
      envVars[key] = key.toLowerCase().includes("key") || key.toLowerCase().includes("secret") || key.toLowerCase().includes("password")
        ? `${(value || "").substring(0, 8)}...`
        : value || "";
    }
  }

  // Try fetching the API
  const apiUrl = process.env.APPHUB_API_URL || "https://api.apphub.kr/v1";
  const apiKey = process.env.APPHUB_API_KEY || "";
  const slug = process.env.APPHUB_APP_SLUG || "company-board";

  let apiTest = "not tested";
  try {
    const res = await fetch(`${apiUrl}/apps/${slug}/tables/posts/records`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    apiTest = `${res.status} ${res.statusText} - ${await res.text().then(t => t.substring(0, 200))}`;
  } catch (e: unknown) {
    apiTest = `fetch error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    envVars,
    apiUrl,
    slug,
    hasApiKey: !!apiKey,
    apiTest,
  });
}
