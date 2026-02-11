#!/bin/bash
# 1Password CLI signin helper
# Uso: source scripts/op-signin.sh
# Depois: op item list

# Requer a master password como argumento ou via stdin
if [ -z "$1" ]; then
    echo "Uso: source op-signin.sh <master_password>"
    echo "  ou: echo 'password' | source op-signin.sh -"
    return 1 2>/dev/null || exit 1
fi

if [ "$1" = "-" ]; then
    read -r OP_MASTER_PASSWORD
else
    OP_MASTER_PASSWORD="$1"
fi

# Signin e exportar token
export OP_SESSION_bilal=$(echo "$OP_MASTER_PASSWORD" | op signin --account bilal --raw 2>/dev/null)

if [ -n "$OP_SESSION_bilal" ]; then
    echo "✅ 1Password conectado!"
    echo "Sessão válida por 30 minutos."
else
    echo "❌ Falha no signin"
    return 1 2>/dev/null || exit 1
fi
