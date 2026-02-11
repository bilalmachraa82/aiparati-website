# n8n Integration Architecture

## 🏗️ Visão Global do Sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         n8n Integration Hub                             │
│                    (n8n.srv944224.hstgr.cloud)                          │
└─────────────────────────────────────────────────────────────────────────┘

    ↓ ↓ ↓              ↓ ↓ ↓              ↓ ↓ ↓              ↓ ↓ ↓
    
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Jira DEV      │  │  GitHub Repos  │  │  Gmail Inbox   │  │  Twenty CRM    │
│                │  │                │  │                │  │                │
│ Issues         │  │ 30+ repos      │  │ Lead capture   │  │ Opportunities  │
│ Tasks          │  │ Commits        │  │ Auto-reply     │  │ Contacts       │
│ Epics          │  │ PRs            │  │ Classification │  │ Pipelines      │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
      ↑                    ↑                    ↑                    ↑
      │                    │                    │                    │
      └────────────────────┴────────────────────┴────────────────────┘
      
                    WEBHOOKS + APIs + Schedules
                    
    ↓ ↓ ↓              ↓ ↓ ↓              ↓ ↓ ↓
    
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Telegram      │  │  Claude AI     │  │  Email         │
│                │  │                │  │                │
│ 4 bots active  │  │ Lead classify  │  │ Auto-reply     │
│ Alerts         │  │ Report format  │  │ Daily digest   │
│ Reports        │  │ Health analyze │  │ Notifications  │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

## 🔄 Fluxo Por Workflow

### **Workflow 1: Jira ↔ CRM Sync (Real-time)**

```
Jira Issue Event
    ↓
[Webhook Trigger]
    ↓
[Check Event Type] (created/updated)
    ↓
    ├─→ [Find Existing Opp in CRM]
    │       ↓
    │   [Exists?]
    │   ├→ YES: [Update CRM Opportunity]
    │   └→ NO:  [Create new]
    │       ↓
    └─→ [Send Telegram Notification]
        ↓
    [✅ Complete]
```

**Dados Mapeados:**
```
Jira Field              → CRM Field
─────────────────────────────────────
issue.key              → customField.jiraKey
issue.summary          → opportunity.name
issue.description      → opportunity.description
issue.status           → opportunity.stage
issue.assignee         → customField.assignee
issue.customfield      → customField.jiraData
```

**Timings:**
- Real-time (webhook acionado imediatamente)
- SLA: <30 segundos entre evento e sync

---

### **Workflow 2: GitHub Daily Sync (Schedule: 09:00 UTC)**

```
[Schedule Trigger - Daily 09:00 UTC]
    ↓
[Fetch GitHub Repos] (user: bilalmachraa82)
    ↓
[Loop Each Repo]
    ├─→ [Fetch Latest Commit] ─┐
    │                          │
    ├─→ [Fetch Open PRs]       ├─→ [Merge Data]
    │                          │
    └─→ [Get Repo Stats]   ─┘
        ↓
[Update CRM Company Fields]
    ├─ lastCommit
    ├─ lastCommitMessage
    ├─ openPRs count
    ├─ stars
    └─ language
        ↓
[Send Completion Alert to Telegram]
    ↓
[✅ Complete]
```

**Dados Extraídos:**
```
GitHub Data            → CRM customField
─────────────────────────────────────
repo.name              → company.name
repo.html_url          → githubRepo
repo.stargazers_count  → githubStars
commit.author.date     → lastCommit
commit.message         → lastCommitMessage
pull_requests.length   → openPRs
repo.language          → language
repo.updated_at        → lastUpdated
```

**Performance:**
- Processa 30 repos em ~2-3 minutos
- API quota: ~50 calls (within limits)
- Batch size: 1 repo por iteração

---

### **Workflow 3: Lead Capture Pipeline (Real-time)**

```
Email Received in Gmail
    ↓
[Gmail Trigger - Polling 5min]
    ↓
[Claude: Extract Lead Data] (Anthropic API)
    │
    ├─ firstName, lastName, email
    ├─ company, phone
    ├─ leadQuality (hot/warm/cold)
    └─ interest summary
    ↓
[Parse JSON Response]
    ↓
[Parallel Actions]
    ├─→ [Create Contact in CRM]
    │       ↓
    │   [Create Opportunity from Lead]
    │       ├─ Stage: based on quality
    │       └─ Custom: AI classification
    │           ↓
    ├─→ [Send Auto-Reply Email]
    │       ↓
    │   Subject: "✅ Lead Received"
    │   Body: Welcome message
    │       ↓
    └─→ [Send Telegram Alert]
            ├─ Emoji: 🔥 (hot), 🟡 (warm), 🔵 (cold)
            ├─ Email, company, quality
            └─ Trigger: IMMEDIATE
    ↓
[✅ Complete]
```

