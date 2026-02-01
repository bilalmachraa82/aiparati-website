#!/bin/bash
# Dream Team Report to CTO - 18:00 Lisbon
# Envia resumo diário ao Luís via Telegram

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATE=$(date +%Y-%m-%d)
REPORT_FILE="/tmp/dream-team-report-$DATE.md"

echo "📊 Generating Dream Team Report for CTO..."

# CTO info
CTO_NAME="Luís Sombreireiro"
CTO_TELEGRAM="+351967798267"

# Get Jira updates
source ~/clawd/.env.secrets.jira 2>/dev/null

# Tasks completed today
COMPLETED=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
    -H "Content-Type: application/json" \
    -d "{\"jql\": \"project=DEV AND status = Done AND updated >= -1d\", \"maxResults\": 10, \"fields\": [\"summary\"]}" \
    | jq -r '.issues[] | "• [\(.key)] \(.fields.summary)"' 2>/dev/null || echo "• Nenhuma tarefa concluída")

# Tasks in progress
IN_PROGRESS=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
    -H "Content-Type: application/json" \
    -d "{\"jql\": \"project=DEV AND status = \\\"In Progress\\\"\", \"maxResults\": 10, \"fields\": [\"summary\", \"assignee\"]}" \
    | jq -r '.issues[] | "• [\(.key)] \(.fields.summary)"' 2>/dev/null || echo "• Nenhuma tarefa em progresso")

# Blockers
BLOCKERS=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
    -H "Content-Type: application/json" \
    -d "{\"jql\": \"project=DEV AND priority = Highest AND status != Done\", \"maxResults\": 5, \"fields\": [\"summary\"]}" \
    | jq -r '.issues[] | "• [\(.key)] \(.fields.summary)"' 2>/dev/null || echo "• Nenhum bloqueador")

# Generate report
cat > "$REPORT_FILE" << EOF
📊 **DREAM TEAM DAILY REPORT**
📅 $DATE | 🕕 $(date +%H:%M) Lisbon

━━━━━━━━━━━━━━━━━━━━━━━

✅ **CONCLUÍDO HOJE:**
$COMPLETED

🔄 **EM PROGRESSO:**
$IN_PROGRESS

⚠️ **BLOQUEADORES:**
$BLOCKERS

━━━━━━━━━━━━━━━━━━━━━━━

🎯 **PRIORIDADES AMANHÃ:**
• IVAzen: Stripe integration (MVP 7 Fev)
• Aurora: WhatsApp agent
• MIDAS: Dashboard web

📈 **MÉTRICAS:**
• Tarefas Jira activas: $(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" -H "Content-Type: application/json" -d '{"jql": "project=DEV AND status != Done", "maxResults": 0}' | jq -r '.total' 2>/dev/null || echo "?")
• PRs abertos: $(gh pr list --state open --limit 100 2>/dev/null | wc -l || echo "?")

━━━━━━━━━━━━━━━━━━━━━━━
_Dream Team Report • JARVIS_
EOF

echo "Report saved: $REPORT_FILE"
cat "$REPORT_FILE"

# TODO: Send via Clawdbot message tool
# For now, just output the report
echo ""
echo "📤 To send to CTO, use Clawdbot message tool with target: $CTO_TELEGRAM"
