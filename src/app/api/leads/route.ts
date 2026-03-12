import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/leads";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/* ─── Budget value → readable label ─── */
const BUDGET_LABELS: Record<string, string> = {
  "ate-500k": "Até R$ 500 mil",
  "500k-1m": "R$ 500 mil a R$ 1 milhão",
  "1m-1.5m": "R$ 1 milhão a R$ 1,5 milhão",
  "acima-1.5m": "Acima de R$ 1,5 milhão",
};

/* ─── Telegram notification ─── */
async function notifyTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    }
  );
}

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

  // Send email notification (awaited — serverless kills unawaited promises)
  try {
    await resend.emails.send({
      from: "use.moema Leads <onboarding@resend.dev>",
      to: "joaomendesranauro@gmail.com",
      subject: `Novo lead: ${data.name} — ${data.source === "modal_interesse" ? "Modal Interesse" : "Formulário Contato"}`,
      html: `
        <h2>Novo lead capturado — use.moema</h2>
        <table style="border-collapse:collapse;font-family:sans-serif">
          <tr><td style="padding:6px 12px;font-weight:bold">Nome</td><td style="padding:6px 12px">${data.name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${data.email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Telefone</td><td style="padding:6px 12px">${data.phone ?? "—"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Fonte</td><td style="padding:6px 12px">${data.source}</td></tr>
          ${data.source === "modal_interesse" ? `
          <tr><td style="padding:6px 12px;font-weight:bold">Motivação</td><td style="padding:6px 12px">${(data.motivation ?? []).join(", ")}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Orçamento</td><td style="padding:6px 12px">${BUDGET_LABELS[data.budget] ?? data.budget}</td></tr>
          ` : ""}
          ${data.source === "formulario_contato" && data.message ? `
          <tr><td style="padding:6px 12px;font-weight:bold">Mensagem</td><td style="padding:6px 12px">${data.message}</td></tr>
          ` : ""}
          ${row.utm_source ? `<tr><td style="padding:6px 12px;font-weight:bold">UTM</td><td style="padding:6px 12px">${row.utm_source} / ${row.utm_medium ?? ""} / ${row.utm_campaign ?? ""}</td></tr>` : ""}
        </table>
        <p style="color:#999;font-size:12px;margin-top:16px">Enviado automaticamente por usemoema.com.br</p>
      `,
    });

    await notifyTelegram(
      `<b>🔔 Novo Lead — use.moema</b>\n\n` +
        `<b>Nome:</b> ${data.name}\n` +
        `<b>Email:</b> ${data.email}\n` +
        `<b>Tel:</b> ${data.phone ?? "—"}\n` +
        `<b>Fonte:</b> ${data.source}\n` +
        (data.source === "modal_interesse"
          ? `<b>Motivação:</b> ${(data.motivation ?? []).join(", ")}\n<b>Orçamento:</b> ${BUDGET_LABELS[data.budget] ?? data.budget}\n`
          : "") +
        (data.source === "formulario_contato" && data.message
          ? `<b>Mensagem:</b> ${data.message}\n`
          : "")
    );
  } catch (err) {
    console.error("Resend email error:", err);
  }

  return NextResponse.json({ success: true });
}