**AI Classification Logic:**
```
Email Analysis by Claude:
- Domain reputation (corporate vs. spam)
- Email tone (professional vs. casual)
- Request urgency (immediate vs. informational)
- Company size signals
- Explicit interest signals

Result: hot | warm | cold
─────────────────────────
hot:   Buy-now signals + decision maker + budget mention
warm:  Interested but early stage + need qualification
cold:  Information-only + no urgency + generic inquiry
```

**CRM Pipeline Mapping:**
```
Lead Quality    → CRM Pipeline Stage
─────────────────────────────────────
hot             → Pipeline_Hot_Lead (45% close rate)
warm            → Pipeline_Warm_Lead (20% close rate)
cold            → Pipeline_Cold_Lead (5% close rate)
```

---

### **Workflow 4: Daily Report Generator (Schedule: 18:00 Lisbon)**

```
[Schedule Trigger - Daily 18:00 Europe/Lisbon]
    ↓
[Parallel Data Fetch]
├─→ [Jira: Updated Issues Last 24h]
│   ├─ Query: project=DEV AND updated>=-1d
│   └─ Fields: key, summary, status, assignee
│       ↓
├─→ [CRM: Updated Opportunities Last 24h]
│   ├─ Filter: updatedAt > -1d
│   └─ Get: stage, amount, owner, probability
│       ↓
└─→ [GitHub: User Activity Events Last 24h]
    ├─ Fetch: push, PR, create events
    └─ Count commits, PRs opened
        ↓
[Claude: Format Report]
├─ Markdown formatting
├─ Emoji indicators
├─ Key metrics summary
└─ Action items
    ↓
[Parallel Delivery]
├─→ [Send to Telegram Group]
│   ├─ Group ID: $TELEGRAM_GROUP_ID
│   └─ Recipients: Bilal + Luis (CTO)
│       ↓
└─→ [Send Email to Team]
    ├─ To: bilal@aiparati.pt, luis@aiparati.pt
    ├─ Subject: "Daily Report - YYYY-MM-DD"
    └─ Body: Markdown formatted
        ↓
[✅ Complete - Report Delivered]
```

**Report Structure:**
```
## Daily Report - 2026-02-11

### 🎯 Jira Updates (DEV Project)
Issues updated: 12
- DEV-450: Login flow auth redesign [In Progress]
- DEV-451: Database migration [In Review]
- DEV-452: Mobile responsive fixes [Done]

### 💼 CRM Pipeline
Opportunities updated: 5
- New leads: 3 (2 hot, 1 warm)
- Deals moved: 2 (Negotiation → Closing)
- Revenue pipeline: €450K

### 🔧 GitHub Activity
Commits: 24 pushes across repos
- ivazen-saas: 8 commits (auth module)
- dream-team: 5 commits (UI fixes)
- open-source: 11 commits

### ⚠️ Alerts
- None critical
```

---

### **Workflow 5: Pipeline Health Monitor (Schedule: Daily 09:00 UTC)**

```
[Schedule Trigger - Daily 09:00 UTC]
    ↓
[Parallel Checks]
├─→ [Fetch All Opportunities]
│   │
│   └─→ [Loop Each Opp]
│       │
│       ├─→ [Check: Last Update >3 days ago?]
│       │   └─ YES: Mark as STALE
│       │           ↓
│       │       [Move to Pipeline_NeedsAttention]
│       │       ├─ Status: Stale
│       │       └─ Alert: Flag = true
│       │
│       └─→ [Check: Lost opportunity signals?]
│           └─ Probability <20% & no activity
│               ↓
│           [Auto-transition to "At Risk"]
│
├─→ [Fetch Cold Leads]
│   │
│   ├─→ [Check: Lead Quality = Cold?]
│   │   └─ YES: No follow-up >30 days
│   │           ↓
│   │       [Queue for nurture sequence]
│   │
│   └─→ [Check: Stale for >60 days?]
│       └─ YES: Archive & notify
│
└─→ [Fetch Overdue Tasks]
    └─ Assigned to people with no owner
        ↓
[Claude: Analyze Health]
├─ Aggregate issues
├─ Calculate priority
└─ Generate recommendations
    ↓
[Send Telegram Alert]
├─ If totalAlerts > 0:
│  ├─ 🚨 CRITICAL: # alerts
│  ├─ Stale deals: [list]
│  ├─ Cold leads: [list]
│  ├─ Actions: [recommendations]
│  └─ Send immediately
│
└─ If no alerts:
   └─ Skip (no noise)
       ↓
[✅ Complete - Monitor Ran]
```

