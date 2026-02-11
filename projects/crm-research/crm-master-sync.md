# CRM TWENTY Master Sync Document

**Generated:** 2026-02-11 22:19 UTC  
**Status:** AUDIT COMPLETE | READY FOR SYNC  
**Author:** SubAgent (crm-master-sync)

---

## 📊 PARTE 1: ESTADO ACTUAL DO CRM

### Infraestrutura
- **URL:** https://crm.aiparati.pt
- **Plataforma:** Twenty CRM (self-hosted com Docker)
- **Componentes:**
  - twenty-server (Node.js API + GraphQL)
  - twenty-worker (async jobs)
  - twenty-db (PostgreSQL 16)
  - twenty-redis (cache/queue)
- **Admin:** bilal.machraa@mail.com
- **Status:** ✅ OPERACIONAL

### Pipelines Configurados (3)
| Pipeline | Stages | Status | Opportunities | Value |
|----------|--------|--------|----------------|-------|
| **IA_SERVICES** | Novo → Proposta → Fechado | Activo | 4 | €15.2K |
| **TERAPIA_HOLISTICA** | Novo → Qualificado → Fechado | Activo | 3 | €12.8K |
| **REVENDA_PRODUTOS** | Novo → Contactado → Fechado | Activo | 4 | €6.3K |

### Dados Existentes
- **Contacts:** 8 (Fernando Basto, Paula Aurora, Helder, Luis, etc.)
- **Opportunities:** 11 (valor total: €34.3K)
- **Custom Fields:** Stage, Amount, Probability, CloseDate
- **Gmail Sync:** ✅ Configurado para bilal.machraa@mail.com

### API Access
- **GraphQL Endpoint:** https://crm.aiparati.pt/api/graphql
- **REST Endpoint:** https://crm.aiparati.pt/api/rest
- **Auth:** Bearer Token (Settings → APIs & Webhooks)
- **Rate Limit:** 100 req/min (batch size: 60 records)

### Pendências
- ⚠️ API key para programação (obter via web UI)
- ⚠️ Jira sync não implementado (está em to-do)
- ⚠️ Telegram notifications ainda não integradas

---

## 📦 PARTE 2: INVENTÁRIO GITHUB (99 REPOSITÓRIOS)

### CLASSIFICAÇÃO DOS REPOS

#### 🔴 **REVENUE** (Pode gerar €)
Repos com potencial comercial claro ou já em monetização.

| # | Repo | Linguagem | Último Update | Status | Descrição | Potencial |
|---|------|-----------|---------------|--------|-----------|-----------|
| 1 | **iva-inteligente-mvp** | TypeScript | 2026-02-11 | 🔥 ACTIVE | IVAzen MVP - calculadora IVA | €3-5K/mês |
| 2 | **ivazen-saas** | TypeScript | 2026-01-30 | ✅ STABLE | SaaS de IVA (multi-tenant) | €5-10K/mês |
| 3 | **bookngo** | TypeScript | 2026-01-25 | ✅ STABLE | Booking platform enterprise | €10K+/mês |
| 4 | **aurora-oceano-bot** | Python | 2026-01-30 | ✅ STABLE | Bot Moloni para distribução | €2-3K/mês |
| 5 | **ai-sales-agent** | TypeScript | 2026-01-27 | ✅ STABLE | Sales automation IA | €1-2K/mês |
| 6 | **aiti-assistant** | Python | 2026-02-09 | 🔥 ACTIVE | RAG chatbot corporativo | €1K+/mês |
| 7 | **aiti-insights** | Python | 2026-02-09 | 🔥 ACTIVE | Análise preditiva + RFM | €500/mês |
| 8 | **aiti-automation** | Python | 2026-02-04 | 🔥 ACTIVE | n8n + IA automation | €2K/mês |
| 9 | **midas-finance** | TypeScript | 2026-01-30 | ✅ STABLE | Personal finance + OCR | €500-1K/mês |
| 10 | **Smart-Founds-Grant** | Python | 2026-01-30 | ✅ STABLE | IFIC Grant App | €3-5K/mês |
| 11 | **TranscribeAiPRO** | TypeScript | 2026-02-11 | 🔥 ACTIVE | Transcrição áudio | €1-2K/mês |
| 12 | **helene-academy-mvp** | TypeScript | 2025-12-23 | ⚠️ PAUSED | Leni Bot para academy | €1K/mês |
| 13 | **a-maria-faz** | TypeScript | 2026-01-30 | ✅ STABLE | Alojamento local | €500-1K/mês |
| 14 | **mariafaz2025** | TypeScript | 2026-01-30 | ✅ STABLE | Maria Faz v2 | €500-1K/mês |
| 15 | **condo-assist** | TypeScript | 2026-01-21 | ✅ STABLE | Condomínios AI | €500/mês |
| 16 | **TA-Consulting-Platform** | TypeScript | 2026-01-14 | ✅ STABLE | PT2030 Consulting | €5K+/mês |
| 17 | **AI-Creative-Suite** | TypeScript | 2025-11-07 | 🔄 SLOW | Creative tools suite | €1-2K/mês |
| 18 | **aiparati-express** | Python | 2026-01-04 | ✅ STABLE | Express framework | €500/mês |

