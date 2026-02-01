#!/bin/bash
# Helper para obter credenciais do 1Password
# Uso: op-get.sh "Nome do Item" [campo] [vault]
#
# Exemplos:
#   op-get.sh "Vercel Token" password
#   op-get.sh "Moloni Aurora" "Access Token"
#   op-get.sh "GLM API Key 4.7" credential

# Carregar Service Account Token do .bashrc
if [ -z "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
  export OP_SERVICE_ACCOUNT_TOKEN=$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | cut -d'"' -f2)
fi

ITEM="$1"
FIELD="${2:-password}"
VAULT="${3:-Jarvis Secrets}"

if [ -z "$ITEM" ]; then
  echo "Uso: op-get.sh \"Nome do Item\" [campo] [vault]"
  echo ""
  echo "Items disponíveis:"
  op item list --vault "$VAULT" 2>/dev/null | tail -n +2
  exit 1
fi

# Obter valor com --reveal para mostrar o valor real
VALUE=$(op item get "$ITEM" --vault "$VAULT" --fields "$FIELD" --reveal 2>/dev/null)

if [ -z "$VALUE" ]; then
  # Tentar com formato JSON se o campo directo não funcionar
  VALUE=$(op item get "$ITEM" --vault "$VAULT" --format json --reveal 2>/dev/null | jq -r ".fields[] | select(.label==\"$FIELD\") | .value")
fi

if [ -z "$VALUE" ] || [ "$VALUE" = "null" ]; then
  echo "Erro: Campo '$FIELD' não encontrado no item '$ITEM'" >&2
  echo "Campos disponíveis:" >&2
  op item get "$ITEM" --vault "$VAULT" --format json 2>/dev/null | jq -r '.fields[] | .label' >&2
  exit 1
fi

echo "$VALUE"