**Health Score Calculation:**
```
Issues Detected                 | Severity | Action
────────────────────────────────┼──────────┼──────────────
No update >3 days              | MEDIUM   | Move to Attention
No update >7 days              | HIGH     | Archive warning
Deal probability <20%          | MEDIUM   | Review call
Lead quality=cold >60 days     | LOW      | Nurture or archive
Task overdue >5 days           | HIGH     | Reassign
No owner assigned              | CRITICAL | Escalate
────────────────────────────────┴──────────┴──────────────

Total Score = (CRITICAL×3 + HIGH×2 + MEDIUM×1 + LOW×0.5)
Alert if Score > 2
```

---

## 📡 API Integration Patterns

### Pattern 1: Webhook Trigger → Sync Action

```
External System          n8n Workflow           Target System
(Jira)                   (n8n)                  (CRM)
   │                        │                      │
   ├─ Event              →   [Webhook Trigger]     │
   │                        │                      │
   │                        ├─ Transform Data      │
   │                        │                      │
   │                        └─ HTTP Request    →   ├─ API Call
   │                                               │
   │                                           [Update/Create]
   │                                               │
   │                                           [Response]
   │                        ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ├─
   │                        │
   │                        ├─ Log Result
   │                        │
   │                        └─ Notify
   │
   └─ Confirmation ← ────────────────────────────
```

### Pattern 2: Schedule → Fetch → Update

```
Schedule                 n8n              External APIs        CRM
(Cron)                (n8n)             (GitHub, Jira)       (n8n)
   │                      │                   │                 │
   ├─ Fire Event      →    [Cron Trigger]     │                 │
   │                       │                   │                 │
   │                       ├─ Fetch Data  →   ├─ GET request    │
   │                       │                   │                 │
   │                       │              ←─ Response data ──┐   │
   │                       │                   │             │   │
   │                       ├─ Process      ┌──┘              │   │
   │                       │               │                 │   │
   │                       ├─ Transform ───┘                 │   │
   │                       │                                 │   │
   │                       ├─ Batch Update    →           ├─ Update
   │                       │                              │
   │                       ├─ Log & Notify               │
   │                       └─────────────────────────────┘
```

### Pattern 3: AI Processing Pipeline

```
Input Data              Claude API             Structured Output
(Email text)         (Anthropic)             (JSON)
   │                      │                      │
   ├─ Raw text        →   [Claude Model]        │
   │                       │                    │
   │                       ├─ Analyze           │
   │                       ├─ Extract           │
   │                       ├─ Classify      →   ├─ firstName
   │                       └─ Score            ├─ email
   │                                           ├─ company
   │                                           ├─ leadQuality
   │                                           └─ interest
   │                                               │
   └─────────────────────────────────────────────┘
                    Used for CRM sync
```

---

## 🔐 Security & Authentication

### Credential Storage

```
n8n Credentials    ← Encrypted Storage ← 1Password Vault
   │
   ├─ Jira Auth (Basic or Token)
   ├─ CRM Auth (Bearer Token)
   ├─ GitHub OAuth2
   ├─ Gmail OAuth2
   ├─ Telegram Bot Token
   └─ Claude API Key
```

### Data Flow Security

```
External → n8n  →  Processing  →  External
  │                   │              │
  └─ HTTPS/TLS ──────┘          └─ HTTPS/TLS
     (encrypted)                  (encrypted)

Webhook Validation:
├─ X-Twenty-Webhook-Signature (HMAC SHA256)
├─ X-Twenty-Webhook-Timestamp
└─ Validate on receipt
```

### Permission Model

```
System            | User Role      | Data Access
──────────────────┼────────────────┼──────────────
Jira              | DEV project    | Issues, Tasks
CRM               | Full API       | All records
GitHub            | Personal token | Public + Private
Gmail             | OAuth2 scopes  | Read/Send only
Telegram          | Bot token      | Target chats
Claude            | API key        | Stateless calls
```

---

## 📊 Data Mapping Reference

### Jira → CRM Mapping

| Jira | Type | → CRM | Type | Notes |
|------|------|-------|------|-------|
| Issue Key | string | customField.jiraKey | string | Unique ID |
| Summary | string | opportunity.name | string | Title |
| Description | text | opportunity.description | text | Details |
| Status | select | opportunity.stage | select | See stage map |
| Assignee | user | customField.assignee | string | Owner name |
| Epic | link | customField.jiraEpic | string | Feature/epic name |
| Created | date | customField.createdAt | date | Timestamp |

**Status → Stage Mapping:**
```
Jira Status    → CRM Pipeline Stage
─────────────────────────────────────
To Do          → Pipeline_Initial
In Progress    → Pipeline_Active
In Review      → Pipeline_Review
Done           → Pipeline_Closed
Blocked        → Pipeline_AtRisk
```

### GitHub → CRM Company Fields