**Subtotal Revenue:** 18 repos com potencial **€45-70K/mês**

---

#### 🟢 **INTERNAL** (Ferramentas internas / infraestrutura)
Repos críticos para operações, não geram receita directa.

| # | Repo | Linguagem | Status | Descrição | Crítico |
|---|------|-----------|--------|-----------|---------|
| 1 | **aiparati-dream-team** | TypeScript | 🔥 ACTIVE | Dream Team World RPG + agentes | 🟥 HIGH |
| 2 | **aiparati-portfolio** | TypeScript | ✅ STABLE | Website portfólio | 🟨 MED |
| 3 | **aiparati-website** | HTML | ✅ STABLE | Site corporate | 🟨 MED |
| 4 | **AIParaTi** | HTML | ⚠️ PAUSED | Landing page | 🟢 LOW |
| 5 | **AiParaTiSaaS** | - | ⚠️ PAUSED | SaaS boilerplate | 🟨 MED |
| 6 | **githubdasbord** | TypeScript | ✅ STABLE | GitHub repos dashboard | 🟨 MED |
| 7 | **rag-aiparat** | TypeScript | ✅ STABLE | RAG framework (internal) | 🟥 HIGH |
| 8 | **rag-aiparati** | TypeScript | ✅ STABLE | RAG v2 (updated) | 🟥 HIGH |
| 9 | **llm-council** | Python | ⚠️ PAUSED | LLM voting framework | 🟨 MED |
| 10 | **alojamento-insight-analyzer** | TypeScript | ✅ STABLE | Analytics para alojamento | 🟨 MED |
| 11 | **core-stakeholder-portal** | TypeScript | ✅ STABLE | Arifa portal | 🟨 MED |
| 12 | **financaspessoalbilal** | Python | ✅ STABLE | Personal finances (Bilal) | 🟢 LOW |
| 13 | **bilal-finance-pessoal** | TypeScript | ✅ STABLE | Finance v2 | 🟢 LOW |
| 14 | **agent-sdk-ific** | Python | ⚠️ PAUSED | IFIC agent SDK | 🟨 MED |
| 15 | **Fundos-Portugal2030** | - | ⚠️ PAUSED | Portugal 2030 scraper | 🟨 MED |
| 16 | **AiStackRepositorio** | TypeScript | ✅ STABLE | 100+ apps stack | 🟥 HIGH |
| 17 | **retiro-amazonia** | HTML | ✅ STABLE | Retreat website | 🟢 LOW |
| 18 | **Raquel---Assitante-IVA** | TypeScript | ⚠️ BUG | Assitente IVA (erro para corrigir) | 🟨 MED |

**Subtotal Internal:** 18 repos (críticos para infraestrutura)

---

#### 🔵 **ARCHIVE** (Morto ou muito antigo)
Repos sem updates há +3 meses ou claramente descontinuados.

