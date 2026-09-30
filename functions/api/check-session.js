import { supabase } from "../_lib/supabase.js";

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return Response.json(
        { error: "sessionId obrigatório." },
        { status: 400 }
      );
    }

    const response = await supabase(
      context,
      `quiz_sessions?id=eq.${encodeURIComponent(sessionId)}&select=id,email,score,total,cat_score,cat_total,paid`,
      {
        method: "GET"
      }
    );

    const rows = await response.json();

    if (!rows || rows.length === 0) {
      return Response.json(
        { error: "Sessão não encontrada." },
        { status: 404 }
      );
    }

    const session = rows[0];

    return Response.json({
      sessionId: session.id,
      paid: Boolean(session.paid),
      score: session.paid ? session.score : null,
      total: session.paid ? session.total : null,
      catScore: session.paid ? session.cat_score : null,
      catTotal: session.paid ? session.cat_total : null
    });

  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Erro ao consultar a sessão." },
      { status: 500 }
    );
  }
}
