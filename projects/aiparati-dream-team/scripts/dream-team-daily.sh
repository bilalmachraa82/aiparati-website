#!/bin/bash
# Dream Team Daily Analysis - 09:00 Lisbon
# Analisa repos, identifica tarefas, distribui aos agentes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="/tmp/dream-team-daily-$(date +%Y-%m-%d).log"

echo "🌅 Dream Team Daily Analysis - $(date)" | tee "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"

# 1. Verificar Jira para novas tarefas
echo "" | tee -a "$LOG_FILE"
echo "📋 1. Verificando Jira..." | tee -a "$LOG_FILE"
source ~/clawd/.env.secrets.jira 2>/dev/null || {
    echo "⚠️ Jira credentials não encontradas" | tee -a "$LOG_FILE"
}

if [ -n "$JIRA_EMAIL" ]; then
    JIRA_TASKS=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
        -H "Content-Type: application/json" \
        -d '{"jql": "project=DEV AND status = \"To Do\" ORDER BY priority DESC", "maxResults": 20, "fields": ["summary", "status", "priority", "issuetype"]}' \
        | jq -r '.issues[] | "[\(.fields.priority.name // "Medium")] \(.key): \(.fields.summary)"' 2>/dev/null)
    
    echo "$JIRA_TASKS" | tee -a "$LOG_FILE"
else
    echo "Skipping Jira check" | tee -a "$LOG_FILE"
fi

# 2. Verificar estado dos repos
echo "" | tee -a "$LOG_FILE"
echo "📦 2. Estado dos Repositórios..." | tee -a "$LOG_FILE"

REPOS=(
    "bilalmachraa82/ivazen-saas"
    "bilalmachraa82/aurora-oceano-bot"
    "bilalmachraa82/midas-finance"
)

for repo in "${REPOS[@]}"; do
    echo "" | tee -a "$LOG_FILE"
    echo "→ $repo" | tee -a "$LOG_FILE"
    gh issue list --repo "$repo" --state open --limit 5 2>/dev/null | tee -a "$LOG_FILE" || echo "  (sem acesso ou sem issues)" | tee -a "$LOG_FILE"
done

# 3. Gerar resumo para JARVIS
echo "" | tee -a "$LOG_FILE"
echo "🤖 3. Resumo para JARVIS..." | tee -a "$LOG_FILE"

SUMMARY_FILE="/tmp/dream-team-summary-$(date +%Y-%m-%d).md"
cat > "$SUMMARY_FILE" << EOF
# Dream Team Daily Summary - $(date +%Y-%m-%d)

## Tarefas Pendentes (Jira)
$JIRA_TASKS

## Acção Recomendada
- Distribuir tarefas aos agentes apropriados
- Verificar PRs pendentes
- Actualizar status no Jira

---
*Gerado automaticamente às $(date +%H:%M)*
EOF

echo "Summary saved: $SUMMARY_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✅ Daily analysis complete!" | tee -a "$LOG_FILE"
