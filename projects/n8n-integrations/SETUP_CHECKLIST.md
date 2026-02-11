# n8n Integration Setup Checklist

Complete esta checklist para garantir que todos os workflows funcionam correctamente.

---

## ✅ PRÉ-REQUISITOS

### Sistema & Acesso

- [ ] Acesso a n8n.srv944224.hstgr.cloud
- [ ] Credenciais Hostinger para n8n
- [ ] VPN/Network conectado (se necessário)
- [ ] Navegador moderno (Chrome, Firefox, Edge)

### Contas & APIs

- [ ] Jira account ativo em aiparati.atlassian.net
- [ ] CRM access em crm.aiparati.pt
- [ ] GitHub token gerado (Settings → Developer settings)
- [ ] Gmail account com API habilitada
- [ ] Telegram bots criados (Jarvis, Aurora, etc.)
- [ ] Anthropic Claude API key obtida

---

## 🔐 CREDENCIAIS

### Jira

```
JIRA_EMAIL: [ ] Preenchido e testado
JIRA_TOKEN: [ ] Gerado em https://id.atlassian.com/manage-profile/security/api-tokens
JIRA_URL:   [ ] https://aiparati.atlassian.net
```

**Verificação:**
```bash
curl -u "$JIRA_EMAIL:$JIRA_TOKEN" \
  "https://aiparati.atlassian.net/rest/api/3/myself" -I
# Expected: 200 OK
```

- [ ] ✅ Jira auth testada

### Twenty CRM

```
CRM_API_KEY: [ ] Obtido em CRM Settings → APIs & Webhooks
CRM_WEBHOOK_SECRET: [ ] Copiado do mesmo local
CRM_API_URL: [ ] https://crm.aiparati.pt/api/rest
```

**Verificação:**
```bash
curl -H "Authorization: Bearer $CRM_API_KEY" \
  "https://crm.aiparati.pt/api/rest/people?limit=1"
# Expected: JSON response com pessoas
```

- [ ] ✅ CRM auth testada

### GitHub

```
GITHUB_TOKEN: [ ] Criado com scopes: repo, read:org, read:user
GITHUB_USERNAME: [ ] bilalmachraa82 (ou seu username)
```

**Verificação:**
```bash
gh api user --jq .login
# Expected: bilalmachraa82
```

- [ ] ✅ GitHub auth testada

### Gmail

```
GMAIL_OAUTH2: [ ] Será configurado via n8n UI (OAuth2 flow)
```

**Setup em n8n:**
1. Abrir workflow 3
2. Clicar node "Gmail: New Email Trigger"
3. Clicar "Create New" credential
4. Selecionar "Gmail OAuth2 API"
5. Fazer login com conta Gmail
6. Autorizar permissões

- [ ] ✅ Gmail OAuth2 configurado

### Telegram

```
TELEGRAM_BOT_TOKEN: [ ] Token do bot (format: 123456:ABC...)
TELEGRAM_USER_ID: [ ] ID seu (numeric)
TELEGRAM_GROUP_ID: [ ] ID grupo report (negative, ex: -123456789)
```

**Verificação:**
```bash
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"
# Expected: {"ok":true, "result":{"id":...,"username":"BotName"}}
```

- [ ] ✅ Telegram bot testado

### Claude API

```
ANTHROPIC_API_KEY: [ ] Obtido de https://console.anthropic.com
```

**Verificação (em Python):**
```python
import anthropic
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
msg = client.messages.create(model="claude-3-5-sonnet-20241022", max_tokens=100, messages=[{"role":"user","content":"test"}])
print(msg.content[0].text)
```

- [ ] ✅ Claude API testada

---

## 📦 IMPORTAR WORKFLOWS

### Workflow 1: Jira ↔ CRM Sync

```
Nome: workflow-01-jira-crm-sync.json
File: ~/clawd/projects/n8n-integrations/workflow-01-jira-crm-sync.json

Passos:
1. [ ] Ir a n8n Workflows
2. [ ] Clicar "Import from file"
3. [ ] Selecionar arquivo JSON
4. [ ] Nomear workflow
5. [ ] Clicar "Import"

Credenciais a configurar:
- [ ] Jira Webhook Trigger: Nenhuma (webhook autogenerada)
- [ ] Create/Update CRM: CRM API Key
- [ ] Send Telegram: Bot token + user ID
```

