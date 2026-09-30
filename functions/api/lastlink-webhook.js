import { supabase, normalizeEmail } from "../_lib/supabase.js";

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    // Aceita somente compras realmente confirmadas
    if (payload?.Event !== "Purchase_Order_Confirmed") {
      return Response.json({
        ok: true,
        ignored: true
      });
    }

    // Eventos de teste da Lastlink não liberam resultado
    if (payload?.IsTest === true) {
      return Response.json({
        ok: true,
        test: true
      });
    }

    const data = payload?.Data || {};

    const sessionId = String(
      data?.Utm?.UtmContent || ""
    ).trim();

    const buyerEmail = normalizeEmail(
      data?.Buyer?.Email || ""
    );

    const paymentId = String(
      data?.Purchase?.PaymentId || ""
    ).trim();

    if (!sessionId || !buyerEmail || !paymentId) {
      return Response.json(
        {
          error: "Dados obrigatórios ausentes."
        },
        { status: 400 }
      );
    }

    // Localiza a sessão criada quando o teste foi concluído
    const sessionResponse = await supabase(
      context,
      `quiz_sessions?id=eq.${encodeURIComponent(sessionId)}&select=id,email,paid`,
      {
        method: "GET"
      }
    );

    if (!sessionResponse.ok) {
      throw new Error("Não foi possível consultar a sessão.");
    }

    const rows = await sessionResponse.json();

    if (!rows || rows.length === 0) {
      return Response.json(
        {
          error: "Sessão não encontrada."
        },
        { status: 404 }
      );
    }

    const session = rows[0];

    // Confirma que o e-mail do pagamento pertence à sessão
    if (normalizeEmail(session.email) !== buyerEmail) {
      return Response.json(
        {
          error: "E-mail do comprador não corresponde à sessão."
        },
        { status: 403 }
      );
    }

    // Libera o resultado
    const updateResponse = await supabase(
      context,
      `quiz_sessions?id=eq.${encodeURIComponent(sessionId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          paid: true,
          payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Não foi possível liberar o resultado.");
    }

    return Response.json({
      ok: true,
      sessionId,
      paid: true
    });
  } catch (e) {
    console.error(e);

    return Response.json(
      {
        error: "Erro ao processar o webhook."
      },
      { status: 500 }
    );
  }
}
