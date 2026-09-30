export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function supabase(context, path, options = {}) {
  const base = String(context.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = context.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!base || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      ...(options.headers || {})
    }
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!response.ok) {
    const err = new Error(
      data?.message ||
      data?.error ||
      text ||
      `Supabase error ${response.status}`
    );

    err.status = response.status;
    throw err;
  }

  return data;
}