### Workflow 2: GitHub ↔ CRM Sync

```
Nome: workflow-02-github-crm-sync.json
File: ~/clawd/projects/n8n-integrations/workflow-02-github-crm-sync.json

Passos:
1. [ ] Ir a n8n Workflows
2. [ ] Clicar "Import from file"
3. [ ] Selecionar arquivo JSON
4. [ ] Nomear workflow
5. [ ] Clicar "Import"

Credenciais a configurar:
- [ ] Schedule: Timezone = Europe/Lisbon
- [ ] Fetch GitHub Repos: GitHub OAuth token
- [ ] Fetch Latest Commit: GitHub OAuth token
- [ ] Fetch Open PRs: GitHub OAuth token
- [ ] Update CRM Company: CRM API Key
- [ ] Send Completion: Telegram Bot token
```

### Workflow 3: Lead Capture Pipeline

```
Nome: workflow-03-lead-capture-pipeline.json
File: ~/clawd/projects/n8n-integrations/workflow-03-lead-capture-pipeline.json

Passos:
1. [ ] Ir a n8n Workflows
2. [ ] Clicar "Import from file"
3. [ ] Selecionar arquivo JSON
4. [ ] Nomear workflow
5. [ ] Clicar "Import"

Credenciais a configurar:
- [ ] Gmail Trigger: Gmail OAuth2
- [ ] Claude Extract: Anthropic API Key
- [ ] Create Contact: CRM API Key
- [ ] Create Opportunity: CRM API Key
- [ ] Send Auto-Reply: Gmail OAuth2
- [ ] Send Telegram Alert: Bot token + user ID
```

### Workflow 4: Daily Report Generator

```
Nome: workflow-04-daily-report-generator.json
File: ~/clawd/projects/n8n-integrations/workflow-04-daily-report-generator.json

Passos:
1. [ ] Ir a n8n Workflows
2. [ ] Clicar "Import from file"
3. [ ] Selecionar arquivo JSON
4. [ ] Nomear workflow
5. [ ] Clicar "Import"

Credenciais a configurar:
- [ ] Schedule: 18:00 Lisbon
- [ ] Fetch Jira Issues: Jira auth (Basic Auth)
- [ ] Fetch CRM Opportunities: CRM API Key
- [ ] Fetch GitHub Activity: GitHub OAuth token
- [ ] Claude Format Report: Anthropic API Key
- [ ] Send Telegram Report: Bot token + GROUP ID
- [ ] Send Email Report: Gmail OAuth2
```

### Workflow 5: Pipeline Health Monitor

```
Nome: workflow-05-pipeline-health-monitor.json
File: ~/clawd/projects/n8n-integrations/workflow-05-pipeline-health-monitor.json

Passos:
1. [ ] Ir a n8n Workflows
2. [ ] Clicar "Import from file"
3. [ ] Selecionar arquivo JSON
4. [ ] Nomear workflow
5. [ ] Clicar "Import"

Credenciais a configurar:
- [ ] Schedule: 09:00 UTC
- [ ] Fetch All Opportunities: CRM API Key
- [ ] Fetch Cold Leads: CRM API Key
- [ ] Claude Analyze Health: Anthropic API Key
- [ ] Send Health Alert: Bot token + user ID
```

---

## 🔌 CONFIGURAR WEBHOOKS

### Jira Webhook (para Workflow 1)

1. [ ] Abrir workflow 1 em n8n
2. [ ] Clicar node "Jira Webhook Trigger"
3. [ ] Copiar URL gerada (formato: `https://n8n.srv.../webhook/jira-sync-webhook`)
4. [ ] Ir a Jira Settings → Webhooks
5. [ ] Clicar "Create webhook"
6. [ ] Colar URL
7. [ ] Selecionar eventos:
   - [ ] issue created
   - [ ] issue updated
8. [ ] Salvar
9. [ ] [ ] Testar: Criar issue em Jira → deve aparecer em n8n logs

### Twenty CRM Webhook (para Workflow 1 reverse sync)

1. [ ] Ir a CRM Settings → APIs & Webhooks
2. [ ] Clicar "Create webhook"
3. [ ] URL: `https://n8n.srv.../webhook/crm-webhook` (gerar em n8n)
4. [ ] Eventos: person.created, person.updated, opportunity.created, opportunity.updated
5. [ ] Salvar
6. [ ] [ ] Testar: Criar contact em CRM → verificar logs n8n

