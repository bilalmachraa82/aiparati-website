# PLANO DE IMPLEMENTAÇÃO - TWENTY CRM

**Data:** 11 de Fevereiro de 2026  
**Status:** ✅ DEPLOYED em crm.aiparati.pt  
**Admin:** bilal.machraa@mail.com  
**Modelo de Dados:** GraphQL + REST API  
**Rate Limit:** 100 req/min, batch size 60 records

---

## 📊 1. ESTADO ACTUAL DO CRM

### Infraestrutura
- **URL:** https://crm.aiparati.pt
- **Health Check:** ✅ OK (HTTP 200)
- **Docker Compose:** ~/twenty-crm/
  - twenty-server (Node.js API)
  - twenty-worker (async jobs)
  - twenty-db (PostgreSQL 16)
  - twenty-redis (cache/queue)
- **Google OAuth:** ✅ Configurado (API interception)
- **Admin User:** bilal.machraa@mail.com

### Endpoint Base (Self-Hosted)
```
https://crm.aiparati.pt/graphql/
https://crm.aiparati.pt/rest/
https://crm.aiparati.pt/rest/metadata/
```

### Autenticação
```bash
# Via API Key (Settings → APIs & Webhooks)
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## 🔧 2. PIPELINES A CRIAR

Twenty CRM organiza pipelines como **Opportunities** com **Stages** customizáveis.

### A) LEAD PIPELINE
**Objectivo:** Rastrear leads do descoberta até fechamento

**Stages (em ordem):**
1. **Novo** - Lead descoberto
2. **Contactado** - Primeiro contacto iniciado
3. **Qualificado** - Validado interesse + orçamento
4. **Proposta** - Proposta enviada ao cliente
5. **Negociação** - Detalhes em discussão
6. **Fechado** - Oportunidade convertida (Won)
7. **Perdido** - Oportunidade descartada (Lost)

**API: Criar Lead Pipeline**
```graphql
mutation CreateLeadPipeline {
  createOpportunitiesMetadata(
    input: {
      objectMetadataInput: {
        namePlural: "opportunities"
        nameSingular: "opportunity"
      }
      fieldsInput: [
        {
          name: "name"
          type: "TEXT"
          description: "Nome da oportunidade"
        }
        {
          name: "amount"
          type: "CURRENCY"
          description: "Valor estimado"
        }
        {
          name: "stage"
          type: "SELECT"
          selectOptions: [
            { label: "Novo", value: "novo" }
            { label: "Contactado", value: "contactado" }
            { label: "Qualificado", value: "qualificado" }
            { label: "Proposta", value: "proposta" }
            { label: "Negociação", value: "negociacao" }
            { label: "Fechado", value: "fechado" }
            { label: "Perdido", value: "perdido" }
          ]
          isRequired: true
        }
        {
          name: "probability"
          type: "NUMBER"
          description: "Probabilidade de fechamento (0-100)"
        }
        {
          name: "closeDate"
          type: "DATE"
          description: "Data esperada de fechamento"
        }
      ]
    }
  ) {
    success
  }
}
```

**REST Alternativa:**
```bash
curl -X POST https://crm.aiparati.pt/rest/metadata/objects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lead",
    "namePlural": "leads",
    "labelSingular": "Lead",
    "labelPlural": "Leads",
    "description": "Lead pipeline",
    "icon": "IconTargetArrow",
    "fields": [
      {
        "name": "stage",
        "type": "SELECT",
        "label": "Estágio",
        "selectOptions": [
          {"label": "Novo", "value": "novo"},
          {"label": "Contactado", "value": "contactado"},
          {"label": "Qualificado", "value": "qualificado"},
          {"label": "Proposta", "value": "proposta"},
          {"label": "Negociação", "value": "negociacao"},
          {"label": "Fechado", "value": "fechado"},
          {"label": "Perdido", "value": "perdido"}
        ]
      }
    ]
  }'
