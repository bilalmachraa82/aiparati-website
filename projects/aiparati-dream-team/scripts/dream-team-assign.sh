#!/bin/bash
# Dream Team Task Assignment
# Distribui tarefas aos agentes baseado no tipo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$PROJECT_DIR/MASTER_CONFIG.json"

echo "🎯 Dream Team Task Assignment"
echo "=============================="

# Task type to agent mapping (from WORKFLOW_SYSTEM.md)
declare -A AGENT_MAP
AGENT_MAP["frontend"]="NOVA"
AGENT_MAP["ui"]="NOVA"
AGENT_MAP["backend"]="VORTEX"
AGENT_MAP["api"]="VORTEX"
AGENT_MAP["database"]="ORACLE"
AGENT_MAP["db"]="ORACLE"
AGENT_MAP["devops"]="SENTINEL"
AGENT_MAP["deploy"]="SENTINEL"
AGENT_MAP["security"]="CIPHER"
AGENT_MAP["auth"]="CIPHER"
AGENT_MAP["general"]="CODER"
AGENT_MAP["code"]="CODER"
AGENT_MAP["ux"]="PIXEL"
AGENT_MAP["design"]="PIXEL"
AGENT_MAP["test"]="GUARDIAN"
AGENT_MAP["qa"]="GUARDIAN"
AGENT_MAP["architecture"]="FORGE"
AGENT_MAP["product"]="ATLAS"
AGENT_MAP["ai"]="NEURAL"
AGENT_MAP["ml"]="NEURAL"
AGENT_MAP["performance"]="VELOCITY"
AGENT_MAP["mobile"]="SWIFT"
AGENT_MAP["docs"]="SCRIBE"

# Function to assign task
assign_task() {
    local task_type="$1"
    local task_desc="$2"
    local jira_key="$3"
    
    task_type_lower=$(echo "$task_type" | tr '[:upper:]' '[:lower:]')
    agent="${AGENT_MAP[$task_type_lower]:-CODER}"
    
    echo ""
    echo "📋 Task: $task_desc"
    echo "   Type: $task_type"
    echo "   Jira: $jira_key"
    echo "   → Assigned to: $agent"
    
    # Get agent config
    agent_lower=$(echo "$agent" | tr '[:upper:]' '[:lower:]')
    agent_file="$PROJECT_DIR/agents/$agent_lower.json"
    
    if [ -f "$agent_file" ]; then
        model=$(jq -r '.technical.model // "claude-sonnet-4-5"' "$agent_file")
        echo "   → Model: $model"
    fi
}

# Example usage
echo ""
echo "Usage: $0 <type> <description> [jira-key]"
echo ""
echo "Types available:"
for key in "${!AGENT_MAP[@]}"; do
    echo "  - $key → ${AGENT_MAP[$key]}"
done

# If arguments provided, assign
if [ $# -ge 2 ]; then
    assign_task "$1" "$2" "${3:-N/A}"
fi
