-- Supabase SQL Editor
-- Crie esta tabela antes de publicar o projeto.

create table if not exists public.quiz_sessions (
  id uuid primary key,
  email text not null,
  score integer not null,
  total integer not null,
  cat_score jsonb not null default '{}'::jsonb,
  cat_total jsonb not null default '{}'::jsonb,
  paid boolean not null default false,
  payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quiz_sessions_email_idx
  on public.quiz_sessions (email, created_at desc);

create index if not exists quiz_sessions_payment_idx
  on public.quiz_sessions (payment_id);

-- A API usa a service role key no servidor. O navegador NÃO recebe essa chave.
alter table public.quiz_sessions enable row level security;

-- Não crie policies públicas para esta tabela.