```

### B) PROJECT PIPELINE
**Objectivo:** Rastrear projectos de desenvolvimento/entrega

**Stages:**
1. **Backlog** - Projectos planejados
2. **Em Progresso** - Desenvolvimento activo
3. **Review** - Testes/validação
4. **Done** - Completado e deployed

**API:**
```bash
curl -X POST https://crm.aiparati.pt/rest/metadata/objects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project",
    "namePlural": "projects",
    "labelSingular": "Projecto",
    "labelPlural": "Projectos",
    "description": "Development project pipeline",
    "fields": [
      {
        "name": "stage",
        "type": "SELECT",
        "label": "Estado",
        "selectOptions": [
          {"label": "Backlog", "value": "backlog"},
          {"label": "Em Progresso", "value": "progresso"},
          {"label": "Review", "value": "review"},
          {"label": "Done", "value": "done"}
        ]
      },
      {
        "name": "startDate",
        "type": "DATE",
        "label": "Data de Início"
      },
      {
        "name": "dueDate",
        "type": "DATE",
        "label": "Data de Conclusão"
      }
    ]
  }'
```

### C) SUPPORT PIPELINE
**Objectivo:** Gestão de tickets/suporte de clientes

**Stages:**
1. **Novo** - Ticket criado
2. **Em Análise** - Suporte investigando
3. **Resolvido** - Problema solucionado

**API:**
```bash
curl -X POST https://crm.aiparati.pt/rest/metadata/objects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ticket",
    "namePlural": "tickets",
    "labelSingular": "Ticket",
    "labelPlural": "Tickets",
    "fields": [
      {
        "name": "stage",
        "type": "SELECT",
        "label": "Status",
        "selectOptions": [
          {"label": "Novo", "value": "novo"},
          {"label": "Em Análise", "value": "analise"},
          {"label": "Resolvido", "value": "resolvido"}
        ]
      },
      {
        "name": "priority",
        "type": "SELECT",
        "label": "Prioridade",
        "selectOptions": [
          {"label": "Baixa", "value": "low"},
          {"label": "Média", "value": "medium"},
          {"label": "Alta", "value": "high"},
          {"label": "Crítica", "value": "critical"}
        ]
      },
      {
        "name": "resolutionTime",
        "type": "NUMBER",
        "label": "Tempo de Resolução (horas)"
      }
    ]
  }'
```

---

## 👥 3. CONTACTOS A IMPORTAR

**Fonte:** MEMORY.md + Relacionamentos existentes  
**Método:** Bulk import via REST API batch

### Contactos Prioritários

| Nome | Empresa | Papel | Email (inferido) | Telefone | Prioridade |
|------|---------|-------|------------------|----------|-----------|
| **Fernando Basto** | TA Consulting | Partner/Cliente | fernando@taconsulting.pt | - | 🥇 HIGH |
| **Paula** | Aurora Oceano | Cliente (Moloni) | paula@aurora-oceano.pt | - | 🥇 HIGH |
| **Helder** | AiParaTi | Colaborador (Branding) | helder@aiparati.pt | - | 🥈 MED |
| **Luís Sombreireiro** | AiParaTi | CTO (interno) | luis.sombreireiro@aiparati.pt | +351967798267 | 🥇 HIGH |
| **Hélène Abiassi** | Helena Academy | Cliente (Leni Bot) | helene@helena-academy.br | - | 🥈 MED |

### API: Importação de Contactos (Batch)
```bash
# Criar 5 pessoas de uma vez
curl -X POST https://crm.aiparati.pt/rest/people \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "firstName": "Fernando",
        "lastName": "Basto",
        "email": [{"email": "fernando@taconsulting.pt", "isPrimary": true}],
        "company": {"name": "TA Consulting"},
        "notes": "Partner AITI, demos prontas"
      },
      {
        "firstName": "Paula",
        "lastName": "Aurora Oceano",
        "email": [{"email": "paula@aurora-oceano.pt", "isPrimary": true}],
        "company": {"name": "Aurora Oceano"},
        "notes": "Cliente Moloni, congelado 2026-02-10"
      },
      {
        "firstName": "Helder",
        "lastName": "Branding",
        "email": [{"email": "helder@aiparati.pt", "isPrimary": true}],
        "company": {"name": "AiParaTi"},
        "notes": "Colaborador - Branding"
      },
      {
        "firstName": "Luís",
        "lastName": "Sombreireiro",
        "email": [{"email": "luis.sombreireiro@aiparati.pt", "isPrimary": true}],
        "phone": "+351967798267",
        "company": {"name": "AiParaTi"},
        "notes": "CTO - Reports diários 18h Lisbon"
      },
      {
        "firstName": "Hélène",
        "lastName": "Abiassi",
        "email": [{"email": "helene@helena-academy.br", "isPrimary": true}],
        "company": {"name": "Helena Academy"},
        "notes": "Cliente Leni Bot, Brasil"
      }
    ]
  }'
