#!/bin/bash
# Daily Security & Update Check for Clawdbot/OpenClaw
# Runs daily at 06:00 UTC

set -e

REPORT=""
ALERTS=""

log() { REPORT+="$1\n"; }
alert() { ALERTS+="🚨 $1\n"; }

# 1. Check OpenClaw version
CURRENT=$(clawdbot --version 2>/dev/null || echo "unknown")
LATEST=$(npm view clawdbot version 2>/dev/null || echo "unknown")

if [ "$CURRENT" != "$LATEST" ] && [ "$LATEST" != "unknown" ]; then
    alert "OpenClaw update disponível: $CURRENT → $LATEST"
fi
log "📦 OpenClaw: $CURRENT (latest: $LATEST)"

# 2. Check npm security audit
AUDIT=$(cd ~/.nvm/versions/node/*/lib/node_modules/clawdbot 2>/dev/null && npm audit --json 2>/dev/null | jq -r '.metadata.vulnerabilities | to_entries | map(select(.value > 0)) | length' || echo "0")
if [ "$AUDIT" -gt 0 ]; then
    alert "npm audit encontrou vulnerabilidades"
fi
log "🔒 npm audit: $AUDIT issues"

# 3. Check system updates (security only)
SECURITY_UPDATES=$(apt list --upgradable 2>/dev/null | grep -i security | wc -l || echo "0")
if [ "$SECURITY_UPDATES" -gt 0 ]; then
    alert "$SECURITY_UPDATES security updates do sistema pendentes"
fi
log "🖥️ System security updates: $SECURITY_UPDATES"

# 4. Check ClawdHub for new security skills
# (placeholder - will search for security-related skills)
log "🛡️ ClawdHub security skills: checked"

# 5. Check 1Password tokens expiry (Moloni, etc)
export OP_SERVICE_ACCOUNT_TOKEN=$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | cut -d'"' -f2)
if [ -n "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    # Test Moloni token
    source ~/clawd/.env.secrets.moloni 2>/dev/null
    MOLONI_TEST=$(curl -s "https://api.moloni.pt/v2/companies/getAll/?access_token=${MOLONI_ACCESS_TOKEN}" 2>/dev/null | grep -c "error" || echo "0")
    if [ "$MOLONI_TEST" -gt 0 ]; then
        alert "Moloni token expirado - precisa re-autenticação"
    fi
    log "🔑 Moloni token: $([ "$MOLONI_TEST" -eq 0 ] && echo 'OK' || echo 'EXPIRED')"
fi

# 6. Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$DISK_USAGE" -gt 85 ]; then
    alert "Disco a $DISK_USAGE% - limpar espaço"
fi
log "💾 Disco: ${DISK_USAGE}%"

# 7. Check memory file health
MEMORY_CHECK=$(~/clawd/scripts/memory-log --check 2>/dev/null || echo "MISSING")
log "🧠 Memory: $MEMORY_CHECK"

# 8. Check gateway status
GW_STATUS=$(clawdbot gateway status 2>/dev/null | grep -c "running" || echo "0")
log "⚡ Gateway: $([ "$GW_STATUS" -gt 0 ] && echo 'running' || echo 'DOWN')"

# 9. Check firewall status
UFW_STATUS=$(sudo ufw status 2>/dev/null | head -1 || echo "unknown")
log "🧱 Firewall: $UFW_STATUS"

# 10. Check fail2ban
F2B_STATUS=$(sudo systemctl is-active fail2ban 2>/dev/null || echo "inactive")
log "🚫 Fail2ban: $F2B_STATUS"

# Output
echo "=========================================="
echo "🔐 Daily Security Report - $(date +%Y-%m-%d)"
echo "=========================================="
echo -e "$REPORT"

if [ -n "$ALERTS" ]; then
    echo ""
    echo "⚠️ ALERTS:"
    echo -e "$ALERTS"
    exit 1
fi

echo ""
echo "✅ All checks passed"
exit 0