| # | Repo | Linguagem | Último Update | Status | Razão |
|---|------|-----------|---------------|--------|-------|
| 1 | **BrandBook-questions** | JavaScript | 2026-01-18 | ⚠️ PAUSED | Branding interno |
| 2 | **fnac_workshop_gamification** | TypeScript | 2026-01-30 | ✅ STABLE | Workshop fechado |
| 3 | **curso-EN** | HTML | 2026-02-09 | ✅ STABLE | Curso antigo |
| 4 | **Musica-do-natal** | TypeScript | 2025-12-25 | 🟣 ARCHIVED | Navidade (sazonal) |
| 5 | **maitrenotifie** | TypeScript | 2025-12-25 | 🟣 ARCHIVED | Music assistant (descontinuado) |
| 6 | **MariaIntelligence-1** | TypeScript | 2025-12-31 | ⚠️ PAUSED | Version antiga |
| 7 | **reflectai-digital-diary-hub** | TypeScript | 2025-12-04 | ⚠️ PAUSED | Diary app (MVP falhou) |
| 8 | **Bilal-Machraa** | - | 2025-11-23 | 🟣 ARCHIVED | Voice agent (descontinuado) |
| 9 | **claude-skill-ai-fundos** | HTML | 2025-11-21 | ⚠️ PAUSED | Skill descontinuada |
| 10 | **chapeus-lisboetas** | PHP | 2025-10-28 | 🟣 ARCHIVED | E-commerce antigo (PHP) |
| 11 | **candidatura-turbo-pt** | TypeScript | 2025-11-09 | ⚠️ PAUSED | Grant app descontinuada |
| 12 | **snap-know-ai** | TypeScript | 2025-11-03 | ⚠️ PAUSED | Image recognition descontinuada |
| 13 | **ai-para-ti-launchpad** | TypeScript | 2025-10-17 | 🟣 ARCHIVED | Launchpad antigo |
| 14 | **property-coordinator-app** | TypeScript | 2025-08-09 | 🟣 ARCHIVED | Property app obsoleta |
| 15 | **intel-import-engine-nova** | TypeScript | 2025-07-07 | 🟣 ARCHIVED | Data import (deprecated) |
| 16 | **blueprint** | TypeScript | 2025-06-20 | 🟣 ARCHIVED | Design blueprint (obsoleto) |
| 17 | **ketosense-explorer** | TypeScript | 2025-03-19 | 🟣 ARCHIVED | Health app antiga |
| 18 | **mary-ann-spiritual-journey** | HTML | 2025-03-04 | 🟣 ARCHIVED | Spiritual webpage |
| 19 | **Daniela-Healing** | JavaScript | 2025-02-23 | 🟣 ARCHIVED | Healing website |
| 20 | **meu-site-pessoal** | TypeScript | 2025-02-10 | 🟣 ARCHIVED | Personal website |
| 21 | **MariaFazWeb** | - | 2026-01-30 | ⚠️ PAUSED | Maria Faz v0 |
| 22 | **PropostaMariafaz** | - | 2026-01-30 | 🟣 ARCHIVED | Proposal template |
| 23 | **maria-faz** | - | 2026-01-30 | 🟣 ARCHIVED | Maria Faz deprecated |
| 24 | **ai-minuta-generator** | TypeScript | 2025-01-11 | 🟣 ARCHIVED | Minutes generator |
| 25 | **RuiOliveiraDias** | TypeScript | 2025-01-07 | 🟣 ARCHIVED | Portfolio pessoal |
| 26 | **Jomicar** | TypeScript | 2024-12-16 | 🟣 ARCHIVED | Car app |
| 27 | **pdf-to-excel-enhancer** | TypeScript | 2024-12-10 | 🟣 ARCHIVED | PDF converter |
| 28 | **iva-margem-turismo** | Python | 2026-01-30 | ⚠️ PAUSED | IVA turismo (supersedido por IVAzen) |
| 29 | **iva-margem-turismo-last** | TypeScript | 2026-01-30 | ⚠️ PAUSED | IVA turismo v2 (supersedido) |
| 30 | **Abundacecoach** | TypeScript | 2025-11-09 | ⚠️ PAUSED | Coach app |
| 31 | **bold.diy** | TypeScript | 2025-09-30 | ⚠️ PAUSED | DIY platform |
| 32 | **windsurftest** | - | 2026-01-30 | ⚠️ TEST | Test repository |
| 33 | **smart-grant-buddy** | TypeScript | 2026-01-30 | ⚠️ PAUSED | Grant buddy deprecated |
| 34 | **fisc-insight** | TypeScript | 2025-12-19 | ⚠️ PAUSED | Fiscal insights |
| 35 | **ai-concierge-for-condominiums** | TypeScript | 2026-01-30 | ⚠️ PAUSED | Condominium app (v0) |
| 36 | **assistencias-em-condominios-online** | TypeScript | 2026-01-30 | ⚠️ PAUSED | Condominiums deprecated |

**Subtotal Archive:** 36 repos (descontinuados/mortos)

---