```

---

## 🔗 4. INTEGRAÇÕES

### A) Gmail Sync (Ambas Contas)
**Contas:**
- bilal.machraa@mail.com (pessoal)
- Conta secundária (a confirmar)

**Implementação:**
```bash
# 1. Obter Google API credentials (OAuth 2.0)
# URL: https://console.cloud.google.com/apis/dashboard
# Scopes: gmail.readonly, gmail.modify

# 2. Configurar em Twenty: Settings → Integrations → Gmail
# 3. Autenticar ambas contas

# 4. REST API para sincronizar emails com records
curl -X POST https://crm.aiparati.pt/rest/integrations/gmail/sync \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "account": "bilal.machraa@mail.com",
    "linkedObject": "people",
    "syncPeriod": "daily",
    "enabled": true
  }'
```

**Workflow Esperado:**
- Emails → Vinculados a Pessoas/Oportunidades
- Threads agrupadas por conversação
- Automação: Email da oportunidade → update status

### B) Telegram Notifications
**Bot:** Usar @LeniAssistenteBot ou novo @TwentyCRMBot

**Triggers:**
- Novo lead criado
- Lead movido para "Proposta"
- Lead perdido/fechado
- Deal amount > 5000€

**API Webhook:**
```bash
# Registar webhook para eventos CRM
curl -X POST https://crm.aiparati.pt/rest/webhooks \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage",
    "events": [
      "opportunity.created",
      "opportunity.updated",
      "person.created"
    ],
    "description": "Notificações Telegram"
  }'
