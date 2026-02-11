#!/bin/bash
# Sync Jira data to Vercel dashboard

set -e

source ~/clawd/.env.secrets.jira
source ~/clawd/.env.secrets

DASHBOARD_DIR=~/clawd/projects/jira-dashboard

echo "🔄 Fetching Jira data..."

# Get all DEV issues
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jql": "project = DEV order by created DESC", "maxResults": 100, "fields": ["summary", "status", "project", "priority", "assignee", "created", "updated", "issuetype"]}' \
  "https://aiparati.atlassian.net/rest/api/3/search/jql" > /tmp/jira_sync.json

# Extract data
cat /tmp/jira_sync.json | jq '[.issues[] | {
  key: .key,
  summary: .fields.summary,
  status: .fields.status.name,
  statusCategory: .fields.status.statusCategory.name,
  project: .fields.project.key,
  projectName: .fields.project.name,
  priority: (.fields.priority.name // "Medium"),
  issueType: .fields.issuetype.name,
  created: .fields.created,
  updated: .fields.updated,
  assignee: (.fields.assignee.displayName // "Unassigned")
}]' > /tmp/jira_data.json

COUNT=$(cat /tmp/jira_data.json | jq 'length')
echo "📊 Found $COUNT issues"

# Update HTML
python3 << 'PYEOF'
import json
import re

with open('/home/ubuntu/clawd/exports/jira-kanban.html') as f:
    html = f.read()

with open('/tmp/jira_data.json') as f:
    data = json.load(f)

html = re.sub(r'const issues = \[.*?\];', f'const issues = {json.dumps(data, ensure_ascii=False)};', html, flags=re.DOTALL)

with open('/home/ubuntu/clawd/projects/jira-dashboard/public/index.html', 'w') as f:
    f.write(html)

print(f"✅ HTML updated with {len(data)} issues")
PYEOF

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
cd $DASHBOARD_DIR
vercel deploy --prod --yes --token=$VERCEL_TOKEN 2>&1 | tail -3

echo "✅ Sync complete!"
