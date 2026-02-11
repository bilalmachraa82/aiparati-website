# n8n Integration Workflows - Setup Guide

## 📋 Visão Geral

5 workflows n8n que conectam **Jira**, **Twenty CRM**, **GitHub**, **Gmail** e **Telegram** para automação completa de pipeline de vendas, desenvolvimento e alertas.

**Status:** Production-ready  
**Versão:** 1.0  
**Última atualização:** 2026-02-11  

---

## 🎯 Os 5 Workflows

| # | Nome | Trigger | Ação | Frequência |
|---|------|---------|------|-----------|
| 1 | Jira ↔ CRM Sync | Jira webhook | Criar/atualizar opportunity | Real-time |
| 2 | GitHub ↔ CRM Sync | Schedule | Sync repos, commits, PRs | Daily 09:00 UTC |
| 3 | Lead Capture Pipeline | Gmail trigger | Extrair lead + classificar IA | Real-time |
| 4 | Daily Report | Schedule | Gerar relatório consolidado | Daily 18:00 Lisbon |
| 5 | Pipeline Health Monitor | Schedule | Detectar deals stale + alertas | Daily 09:00 UTC |

---

## 🔧 Pré-requisitos

### Credenciais Necessárias

#### 1. **Jira** (aiparati.atlassian.net)
```
JIRA_URL: https://aiparati.atlassian.net
JIRA_EMAIL: seu-email@domain.com
JIRA_TOKEN: api-token-gerado-em-account-settings
JIRA_PROJECT: DEV
```

**Como obter:**
- Ir a https://id.atlassian.com/manage-profile/security/api-tokens
- Clicar "Create API token"
- Copiar o token gerado

#### 2. **Twenty CRM** (crm.aiparati.pt)
```
CRM_API_URL: https://crm.aiparati.pt/api/rest
CRM_API_KEY: obtido em Settings → APIs & Webhooks
CRM_WEBHOOK_SECRET: gerado no mesmo local
```

**Como obter:**
- Login em crm.aiparati.pt
- Settings → APIs & Webhooks
- Gerar API Key
- Copiar webhook secret para validação

#### 3. **GitHub** (bilalmachraa82)
```
GITHUB_TOKEN: ghp_xxxxxxxxxxxx
GITHUB_USERNAME: bilalmachraa82
```

**Como obter:**
- GitHub Settings → Developer settings → Personal access tokens
- Gerar token com scopes: `repo`, `read:org`, `read:user`
- Já configured via `gh` CLI

#### 4. **Gmail** (OAuth2)
```
GMAIL_OAUTH2: Configuração automática via n8n
```

**Como obter:**
- n8n criará automaticamente na primeira autenticação
- Precisa de conta Gmail com API habilitada

#### 5. **Telegram** (Bots Jarvis, Aurora, Leni, Midas)
```
TELEGRAM_BOT_TOKEN: Existing bot tokens
TELEGRAM_USER_ID: ID Bilal + Luis
TELEGRAM_GROUP_ID: ID grupo de reports
```

**Onde encontrar:**
- Tokens em `~/clawd/.env.secrets`
- IDs em histórico do BotFather

#### 6. **Claude API** (Anthropic)
```
ANTHROPIC_API_KEY: Obtido de 1Password
```

---

## 📦 Como Importar Workflows

### Passo 1: Acessar n8n
```
https://n8n.srv944224.hstgr.cloud/
Login com credenciais Hostinger
```

### Passo 2: Importar cada workflow
```
1. Clicar "Workflows" no menu esquerdo
2. Clicar "Import from file"
3. Selecionar arquivo JSON
   - workflow-01-jira-crm-sync.json
   - workflow-02-github-crm-sync.json
   - workflow-03-lead-capture-pipeline.json
   - workflow-04-daily-report-generator.json
   - workflow-05-pipeline-health-monitor.json
```

### Passo 3: Configurar Credenciais
Para CADA workflow importado:

```
1. Abrir o workflow
2. Clicar em cada node com credenciais (destacados em vermelho)
3. Clicar "Create New" credencial
4. Selecionar tipo apropriado:
   - Jira → "Jira Server"
   - CRM → "HTTP Basic Auth" ou "Bearer Token"
   - GitHub → "OAuth2" ou "Personal Token"
   - Gmail → "OAuth2"
   - Telegram → "Telegram Bot API"
   - Claude → "Anthropic"
5. Preencher os dados acima
6. Guardar
```

### Passo 4: Ativar Webhooks (se necessário)
Para workflows com triggers de webhook:

```
1. Abrir workflow
2. Clicar no node "Webhook" ou "Trigger"
3. Copiar URL gerada (ex: https://.../.../webhook/jira-sync)
4. Ir ao sistema origem (Jira, Twenty, etc.)
5. Settings → Webhooks → Create
6. Colar URL
7. Ativar
```