```

### C) Jira Sync (DEV Project)
**Projecto:** https://aiparati.atlassian.net/jira/projects/DEV

**Mapeamento:**
```
Twenty Project → Jira Epic
Twenty Task → Jira Issue (Task)
Twenty Notes → Jira Comentários
```

**n8n Workflow (já temos 105 workflows):**
```json
{
  "workflow_name": "Twenty → Jira Sync",
  "trigger": "Twenty webhook (project.created, project.updated)",
  "steps": [
    {
      "action": "parse_webhook",
      "map": {
        "projectName": "summary",
        "projectDescription": "description",
        "dueDate": "duedate",
        "owner": "assignee"
      }
    },
    {
      "action": "jira_create_issue",
      "projectKey": "DEV",
      "issueType": "Epic"
    },
    {
      "action": "update_twenty_record",
      "field": "jiraId",
      "value": "DEV-{{jiraIssueKey}}"
    }
  ]
}
```

**Credenciais Jira:**
```bash
# Verificar em ~/clawd/.env.secrets.jira
source ~/clawd/.env.secrets.jira
# Contém: JIRA_URL, JIRA_EMAIL, JIRA_TOKEN
```

---

## 📊 5. VIEWS CUSTOM

### A) Dashboard Principal
**Nome:** Revenue & Pipeline Overview  
**Cards:**
1. **Total Revenue (Deals Activos)**
   - Soma de opportunities em stage != "Perdido"
   - Agrupado por estágio
   - Tendência 30 dias

2. **Pipeline Velocity**
   - Média de dias por estágio
   - Gráfico Kanban

3. **Conversion Rate**
   - Qualificado → Proposta
   - Proposta → Fechado

4. **Top Accounts**
   - Top 5 companies por deal size

**GraphQL Query:**
```graphql
query DashboardMetrics {
  opportunities(filter: {stage: {neq: "perdido"}}) {
    edges {
      node {
        id
        name
        amount
        stage
        createdAt
        closeDateAt
        personId
        companyId
      }
    }
  }
  companies(orderBy: [{totalRevenue: DESC}], first: 5) {
    edges {
      node {
        id
        name
        totalRevenue
      }
    }
  }
}
```

### B) Vista por Projecto
**Nome:** Project Board  
**Colunas:** Backlog → Progresso → Review → Done

**Filtros:**
- Owner (Bilal, Team)
- Due Date (próximas 2 semanas)
- Priority

### C) Vista por Cliente
**Nome:** Account Management  
**Group By:** Company

**Info por cliente:**
- Total value (SUM opportunities)
- Active opportunities
- Contact frequency (últimos 30 dias)
- Last interaction date

---

## ⚙️ 6. AUTOMAÇÕES

### A) Follow-up Automático (Lead sem contacto > 3 dias)

**Trigger:** Opportunity em stage "Novo" ou "Contactado" + LastActivityAt < 3 dias

**Automação (via n8n webhook):**
```json
{
  "id": "auto_follow_up_lead",
  "name": "Auto Follow-up (3+ days no contact)",
  "trigger": {
    "type": "schedule",
    "cron": "0 9 * * *"
  },
  "workflow": [
    {
      "action": "query_opportunities",
      "filter": {
        "stage": ["novo", "contactado"],
        "lastActivityAt": {
          "lt": "now() - 3 days"
        }
      }
    },
    {
      "action": "create_task",
      "title": "Follow-up: {{person.firstName}} - {{opportunity.name}}",
      "assignee": "bilal.machraa@mail.com",
      "dueDate": "today",
      "priority": "high"
    },
    {
      "action": "send_telegram",
      "message": "⏰ Follow-up necessário:\n{{person.firstName}} - {{opportunity.name}}\nÚltimo contacto: {{lastActivityAt}}"
    }
  ]
}
```

### B) Lead Scoring (Baseado em Interacções)

**Modelo de Scoring:**
| Acção | Pontos | Categoria |
|-------|--------|-----------|
| Email aberto | +1 | Engagement |
| Link clicado | +3 | Engagement |
| Reunião agendada | +10 | Intent |
| Proposta aceita | +25 | Intent |
| Documento visto | +5 | Intent |
| Inatividade 7+ dias | -5 | Engagement |

**GraphQL Mutation (calcular score):**
```graphql
mutation UpdateLeadScore($opportunityId: UUID!) {
  updateOpportunity(
    input: {
      id: $opportunityId
      leadScore: {
        calculate: "engagement + intent - decay"
        fields: [
          {name: "emailsOpened", weight: 1},
          {name: "linksClicked", weight: 3},
          {name: "meetingsScheduled", weight: 10},
          {name: "proposalViewed", weight: 5},
          {name: "daysInactive", weight: -5}
        ]
      }
    }
  ) {
    id
    leadScore
  }
}
```

**Automação em n8n (diária):**
```json
{
  "name": "Daily Lead Scoring",
  "trigger": "0 18 * * *",
  "actions": [
    {
      "query": "all opportunities",
      "for_each": "opportunity",
      "calculate": "leadScore from interactions",
      "update": "opportunity.leadScore"
    },
    {
      "filter": "leadScore >= 50",
      "action": "move_to_stage",
      "stage": "Qualificado"
    }
  ]
}
```

---

## 🚀 7. PASSO A PASSO DE IMPLEMENTAÇÃO

### Fase 1: Setup API (30 min)
- [ ] Aceder a https://crm.aiparati.pt/settings/developers/api
- [ ] Criar API Key "Implementation"
- [ ] Guardar em `~/clawd/.env.secrets.crm`
- [ ] Testar GraphQL Playground

### Fase 2: Pipelines Custom (1h)
- [ ] Executar mutations para Lead, Project, Support pipelines
- [ ] Validar stages em UI
- [ ] Configurar field visibility rules

### Fase 3: Importar Contactos (30 min)
- [ ] Bulk import via REST (5 contactos)
- [ ] Vincular a companies existentes
- [ ] Verificar dados

### Fase 4: Integrações (2h)
- [ ] Gmail: OAuth setup + sync diária
- [ ] Telegram: Webhook registado
- [ ] Jira: n8n workflow criado

### Fase 5: Views & Dashboards (1h)
- [ ] Criar 3 custom views
- [ ] Configurar dashboard principal
- [ ] Testar filtros

### Fase 6: Automações (1.5h)
- [ ] n8n: Follow-up automático
- [ ] n8n: Lead scoring diária
- [ ] Testar triggers

**⏱️ TEMPO TOTAL: ~6h**

---

## 📝 8. EXEMPLOS DE CHAMADAS API COMPLETAS

### Criar Lead
```bash
curl -X POST https://crm.aiparati.pt/rest/people \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": [{"email": "joao@empresa.pt", "isPrimary": true}],
    "phone": "+351912345678",
    "linkedinUrl": "https://linkedin.com/in/joaosilva",
    "company": {"name": "TechStartup"}
  }'
