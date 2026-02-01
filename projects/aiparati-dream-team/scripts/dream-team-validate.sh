#!/bin/bash
# Dream Team Validation (GUARDIAN)
# Valida implementações antes de merge

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛡️ GUARDIAN - Dream Team Validation"
echo "====================================="

# Validation checklist
validate_code() {
    local repo_path="$1"
    local branch="${2:-main}"
    
    echo ""
    echo "📁 Validating: $repo_path"
    echo "🌿 Branch: $branch"
    echo ""
    
    if [ ! -d "$repo_path" ]; then
        echo "❌ Directory not found: $repo_path"
        return 1
    fi
    
    cd "$repo_path"
    
    # 1. Check for uncommitted changes
    echo "1️⃣ Checking git status..."
    if [ -n "$(git status --porcelain)" ]; then
        echo "   ⚠️ Uncommitted changes detected"
        git status --short
    else
        echo "   ✅ Clean working directory"
    fi
    
    # 2. Check for secrets (basic)
    echo ""
    echo "2️⃣ Checking for exposed secrets..."
    SECRETS_FOUND=$(grep -r -E "(api[_-]?key|password|secret|token)\s*[:=]\s*['\"][^'\"]{10,}" --include="*.js" --include="*.ts" --include="*.json" --include="*.env" . 2>/dev/null | grep -v node_modules | grep -v ".env.example" | head -5 || true)
    if [ -n "$SECRETS_FOUND" ]; then
        echo "   ⚠️ Potential secrets found:"
        echo "$SECRETS_FOUND"
    else
        echo "   ✅ No obvious secrets exposed"
    fi
    
    # 3. Check package.json exists
    echo ""
    echo "3️⃣ Checking project structure..."
    if [ -f "package.json" ]; then
        echo "   ✅ package.json found"
        # Check for vulnerabilities if npm available
        if command -v npm &> /dev/null; then
            echo "   → Running npm audit..."
            npm audit --audit-level=high 2>/dev/null || echo "   ⚠️ Vulnerabilities found (run npm audit for details)"
        fi
    else
        echo "   ℹ️ No package.json (not a Node.js project)"
    fi
    
    # 4. Check for tests
    echo ""
    echo "4️⃣ Checking for tests..."
    if [ -d "tests" ] || [ -d "__tests__" ] || [ -d "test" ]; then
        echo "   ✅ Test directory found"
        TEST_COUNT=$(find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l)
        echo "   → Test files: $TEST_COUNT"
    else
        echo "   ⚠️ No test directory found"
    fi
    
    # 5. Check README
    echo ""
    echo "5️⃣ Checking documentation..."
    if [ -f "README.md" ]; then
        echo "   ✅ README.md exists"
        LINES=$(wc -l < README.md)
        echo "   → Lines: $LINES"
    else
        echo "   ⚠️ No README.md"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Validation complete!"
}

# Usage
if [ $# -ge 1 ]; then
    validate_code "$1" "${2:-main}"
else
    echo ""
    echo "Usage: $0 <repo-path> [branch]"
    echo ""
    echo "Example:"
    echo "  $0 ~/clawd/projects/ivazen-saas main"
    echo "  $0 . feature/new-stuff"
fi
