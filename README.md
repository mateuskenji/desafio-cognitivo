# Desafio Cognitivo — Cloudflare Pages + Lastlink

Projeto adaptado para Cloudflare Pages Functions. O domínio pode ser `desafiocognitivo.com.br`.

## Estrutura
- `index.html` — teste
- `obrigado.html` — retorno pós-pagamento
- `functions/api/create-session.js` — cria sessão
- `functions/api/check-session.js` — consulta sessão
- `functions/api/lastlink-webhook.js` — recebe confirmação Lastlink
- `supabase.sql` — tabela do banco

## Variáveis no Cloudflare
Em Pages > Settings > Variables and Secrets, crie: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Deploy
Use Cloudflare Pages com integração Git. A pasta `functions/` será publicada como Pages Functions.

## Lastlink
Webhook: `https://desafiocognitivo.com.br/api/lastlink-webhook`
Evento principal: `Purchase_Order_Confirmed`.
Página de obrigado: `https://desafiocognitivo.com.br/obrigado.html`

A chave service role do Supabase deve ficar somente no servidor/Cloudflare, nunca no HTML.