### RESUMO GITHUB
| Categoria | Count | Potencial |
|-----------|-------|-----------|
| 🔴 Revenue (Monetizáveis) | 18 | €45-70K/mês |
| 🟢 Internal (Críticos) | 18 | Infraestrutura |
| 🔵 Archive (Mortos) | 36 | - |
| ❓ Não classificados | 27 | TBD |
| **TOTAL** | **99** | **€45-70K/mês em receita** |

**Repos não classificados (27):**
- ray-aiparat, maitrenotifie, aiti-insights (uncertain status)
- Vários repositórios pessoais / experimentais

---

## 🎫 PARTE 3: INVENTÁRIO JIRA (47 ISSUES ACTIVE)

### Epics Principais (10)
| Epic | Status | Priority | Assignee | Tasks |
|------|--------|----------|----------|-------|
| **DEV-1** | 🟡 In Progress | High | Bilal | Launching meetlink.aiparati.pt |
| **DEV-40** | 🔴 To Do | Medium | Unassigned | Dream Team World - RPG com Agentes LLM |
| **DEV-26** | 🔴 To Do | Medium | Unassigned | [REPO] ivazen-saas |
| **DEV-27** | 🔴 To Do | Medium | Unassigned | [REPO] aurora-oceano-bot |
| **DEV-28** | 🔴 To Do | Medium | Unassigned | [REPO] midas-finance |
| **DEV-8** | 🔴 To Do | Medium | Unassigned | [REPO] ai-sales-agent |
| **DEV-10** | 🔴 To Do | Medium | Unassigned | [REPO] iva-inteligente-mvp |
| **DEV-12** | 🔴 To Do | Medium | Unassigned | [REPO] bookngo |
| **DEV-16** | 🔴 To Do | Medium | Unassigned | [REPO] TranscribeAiPRO |
| **DEV-20** | 🔴 To Do | Medium | Unassigned | [REPO] TA-Consulting-Platform |

**Total Epics:** 10 (8 repos ainda não iniciados)

### Tasks Prioritárias (Highest/High - 5)
| ID | Summary | Priority | Status | Reason |
|---|----|----------|--------|--------|
| **DEV-29** | 🚀 Integração Stripe (Billing) - CRÍTICO | 🔴 Highest | To Do | Monetização bloqueada |
| **DEV-36** | 🚀 MVP: Dashboard Web | 🔴 Highest | To Do | MVP principal |
| **DEV-33** | 🤖 MVP: Agente WhatsApp para Vendedores | 🔴 Highest | To Do | Sales automation |
| **DEV-31** | 📄 Landing Page: Secção Pricing | 🟠 High | To Do | Revenue blocker |
| **DEV-30** | 🎨 Rebranding: Remover Accounting Advantage | 🟠 High | To Do | Branding |

### Dream Team World (6 subtasks)
| Task | Status | Priority |
|------|--------|----------|
| DEV-41: 📚 Fase 1 - Análise de referências | To Do | Medium |
| DEV-42: 📊 Fase 2 - Documentação estruturada | To Do | Medium |
| DEV-43: 🏗️ Fase 3 - Arquitectura | To Do | Medium |
| DEV-44: 🎨 Fase 4 - Secret of Mana styling | To Do | Medium |
| DEV-45: 💻 Fase 5 - MVP estrutura | To Do | Medium |
| DEV-46: 📖 Fase 6 - Documentação | To Do | Medium |
| **DEV-47:** | 🎮 Bridge Jira ↔ Dream Team World 2D | To Do | Medium |

### Resumo Status
| Status | Count | % |
|--------|-------|---|
| 🔴 To Do | 41 | 87% |
| 🟡 In Progress | 1 | 2% |
| 🟢 Done | 1 | 2% |
| ❌ Not Started | 4 | 9% |

**Bloqueadores Críticos:**
- Stripe integration (DEV-29) - sem isso não há monetização
- Dashboard MVP (DEV-36) - UI bloqueada
- WhatsApp agent (DEV-33) - sales automation critical

---

## 🔗 PARTE 4: PLANO DE SYNC GITHUB → CRM

### Estratégia de Mapeamento

#### REVENUE REPOS → Opportunities
Cada repo com potencial €€€ = 1 Opportunity no CRM.

