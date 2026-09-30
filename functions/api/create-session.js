import { supabase, normalizeEmail } from "../_lib/supabase.js";

export async function onRequestPost(context) {
  try {
    const { email, score, total, catScore, catTotal } = await context.request.json();

    const normalized = normalizeEmail(email);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      return Response.json({ error: "E-mail inválido." }, { status: 400 });
    }

    if (!Number.isFinite(Number(score)) || !Number.isFinite(Number(total))) {
      return Response.json({ error: "Resultado inválido." }, { status: 400 });
    }

    const sessionId = crypto.randomUUID();

    await supabase(context, "quiz_sessions", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        id: sessionId,
        email: normalized,
        score: Number(score),
        total: Number(total),
        cat_score: catScore || {},
        cat_total: catTotal || {},
        paid: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    return Response.json({ sessionId });

  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Erro ao criar a sessão." },
      { status: 500 }
    );
  }
}
