# Dashboard Unification Audit - Jarvis Command Center v2

**Data:** 11 Fevereiro 2026  
**Auditor:** Subagent Dashboard-Unification  
**Status:** Auditoria Completa ✅

---

## Sumário Executivo

Existem **5 dashboards espalhados** que necessitam unificação:

| Dashboard | Ficheiro | Design | Dados | Actualização | Prioridade |
|-----------|----------|--------|-------|--------------|-----------|
| **Jarvis v1** | `index.html` (Vercel) | ⭐⭐⭐⭐⭐ Dark slate profissional | Estática/Mockada | Manual | 🎯 Base |
| **Jira Kanban** | `jira-kanban.html` | ⭐⭐⭐⭐ Jira blue style | Dinâmica (embedded JSON) | Manual | 🥇 Include |
| **GitHub Dashboard** | `github-repos-dashboard.html` | ⭐⭐⭐⭐ GitHub dark | Dinâmica (embedded JSON) | Manual | 🥇 Include |
| **Project Dashboard v2** | `project-dashboard-v2.html` | ⭐⭐⭐⭐ Custom gradient | Estática/Mockada | Manual | 🥈 Opcional |
| **Kanban Projects** | `kanban-projects.html` | ⭐⭐⭐⭐ Custom gradient | Dinâmica (JSON) | Manual | 🥈 Opcional |

**Recomendação:** Usar **Jarvis v1 como base** (melhor design) e integrar Jira + GitHub como tabs/abas.

---

## 1️⃣ JARVIS COMMAND CENTER v1 (Vercel)

### Localização
- **HTML:** `~/clawd/projects/jarvis-dashboard/public/index.html`
- **URL Vercel:** https://jarvis.aiparati.pt (ou similar)
- **Tamanho:** ~18KB

### Design & Estilo
- **Tema:** Dark Slate profissional
- **Paleta CSS Variables:**
  ```
  --bg-primary: #0F172A (dark slate)
  --bg-surface: #1E293B
  --bg-elevated: #334155
  --accent: #38BDF8 (cyan/blue)
  --purple: #A78BFA
  --success: #4ADE80
  --warning: #FBBF24
  --danger: #F87171
  ```
- **Layout:** Bento Grid (4 colunas responsivo)
- **Tipografia:** Inter (Google Fonts)
- **Animações:** Pulso, fade-in, count-up (suaves)

### Estrutura de Dados (Mockada)
```javascript
Stat Cards:
- Urgentes: 3
- Em Progresso: 5
- Concluídas Hoje: 12
- Sub-Agentes: 3

AI Summary:
- Texto hardcoded
- 3 botões "Sugestões"

Tarefas Urgentes: 3 items
Projectos Activos: 4 items (Productized, IVAzen, Brand Brief)
Actividade Recente: 5 eventos timeline
Sub-Agentes: 3 items
```

### Funcionalidades
- ✅ Command Palette (⌘K)
- ✅ Keyboard shortcuts (N=nova tarefa, R=refresh)
- ✅ Timestamp auto-actualização
- ✅ Contadores animados
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Scroll customizado (webkit)

### APIs Integradas
- ❌ NENHUMA - Tudo é mockado

### Avaliação
- **Design:** 5/5 ⭐⭐⭐⭐⭐ (Excelente, profissional)
- **UX:** 4/5 (Command palette é nice, mas falta interactividade)
- **Performance:** 5/5 (Puro HTML/CSS/JS, instant)
- **Manutenibilidade:** 4/5 (Código limpo, bem organizado)
- **Score Overall:** 4.5/5

---

## 2️⃣ JIRA KANBAN

### Localização
- **HTML:** `~/clawd/exports/jira-kanban.html`
- **Tamanho:** ~24KB

### Design & Estilo
- **Tema:** Jira Blue Professional (Atlassian design system)
- **Paleta:**
  ```
  --primary-blue: #0052CC
  --light-blue: #2684FF
  --background: Linear gradient(135deg, #0052CC, #172B4D)
  --surface: #ffffff
  ```
- **Layout:** Kanban horizontal (4 colunas: To Do, In Progress, Review, Done)
- **Cards:** Estilo Jira nativo (border-left por priority)