---

## 🚀 Configuração Por Workflow

### **Workflow 1: Jira ↔ CRM Sync**

**Setup:**
1. Em n8n, abrir workflow importado
2. Node "Jira Webhook Trigger":
   - Copiar webhook URL gerada
3. Em Jira (Settings → Webhooks):
   - Create webhook com URL acima
   - Events: "issue created" e "issue updated"
4. Node "Create/Update CRM Opportunity":
   - Autenticar com CRM API key
5. Salvar e ativar workflow

**Teste:**
```bash
# Criar issue em Jira
# Verificar se aparece no CRM automaticamente
# Verificar logs em n8n → Executions
```

---

### **Workflow 2: GitHub ↔ CRM Sync**

**Setup:**
1. Node "Schedule: Daily":
   - Já configurado para 09:00 UTC
   - Ajustar se necessário
2. Node "Fetch GitHub Repos":
   - Autenticar com GitHub token
   - Verificar que username está correto
3. Node "Update CRM Company":
   - Autenticar com CRM API key
4. Ativar

**Teste:**
```bash
# Clicar "Test Workflow"
# Deverá listar repos do GitHub
# Deverá atualizar CRM com dados
```

---

### **Workflow 3: Lead Capture Pipeline**

**Setup:**
1. Node "Gmail: New Email Trigger":
   - Fazer login com Gmail
   - Filtrar por label (ex: INBOX)
   - Polling interval: 5 minutos
2. Node "Claude: Extract Lead Data":
   - Autenticar com Anthropic API
3. Node "Create CRM Contact" + "Create CRM Opportunity":
   - Autenticar com CRM API
4. Node "Send Auto-Reply Email":
   - Gmail OAuth já deve estar autenticada
5. Node "Send Telegram Alert":
   - Configurar bot token
6. Ativar

**Teste:**
```bash
# Enviar email para a caixa
# Aguardar 5 minutos para polling
# Verificar CRM para novo contact
# Verificar Telegram para alerta
```

---

### **Workflow 4: Daily Report Generator**

**Setup:**
1. Node "Schedule: 18:00 Lisbon":
   - Timezone: Europe/Lisbon
   - Hora: 18:00
2. Nós "Fetch Jira Issues", "Fetch CRM Opportunities", "Fetch GitHub Activity":
   - Autenticar cada um (Jira, CRM, GitHub)
3. Node "Claude: Format Report":
   - Autenticar com Anthropic
4. Node "Send to Telegram":
   - Telegram group ID (negativo, ex: -123456789)
   - Bot token
5. Node "Send Email Report":
   - Gmail OAuth
6. Ativar

**Teste:**
```bash
# Clicar "Test Workflow" (sem esperar schedule)
# Verificar relatório em Telegram
# Verificar email recebido
```

---

### **Workflow 5: Pipeline Health Monitor**

**Setup:**
1. Node "Schedule: Daily 09:00 UTC":
   - Já configurado
2. Node "Fetch All Opportunities":
   - Autenticar CRM
3. Loop e checks:
   - Automático após fetch
4. Node "Claude: Analyze Pipeline Health":
   - Autenticar Anthropic
5. Node "Send Health Alert":
   - Configurar Telegram
6. Ativar

**Teste:**
```bash
# Clicar "Test Workflow"
# Deverá gerar alerta se há deals stale
```

---

## 🔐 Variáveis de Ambiente

Guardar em `~/.n8n.env`:

```bash
# Jira
JIRA_EMAIL=your-email@domain.com
JIRA_TOKEN=xxxxxxxxxxxxx
JIRA_URL=https://aiparati.atlassian.net

# CRM Twenty
CRM_API_URL=https://crm.aiparati.pt/api/rest
CRM_API_KEY=xxxxxxxxxxxxx
CRM_WEBHOOK_SECRET=xxxxxxxxxxxxx

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABCDEFGHIJKLMNOPQRSTUVWxyz
TELEGRAM_USER_ID=123456789
TELEGRAM_GROUP_ID=-123456789

# Claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Gmail (auto-gerado)
GMAIL_OAUTH2=auto
```

---

## 📊 Integração com Jira

### Criar Webhook em Jira

```bash
# Via curl (se preferir API):
curl -s -u $JIRA_EMAIL:$JIRA_TOKEN -X POST \
  "https://aiparati.atlassian.net/rest/api/3/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "n8n Sync",
    "url": "https://n8n.srv944224.hstgr.cloud/webhook/jira-sync",
    "events": ["jira:issue_created", "jira:issue_updated"],
    "filters": {"issue_related_events_section": ""}
  }'
```

### Validar Webhook

```bash
# Testar webhook trigger em Jira
# Settings → Webhooks → Seu webhook
# Clicar "Send test notification"
```

---

## 📞 Integração com Telegram

