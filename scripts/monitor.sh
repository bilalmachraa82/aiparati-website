#!/bin/bash
# Monitor de Recursos - Jarvis VPS
OUTPUT_FILE=~/clawd/exports/metrics.json

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "0")
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_PERCENT=$(awk "BEGIN {printf \"%.1f\", $MEM_USED * 100 / $MEM_TOTAL}")
DISK_PERCENT=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
SESSIONS=$(pgrep -c clawdbot 2>/dev/null || echo "0")

cat > $OUTPUT_FILE << JSONEOF
{
  "timestamp": "$TIMESTAMP",
  "vps": {
    "mem_total_mb": $MEM_TOTAL,
    "mem_used_mb": $MEM_USED,
    "mem_percent": $MEM_PERCENT,
    "disk_percent": $DISK_PERCENT
  },
  "clawdbot": {
    "processes": $SESSIONS
  }
}
JSONEOF
echo "✅ Metrics: RAM ${MEM_PERCENT}% | Disk ${DISK_PERCENT}%"
