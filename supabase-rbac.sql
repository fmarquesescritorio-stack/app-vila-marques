-- Tabela de permissões por usuário para o app Vila Marques
-- Execute no SQL Editor do Supabase (projeto de produção).

create table if not exists public.app_user_permissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  role_category text not null default 'funcionario' check (role_category in ('administrador', 'funcionario')),

  access_proposals boolean not null default true,
  access_clients boolean not null default true,
  access_employees boolean not null default true,
  access_payslip boolean not null default false,
  access_balance boolean not null default true,
  access_contracts boolean not null default false,
  access_exports boolean not null default false,

  edit_clients boolean not null default false,
  edit_employees boolean not null default false,
  edit_contracts boolean not null default false,

  export_proposal boolean not null default true,
  export_payslip boolean not null default false,
  sync_exports boolean not null default false,
  view_financial_values boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migração segura para bases já existentes:
alter table public.app_user_permissions
  add column if not exists role_category text not null default 'funcionario';

alter table public.app_user_permissions
  add column if not exists view_financial_values boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'app_user_permissions_role_category_check'
  ) then
    alter table public.app_user_permissions
      add constraint app_user_permissions_role_category_check
      check (role_category in ('administrador', 'funcionario'));
  end if;
end;
$$;

create or replace function public.touch_app_user_permissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_app_user_permissions_updated_at on public.app_user_permissions;
create trigger trg_touch_app_user_permissions_updated_at
before update on public.app_user_permissions
for each row
execute procedure public.touch_app_user_permissions_updated_at();

alter table public.app_user_permissions enable row level security;

-- Usuário vê apenas suas próprias permissões.
drop policy if exists app_user_permissions_select_own on public.app_user_permissions;
create policy app_user_permissions_select_own
on public.app_user_permissions
for select
using (auth.uid() = user_id);

-- Admin do app (is_admin=true) pode inserir/editar/apagar qualquer linha.
drop policy if exists app_user_permissions_admin_all on public.app_user_permissions;
create policy app_user_permissions_admin_all
on public.app_user_permissions
for all
using (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);

-- Exemplo 1: categoria Administrador (tarjeta vermelha)
-- insert into public.app_user_permissions (
--   user_id, is_admin, role_category, access_proposals, access_clients, access_employees, access_payslip, access_balance, access_contracts, access_exports, edit_clients, edit_employees, edit_contracts, export_proposal, export_payslip, sync_exports, view_financial_values
-- ) values (
--   '00000000-0000-0000-0000-000000000000', true, 'administrador', true, true, true, true, true, true, true, true, true, true, true, true, true, true
-- )
-- on conflict (user_id) do update set
--   is_admin = excluded.is_admin,
--   role_category = excluded.role_category,
--   access_proposals = excluded.access_proposals,
--   access_clients = excluded.access_clients,
--   access_employees = excluded.access_employees,
--   access_payslip = excluded.access_payslip,
--   access_balance = excluded.access_balance,
--   access_contracts = excluded.access_contracts,
--   access_exports = excluded.access_exports,
--   edit_clients = excluded.edit_clients,
--   edit_employees = excluded.edit_employees,
--   edit_contracts = excluded.edit_contracts,
--   export_proposal = excluded.export_proposal,
--   export_payslip = excluded.export_payslip,
--   sync_exports = excluded.sync_exports,
--   view_financial_values = excluded.view_financial_values;

-- Exemplo 2: categoria Funcionário (tarjeta amarela)
-- Regras:
-- - sem acesso a Contra-cheque, Contratos, Imóveis Alugados e Exportados
-- - sem edição de Clientes e Funcionários
-- - pode acessar Balanço e lançar custos
-- - sem visualização de valores financeiros (blur no frontend)
-- insert into public.app_user_permissions (
--   user_id, is_admin, role_category, access_proposals, access_clients, access_employees, access_payslip, access_balance, access_contracts, access_exports, edit_clients, edit_employees, edit_contracts, export_proposal, export_payslip, sync_exports, view_financial_values
-- ) values (
--   '11111111-1111-1111-1111-111111111111', false, 'funcionario', true, true, true, false, true, false, false, false, false, false, true, false, false, false
-- )
-- on conflict (user_id) do update set
--   is_admin = excluded.is_admin,
--   role_category = excluded.role_category,
--   access_proposals = excluded.access_proposals,
--   access_clients = excluded.access_clients,
--   access_employees = excluded.access_employees,
--   access_payslip = excluded.access_payslip,
--   access_balance = excluded.access_balance,
--   access_contracts = excluded.access_contracts,
--   access_exports = excluded.access_exports,
--   edit_clients = excluded.edit_clients,
--   edit_employees = excluded.edit_employees,
--   edit_contracts = excluded.edit_contracts,
--   export_proposal = excluded.export_proposal,
--   export_payslip = excluded.export_payslip,
--   sync_exports = excluded.sync_exports,
--   view_financial_values = excluded.view_financial_values;

-- =========================================================
-- Auditoria de ações (quem fez, quando fez, e o que mudou)
-- =========================================================

create table if not exists public.app_audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  action text not null,
  module text not null,
  entity_type text not null,
  entity_id text,
  description text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_app_audit_logs_user_id on public.app_audit_logs(user_id);
create index if not exists idx_app_audit_logs_occurred_at on public.app_audit_logs(occurred_at desc);
create index if not exists idx_app_audit_logs_module on public.app_audit_logs(module);
create index if not exists idx_app_audit_logs_entity on public.app_audit_logs(entity_type, entity_id);

