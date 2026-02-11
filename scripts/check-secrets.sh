#!/bin/bash
# Detecta possíveis secrets hardcoded no código
# Usar antes de qualquer commit!

set -e

REPO_PATH="${1:-.}"
FOUND=0

echo "🔍 Verificando secrets em: $REPO_PATH"
echo "=================================="

# Patterns de secrets comuns
PATTERNS=(
  "AKIA[0-9A-Z]{16}"                    # AWS Access Key
  "sk-[a-zA-Z0-9]{48}"                  # OpenAI API Key
  "sk_live_[a-zA-Z0-9]{24,}"            # Stripe Live Key
  "xox[baprs]-[0-9a-zA-Z]{10,}"         # Slack Token
  "ghp_[a-zA-Z0-9]{36}"                 # GitHub Personal Token
  "glpat-[a-zA-Z0-9\-]{20}"             # GitLab Token
  "[0-9]{9,10}:[a-zA-Z0-9_-]{35}"       # Telegram Bot Token
  "ya29\.[a-zA-Z0-9_-]+"                # Google OAuth Token
  "AIza[0-9A-Za-z\-_]{35}"              # Google API Key
  "SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}" # SendGrid
)

# Palavras-chave suspeitas (valor após =)
KEYWORDS=(
  "password\s*="
  "api_key\s*="
  "apikey\s*="
  "secret\s*="
  "token\s*="
  "access_token\s*="
  "private_key"
)

# Ignorar estes ficheiros/pastas
IGNORE="-not -path '*/.git/*' -not -path '*/node_modules/*' -not -path '*/.env.example' -not -name '*.md' -not -name 'check-secrets.sh'"

# Verificar patterns regex
for pattern in "${PATTERNS[@]}"; do
  MATCHES=$(find "$REPO_PATH" -type f $IGNORE -exec grep -l -E "$pattern" {} \; 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    echo "❌ PATTERN ENCONTRADO: $pattern"
    echo "$MATCHES" | while read -r file; do echo "   → $file"; done
    FOUND=1
  fi
done

# Verificar keywords com valores
for keyword in "${KEYWORDS[@]}"; do
  MATCHES=$(find "$REPO_PATH" -type f $IGNORE -exec grep -l -iE "$keyword" {} \; 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    echo "⚠️  KEYWORD SUSPEITA: $keyword"
    echo "$MATCHES" | while read -r file; do
      # Mostrar linha (sem o valor)
      grep -n -iE "$keyword" "$file" 2>/dev/null | head -3 | while read -r line; do
        echo "   → $file: $line"
      done
    done
  fi
done

# Verificar .env no git
if [ -d "$REPO_PATH/.git" ]; then
  ENV_IN_GIT=$(git -C "$REPO_PATH" ls-files | grep -E "^\.env$" || true)
  if [ -n "$ENV_IN_GIT" ]; then
    echo "❌ .env ESTÁ NO GIT!"
    FOUND=1
  fi
fi

echo "=================================="
if [ $FOUND -eq 1 ]; then
  echo "🚨 SECRETS POTENCIAIS ENCONTRADOS - VERIFICAR ANTES DE COMMIT!"
  exit 1
else
  echo "✅ Nenhum secret óbvio encontrado"
  exit 0
fi
