import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads";
import { supabase } from "@/lib/supabase";

/* ─── Budget value → readable label ─── */
const BUDGET_LABELS: Record<string, string> = {
  "ate-500k": "Até R$ 500 mil",
  "500k-1m": "R$ 500 mil a R$ 1 milhão",
  "1m-1.5m": "R$ 1 milhão a R$ 1,5 milhão",
  "acima-1.5m": "Acima de R$ 1,5 milhão",
};

/* ─── Simple in-memory rate limiter (5 req/min per IP) ─── */
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000; // 1 min

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW
  );

  if (timestamps.length >= RATE_LIMIT) {
    rateMap.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

/* ─── POST handler ─── */
export async function POST(request: NextRequest) {
  // Rate limit
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Aguarde um momento." },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Payload inválido." },
      { status: 400 }
    );
  }

  // Validate with zod
  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: "Dados inválidos.", details: result.error.flatten() },
      { status: 422 }
    );
  }

  const data = result.data;

  // Build insert row
  const row: Record<string, unknown> = {
    source: data.source,
    name: data.name,
    email: data.email,
    phone: data.phone,
  };

  if (data.source === "formulario_contato") {
    row.message = data.message ?? null;
  }

  if (data.source === "modal_interesse") {
    row.motivation = data.motivation;
    row.budget = BUDGET_LABELS[data.budget] ?? data.budget;
  }

  // UTM params from referer or body (future-proof)
  const url = request.headers.get("referer");
  if (url) {
    try {
      const params = new URL(url).searchParams;
      if (params.get("utm_source")) row.utm_source = params.get("utm_source");
      if (params.get("utm_medium")) row.utm_medium = params.get("utm_medium");
      if (params.get("utm_campaign")) row.utm_campaign = params.get("utm_campaign");
    } catch {
      // ignore malformed referer
    }
  }

  // Insert into Supabase
  const { error } = await supabase.from("lp_leads").insert(row);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
