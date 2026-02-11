#!/bin/bash
# OpenClaw Sessions Cleanup Script
# Purpose: Remove deleted session files and orphan lockfiles
# Usage: ./cleanup-sessions.sh [--dry-run] [--backup]
# Location: ~/.openclaw/scripts/cleanup-sessions.sh

set -e

SESSIONS_DIR="${SESSIONS_DIR:-$HOME/.openclaw/agents/main/sessions}"
DRY_RUN=0
BACKUP=1
BACKUP_DIR=""
LOG_FILE="/tmp/openclaw-cleanup.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    local level=$1
    shift
    local msg="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${msg}" | tee -a "$LOG_FILE"
}

info() { log "INFO" "$@"; }
warn() { log "WARN" "$@"; }
error() { log "ERROR" "$@"; }
success() { log "SUCC" "$@"; }

usage() {
    cat << EOF
Usage: $(basename $0) [options]

Options:
  --dry-run      Show what would be deleted without making changes
  --no-backup    Skip backup creation
  --help         Show this help message

Examples:
  $(basename $0)              # Run with defaults (backup + cleanup)
  $(basename $0) --dry-run    # Preview what would be deleted
  $(basename $0) --no-backup  # Skip backup, just cleanup

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        --no-backup)
            BACKUP=0
            shift
            ;;
        --help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate directory
if [ ! -d "$SESSIONS_DIR" ]; then
    error "Sessions directory not found: $SESSIONS_DIR"
    exit 1
fi

info "═══════════════════════════════════════════════════════════"
info "OpenClaw Sessions Cleanup"
info "═══════════════════════════════════════════════════════════"
info "Dry Run: $([ $DRY_RUN -eq 1 ] && echo 'YES' || echo 'NO')"
info "Backup: $([ $BACKUP -eq 1 ] && echo 'YES' || echo 'NO')"
info "Sessions Directory: $SESSIONS_DIR"

# Get statistics before
info ""
info "📊 Statistics Before Cleanup"
DELETED_COUNT=$(find "$SESSIONS_DIR" -name "*.deleted*" -type f | wc -l)
LOCK_COUNT=$(find "$SESSIONS_DIR" -name "*.lock" -type f | wc -l)
DIR_SIZE=$(du -sh "$SESSIONS_DIR" | awk '{print $1}')

info "  Deleted Files: $DELETED_COUNT"
info "  Lock Files: $LOCK_COUNT"
info "  Directory Size: $DIR_SIZE"

# Check if there's anything to clean
if [ "$DELETED_COUNT" -eq 0 ] && [ "$LOCK_COUNT" -eq 0 ]; then
    success "✅ No cleanup needed - directory is clean!"
    exit 0
fi

# Create backup if requested
if [ $BACKUP -eq 1 ] && [ $DRY_RUN -eq 0 ]; then
    info ""
    info "💾 Creating backup..."
    BACKUP_DIR="${SESSIONS_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup deleted files
    find "$SESSIONS_DIR" -name "*.deleted*" -type f -exec cp {} "$BACKUP_DIR/" \; 2>/dev/null || true
    
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | awk '{print $1}' || echo "0B")
    success "  Backup created: $BACKUP_DIR ($BACKUP_SIZE)"
fi

# Clean deleted files
info ""
info "🗑️  Removing deleted session files..."
if [ $DRY_RUN -eq 1 ]; then
    DELETED_TO_REMOVE=$(find "$SESSIONS_DIR" -name "*.deleted*" -type f)
    if [ -n "$DELETED_TO_REMOVE" ]; then
        echo "$DELETED_TO_REMOVE" | while read file; do
            echo "  [DRY-RUN] Would delete: $(basename $file)"
        done
        info "  Total files to delete: $DELETED_COUNT"
    fi
else
    find "$SESSIONS_DIR" -name "*.deleted*" -type f -delete
    success "  ✅ Deleted $DELETED_COUNT old session files"
fi

# Clean orphan lockfiles
info ""
info "🔐 Removing orphan lockfiles..."
ORPHAN_LOCKS=0

for lock in "$SESSIONS_DIR"/*.lock; do
    [ -f "$lock" ] || continue
    
    base="${lock%.lock}"
    base_name=$(basename "$base")
    
    if [ ! -f "$base" ]; then
        ((ORPHAN_LOCKS++))
        if [ $DRY_RUN -eq 1 ]; then
            echo "  [DRY-RUN] Would delete: $(basename $lock)"
        else
            rm "$lock"
        fi
    fi
done

if [ $DRY_RUN -eq 1 ]; then
    info "  Total orphan locks to delete: $ORPHAN_LOCKS"
else
    [ $ORPHAN_LOCKS -gt 0 ] && success "  ✅ Removed $ORPHAN_LOCKS orphan lockfiles"
fi

# Final statistics
info ""
info "📊 Statistics After Cleanup"
if [ $DRY_RUN -eq 0 ]; then
    NEW_DELETED_COUNT=$(find "$SESSIONS_DIR" -name "*.deleted*" -type f | wc -l)
    NEW_LOCK_COUNT=$(find "$SESSIONS_DIR" -name "*.lock" -type f | wc -l)
    NEW_DIR_SIZE=$(du -sh "$SESSIONS_DIR" | awk '{print $1}')
    
    info "  Deleted Files: $NEW_DELETED_COUNT (was $DELETED_COUNT)"
    info "  Lock Files: $NEW_LOCK_COUNT (was $LOCK_COUNT)"
    info "  Directory Size: $NEW_DIR_SIZE (was $DIR_SIZE)"
    
    # Calculate space freed
    SPACE_FREED=$(echo "Backup: $BACKUP_DIR" 2>/dev/null | awk -F'[()]' '{print $2}')
    [ -n "$BACKUP_DIR" ] && success "  💿 Backup: $BACKUP_DIR"
fi

info ""
info "═══════════════════════════════════════════════════════════"
success "✅ Cleanup $([ $DRY_RUN -eq 1 ] && echo 'preview' || echo 'completed') successfully!"
info "═══════════════════════════════════════════════════════════"

exit 0