### Estrutura de Dados
```javascript
Issues (24 items):
- DEV-1 a DEV-25 (Epic + Tasks)
- Status: To Do, In Progress, Done
- Priority: Highest, High, Medium, Low, Lowest
- Assignees: Bilal Machraa, Unassigned
- Tipo: Epic, Task, Story, Bug, Subtask

Dados Estáticos (embedded JSON):
[
  {
    "key": "DEV-25",
    "summary": "[REPO] aiparati-express",
    "status": "To Do",
    "priority": "Medium",
    "project": "DEV",
    "assignee": "Unassigned"
  },
  ...
]
```

### Funcionalidades
- ✅ Filtros por Projecto (DEV, SAM1, Todos)
- ✅ Filtros por Tipo (Task, Story, Todos)
- ✅ Pesquisa fulltext
- ✅ Click para abrir na Jira (browser.open)
- ✅ Contadores por coluna
- ✅ Scroll horizontal responsivo

### APIs Integradas
- ❌ NENHUMA API real - JSON embedded
- 💡 Poderia ser actualizado com: `curl -u "$JIRA_EMAIL:$JIRA_TOKEN" ...`

### Avaliação
- **Design:** 4/5 (Seguido Atlassian guidelines)
- **Dados:** 2/5 (24 issues são apenas repositórios, não tarefas reais)
- **UX:** 4/5 (Familiar aos users Jira)
- **API Integration:** 1/5 (Hardcoded JSON)
- **Score Overall:** 2.75/5

---

## 3️⃣ GITHUB REPOS DASHBOARD

### Localização
- **HTML:** `~/clawd/exports/github-repos-dashboard.html`
- **Tamanho:** ~35KB

### Design & Estilo
- **Tema:** GitHub Dark (Octcat inspired)
- **Paleta:**
  ```
  --github-bg: #0d1117
  --github-elevated: #161b22
  --github-accent: #58a6ff (cyan)
  --github-pink: #f778ba
  --github-purple: #a371f7
  ```
- **Layout:** Kanban horizontal (6 colunas: Clientes, AiParaTi Core, Tools, AL, Fundos, Experiments)
- **Cards:** Repositórios com status visual (borda colorida por atividade)

### Estrutura de Dados
```javascript
Repositórios: 63 total

Status Classification:
- 🟢 Activos (7 dias): 8 repos
- 🔵 Recentes (8-30 dias): 12 repos
- 🟡 Parados (1-6 meses): 18 repos
- 🔴 Abandonados (>6 meses): 25 repos

Linguagens:
- TypeScript: 41 repos
- Python: 6 repos
- JavaScript: 3 repos
- HTML/CSS/PHP: Alguns

Dados Embedded:
[
  {
    "name": "fnac_workshop_gamification",
    "description": "Plataforma gamificação FNAC",
    "language": "TypeScript",
    "status": "active",
    "url": "https://github.com/bilalmachraa82/..."
  },
  ...
]
```

### Funcionalidades
- ✅ Filtros por status (Todos, Activos, Recentes, Parados, Abandonados)
- ✅ Pesquisa fulltext
- ✅ Tags por linguagem e categoria
- ✅ Recomendações (arquivar 25, consolidar duplicados)
- ✅ Estatísticas KPI
- ✅ Click para abrir no GitHub

### APIs Integradas
- ❌ NENHUMA API real - JSON embedded
- 💡 Poderia ser: `gh api user/repos --limit 100`

### Avaliação
- **Design:** 4.5/5 (Muito GitHub-like)
- **Dados:** 3/5 (63 repos listados, mas dados estáticos)
- **UX:** 4.5/5 (Filtros bons, cards informativos)
- **Categorização:** 4/5 (6 categorias lógicas)
- **Score Overall:** 4/5

---

## 4️⃣ PROJECT DASHBOARD v2

### Localização
- **HTML:** `~/clawd/exports/project-dashboard-v2.html`
- **Tamanho:** ~28KB

### Design & Estilo
- **Tema:** Custom Gradient (Cyan → Purple → Pink)
- **Paleta:**
  ```
  --bg-dark: #0f0f1a, #1a1a2e, #16213e
  --accent-cyan: #00d4ff
  --accent-purple: #7c3aed
  --accent-pink: #ff6b6b
  ```
- **Layout:** Tabs/Abas (5 tabs: Overview, Projectos, Costs, Optimize, Infra)
- **Conteúdo:** Mix de cards, grids, kanban, tabelas

### Estrutura por Tab

#### 📊 Overview
- Summary Cards: 7 projectos, 3 clientes, 34% context, €200k meta
- Usage Meter: Claude API usage (34% de 200k tokens)
- Prioridades: 3 cards com status