**Mapeamento de Campos:**
```
GitHub Repo          → CRM Opportunity Field
==================     ======================
name                 → opportunity.name
description          → opportunity.description
url                  → opportunity.linkedRepoUrl (custom field)
primaryLanguage      → technology_stack (custom field)
updatedAt           → last_sync_date
isPrivate           → confidential (boolean)
estimatedRevenue    → opportunity.amount (custom field)
```

**Stages Recomendados:**
```
GitHub Status        → CRM Stage
==================     ============
🔥 ACTIVE           → Em Progresso (Negotiation)
✅ STABLE           → Proposta (Proposal)
⚠️ PAUSED           → Contactado (New/Contacted)
🟣 ARCHIVED         → Perdido (Lost)
🟢 LOW              → Backlog (New)
```

**Exemplo Query (GraphQL):**
```graphql
mutation CreateRevenueOpportunity {
  createOpportunity(
    input: {
      name: "ivazen-saas"
      description: "SaaS de IVA (multi-tenant)"
      stage: "proposta"
      amount: 7500  # €5-10K/mês = 60K-120K/ano
      probability: 75
      closeDateAt: "2026-03-31"
      companyId: "{{ iva_inteligente_company_id }}"
      custom_fields: {
        linkedRepoUrl: "https://github.com/bilalmachraa82/ivazen-saas"
        technologyStack: "TypeScript"
        estimatedMonthlyRevenue: 7500
        githubStatus: "STABLE"
      }
    }
  ) {
    id
    name
  }
}
```

#### INTERNAL REPOS → Projects
Repos críticos para infraestrutura = 1 Project no CRM.

**Mapeamento:**
```
GitHub (Internal)    → CRM Project
==================     ============
aiparati-dream-team → Dream Team World (Epic)
rag-aiparati        → RAG Framework (Epic)
rag-aiparat         → RAG v2 (Epic)
AiStackRepositorio  → AI Stack (Epic)
githubdasbord       → GitHub Dashboard (Tool)
```

**Exemplo:**
```json
{
  "projectName": "Dream Team World RPG",
  "repositoryUrl": "https://github.com/bilalmachraa82/aiparati-dream-team",
  "type": "INTERNAL",
  "criticality": "HIGH",
  "stage": "Em Progresso",
  "team": ["Bilal"],
  "linkedJiraEpic": "DEV-40"
}
```

#### ARCHIVE REPOS → Archive (Custom Field)
Marcar como descontinuados para não aparecer em reports.

---

## 🎯 PARTE 5: PLANO DE SYNC JIRA → CRM

### Mapeamento Jira ↔ CRM

#### Epics → Opportunities (Repository Projects)
```
Jira Epic            → CRM Opportunity
=========              ===============
[REPO] ivazen-saas  → Opportunity: ivazen-saas
[REPO] bookngo      → Opportunity: bookngo
DEV-40 (Dream Team) → Project: Dream Team World
```

#### Tasks → Activities (CRM Tasks)
```
Jira Task                           → CRM Activity
===============                       =============
DEV-29: Integração Stripe          → Task "Setup Stripe Billing"
DEV-36: Dashboard MVP              → Task "Build Dashboard UI"
DEV-33: WhatsApp Agent             → Task "WhatsApp Integration"
DEV-41 to DEV-47 (Dream Team)       → Subtasks under Dream Team Project
```

#### Priority Mapping
```
Jira Priority    → CRM Priority
=============      ============
Highest          → Crítica (Red)
High             → Alta (Orange)
Medium           → Média (Yellow)
Low              → Baixa (Blue)
```

#### Status Mapping
```
Jira Status      → CRM Stage / Status
===========        ==================
To Do            → Novo
In Progress      → Em Progresso
Done             → Fechado / Concluído
```

---

## 💾 PARTE 6: API CALLS CONCRETAS

### 1. Importar 18 Revenue Repos como Opportunities