alter table public.app_audit_logs enable row level security;

-- Usuário autenticado só pode inserir log para si mesmo.
drop policy if exists app_audit_logs_insert_own on public.app_audit_logs;
create policy app_audit_logs_insert_own
on public.app_audit_logs
for insert
with check (auth.uid() = user_id);

-- Usuário pode consultar seus próprios logs.
drop policy if exists app_audit_logs_select_own on public.app_audit_logs;
create policy app_audit_logs_select_own
on public.app_audit_logs
for select
using (auth.uid() = user_id);

-- Admin do app pode consultar todos os logs.
drop policy if exists app_audit_logs_select_admin on public.app_audit_logs;
create policy app_audit_logs_select_admin
on public.app_audit_logs
for select
using (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);

-- =========================================================
-- Estado do app (persistência principal em nuvem por usuário)
-- =========================================================

create table if not exists public.app_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_app_user_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_app_user_state_updated_at on public.app_user_state;
create trigger trg_touch_app_user_state_updated_at
before update on public.app_user_state
for each row
execute procedure public.touch_app_user_state_updated_at();

alter table public.app_user_state enable row level security;

drop policy if exists app_user_state_select_own on public.app_user_state;
create policy app_user_state_select_own
on public.app_user_state
for select
using (auth.uid() = user_id);

drop policy if exists app_user_state_insert_own on public.app_user_state;
create policy app_user_state_insert_own
on public.app_user_state
for insert
with check (auth.uid() = user_id);

drop policy if exists app_user_state_update_own on public.app_user_state;
create policy app_user_state_update_own
on public.app_user_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists app_user_state_delete_own on public.app_user_state;
create policy app_user_state_delete_own
on public.app_user_state
for delete
using (auth.uid() = user_id);

-- =========================================================
-- Estado compartilhado do app (todos os módulos em nuvem)
-- =========================================================
-- Observação:
-- - Esta é a persistência principal usada pelo app para compartilhar
--   dados entre usuários/dispositivos.
-- - app_user_state permanece como legado.

create table if not exists public.app_shared_state (
  singleton_id text primary key,
  state_data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_app_shared_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_app_shared_state_updated_at on public.app_shared_state;
create trigger trg_touch_app_shared_state_updated_at
before update on public.app_shared_state
for each row
execute procedure public.touch_app_shared_state_updated_at();

alter table public.app_shared_state enable row level security;

-- Todos os usuários autenticados do sistema podem ler o estado compartilhado.
drop policy if exists app_shared_state_select_authenticated on public.app_shared_state;
create policy app_shared_state_select_authenticated
on public.app_shared_state
for select
using (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem inserir o registro singleton.
drop policy if exists app_shared_state_insert_authenticated on public.app_shared_state;
create policy app_shared_state_insert_authenticated
on public.app_shared_state
for insert
with check (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem atualizar o estado compartilhado.
drop policy if exists app_shared_state_update_authenticated on public.app_shared_state;
create policy app_shared_state_update_authenticated
on public.app_shared_state
for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.app_shared_state (singleton_id, state_data)
values ('global', '{}'::jsonb)
on conflict (singleton_id) do nothing;

-- =========================================================
-- Exportados compartilhados entre usuários da empresa
-- =========================================================

create table if not exists public.app_shared_exports (
  export_id text primary key,
  type text not null check (type in ('proposal', 'payslip')),
  exported_at timestamptz not null default now(),
  proposal_number text,
  company_name text,
  snapshot jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_app_shared_exports_exported_at on public.app_shared_exports(exported_at desc);
create index if not exists idx_app_shared_exports_created_by on public.app_shared_exports(created_by);

create or replace function public.touch_app_shared_exports_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_app_shared_exports_updated_at on public.app_shared_exports;
create trigger trg_touch_app_shared_exports_updated_at
before update on public.app_shared_exports
for each row
execute procedure public.touch_app_shared_exports_updated_at();

alter table public.app_shared_exports enable row level security;

-- Usuários autenticados podem visualizar os exportados compartilhados.
drop policy if exists app_shared_exports_select_authenticated on public.app_shared_exports;
create policy app_shared_exports_select_authenticated
on public.app_shared_exports
for select
using (auth.role() = 'authenticated');

-- Quem criou pode inserir/atualizar/apagar seus registros.
drop policy if exists app_shared_exports_insert_own on public.app_shared_exports;
create policy app_shared_exports_insert_own
on public.app_shared_exports
for insert
with check (auth.uid() = created_by);

drop policy if exists app_shared_exports_update_own on public.app_shared_exports;
create policy app_shared_exports_update_own
on public.app_shared_exports
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists app_shared_exports_delete_own on public.app_shared_exports;
create policy app_shared_exports_delete_own
on public.app_shared_exports
for delete
using (auth.uid() = created_by);

-- Admin do app pode atualizar/apagar qualquer exportado compartilhado.
drop policy if exists app_shared_exports_admin_update on public.app_shared_exports;
create policy app_shared_exports_admin_update
on public.app_shared_exports
for update
using (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists app_shared_exports_admin_delete on public.app_shared_exports;
create policy app_shared_exports_admin_delete
on public.app_shared_exports
for delete
using (
  exists (
    select 1
    from public.app_user_permissions p
    where p.user_id = auth.uid()
      and p.is_admin = true
  )
);