#### 📋 Projectos (Kanban)
- 4 colunas: Backlog, Em Progresso, Review, Concluído
- 13 projectos/tarefas com prioridades
- Clientes: Prospect, Tech, Produto, Branding

#### 💰 Custos API
- Tabelas de preços Claude (Opus, Sonnet, Haiku)
- Prompt Caching
- Rate Limits (Tier 1)
- Estimativas mensais

#### ⚡ Optimização
- 6 dicas (Prompt Caching, Model Cascading, Response Cache, etc.)
- Poupanças estimadas (60-90%)
- Estratégia recomendada

#### 🖥️ Infraestrutura
- VPS OVH status
- n8n, Azure TTS, Brave Search
- Custos mensais (~€5 + variável Claude)

### Funcionalidades
- ✅ Tabs funcionais (DOM switching)
- ✅ Cards informativos
- ✅ Tabelas com preços
- ✅ Usage meters com cores
- ✅ Status indicators (online/warning/offline)

### APIs Integradas
- ❌ NENHUMA - Tudo mockado

### Avaliação
- **Design:** 4/5 (Bonito, mas menos profissional que Jarvis)
- **Conteúdo:** 4/5 (Informação útil sobre custos)
- **UX:** 3.5/5 (Tabs abrem bem mas tabs numerosos)
- **Foco:** 3/5 (Muito genérico, mistura vários tópicos)
- **Score Overall:** 3.6/5

---

## 5️⃣ KANBAN PROJECTS

### Localização
- **HTML:** `~/clawd/exports/kanban-projects.html`
- **Tamanho:** ~32KB

### Design & Estilo
- **Tema:** Custom Gradient (Purple → Dark blue)
- **Paleta:**
  ```
  --gradient: linear-gradient(135deg, #1a1a2e, #16213e)
  --accent-purple: #667eea
  --accent-primary: #764ba2
  ```
- **Layout:** Kanban horizontal (5 colunas: Activo, Progresso, Pausado, Backlog, Arquivado)
- **Cards:** GitHub repos com status visual

### Estrutura de Dados
```javascript
Repositórios: 63 total (mesmo que GitHub dashboard)

Colunas por Actividade:
- Activo (🟢): Push últimos 7 dias
- Progresso (🔵): Push últimos 30 dias
- Pausado (🟡): Push 30-90 dias
- Backlog (⚪): Push +90 dias
- Arquivado (🔴): isArchived = true

Dados por repo:
- Nome, descrição
- Linguagem (com cor)
- Data do último push
- Visibilidade (público/privado)
- Tags (AiParaTi, Bot, Dashboard)
```

### Funcionalidades
- ✅ Filtros (Todos, Públicos, Privados, AiParaTi)
- ✅ Pesquisa fulltext
- ✅ Status visual (cores por coluna)
- ✅ Click para abrir no GitHub
- ✅ Estatísticas header

### APIs Integradas
- ❌ NENHUMA - JSON embedded (63 repos)
- 💡 Poderia usar: `gh api user/repos`

### Avaliação
- **Design:** 4/5 (Bonito, cores harmoniosas)
- **Dados:** 3.5/5 (63 repos, dados estáticos)
- **Organização:** 5/5 (Classificação por atividade é inteligente!)
- **Filtering:** 4.5/5 (Bons filtros)
- **Score Overall:** 4.25/5

---

## 📊 ANÁLISE COMPARATIVA

### Dados Estáticos vs Dinâmicos
| Dashboard | Estático | Dinâmico | Fonte |
|-----------|----------|----------|-------|
| Jarvis v1 | 100% | 0% | Mockado |
| Jira Kanban | 100% | 0% | JSON embedded (24 issues) |
| GitHub | 100% | 0% | JSON embedded (63 repos) |
| Project v2 | 100% | 0% | Mockado |
| Kanban Projects | 100% | 0% | JSON embedded (63 repos) |

**Conclusão:** Todos são estáticos! Nenhum puxa dados em tempo real de APIs.

### Cobertura de Dados

| Metrica | Jarvis | Jira | GitHub | Project | Kanban |
|---------|--------|------|--------|---------|--------|
| KPIs Gerais | ✅ 3 | ❌ | ❌ | ✅ (4) | ❌ |
| Jira Issues | ❌ | ✅ 24 | ❌ | ❌ | ❌ |
| GitHub Repos | ❌ | ❌ | ✅ 63 | ❌ | ✅ 63 |
| Projectos | ✅ 4 | ❌ | ❌ | ✅ 13 | ✅ 63 |
| Custos | ❌ | ❌ | ❌ | ✅ | ❌ |
| Infraestrutura | ❌ | ❌ | ❌ | ✅ | ❌ |

