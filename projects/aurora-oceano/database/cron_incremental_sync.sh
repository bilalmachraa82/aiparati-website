#!/bin/bash
# Aurora Oceano - Incremental Sync (a cada hora)
# Sincroniza apenas faturas do ano actual + novos clientes

set -e
cd /home/ubuntu/clawd/projects/aurora-oceano/database

# Activar venv
source venv/bin/activate

# Carregar variáveis de ambiente
export $(grep -v '^#' /home/ubuntu/clawd/.env.secrets.moloni | xargs) 2>/dev/null || true

# Log
LOG_FILE="/home/ubuntu/clawd/logs/aurora_sync.log"
mkdir -p /home/ubuntu/clawd/logs

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Incremental sync..." >> "$LOG_FILE"

# Executar sync incremental
python moloni_sync.py incremental >> "$LOG_FILE" 2>&1
