import { handleLead } from "../lib/lead-core.js";

function jsonResponse(statusCode, payload) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method Not Allowed" });
  }

  const env = globalThis?.process?.env ?? {};

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid JSON body" });
  }

  const result = await handleLead(payload, env);
  return jsonResponse(result.statusCode, result.body);
}
