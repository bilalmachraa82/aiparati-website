#!/bin/bash
# Sync Clawdbot workspace: VPS <-> Mac
# Uso: sync-vps.sh [push|pull|both]
# Default: both (bidirectional)

VPS_HOST="ubuntu@137.74.112.68"
VPS_PASS="EUsourico82!"
LOCAL_WORKSPACE="$HOME/clawd"
REMOTE_WORKSPACE="/home/ubuntu/clawd"
LOCAL_CONFIG="$HOME/.clawdbot"
REMOTE_CONFIG="/home/ubuntu/.clawdbot"

MODE="${1:-both}"

# Ficheiros/pastas a excluir do sync
EXCLUDES=(
    ".git"
    "node_modules"
    ".DS_Store"
    "*.log"
    "clawd/clawd"  # pasta duplicada na VPS
)

RSYNC_EXCLUDES=""
for ex in "${EXCLUDES[@]}"; do
    RSYNC_EXCLUDES="$RSYNC_EXCLUDES --exclude=$ex"
done

sync_push() {
    echo "📤 PUSH: Mac → VPS"
    
    # Workspace
    echo "  → Workspace..."
    sshpass -p "$VPS_PASS" rsync -avz --delete $RSYNC_EXCLUDES \
        "$LOCAL_WORKSPACE/" "$VPS_HOST:$REMOTE_WORKSPACE/"
    
    # Config (sem sessions para não sobrecarregar)
    echo "  → Config..."
    sshpass -p "$VPS_PASS" rsync -avz $RSYNC_EXCLUDES \
        --exclude="agents/*/sessions" \
        --exclude="cron" \
        --exclude="browser" \
        "$LOCAL_CONFIG/" "$VPS_HOST:$REMOTE_CONFIG/"
    
    echo "✅ Push completo!"
}

sync_pull() {
    echo "📥 PULL: VPS → Mac"
    
    # Workspace
    echo "  ← Workspace..."
    sshpass -p "$VPS_PASS" rsync -avz $RSYNC_EXCLUDES \
        "$VPS_HOST:$REMOTE_WORKSPACE/" "$LOCAL_WORKSPACE/"
    
    # Config (sem sessions)
    echo "  ← Config..."
    sshpass -p "$VPS_PASS" rsync -avz $RSYNC_EXCLUDES \
        --exclude="agents/*/sessions" \
        --exclude="cron" \
        --exclude="browser" \
        "$VPS_HOST:$REMOTE_CONFIG/" "$LOCAL_CONFIG/"
    
    echo "✅ Pull completo!"
}

case "$MODE" in
    push)
        sync_push
        ;;
    pull)
        sync_pull
        ;;
    both|bidirectional)
        # Pull primeiro (VPS é master), depois push updates
        sync_pull
        sync_push
        ;;
    *)
        echo "Uso: $0 [push|pull|both]"
        exit 1
        ;;
esac

echo ""
echo "🕐 Sync executado: $(date)"