### Obter Chat IDs

```bash
# Para user ID:
# 1. Enviar mensagem ao bot
# 2. Ir a https://api.telegram.org/bot{TOKEN}/getUpdates
# 3. Procurar "from": {"id": 123456789}

# Para group ID:
# 1. Adicionar bot ao grupo
# 2. Enviar mensagem no grupo
# 3. Mesmo endpoint acima, procurar "chat": {"id": -123456789}
```

### Bots Disponíveis

| Bot | Token | Função |
|-----|-------|--------|
| Jarvis | Em .env | Principais notificações |
| Aurora | Em .env | Moloni sync |
| Leni | Em .env | Suporte/IA |
| Midas | Em .env | Financeiro |

---

## 🧪 Testes & Validação

### Checklist de Verificação

```
□ Workflow 1: Criar issue em Jira → aparece em CRM
□ Workflow 2: Repos do GitHub sincronizam em CRM
□ Workflow 3: Email recebido → Lead criado em CRM
□ Workflow 4: Report gerado e enviado às 18:00
□ Workflow 5: Alerts enviados para deals stale

□ Credenciais todas validadas
□ Webhooks ativos em origem
□ Logs sem erros
□ Execuções concluídas com sucesso
```

### Debugar Erros

```bash
# Em n8n:
# 1. Clicar workflow
# 2. Clicar "Executions" (histórico)
# 3. Procurar execution com erro (marca vermelha)
# 4. Clicar "View Full Log"
# 5. Procurar mensagem de erro

# Erros comuns:
# "401 Unauthorized" → Credencial inválida
# "404 Not Found" → URL errada
# "Connection timeout" → API down ou firewall
# "Invalid JSON" → Formato de dados errado
```

---

## 📈 Performance & Limits

### Rate Limits Verificados

| Sistema | Limite | Impacto |
|---------|--------|--------|
| Jira API | 10 req/sec | ✅ Sem problema |
| CRM API | Custom | ✅ Sem problema |
| GitHub API | 60 req/hour (auth) | ✅ Sem problema |
| Gmail API | 250 req/day | ⚠️ Monitorar |
| Telegram | Unlimited | ✅ Sem problema |

### Otimizações

- **Workflow 2 (GitHub):** Loop sobre repos com batches de 5
- **Workflow 3 (Gmail):** Polling a 5 min, otimizar se necessário
- **Workflow 4 (Report):** Executar 1x/dia, aceita delays
- **Workflow 5 (Monitor):** Executar 1x/dia, alerts só se problemas

---

## 🆘 Troubleshooting

### Workflow não executa no schedule

```
1. Verificar que workflow está ativado (toggle verde)
2. Verificar timezone correto
3. Clicar "Test" para forçar execução manual
4. Verificar logs de erro
```

### Dados não sincronizam

```
1. Verificar autenticação (credentials válidas)
2. Verificar URLs (não typos)
3. Verificar formato JSON (valid)
4. Verificar firewall/VPN
5. Testar API manualmente com curl
```

### Telegram não recebe mensagens

```
1. Verificar token bot válido
2. Verificar chat ID correto (negativo para grupos)
3. Verificar bot tem permissão no grupo
4. Verificar que não foi kickado
```

### Gmail não detecta emails

```
1. Verificar que Gmail OAuth está autenticada
2. Verificar que emails estão em INBOX (não archived)
3. Verificar polling interval
4. Testar com "Test Workflow" (força execução)
```

---

## 🔄 Manutenção Contínua

### Diário
- ✅ Verificar execuções de workflows em n8n dashboard
- ✅ Verificar alertas Telegram (se houver)

### Semanal
- ✅ Revisar logs de erro
- ✅ Verificar sync de dados (manual sampling)

### Mensal
- ✅ Avaliar performance
- ✅ Revisar e ajustar regras (ex: dias para stale)
- ✅ Atualizar documentação

---

## 📞 Suporte & Contactos

**n8n Cloud Support:** https://n8n.io/support  
**n8n Community:** https://community.n8n.io  
**Twenty CRM Docs:** https://docs.twenty.com  

**Internal Contacts:**
- Bilal (Product) - bilal@aiparati.pt
- Luis (CTO) - luis@aiparati.pt +351967798267

---

## 📝 Changelog

### v1.0 (2026-02-11)
- ✅ Workflow 1: Jira ↔ CRM Sync
- ✅ Workflow 2: GitHub Daily Sync
- ✅ Workflow 3: Lead Capture + AI Classification
- ✅ Workflow 4: Daily Report (18:00 Lisbon)
- ✅ Workflow 5: Pipeline Health Monitor
- ✅ Documentação completa

---

## 📄 Licença

Interno AiParaTi. Uso exclusivo para equipa.

---

**Documento de Setup: v1.0**  
**Última verificação: 2026-02-11**
