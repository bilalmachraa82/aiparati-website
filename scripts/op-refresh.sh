#!/bin/bash
# Verifica e renova sessão do 1Password
if ! op whoami &>/dev/null; then
  echo "Sessão expirada. A tentar renovar..."
  # Tentar com biometria se disponível
  op signin --raw 2>/dev/null > ~/.op_session && echo "Sessão renovada!"
fi