| GitHub | → CRM Custom Field | Example |
|--------|-------------------|---------|
| repo.name | company.name | "ivazen-saas" |
| repo.html_url | githubRepo | "https://github.com/..." |
| stargazers_count | githubStars | 42 |
| latest_commit.date | lastCommit | "2026-02-11T10:30Z" |
| latest_commit.message | lastCommitMessage | "Fix auth flow" |
| open_prs.length | openPRs | 3 |
| repo.language | language | "TypeScript" |

### Email → Person/Opportunity

| Email Data | → CRM Field |
|------------|-------------|
| From address | person.email |
| From name | person.firstName/lastName |
| Subject | opportunity.name |
| Body (extracted) | customField.interest |
| AI Classification | opportunity.stage + leadQuality |
| Received date | person.createdAt |

---

## 🎯 Execution Order & Dependencies

```
STARTUP SEQUENCE:
1. Workflow 1 (Jira) - Real-time, always on
2. Workflow 3 (Email) - Real-time, always on
3. Workflow 2 (GitHub) - Schedule 09:00 UTC
4. Workflow 5 (Monitor) - Schedule 09:00 UTC (parallel with #3)
5. Workflow 4 (Report) - Schedule 18:00 Lisbon

RETRY POLICY:
├─ Failed execution: Retry 2x with 5min delay
├─ Webhook endpoints: 3 retries on 5xx errors
└─ API calls: exponential backoff (1s, 2s, 4s)

TIMEOUT VALUES:
├─ Jira API calls: 30s
├─ CRM API calls: 30s
├─ GitHub API calls: 45s
├─ Gmail polling: 60s
├─ Claude processing: 60s
└─ Telegram notifications: 10s
```

---

## 🚨 Error Handling & Recovery

```
Error Type              | Handling          | Recovery
────────────────────────┼───────────────────┼──────────────────
Auth (401/403)         | Halt workflow     | Manual credential update
API Down (503)         | Retry with backoff| Auto-retry next execution
Invalid Data (400)     | Log error         | Review data mapping
Timeout                | Retry once        | Escalate if persistent
Rate Limited (429)     | Backoff & defer   | Stagger requests
Network (timeout)      | Retry 2x          | Alert ops if >2x fail
```

---

## 📈 Scalability Notes

### Current Load
```
Jira webhook:      Real-time (variable)
GitHub sync:       30 repos/day = 90 API calls/day
Email polling:     5min interval = 288 checks/day
CRM polling:       Various API calls
Report generation: 1x/day
Health monitor:    1x/day
```

### Bottlenecks & Solutions
```
Bottleneck                 | Current | Solution
───────────────────────────┼─────────┼──────────────────
Gmail polling (5min)       | 288/day | Keep as-is (safe)
GitHub loop (30 repos)     | ~45 API | Within limits
CRM API calls             | Batched | Works fine
Telegram notifications    | Unlimited | No concern
Claude API processing     | $tokens | Monitor cost
```

### Future Scaling
```
If 100+ repos:
├─ Split GitHub workflow into batches
├─ Paginate CRM calls
└─ Use background job queues

If 1000+ daily workflows:
├─ Add dedicated n8n worker nodes
├─ Cache frequently-accessed data
└─ Implement database-level filtering
```

---

## 🔄 Data Freshness & Consistency

| Workflow | Data Source | Refresh | Freshness SLA |
|----------|-------------|---------|---------------|
| Jira Sync | Webhook | Real-time | <30 sec |
| GitHub | Schedule | Daily 09:00 | 24 hours |
| Lead Capture | Gmail | Polling 5min | <5 min |
| Report | Multiple | Daily 18:00 | 24 hours |
| Monitor | CRM | Daily 09:00 | 24 hours |

**Consistency Checks:**
- Jira ↔ CRM: Bidirectional validation on sync
- GitHub → CRM: Daily verification of 10 random repos
- Email → Lead: Manual spot-checks of AI classification weekly

---

## 📋 Monitoring & Observability

### Key Metrics to Monitor

```
Dashboard KPIs:
├─ Workflow success rate (target: >99%)
├─ Average execution time
├─ API error rate
├─ Alerts triggered per day
├─ Data sync latency (ms)
└─ Cost (API calls, tokens used)

Alerts to Set:
├─ Workflow failure (immediate)
├─ Auth error (immediate)
├─ Rate limit approaching (warning)
├─ Execution timeout (warning)
└─ Unusual data spike (monitoring)
```

---

## 📞 Support & Escalation

```
Issue Severity    | Escalation Path
──────────────────┼────────────────────────────
P0 (System down)  | Luis (CTO) immediately
P1 (Data loss)    | Bilal + Luis within 1h
P2 (Delays)       | Team morning sync
P3 (Minor)        | Document + plan fix
───────────────────┴────────────────────────────
```

---

**Architecture Version: 1.0**  
**Last Updated: 2026-02-11**  
**Maintained By: AiParaTi Platform Team**
