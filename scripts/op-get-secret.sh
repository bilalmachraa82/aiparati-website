#!/bin/bash
# Obter secret do 1Password
# Uso: op-get-secret.sh "Nome do Item" [campo]
# Exemplos:
#   op-get-secret.sh "Deepgram API" password
#   op-get-secret.sh "Jira AiParaTi" username
#   op-get-secret.sh "Moloni Aurora" "Access Token"

set -e

ITEM="$1"
FIELD="${2:-password}"

if [ -z "$ITEM" ]; then
  echo "Uso: $0 \"Nome do Item\" [campo]"
  echo ""
  echo "Items disponíveis:"
  op item list --vault="Jarvis Secrets" --format=json | jq -r '.[].title'
  exit 1
fi

# Exportar token se não estiver definido
if [ -z "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
  source ~/.bashrc
fi

op item get "$ITEM" --vault="Jarvis Secrets" --fields "$FIELD" --reveal 2>/dev/null
