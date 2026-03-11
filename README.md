# App Web - Propostas para Alojamentos Corporativos

Aplicação web em HTML/CSS/JS puro para geração de propostas comerciais da Vila Marques Alojamentos.

## Recursos

- Tela de login com:
  - login por e-mail/senha
  - cadastro
  - recuperação de senha por e-mail
  - redefinição de senha
  - login local de teste sem Supabase (`teste` / `teste`)
- Cadastro de empresa cliente
- Cadastro completo de imóvel
- Cadastro de mobília com:
  - catálogo padrão opcional
  - ambiente por item (cozinha, sala, banheiro etc.)
  - quantidade por item
- Cálculo comercial automático com base em:
  - diária por pessoa
  - quantidade de pessoas
  - margem, taxa administrativa e desconto
- Documento final formatado para impressão/PDF
- Módulo de propostas em etapas (passo a passo)
- Separação por abas: `Propostas Comerciais` e `Contra-cheque`
- Módulo de contra-cheque com:
  - cadastro de funcionário
  - proventos e descontos
  - cálculo de líquido
  - exportação A4 com 2 vias por folha (empresa e funcionário)
- Layout responsivo para desktop e mobile
- Persistência local com `localStorage`
- Persistência em nuvem por usuário no Supabase (`app_user_state`) com sincronização automática
- Aba `Exportados` para reabrir/editar documentos já exportados
- Importação de despesas em lote no balanço

## Autenticação (Supabase)

1. Crie um projeto no Supabase.
2. Em `Project Settings > API`, copie:
   - `Project URL`
   - `anon public key`
3. Abra o app e preencha esses dados na tela de login.
4. Use as abas `Login`, `Cadastro` e `Recuperar senha`.

Observação:
- O app só libera as telas principais após login válido.
- A recuperação de senha usa e-mail de reset do Supabase.
- O cadastro público pode ficar desativado para segurança.

## Permissões de Usuário (RBAC)

Este projeto suporta permissões por usuário via tabela `public.app_user_permissions`.

1. No Supabase, abra o `SQL Editor`.
2. Execute o arquivo:

```sql
-- arquivo no projeto:
-- app-web/supabase-rbac.sql
```

3. Crie usuários em `Authentication > Users` (ou via API).
4. Para cada usuário, insira/atualize uma linha em `app_user_permissions`.

Permissões principais:
- `access_balance`: pode entrar no módulo Balanço
- `edit_clients`: pode criar/editar/apagar clientes
- `edit_employees`: pode criar/editar/apagar funcionários
- `edit_contracts`: pode criar/editar/apagar contratos e marcar pagamento
- `export_payslip`: pode exportar contra-cheque
- `is_admin`: acesso total
- `role_category`: categoria visual/operacional (`administrador` ou `funcionario`)
- `view_financial_values`: controle de visualização de valores financeiros (blur quando `false`)

### Categorias suportadas

- `Administrador` (tarjeta vermelha):
  - acesso total a todos os módulos e funções
  - visualiza valores financeiros sem blur
- `Funcionário` (tarjeta amarela):
  - pode acessar: Propostas, Clientes, Funcionários e Balanço
  - não pode acessar: Contra-cheque, Contratos, Imóveis Alugados e Exportados
  - não pode editar: Clientes e Funcionários
  - não pode alterar blur nem visualizar valores do Balanço
  - pode lançar custos no Balanço

## Auditoria de ações (Supabase)

Quando autenticado via Supabase, o app registra trilha de auditoria na tabela `public.app_audit_logs`, incluindo:
- usuário (`user_id`, `user_email`)
- ação (criação, edição, exclusão, exportação, marcação de pagamento)
- data/hora (`occurred_at`)
- dados antes/depois da alteração (quando aplicável)

Para habilitar, execute também o mesmo arquivo SQL `app-web/supabase-rbac.sql`, que já inclui a criação da tabela e políticas de acesso.

## Persistência em nuvem (multi-dispositivo)

Com Supabase configurado e usuário autenticado:
- o app carrega o estado salvo em `public.app_user_state` no login;
- salva automaticamente alterações do sistema na nuvem (debounce);
- mantém fallback local no navegador para operação offline temporária.

Isso permite acessar os mesmos dados em qualquer dispositivo usando o mesmo login.

## Importação de despesas em lote

Na aba `Balanço`, use o bloco `Importar despesas em lote`.

Formato de cada linha:

```txt
descricao;valor;data-hora(AAAA-MM-DDTHH:mm);responsavel
```

Exemplo:

```txt
Combustível;350.90;2026-03-10T08:30;Fred Marques
Pedágio;45.00;2026-03-10T09:10;Fred Marques
```

## Como executar localmente

1. Abra o arquivo `src/index.html` em um navegador.
2. Ou sirva a pasta `src/` com um servidor local.

Exemplo com Python:

```bash
cd app-web/src
python3 -m http.server 5500
```

Acesse: `http://localhost:5500`

## Deploy

Este projeto já está pronto para deploy estático:

- Netlify: usa `netlify.toml` (publica `src/`)
- Vercel: usa `vercel.json`

### Netlify

1. Crie um novo site no Netlify conectado ao seu repositório.
2. Build command: deixe vazio.
3. Publish directory: `src`.
4. Deploy.

### Vercel

1. Importe o repositório no Vercel.
2. Framework Preset: `Other`.
3. Build command: vazio.
4. Output directory: `src`.
5. Deploy.

## Deploy contínuo sem perder dados

- Código: GitHub + Vercel (deploy automático a cada `push`).
- Dados: Supabase (`app_user_state`, `app_user_permissions`, `app_audit_logs`).
- Resultado: você pode atualizar o deploy em tempo real sem perder contratos, clientes, balanço e demais registros.

## Evolução para app iOS

Caminho recomendado:
1. Publicar web app estável (Vercel + Supabase).
2. Transformar em PWA (manifest + service worker).
3. Embalar com Capacitor para iOS quando quiser publicar na App Store.

## Estrutura

- `src/index.html` - Estrutura da aplicação
- `src/styles.css` - Estilos
- `src/app.js` - Lógica principal
- `netlify.toml` - Configuração de deploy Netlify
- `vercel.json` - Configuração de deploy Vercel

## Próximos passos sugeridos

- Migrar para React + backend (Node/Nest ou Django)
- Autenticação e multiusuário
- Catálogo de imóveis com fotos em storage
- Geração de PDF em backend (com layout fixo)
- CRM de propostas (pipeline comercial)
