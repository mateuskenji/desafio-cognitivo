export async function onRequestPost() {
  return new Response(
    JSON.stringify({ ok: true, message: "Webhook endpoint ativo" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