### Redundância
- **GitHub Repos:** Duplicado em "GitHub Dashboard" + "Kanban Projects" (mesmos 63 repos, layouts diferentes)
- **Projectos:** Duplicado em "Kanban Projects" (GitHub) vs "Project Dashboard" (Projects)
- **Mockdata:** 5 dashboards, 5 sources diferentes de mockdata (não sincronizados!)

---

## 🎯 RECOMENDAÇÕES

### 1. Consolidação de Dados
```
┌─────────────────────────────────────┐
│  ~/clawd/exports/metrics.json       │  ← FONTE ÚNICA
│  {                                  │
│    "kpis": {...},                   │
│    "jira": {...},                   │
│    "github": {...},                 │
│    "crm": {...}                     │
│  }                                  │
└─────────────────────────────────────┘
         ↓
    ┌──────────────┐
    │ Jarvis v2    │ ← Dashboard unificado
    │ (Single HTML │
    │  + tabs)     │
    └──────────────┘
```

### 2. Estrutura de Tabs Recomendada
```
📊 Overview (KPIs, status geral)
  ├ Métricas principais (pipeline €, issues, repos, deploys)
  ├ Quick actions
  └ Activity timeline

💼 CRM
  ├ Pipeline visual (Twenty CRM)
  ├ Contacts
  └ Opportunities

🔨 Jira
  ├ Kanban mini (últimas 20 issues)
  ├ Filtros (projeto, tipo)
  └ Link "Ver Tudo" → Jira

📦 GitHub
  ├ 6 Colunas (Activos, Recentes, etc.)
  ├ 63 repos com filtros
  └ Recomendações (arquivar, consolidar)

🖥️ Infra
  ├ VPS status
  ├ Serviços (n8n, TTS, Search)
  └ Custos

💰 Optimize
  ├ Model Pricing (Claude)
  ├ Cost Reduction Tips
  └ Recomendações
```

### 3. Script de Actualização
```bash
~/clawd/scripts/update-dashboard-data.sh

Tarefas:
1. Fetch Jira (API) → issues.json
2. Fetch GitHub (gh CLI) → repos.json
3. Fetch CRM (API se disponível) → crm.json
4. Consolidar → metrics.json
5. Dashboard lê metrics.json (fetch on load)
```

### 4. Integração de APIs

**Jira API:**
```bash
source ~/clawd/.env.secrets.jira
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" "$JIRA_URL/rest/api/3/search?jql=project%3DDEV"
```

**GitHub (gh CLI):**
```bash
gh api user/repos --limit 100 --jq '.[] | {name, description, pushedAt, visibility, primaryLanguage}'
```

**CRM (Twenty):**
```
Se API disponível: fetch("https://crm.aiparati.pt/api/...")
Se não: mockdata
```

---

## ✅ Checkpoints para v2

- [ ] Preservar design Jarvis v1 (CSS variables, animações)
- [ ] Usar dark theme único (--bg-primary: #0F172A)
- [ ] Single HTML com CSS/JS inline (fácil deploy Vercel)
- [ ] Tabs colapsáveis/abas funcionais
- [ ] Fallback para mockdata se APIs falharem
- [ ] Actualização automática on load (fetch metrics.json)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Performance: <2s load time
- [ ] Sem breaking changes vs v1 visual

---

## 📋 Próximos Passos

1. ✅ **Auditoria** (feito - este documento)
2. 🔄 **Design Spec** (próximo - criar wireframe v2)
3. 🔨 **Implementação** (criar index-v2.html)
4. 📝 **Script** (criar update-dashboard-data.sh)
5. 🧪 **Testes** (validar com dados reais)
6. 🚀 **Deploy** (push para Vercel)

---

## 📞 Contato CTO

**Luis Sombreireiro**
- Telefone: +351967798267
- Jira: https://aiparati.atlassian.net
- Report: Diariamente 18:00 PT

---

**Documento Criado:** 11 Fevereiro 2026, 22:30 UTC  
**Próxima Revisão:** Após implementação v2  
**Status:** ✅ COMPLETO - Pronto para implementação
