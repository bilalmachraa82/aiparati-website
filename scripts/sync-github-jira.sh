#!/bin/bash
# Sync GitHub repos with Jira Epics
# Ensures every active repo has a corresponding Epic in Jira DEV project

set -e

source ~/clawd/.env.secrets.jira

# Get existing Jira Epics
echo "📋 Fetching Jira Epics..."
JIRA_EPICS=$(curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/search/jql" \
  -H "Content-Type: application/json" \
  -d '{"jql": "project=DEV AND issuetype=Epic", "maxResults": 100, "fields": ["summary"]}' | jq -r '.issues[] | .fields.summary')

# Get GitHub repos
echo "🐙 Fetching GitHub repos..."
GH_REPOS=$(gh repo list bilalmachraa82 --json name --limit 100 | jq -r '.[].name')

# Check for missing repos
echo ""
echo "🔍 Checking sync status..."
echo "========================="

MISSING=0
for repo in $GH_REPOS; do
  if ! echo "$JIRA_EPICS" | grep -q "\[REPO\] $repo"; then
    echo "❌ Missing in Jira: $repo"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -eq 0 ]; then
  echo "✅ All repos have corresponding Jira Epics!"
else
  echo ""
  echo "⚠️  $MISSING repos missing from Jira"
  echo "Run with --create to add missing Epics"
fi

# Create missing if --create flag
if [ "$1" == "--create" ] && [ $MISSING -gt 0 ]; then
  echo ""
  echo "🚀 Creating missing Epics..."
  for repo in $GH_REPOS; do
    if ! echo "$JIRA_EPICS" | grep -q "\[REPO\] $repo"; then
      echo "Creating: [REPO] $repo"
      curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST "$JIRA_URL/rest/api/3/issue" \
        -H "Content-Type: application/json" \
        -d "{
          \"fields\": {
            \"project\": {\"key\": \"DEV\"},
            \"summary\": \"[REPO] $repo\",
            \"description\": {\"type\": \"doc\", \"version\": 1, \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"GitHub: https://github.com/bilalmachraa82/$repo\"}]}]},
            \"issuetype\": {\"name\": \"Epic\"}
          }
        }" | jq -r '.key'
    fi
  done
  echo "✅ Sync complete!"
fi
