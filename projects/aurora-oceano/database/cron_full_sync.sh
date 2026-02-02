#!/bin/bash
# Aurora Oceano - Full Sync (06:00 diário)
# Sincroniza TODOS os dados do Moloni

set -e
cd /home/ubuntu/clawd/projects/aurora-oceano/database

# Activar venv
source venv/bin/activate

# Carregar variáveis de ambiente
export $(grep -v '^#' /home/ubuntu/clawd/.env.secrets.moloni | xargs) 2>/dev/null || true

# Log
LOG_FILE="/home/ubuntu/clawd/logs/aurora_sync.log"
mkdir -p /home/ubuntu/clawd/logs

echo "========================================" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] FULL SYNC iniciado" >> "$LOG_FILE"

# Executar sync completo
python moloni_sync.py sync >> "$LOG_FILE" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] FULL SYNC concluído" >> "$LOG_FILE"