---

## 🧪 TESTES FUNCIONAIS

### Teste 1: Jira ↔ CRM Sync

```
1. [ ] Abrir Jira em nova aba
2. [ ] Criar issue com título "Test n8n Sync"
3. [ ] Ir a n8n → Workflow 1 → Executions
4. [ ] Aguardar nova execution (deve ser imediata)
5. [ ] [ ] Status: Success ou Error?
6. [ ] [ ] Em caso de erro: Ver logs, debugar
7. [ ] Ir a CRM → Opportunities
8. [ ] [ ] Procurar "Test n8n Sync" - deve estar lá?
9. [ ] Se OK: Marcar teste como PASSED ✅
```

**Status:** [ ] PASSED [ ] FAILED

Se FAILED:
```
- Verificar Jira webhook está ativo
- Verificar CRM API key válida
- Ver logs de erro em n8n (Executions → Error)
- Testar CRM API manualmente com curl
```

### Teste 2: GitHub Sync

```
1. [ ] Ir a n8n → Workflow 2
2. [ ] Clicar "Test Workflow" (força execução)
3. [ ] Aguardar 30-60 segundos
4. [ ] [ ] Deve listar repos do GitHub
5. [ ] [ ] Deve criar/atualizar entries em CRM
6. [ ] Ir a CRM → Companies
7. [ ] [ ] Procurar repos com campos "lastCommit", "openPRs"
8. [ ] [ ] Dados estão preenchidos corretamente?
9. [ ] Se OK: PASSED ✅
```

**Status:** [ ] PASSED [ ] FAILED

### Teste 3: Lead Capture

```
1. [ ] Abrir Gmail
2. [ ] Enviar email PARA a conta (criar test email)
   Subject: "Test Lead - Hot Prospect"
   Body: "Hi, I'm interested in your product. My company is TechCorp and budget is €50K. -John Smith john@techcorp.com"
3. [ ] Aguardar ~5 minutos (polling interval)
4. [ ] Ir a n8n → Workflow 3 → Executions
5. [ ] [ ] Deve ter nova execution
6. [ ] [ ] Status: Success?
7. [ ] [ ] Verificar Telegram - recebeu alerta 🔥?
8. [ ] Ir a CRM → Contacts
9. [ ] [ ] Procurar "John Smith" - deve estar?
10. [ ] Ir a CRM → Opportunities
11. [ ] [ ] Procurar opportunity "john@techcorp.com"
12. [ ] [ ] Stage deve ser "Pipeline_Hot_Lead"?
13. [ ] Se OK: PASSED ✅
```

**Status:** [ ] PASSED [ ] FAILED

### Teste 4: Daily Report

```
1. [ ] Ir a n8n → Workflow 4
2. [ ] Clicar "Test Workflow"
3. [ ] Aguardar 30-60 segundos (fetch + formato)
4. [ ] [ ] Deve gerar relatório em markdown
5. [ ] Verificar Telegram grupo
6. [ ] [ ] Recebeu mensagem com relatório?
7. [ ] Verificar email (bilal@aiparati.pt, luis@aiparati.pt)
8. [ ] [ ] Recebeu email com subject "Daily Report"?
9. [ ] Se OK: PASSED ✅
```

**Status:** [ ] PASSED [ ] FAILED

### Teste 5: Health Monitor

```
1. [ ] Ir a CRM → Opportunities
2. [ ] Encontrar uma opportunity e simular "sem update >3 dias"
   (Editar created_at ou updated_at manualmente)
3. [ ] Ir a n8n → Workflow 5
4. [ ] Clicar "Test Workflow"
5. [ ] Aguardar 30-60 segundos
6. [ ] [ ] Se tem opp stale: Deve ter Telegram alert?
7. [ ] [ ] Status em n8n: Success?
8. [ ] Se OK: PASSED ✅
```

**Status:** [ ] PASSED [ ] FAILED

---

## 🔄 ATIVAR SCHEDULES

### Workflow 2: GitHub Sync

```
1. [ ] Ir a n8n → Workflow 2
2. [ ] Clicar workflow (abrir editor)
3. [ ] Verificar node "Schedule: Daily (09:00 UTC)"
4. [ ] [ ] Timezone correto?
5. [ ] [ ] Hora: 09:00 UTC?
6. [ ] Toggle "Active" = ON (canto superior direito)
7. [ ] [ ] Status: "ACTIVE" em verde?
```

