#!/bin/bash
# Daily Report to CTO (Luís Sombreireiro)
# Runs at 18:00 Lisbon time

set -e

LUIS_PHONE="+351967798267"
DATE=$(date +%Y-%m-%d)
REPORT_FILE="/tmp/daily-report-$DATE.md"

# Generate report content
cat > "$REPORT_FILE" << EOF
📊 **DREAM TEAM DAILY REPORT**
📅 $DATE

EOF

# Get Jira updates from today
source ~/clawd/.env.secrets.jira
JIRA_UPDATES=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
  -H "Content-Type: application/json" \
  -d "{\"jql\": \"project=DEV AND updated >= -1d ORDER BY updated DESC\", \"maxResults\": 10, \"fields\": [\"summary\", \"status\"]}" \
  | jq -r '.issues[] | "• [\(.key)] \(.fields.summary) - \(.fields.status.name)"' 2>/dev/null || echo "• Sem actualizações no Jira")

cat >> "$REPORT_FILE" << EOF
**🔄 Actualizações Jira (últimas 24h):**
$JIRA_UPDATES

**📁 Ficheiros Dream Team:**
• DREAM_TEAM_STATUS.md - Estado técnico
• ATLAS_PRODUCT_VISION.md - Visão produto
• CIPHER_SECURITY_AUDIT.md - Audit segurança

**🎯 Prioridades:**
1. IvaZen SaaS - Stripe integration
2. AI Sales Agent - MVP para André
3. Midas Finance - Dashboard web
4. Aurora Oceano - HOLD (aguarda cliente)

---
_Report automático do Dream Team_
_Dúvidas: contactar Jarvis via Bilal_
EOF

echo "Report generated: $REPORT_FILE"
cat "$REPORT_FILE"