```

### Criar Opportunity (Lead com Pipeline)
```bash
curl -X POST https://crm.aiparati.pt/rest/opportunities \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Implementação CRM - TechStartup",
    "person": {"id": "{{personId}}"},
    "stage": "Novo",
    "amount": 15000,
    "probability": 30,
    "closeDateAt": "2026-03-31",
    "description": "Lead de Fernando Basto"
  }'
```

### Mover Opportunity de Stage
```bash
curl -X PATCH https://crm.aiparati.pt/rest/opportunities/{{opportunityId}} \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Contactado",
    "updatedAt": "2026-02-11T21:00:00Z"
  }'
```

### Query GraphQL: Opportunities por Stage
```graphql
query PipelineView {
  opportunities(filter: {stage: {eq: "Proposta"}}) {
    edges {
      node {
        id
        name
        amount
        person {
          firstName
          lastName
          email
        }
        company {
          name
        }
        closeDateAt
      }
    }
  }
}
```

---

## 🔐 9. SEGURANÇA & BOAS PRÁTICAS

### API Key Management
- ✅ Armazenar em `~/.bashrc` ou 1Password ("Jarvis Secrets")
- ✅ Renovar a cada 90 dias
- ❌ NUNCA commitar para Git
- ❌ NUNCA no histórico de comandos (usar env vars)

### Permissões (Roles)
- **Admin:** Bilal (Full Access)
- **Default:** Criar API key + assinhar role restrictive
- **Suporte:** Read-only access

### Webhooks
- ✅ HTTPS apenas
- ✅ Validar assinatura (X-Twenty-Webhook-Signature)
- ✅ Retry logic (exponential backoff)

---

## 📞 10. CONTACTOS & ESCALAÇÃO

| Quem | Role | Contacto | Urgência |
|------|------|----------|----------|
| **Bilal** | Admin CRM | bilal.machraa@mail.com | - |
| **Luís Sombreireiro** | CTO | +351967798267 / Telegram | Reports 18h |
| **Suporte Twenty** | Platform | support@twenty.com | Issues técnicos |

---

## ✅ CHECKLIST FINAL

- [ ] API Key criada e testada
- [ ] 3 Pipelines configuradas
- [ ] 5 Contactos importados
- [ ] Gmail sync ativo
- [ ] Telegram notificações funcionando
- [ ] Jira sync via n8n
- [ ] Dashboard principal criado
- [ ] Follow-up automático agendado
- [ ] Lead scoring a correr diariamente
- [ ] Documentação atualizada

---

**Próximos Passos:** 
1. Executar Fase 1 (API Key) hoje
2. Phases 2-3 amanhã (Pipelines + Contactos)
3. Phases 4-6 ao longo da semana
4. Teste completo antes de segunda-feira

**Documentação Completa:** https://docs.twenty.com/