**Status:** [ ] ATIVADO

### Workflow 4: Daily Report

```
1. [ ] Ir a n8n → Workflow 4
2. [ ] Verificar node "Schedule: 18:00 Lisbon"
3. [ ] [ ] Timezone: Europe/Lisbon?
4. [ ] [ ] Hora: 18:00?
5. [ ] Toggle "Active" = ON
6. [ ] [ ] Status: "ACTIVE" em verde?
7. [ ] Nota: Primeiro report será enviado amanhã às 18:00
```

**Status:** [ ] ATIVADO

### Workflow 5: Health Monitor

```
1. [ ] Ir a n8n → Workflow 5
2. [ ] Verificar node "Schedule: Daily 09:00 UTC"
3. [ ] [ ] Timezone: UTC?
4. [ ] [ ] Hora: 09:00?
5. [ ] Toggle "Active" = ON
6. [ ] [ ] Status: "ACTIVE" em verde?
```

**Status:** [ ] ATIVADO

---

## 📊 VERIFICAÇÃO FINAL

### Dashboard Health

```
Ir a n8n Dashboard:
- [ ] Nenhum workflow com erro (ícone 🔴)
- [ ] Workflows 2, 4, 5 com status ACTIVE (toggle verde)
- [ ] Workflows 1, 3 prontos (real-time, sempre listening)
```

### Integração Data Flow

```
- [ ] Jira → CRM: Issue criada em Jira aparece em CRM dentro de 30s
- [ ] GitHub → CRM: Repos sincronizados com últimos commits/PRs
- [ ] Email → CRM: Novo lead capturado, classificado por IA, alert Telegram
- [ ] CRM → Report: Dados do CRM incluídos no relatório diário
- [ ] CRM Health: Deals stale detectados, alertas enviados
```

### Performance Checks

```
- [ ] Nenhuma execution > 2 minutos (exceto report)
- [ ] Nenhum erro de timeout
- [ ] Nenhum erro de rate limit
- [ ] Logs limpos (sem warnings)
```

---

## 📝 PRÓXIMOS PASSOS (PÓS SETUP)

### Imediatamente

```
[ ] Dar access a Bilal para n8n dashboard
[ ] Dar access a Luis (CTO) para n8n dashboard
[ ] Documentar webhook URLs em local seguro
[ ] Fazer backup das JSON configs
```

### Diário

```
[ ] Verificar Telegram reports às 18:00
[ ] Monitorar n8n Executions para erros
[ ] Verificar que leads estão sendo capturados
```

### Semanal

```
[ ] Revisar health alerts
[ ] Verificar sync accuracy (amostral)
[ ] Consultar log de erros
```

### Mensal

```
[ ] Revisar métricas de performance
[ ] Ajustar thresholds (ex: dias para stale)
[ ] Atualizar documentação
[ ] Avaliar custos (Claude API tokens)
```

---

## 🆘 SUPORTE

Se algo correr mal:

1. **Erro em Workflow:**
   - [ ] Ir a Executions do workflow
   - [ ] Clicar na execution com erro
   - [ ] Ver "View Full Log"
   - [ ] Procurar mensagem de erro
   - [ ] Consultar README.md → Troubleshooting

2. **Webhook não recebe eventos:**
   - [ ] Verificar URL é pública e acessível
   - [ ] Verificar webhook ativo no sistema origem
   - [ ] Testar webhook manualmente com curl
   - [ ] Ver n8n logs para "connection refused"

3. **Credencial inválida:**
   - [ ] Verificar token/key não expirou
   - [ ] Regenerar se necessário
   - [ ] Testar credencial com curl antes de usar
   - [ ] Verificar permissões (scope) corretas

4. **Dados não sincronizam:**
   - [ ] Verificar API response (Check logs)
   - [ ] Testar API call manualmente
   - [ ] Verificar data mapping (campos corretos)
   - [ ] Debugar com valores static se necessário

---

## ✅ SIGN-OFF

Setup completado por: ___________________  
Data: ___________________  
Status: [ ] READY FOR PRODUCTION

---

**Versão: 1.0**  
**Data: 2026-02-11**