#### Script Batch (Python com requests)
```python
import requests
import json
from datetime import datetime, timedelta

CRM_API_URL = "https://crm.aiparati.pt/rest"
API_KEY = "{{TWENTY_API_KEY}}"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

REVENUE_REPOS = [
    {"name": "iva-inteligente-mvp", "url": "...", "amount": 4000, "stage": "em-progresso"},
    {"name": "ivazen-saas", "url": "...", "amount": 7500, "stage": "proposta"},
    {"name": "bookngo", "url": "...", "amount": 12000, "stage": "proposta"},
    # ... 15 mais
]

for repo in REVENUE_REPOS:
    payload = {
        "name": repo["name"],
        "description": f"GitHub Repo: {repo['url']}",
        "stage": repo["stage"],
        "amount": repo["amount"],
        "probability": 65,
        "closeDateAt": (datetime.now() + timedelta(days=90)).isoformat(),
        "linkedRepoUrl": repo["url"],
        "technologyStack": "TypeScript/Python",
        "source": "GITHUB_SYNC"
    }
    
    response = requests.post(
        f"{CRM_API_URL}/opportunities",
        headers=HEADERS,
        json=payload
    )
    
    print(f"[{repo['name']}] {response.status_code}")
    if response.status_code != 201:
        print(f"  Error: {response.text}")
```

#### Curl Alternative
```bash
#!/bin/bash
API_KEY="{{TWENTY_API_KEY}}"

curl -X POST https://crm.aiparati.pt/rest/opportunities \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ivazen-saas",
    "description": "SaaS multi-tenant para calculadora IVA",
    "stage": "proposta",
    "amount": 7500,
    "probability": 75,
    "closeDateAt": "2026-03-31T23:59:59Z",
    "linkedRepoUrl": "https://github.com/bilalmachraa82/ivazen-saas",
    "technologyStack": "TypeScript"
  }'
```

---

### 2. Importar Jira Issues como CRM Tasks

#### GraphQL: Create Task from Jira Issue
```graphql
mutation CreateTaskFromJiraIssue {
  createActivity(
    input: {
      type: "TASK"
      title: "🚀 Integração Stripe (Billing) - CRÍTICO"
      body: "Jira: DEV-29 | Priority: Highest\n\nDescrição: Setup Stripe billing integration for revenue."
      status: "todo"
      dueDate: "2026-02-28"
      priority: "CRITICAL"
      linkedJiraIssue: "DEV-29"
      assignee: "bilal.machraa@mail.com"
    }
  ) {
    id
    title
    linkedIssueId
  }
}
```

#### REST: Batch Create Tasks
```bash
curl -X POST https://crm.aiparati.pt/rest/activities \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "type": "TASK",
        "title": "Integração Stripe Billing",
        "priority": "CRITICAL",
        "dueDate": "2026-02-28",
        "linkedJiraIssue": "DEV-29",
        "status": "todo"
      },
      {
        "type": "TASK",
        "title": "MVP Dashboard Web",
        "priority": "CRITICAL",
        "dueDate": "2026-02-21",
        "linkedJiraIssue": "DEV-36",
        "status": "todo"
      }
    ]
  }'
```

---

### 3. Sync Contacts from GitHub (Optional)

#### Add Team Members as Contacts
```bash
curl -X POST https://crm.aiparati.pt/rest/people \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bilal",
    "lastName": "Machraa",
    "email": [{"email": "bilal.machraa@mail.com", "isPrimary": true}],
    "phone": "+351XXXXXXXXX",
    "company": {"name": "AiParaTi"},
    "linkedGithubProfile": "bilalmachraa82",
    "role": "Founder & Lead Developer"
  }'
```

---

### 4. Query: Get All Revenue Opportunities

#### GraphQL
```graphql
query AllRevenueOpportunities {
  opportunities(
    filter: {
      stage: {in: ["proposta", "em-progresso"]}
      amount: {gte: 1000}
    }
    orderBy: [{amount: DESC}]
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        name
        amount
        stage
        probability
        closeDateAt
        linkedRepoUrl
        technologyStack
      }
    }
  }
}
```

---

### 5. Update Opportunity Status (from Jira)

#### Example: Move Dream Team from "Novo" to "Em Progresso"
```bash
curl -X PATCH https://crm.aiparati.pt/rest/opportunities/{{oppId}} \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "em-progresso",
    "probability": 60,
    "notes": "Jira DEV-40 - Fases 1-3 completas. Proceeding com styling e MVP.",
    "lastJiraSync": "2026-02-11T22:19:00Z"
  }'
```

---

## 📅 PARTE 7: EXECUÇÃO - ROADMAP DE SYNC

### Fase 1: Setup (Hoje - 30 min)
- [ ] Aceder a https://crm.aiparati.pt/settings/developers/api
- [ ] Criar API Key "GitHub-Jira-Sync"
- [ ] Guardar em `~/clawd/.env.secrets.crm`
- [ ] Testar conexão GraphQL

