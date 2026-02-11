# Automação e Proactividade para AI Assistants

**Deep Research Report - Janeiro 2026**

---

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Padrões de Automação Proactiva](#padrões-de-automação-proactiva)
3. [Event-Driven Automation](#event-driven-automation)
4. [Como Outros AI Assistants Fazem Automação](#como-outros-ai-assistants-fazem-automação)
5. [Webhooks e Integrações](#webhooks-e-integrações)
6. [Background Jobs e Scheduling](#background-jobs-e-scheduling)
7. [Melhores Práticas de Proactividade](#melhores-práticas-de-proactividade)
8. [Padrões de Heartbeat Inteligente](#padrões-de-heartbeat-inteligente)
9. [Triggers e Automações Recomendadas](#triggers-e-automações-recomendadas)
10. [Recomendações para Clawdbot](#recomendações-para-clawdbot)

---

## Resumo Executivo

A automação proactiva para AI assistants está a evoluir rapidamente, combinando:
- **Intelligent Automation**: AI + automação tradicional para decisões adaptativas
- **Durable Execution**: Workflows que sobrevivem a falhas e reinícios
- **Event-Driven Architecture**: Reagir a eventos em vez de polling constante
- **Multi-Agent Systems**: Múltiplos agentes especializados a colaborar

### Tendências Chave 2025-2026:
1. **Fan-out patterns** para processamento paralelo eficiente
2. **Human-in-the-loop** para supervisão de tarefas críticas
3. **Memory persistence** entre sessões
4. **Tool orchestration** com fallbacks automáticos

---

## Padrões de Automação Proactiva

### 1. Cron/Schedule-Based Automation

O padrão mais tradicional - executar tarefas em intervalos fixos.

```
┌─────────────────────────────────────────────────────────────────┐
│  CRON PATTERNS                                                   │
├─────────────────────────────────────────────────────────────────┤
│  "0 9 * * *"        → Diário às 9:00                           │
│  "0 */4 * * *"      → A cada 4 horas                           │
│  "0 12 * * 5"       → Sextas às 12:00                          │
│  "*/30 * * * *"     → A cada 30 minutos                        │
│  "TZ=Europe/Lisbon" → Suporte a timezone (Inngest, etc.)       │
└─────────────────────────────────────────────────────────────────┘
```

**Quando usar:**
- Tarefas com timing exacto (relatórios diários, backups)
- Sincronização periódica de dados
- Limpeza/manutenção programada

**Quando NÃO usar:**
- Quando eventos podem acionar a mesma lógica (use event-driven)
- Check-ups frequentes que podem ser batched (use heartbeat)

### 2. Heartbeat/Polling Pattern

Verificações periódicas com lógica inteligente.

```
┌─────────────────────────────────────────────────────────────────┐
│  HEARTBEAT INTELIGENTE                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────┐        │
│  │Heartbeat│───▶│ Check State  │───▶│ Needs Action?   │        │
│  │ Timer   │    │ (last checks)│    │                 │        │
│  └─────────┘    └──────────────┘    └────────┬────────┘        │
│                                              │                  │
│                         ┌────────────────────┼────────────────┐ │
│                         ▼                    ▼                ▼ │
│                  ┌──────────┐         ┌──────────┐     ┌──────┐ │
│                  │Check     │         │Check     │     │ OK   │ │
│                  │Email     │         │Calendar  │     │(noop)│ │
│                  └──────────┘         └──────────┘     └──────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Vantagens sobre cron puro:**
- Batching de múltiplos checks numa só execução
- Estado mantido entre execuções (evita repetição)
- Lógica condicional (não verificar à noite)
- Menor custo de API calls

### 3. Event-Driven Triggers

Reagir a eventos externos em tempo real.

**Tipos de triggers:**

| Trigger Type | Exemplo | Latência |
|--------------|---------|----------|
| Webhook | Email recebido → processar | ~segundos |
| Database change | Novo registo → notificar | ~segundos |
| File watch | Novo ficheiro → processar | ~segundos |
| API polling | RSS feed → novos items | ~minutos |
| User action | Botão clicado → executar | imediato |

---

## Event-Driven Automation

### Arquitectura Event-Driven

```
┌─────────────────────────────────────────────────────────────────┐
│  EVENT-DRIVEN ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────┐    │
│  │ Event    │     │   Event      │     │    Functions     │    │
│  │ Sources  │────▶│   Bus/Queue  │────▶│    (Handlers)    │    │
│  └──────────┘     └──────────────┘     └──────────────────┘    │
│                                                                  │
│  Sources:          Queue options:       Handler patterns:       │
│  - Webhooks        - Redis Streams      - Single function       │
│  - API calls       - Kafka              - Fan-out (parallel)    │
│  - Cron triggers   - SQS/SNS            - Chain (sequential)    │
│  - DB changes      - Inngest            - Saga (compensating)   │
│  - File uploads    - Temporal           - Workflow (stateful)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fan-Out Pattern (Inngest/Trigger.dev)

Quando precisas processar muitos items em paralelo:

```typescript
// Scheduled trigger
export const weeklyDigest = inngest.createFunction(
  { id: "weekly-digest" },
  { cron: "TZ=Europe/Lisbon 0 12 * * 5" }, // Sextas às 12h
  async ({ step }) => {
    // 1. Carregar todos os users
    const users = await step.run("load-users", () => db.getUsers());
    
    // 2. Fan-out: criar evento para cada user
    const events = users.map(u => ({
      name: "digest/send",
      data: { userId: u.id, email: u.email }
    }));
    
    // 3. Enviar todos os eventos em batch
    await step.sendEvent("fan-out-digests", events);
  }
);

// Handler para cada evento individual
export const sendDigest = inngest.createFunction(
  { id: "send-digest-email" },
  { event: "digest/send" },
  async ({ event }) => {
    await email.send(event.data.email, generateDigest(event.data.userId));
  }
);
```

**Benefícios:**
- Execução paralela automática
- Retry individual por item
- Não bloqueia a função principal
- Escala horizontalmente

---

## Como Outros AI Assistants Fazem Automação

### 1. Lindy AI

**Modelo:** AI Employees (agentes especializados)

**Features de automação:**
- Agentes pré-construídos para casos de uso comuns
- Integração com 1000+ apps
- Execução 24/7 sem intervenção
- Memória persistente

**Tipos de automação:**
- Support Agent: Resolver tickets em tempo real
- Inbound SDR: Qualificar leads automaticamente
- Document Processing: Extrair dados de documentos
- Creative Agent: Gerar conteúdo marketing

**Arquitectura:**
```
User Query → Agent Selection → Tool Execution → Memory Update → Response
                  ↓
            [Pre-built workflows]
            [Custom instructions]
            [Integrations layer]
```

### 2. Zapier AI

**Modelo:** AI + Traditional Automation

**Componentes:**
- **Zaps** (workflows tradicionais)
- **AI Actions** (processamento inteligente)
- **AI Chatbots** (interação conversacional)

**Pattern típico:**
```
Trigger (webhook/schedule/event)
    ↓
AI Action (classify, extract, generate)
    ↓
Conditional Logic (if/else)
    ↓
Actions (múltiplas apps)
    ↓
Notification/Update
```

**Pontos fortes:**
- 6000+ integrações nativas
- AI para enriquecer dados mid-workflow
- Retry automático com backoff
- Filtros e transformações visuais

### 3. CrewAI

**Modelo:** Multi-Agent Orchestration

**Arquitectura:**
```
┌─────────────────────────────────────────────────────────────────┐
│  CREWAI MULTI-AGENT PATTERN                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│  │Researcher│   │Analyst  │   │Writer   │   │Reviewer │        │
│  │  Agent   │──▶│  Agent  │──▶│  Agent  │──▶│  Agent  │        │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│       │             │             │             │               │
│       ▼             ▼             ▼             ▼               │
│  [Web Search]  [Analysis   [Content      [Quality             │
│  [API calls ]  Tools]      Generation]   Check]              │
│                                                                  │
│  Orchestration: Sequential, Parallel, or Hierarchical          │
│  Memory: Shared context across agents                          │
│  Tools: Pluggable per agent                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Tipos de orchestration:**
- **Sequential:** Agent A → Agent B → Agent C
- **Parallel:** Agents executam simultaneamente
- **Hierarchical:** Manager agent delega a workers

### 4. LangGraph

**Modelo:** Graph-based Agent Orchestration

**Features chave:**
- **Durable Execution:** Sobrevive a crashes
- **Human-in-the-loop:** Pausar para aprovação humana
- **Comprehensive Memory:** Short-term e long-term
- **State Management:** Estado persiste entre steps

**Padrão básico:**
```python
from langgraph.graph import StateGraph, MessagesState, START, END

graph = StateGraph(MessagesState)
graph.add_node("agent", agent_function)
graph.add_node("tools", tool_executor)
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue, {
    "continue": "tools",
    "end": END
})
graph.add_edge("tools", "agent")
```

### 5. GPT Researcher

**Modelo:** Autonomous Research Agent

**Arquitectura:**
```
Research Query
    ↓
┌─────────────────┐
│ Planner Agent   │ → Gera questões de pesquisa
└────────┬────────┘
         ▼
┌─────────────────┐
│ Crawler Agents  │ → Recolhe informação (paralelo)
│ (multiple)      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Summarizer      │ → Resume cada fonte
└────────┬────────┘
         ▼
┌─────────────────┐
│ Publisher       │ → Gera relatório final
└─────────────────┘
```

**Lições:**
- Decomposição de tarefas complexas
- Paralelização de sub-tarefas
- Aggregação inteligente de resultados

---

## Webhooks e Integrações

### Padrões de Webhook

```
┌─────────────────────────────────────────────────────────────────┐
│  WEBHOOK PATTERNS                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INBOUND WEBHOOK (receber eventos)                           │
│     External Service → Your Endpoint → Process → Respond        │
│                                                                  │
│  2. OUTBOUND WEBHOOK (enviar eventos)                           │
│     Your Event → POST to URL → External Service                 │
│                                                                  │
│  3. BIDIRECTIONAL (request/response)                            │
│     External → Your API → Process → Return Result               │
│                                                                  │
│  Security:                                                       │
│  - HMAC signature verification                                  │
│  - Secret tokens in headers                                     │
│  - IP allowlisting                                              │
│  - Rate limiting                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Integrações Comuns

| Categoria | Serviços | Tipo de Trigger |
|-----------|----------|-----------------|
| Email | Gmail, Outlook | Webhook/IMAP |
| Calendar | Google Calendar, Outlook | Webhook/Polling |
| Messaging | Slack, Discord, Telegram | Webhook |
| CRM | HubSpot, Salesforce | Webhook |
| Storage | Dropbox, Google Drive | Webhook |
| Code | GitHub, GitLab | Webhook |
| Payments | Stripe, PayPal | Webhook |

### Retry Strategy para Webhooks

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPONENTIAL BACKOFF PATTERN                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Attempt 1: Imediato                                            │
│  Attempt 2: +1 segundo                                          │
│  Attempt 3: +2 segundos                                         │
│  Attempt 4: +4 segundos                                         │
│  Attempt 5: +8 segundos                                         │
│  ...                                                            │
│  Max attempts: 5-10                                             │
│  Max delay: 5-30 minutos                                        │
│                                                                  │
│  Jitter: Adicionar aleatoriedade para evitar thundering herd    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Background Jobs e Scheduling

### Plataformas de Background Jobs

#### 1. Temporal.io

**Modelo:** Durable Execution Engine

**Conceitos chave:**
- **Workflows:** Funções duráveis que mantêm estado
- **Activities:** Operações que podem falhar e ser retried
- **Workers:** Processos que executam workflows/activities
- **Signals:** Comunicação externa com workflows running

**Exemplo com AI SDK:**
```typescript
import { generateText } from 'ai';
import { temporalProvider } from '@temporalio/ai-sdk';

export async function researchWorkflow(topics: string[]): Promise<string> {
  // Phase 1: Search (Activities com retry automático)
  const searchResults = await Promise.all(
    topics.map(topic => searchTopic(topic))
  );

  // Phase 2: Summarize (LLM calls duráveis)
  const summaries = await Promise.all(
    searchResults.map(results =>
      generateText({
        model: temporalProvider.languageModel('gpt-4o-mini'),
        prompt: `Summarize: ${JSON.stringify(results)}`,
      })
    )
  );

  // Phase 3: Generate final report
  const briefing = await generateText({
    model: temporalProvider.languageModel('gpt-4o-mini'),
    prompt: `Create briefing from: ${summaries.map(s => s.text).join('\n')}`,
  });

  return briefing.text;
}
```

**Benefícios:**
- Retries automáticos
- Estado persiste após crash
- Visibilidade completa via UI
- Não repete trabalho já feito

#### 2. Trigger.dev

**Modelo:** Background Jobs as Code

**Features:**
- `trigger()` - Fire and forget
- `triggerAndWait()` - Esperar resultado
- `batchTrigger()` - Múltiplas execuções
- Delays nativos (`{ delay: "1h" }`)

**Exemplo:**
```typescript
export const parentTask = task({
  id: "parent-task",
  run: async (payload: string) => {
    // Trigger e esperar
    const result = await childTask.triggerAndWait("data");
    
    if (result.ok) {
      return result.output;
    } else {
      throw new Error(result.error);
    }
  },
});
```

#### 3. Inngest

**Modelo:** Event-Driven Durable Functions

**Features:**
- Triggers: events, cron, webhooks
- Steps: unidades retriáveis
- Flow control: throttle, concurrency, debounce
- Fan-out pattern nativo

#### 4. Windmill

**Modelo:** Open-source Workflow Engine

**Features:**
- Scripts em Python, TypeScript, Go, Bash, etc.
- Orchestrador visual
- App builder para UIs
- Scheduler integrado
- Git sync para deployments

---

## Melhores Práticas de Proactividade

### 1. Saber Quando Agir vs Quando Esperar

```
┌─────────────────────────────────────────────────────────────────┐
│  PROACTIVITY DECISION MATRIX                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              │ URGENTE           │ NÃO URGENTE                  │
│  ────────────┼───────────────────┼────────────────────────────  │
│  IMPORTANTE  │ ✅ Notificar      │ ⏰ Agendar para altura       │
│              │    imediatamente  │    apropriada                │
│  ────────────┼───────────────────┼────────────────────────────  │
│  NÃO         │ 📝 Log para       │ ❌ Não interromper          │
│  IMPORTANTE  │    revisão        │    (pode ignorar)            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Contexto Temporal

```python
# Respeitar horários do utilizador
def should_notify(user_timezone: str, urgency: str) -> bool:
    local_hour = get_local_hour(user_timezone)
    
    if urgency == "critical":
        return True  # Sempre notificar
    
    if urgency == "high":
        return 7 <= local_hour <= 23  # Horário acordado
    
    if urgency == "normal":
        return 9 <= local_hour <= 21  # Horário de trabalho alargado
    
    # Low urgency: batch para o próximo check normal
    return False
```

### 3. Batching Inteligente

**Mau:**
```
09:00 - Email novo de X
09:01 - Notificação
09:05 - Email novo de Y
09:06 - Notificação
09:10 - Email novo de Z
09:11 - Notificação
```

**Bom:**
```
09:00-09:15 - 3 emails novos acumulados
09:15 - "Tens 3 emails novos: X (urgente), Y, Z"
```

### 4. State Tracking

Manter estado para evitar repetições:

```json
// memory/heartbeat-state.json
{
  "lastChecks": {
    "email": "2026-01-28T09:00:00Z",
    "calendar": "2026-01-28T08:30:00Z",
    "github": "2026-01-28T07:00:00Z"
  },
  "lastNotifications": {
    "email_count_today": 5,
    "calendar_reminders_sent": ["event-123", "event-456"]
  },
  "pendingDigests": {
    "emails": ["id1", "id2", "id3"]
  }
}
```

### 5. Graceful Degradation

```
┌─────────────────────────────────────────────────────────────────┐
│  FALLBACK CHAIN                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Call                                                        │
│    ↓ (falha?)                                                   │
│  Retry com backoff (3x)                                         │
│    ↓ (ainda falha?)                                             │
│  Cache local (se disponível)                                    │
│    ↓ (cache miss?)                                              │
│  Notificar user da indisponibilidade                           │
│    ↓                                                            │
│  Agendar re-tentativa para mais tarde                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Padrões de Heartbeat Inteligente

### Heartbeat vs Cron: Quando Usar Cada

| Aspecto | Heartbeat | Cron |
|---------|-----------|------|
| Timing | Aproximado (30min±) | Exacto (9:00 sharp) |
| Batching | ✅ Múltiplos checks | ❌ Uma tarefa |
| Contexto | ✅ Acesso a histórico | ❌ Isolado |
| Custo | 💰 Menor (menos calls) | 💸 Maior |
| Use case | Checks periódicos | Tarefas scheduled |

### Estrutura de Heartbeat Recomendada

```markdown
# HEARTBEAT.md

## Checks Rotativos (2-4x por dia)

### Alta Prioridade (sempre verificar)
- [ ] Emails não lidos com urgência
- [ ] Eventos calendário próximas 2h
- [ ] Menções/notificações directas

### Média Prioridade (verificar se >2h desde último)
- [ ] Novos emails gerais
- [ ] GitHub notifications
- [ ] RSS feeds favoritos

### Baixa Prioridade (1x por dia)
- [ ] Weather forecast
- [ ] News digest
- [ ] Maintenance tasks

## Regras
- Não notificar 23:00-08:00 (excepto urgente)
- Batch notificações se possível
- Actualizar heartbeat-state.json após cada check
```

### Implementação de Smart Heartbeat

```python
async def smart_heartbeat():
    state = load_state("heartbeat-state.json")
    now = datetime.now()
    notifications = []
    
    # 1. Checks de alta prioridade (sempre)
    if urgent_emails := await check_urgent_emails():
        notifications.append(f"📧 {len(urgent_emails)} emails urgentes")
    
    # 2. Calendário se evento próximo
    if upcoming := await check_calendar_next_hours(2):
        for event in upcoming:
            if event.id not in state["calendar_reminders_sent"]:
                notifications.append(f"📅 {event.title} em {event.time_until}")
                state["calendar_reminders_sent"].append(event.id)
    
    # 3. Checks de média prioridade (com cooldown)
    if hours_since(state["lastChecks"]["email"]) > 2:
        if new_emails := await check_new_emails():
            state["pendingDigests"]["emails"].extend(new_emails)
        state["lastChecks"]["email"] = now.isoformat()
    
    # 4. Batch digest se acumulou
    if len(state["pendingDigests"]["emails"]) >= 5:
        notifications.append(
            f"📬 {len(state['pendingDigests']['emails'])} emails novos para review"
        )
        state["pendingDigests"]["emails"] = []
    
    # 5. Verificar se deve notificar
    if notifications and is_appropriate_time():
        await send_notification("\n".join(notifications))
    
    save_state("heartbeat-state.json", state)
    return "HEARTBEAT_OK" if not notifications else "HEARTBEAT_NOTIFIED"
```

---

## Triggers e Automações Recomendadas

### Triggers por Categoria

#### 📧 Email

| Trigger | Acção | Prioridade |
|---------|-------|------------|
| Email de pessoa VIP | Notificar imediatamente | Alta |
| Email com keywords urgentes | Notificar + resumir | Alta |
| Novo email geral | Adicionar a digest | Baixa |
| Email não respondido >24h | Lembrete | Média |

#### 📅 Calendário

| Trigger | Acção | Timing |
|---------|-------|--------|
| Evento em <2h | Lembrete | Push |
| Evento amanhã | Preview no evening | Batch |
| Conflito de eventos | Alertar | Imediato |
| Evento cancelado | Notificar | Imediato |

#### 💻 Dev/GitHub

| Trigger | Acção | Quando |
|---------|-------|--------|
| PR needs review | Notificar | Business hours |
| CI failed | Alertar | Imediato |
| New issue assigned | Digest | Batch |
| Dependabot alert | Resumo semanal | Domingo |

#### 🔔 Monitoring

| Trigger | Acção | Urgência |
|---------|-------|----------|
| Server down | Alertar | Crítico |
| High CPU/Memory | Log + threshold alert | Média |
| SSL expiring <7d | Lembrete | Alta |
| Backup failed | Alertar | Alta |

### Automações Background Recomendadas

```yaml
# Automações que podem correr sem interacção

daily:
  - name: "Morning Briefing"
    cron: "0 8 * * *"
    actions:
      - check_calendar_today
      - check_priority_emails
      - weather_summary
      - generate_briefing

weekly:
  - name: "Weekly Review"
    cron: "0 18 * * 5"  # Sexta às 18h
    actions:
      - summarize_week_activity
      - pending_tasks_review
      - upcoming_week_preview

continuous:
  - name: "Inbox Monitor"
    trigger: "webhook:email.received"
    actions:
      - classify_urgency
      - route_or_batch

  - name: "Calendar Sync"
    trigger: "webhook:calendar.updated"
    actions:
      - update_local_cache
      - check_conflicts
```

---

## Recomendações para Clawdbot

### Arquitectura Sugerida

```
┌─────────────────────────────────────────────────────────────────┐
│  CLAWDBOT AUTOMATION ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │  HEARTBEAT   │ ←── Clawdbot cron (cada 30min)               │
│  │  Handler     │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │ HEARTBEAT.md │     │ State JSON   │     │ memory/*.md  │    │
│  │ (checklist)  │     │ (last checks)│     │ (context)    │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  CRON JOBS   │ ←── Tarefas isoladas com timing exacto       │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ├── Daily Briefing (8:00)                               │
│         ├── Weekly Review (Fri 18:00)                           │
│         └── Maintenance (Sun 03:00)                             │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  WEBHOOKS    │ ←── Eventos externos em tempo real           │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ├── Email received → classify + batch/notify            │
│         ├── Calendar updated → check conflicts                  │
│         └── GitHub event → route appropriately                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Melhorias Prioritárias

#### 1. State Persistence (Implementar Já)
```json
// memory/heartbeat-state.json
{
  "lastChecks": {},
  "pendingDigests": {},
  "notificationsSent": [],
  "userPreferences": {
    "quietHours": ["23:00", "08:00"],
    "timezone": "Europe/Lisbon"
  }
}
```

#### 2. Smart Batching (Curto Prazo)
- Agrupar notificações similares
- Digest de emails em vez de notificação por email
- Resumos periódicos em vez de alertas constantes

#### 3. Event-Driven Triggers (Médio Prazo)
- Integrar webhooks para email/calendar
- Reduzir polling, aumentar reactivity
- Processar eventos em background

#### 4. Durable Execution (Longo Prazo)
- Considerar Temporal/Inngest para workflows complexos
- Garantir que tarefas longas sobrevivem a restarts
- Human-in-the-loop para decisões importantes

### Exemplo de HEARTBEAT.md Melhorado

```markdown
# HEARTBEAT.md

## Quick Checks (every heartbeat)
- [ ] Urgent emails (VIP senders, keywords)
- [ ] Calendar events next 2 hours
- [ ] Direct mentions/notifications

## State File: memory/heartbeat-state.json

## Rules
1. Check state file for last check times
2. Skip checks if done recently (<30 min)
3. Batch non-urgent items for digest
4. Respect quiet hours (23:00-08:00 Lisbon)
5. Update state after each check
6. Reply HEARTBEAT_OK if nothing to report

## Monthly Rotation
Week 1: Focus on email optimization
Week 2: Focus on calendar/planning
Week 3: Focus on dev/code tasks  
Week 4: Focus on maintenance/cleanup
```

---

## Conclusão

A proactividade efectiva para AI assistants requer:

1. **Equilíbrio** entre ser útil e não ser intrusivo
2. **Contexto** sobre preferências e horários do utilizador
3. **Estado** persistente para evitar repetições
4. **Batching** inteligente de notificações
5. **Fallbacks** para quando APIs falham
6. **Event-driven** quando possível, polling quando necessário

O padrão ideal combina:
- **Heartbeats** para checks rotativos batched
- **Cron** para tarefas com timing exacto
- **Webhooks** para eventos em tempo real
- **State tracking** para memória entre execuções

---

*Relatório gerado em 2026-01-28*
*Pesquisa baseada em: Lindy AI, Zapier, CrewAI, LangGraph, Temporal, Inngest, Trigger.dev, Windmill, GPT Researcher*
