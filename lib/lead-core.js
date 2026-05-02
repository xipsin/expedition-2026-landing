const REQUIRED_FIELDS = ["parentName", "phone", "childName", "childAge"];
const REQUEST_TIMEOUT_MS = 10000;
const BASE_SOURCE = "expedition-2026-landing";

function normalizeLead(raw = {}) {
  const lead = {};

  for (const field of REQUIRED_FIELDS) {
    const v = raw[field];
    lead[field] = v == null ? "" : String(v).trim();
  }

  return lead;
}

function validateLead(lead) {
  for (const field of REQUIRED_FIELDS) {
    if (!lead[field]) {
      return `Поле ${field} обязательно`;
    }
  }

  if (!/^\+?[0-9()\-\s]{10,}$/.test(lead.phone)) {
    return "Некорректный формат телефона";
  }

  if (!/^1[2-7]$/.test(lead.childAge)) {
    return "Некорректный возраст ребенка";
  }

  return null;
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

async function postJson(url, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 500)}`);
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    let data;
    try {
      data = JSON.parse(trimmed);
    } catch {
      return;
    }

    if (data.status === "error" || data.ok === false) {
      throw new Error(
        typeof data.message === "string" ? data.message : "Webhook returned error",
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * @param {Record<string, unknown>} payload
 * @param {Record<string, string | undefined>} env
 * @returns {Promise<{ statusCode: number, body: Record<string, unknown> }>}
 */
export async function handleLead(payload, env) {
  const primaryWebhook = env.LEADS_WEBHOOK_URL;
  const fallbackWebhook =
    env.LEADS_FALLBACK_WEBHOOK_URL ||
    env.LEADS_EMAIL_WEBHOOK_URL ||
    env.LEADS_SMS_WEBHOOK_URL;

  if (!primaryWebhook) {
    return {
      statusCode: 500,
      body: { ok: false, error: "LEADS_WEBHOOK_URL is not set" },
    };
  }

  const lead = normalizeLead(payload);
  const validationError = validateLead(lead);
  if (validationError) {
    return { statusCode: 400, body: { ok: false, error: validationError } };
  }

  const leadPayloadPrimary = {
    ...lead,
    source: BASE_SOURCE,
    submittedAt: new Date().toISOString(),
  };

  try {
    await postJson(primaryWebhook, leadPayloadPrimary);
    return { statusCode: 200, body: { ok: true, channel: "primary" } };
  } catch (primaryError) {
    console.error("Primary lead delivery failed", {
      error: primaryError instanceof Error ? primaryError.message : String(primaryError),
      phone: maskPhone(lead.phone),
    });

    if (!fallbackWebhook) {
      return { statusCode: 502, body: { ok: false, error: "Lead delivery failed" } };
    }

    try {
      await postJson(fallbackWebhook, {
        ...leadPayloadPrimary,
        source: `${BASE_SOURCE} · резерв`,
        fallback: true,
      });

      return { statusCode: 200, body: { ok: true, channel: "fallback" } };
    } catch (fallbackError) {
      console.error("Fallback lead delivery failed", {
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        phone: maskPhone(lead.phone),
      });
      return { statusCode: 502, body: { ok: false, error: "Lead delivery failed" } };
    }
  }
}