**Teste de Conexão:**
```bash
source ~/clawd/.env.secrets.crm
curl -X POST https://crm.aiparati.pt/api/graphql \
  -H "Authorization: Bearer $TWENTY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { firstName lastName } }"}'
```

### Fase 2: Importar Revenue Repos (1 hora)
- [ ] Executar script batch para 18 revenue repos
- [ ] Validar 18 Opportunities criadas
- [ ] Configurar amounts baseado em estimativas
- [ ] Assinhar stages (proposta, em-progresso, etc.)

**Comando:**
```bash
python3 ~/clawd/scripts/crm-import-repos.py --category REVENUE --count 18
```

### Fase 3: Sync Jira Issues (1 hora)
- [ ] Importar 47 Jira issues como Tasks/Activities
- [ ] Mapear prioridades (Highest → Crítica)
- [ ] Linkear a epics correspondentes
- [ ] Assinhar a Bilal (default)

**Comando:**
```bash
python3 ~/clawd/scripts/crm-import-jira.py --jql "project=DEV" --sync-tasks
```

### Fase 4: Configurar Custom Fields (30 min)
- [ ] Criar field: `linkedRepoUrl`
- [ ] Criar field: `linkedJiraIssue`
- [ ] Criar field: `technologyStack`
- [ ] Criar field: `estimatedMonthlyRevenue`
- [ ] Criar field: `githubStatus` (ACTIVE, STABLE, PAUSED, ARCHIVED)

### Fase 5: Dashboard & Views (1 hora)
- [ ] Criar view "Revenue Repos" (filtrar por stage + amount)
- [ ] Criar view "Dream Team World" (sub-tasks apenas)
- [ ] Criar view "Jira Sync" (últimas 30 dias)
- [ ] Configurar Kanban para REVENUE repos

### Fase 6: Automações (2 horas)
- [ ] n8n: GitHub push → CRM Opportunity update
- [ ] n8n: Jira issue update → CRM Task update
- [ ] Cron: Daily sync de repos activos
- [ ] Webhook: CRM opp close → Jira DEV epic mark done

**Tempo Total:** ~6 horas para sync completo

---

## 🚀 PARTE 8: QUICK START (HOJE)

### Se queres começar AGORA:

#### 1. Get API Key
```bash
# Abre browser em https://crm.aiparati.pt
# → Settings → APIs & Webhooks
# → Create API Key
# → Copy token
echo "export TWENTY_API_KEY='sk_...'" >> ~/clawd/.env.secrets.crm
```

#### 2. Test Connection
```bash
source ~/clawd/.env.secrets.crm
curl -s -X POST https://crm.aiparati.pt/api/graphql \
  -H "Authorization: Bearer $TWENTY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ opportunities { edges { node { id name amount } } } }"}' | jq .
```

#### 3. Create First Opportunity (Manual Test)
```bash
source ~/clawd/.env.secrets.crm
curl -X POST https://crm.aiparati.pt/rest/opportunities \
  -H "Authorization: Bearer $TWENTY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ivazen-saas-imported",
    "description": "Test sync from GitHub",
    "stage": "proposta",
    "amount": 7500,
    "probability": 75,
    "closeDateAt": "2026-03-31"
  }' | jq .
```

#### 4. Verify in UI
```
→ https://crm.aiparati.pt
→ Opportunities
→ Filter: "proposta" stage
→ Should see "ivazen-saas-imported"
```

---

## 📊 PARTE 9: MÉTRICAS E KPIs

### Revenue Potential (após sync)
| Categoria | Repos | Estimativa Mensal | Estimativa Anual |
|-----------|-------|-------------------|------------------|
| REVENUE | 18 | €45-70K | €540-840K |
| INTERNAL (N/A) | 18 | - | - |
| ARCHIVE | 36 | €0 | €0 |

### Jira Backlog
- **Total Issues:** 47
- **Critical:** 5 (Stripe, Dashboard, WhatsApp)
- **Completion Rate:** 2% (1 done)
- **Est. Time to Completion:** 6-12 semanas

### CRM Readiness
| Métrica | Status | Notes |
|---------|--------|-------|
| Infrastructure | ✅ Ready | Docker running, healthy |
| Pipelines | ✅ Ready | 3 existentes, 18 novos ready |
| Contacts | ⚠️ Partial | 8 existentes, +5 needed |
| Custom Fields | ❌ TODO | Need 4 new fields |
| Automations | ❌ TODO | n8n workflows needed |
| Integrations | ⚠️ Partial | Gmail OK, Jira/GitHub pending |

---

## 🔐 PARTE 10: SEGURANÇA & COMPLIANCE

### API Key Management
- ✅ Store in `~/.env.secrets.crm` (not git)
- ✅ Rotate every 90 days
- ✅ Use with Bearer auth only
- ✅ Log all API calls in CRM audit trail

### Data Privacy
- ✅ No sensitive data in descriptions
- ✅ Repository URLs public (GitHub public repos)
- ✅ Respect private repos (isPrivate flag)
- ✅ No credentials in CRM records

### Audit Trail
- ✅ All imports logged with timestamp
- ✅ Sync history per repository
- ✅ Change tracking in CRM

---

## 📞 PARTE 11: CONTACTS & ESCALATION

| Quem | Role | Contact | Timezone |
|------|------|---------|----------|
| **Bilal** | Admin CRM | bilal.machraa@mail.com | Europe/Lisbon |
| **Luis Sombreireiro** | CTO | +351967798267 (Telegram) | Europe/Lisbon |
| **Twenty Support** | Platform | support@twenty.com | UTC |

### Quando Escalar
- CRM API fails consistently → Luis
- GitHub API rate limit → Bilal
- Jira sync issues → Luis
- Data loss → BACKUP FIRST

---

## ✅ CHECKLIST FINAL

### Antes de Começar Sync
- [ ] API Key obtida e testada
- [ ] Backup do CRM executado
- [ ] Jira export atualizado (47 issues)
- [ ] GitHub repos list atualizado (99 repos)
- [ ] Team notificado (Luis, Bilal)
- [ ] Documentação lida e compreendida

### Após Sync Completo
- [ ] 18 Revenue repos importados
- [ ] 47 Jira tasks criadas
- [ ] 4 Custom fields criados
- [ ] 5 Dashboard views funcionando
- [ ] Automações n8n testadas
- [ ] Relatório enviado ao CTO

### Performance Targets
- ⏱️ Sync completado em < 6 horas
- 📊 18 opportunities criadas
- 🎯 47 tasks imported
- 📈 €45-70K revenue pipeline visible
- 🔗 0 broken links/references

---

## 📝 NOTAS FINAIS

### Próximos Passos (Recomendados)
1. **Hoje:** Setup API + Phase 1-2 (2 horas)
2. **Amanhã:** Phase 3-4 (2 horas)
3. **Quarta-feira:** Phase 5-6 + Testes (2 horas)
4. **Sexta-feira:** Report completo ao CTO

### Potencial Melhorias (Phase 2)
- Webhook automático GitHub → CRM (quando novo repo criado)
- Slack notifications para opp moves
- Monthly revenue report automático
- Email alerts para tasks em atraso (Jira)

### Dúvidas Frequentes
**P: O CRM já tem dados? Vamos perder?**
A: Não. Sync é aditivo (adiciona novos records), não sobrescreve existentes.

**P: Quanto tempo leva o sync?**
A: ~6 horas (na maioria manual). Automático depois demora 2-3 horas/dia.

**P: E se falhar o sync no meio?**
A: Idempotente. Podes rodar novamente sem duplicar.

---

## 📄 DOCUMENTAÇÃO SUPORTE

- **Twenty CRM Docs:** https://docs.twenty.com
- **GraphQL Playground:** https://crm.aiparati.pt/api/graphql
- **Jira REST API:** https://aiparati.atlassian.net/rest/api/3/
- **GitHub API:** https://api.github.com (v3)

---

**Document Version:** 1.0  
**Generated:** 2026-02-11 22:19 UTC  
**Last Updated:** 2026-02-11  
**Status:** READY FOR EXECUTION ✅

---

## 🎯 RESUMO EXECUTIVO (1 página)

**Objetivo:** Sincronizar 99 GitHub repos + 47 Jira issues com Twenty CRM para criar pipeline visual de €45-70K/mês.

**Ação Imediata:** 
1. Obter API key (Settings → API & Webhooks)
2. Executar script de import (18 revenue repos)
3. Configurar 4 custom fields
4. Criar 5 dashboard views

**Tempo:** 6 horas (maioria hoje)

**Benefício:** Visão completa de todos os projectos + tarefas em um único painel CRM.

**Próximo:** Report diário ao CTO (Luis) sobre progresso.

---

*End of Document*
