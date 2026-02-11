#!/bin/bash
# Moloni Token Auto-Refresh
# Runs every 7 days (well within 14-day refresh token validity)
# Saves new tokens to both file AND 1Password

set -e

SECRETS_FILE="$HOME/clawd/.env.secrets.moloni"
source "$SECRETS_FILE"

echo "🔄 Refreshing Moloni tokens..."

# Make refresh request
RESPONSE=$(curl -s "https://api.moloni.pt/v2/grant/?grant_type=refresh_token&client_id=${MOLONI_CLIENT_ID}&client_secret=${MOLONI_CLIENT_SECRET}&refresh_token=${MOLONI_REFRESH_TOKEN}")

# Check for errors
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR=$(echo "$RESPONSE" | jq -r '.error_description // .error')
    echo "❌ Refresh failed: $ERROR"
    exit 1
fi

# Extract new tokens
NEW_ACCESS=$(echo "$RESPONSE" | jq -r '.access_token')
NEW_REFRESH=$(echo "$RESPONSE" | jq -r '.refresh_token')

if [ "$NEW_ACCESS" = "null" ] || [ -z "$NEW_ACCESS" ]; then
    echo "❌ Invalid response: $RESPONSE"
    exit 1
fi

# Update secrets file
cat > "$SECRETS_FILE" << EOF
# Moloni Aurora Oceano - Auto-refreshed $(date +%Y-%m-%d\ %H:%M)
MOLONI_CLIENT_ID="${MOLONI_CLIENT_ID}"
MOLONI_CLIENT_SECRET="${MOLONI_CLIENT_SECRET}"
MOLONI_ACCESS_TOKEN="${NEW_ACCESS}"
MOLONI_REFRESH_TOKEN="${NEW_REFRESH}"
MOLONI_COMPANY_ID="${MOLONI_COMPANY_ID}"
EOF

echo "✅ Tokens refreshed successfully!"
echo "   Access Token: ${NEW_ACCESS:0:20}..."
echo "   Refresh Token: ${NEW_REFRESH:0:20}..."

# Update 1Password (if available)
export OP_SERVICE_ACCOUNT_TOKEN=$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | cut -d'"' -f2 2>/dev/null)
if [ -n "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    echo "📦 Updating 1Password..."
    op item edit "Moloni Aurora" \
        --vault "Jarvis Secrets" \
        "Access Token=${NEW_ACCESS}" \
        "Refresh Token=${NEW_REFRESH}" \
        2>/dev/null && echo "✅ 1Password updated" || echo "⚠️ 1Password update failed (read-only?)"
fi

# Test the new token
TEST=$(curl -s "https://api.moloni.pt/v2/companies/getAll/?access_token=${NEW_ACCESS}" | jq -r '.[0].name // "error"')
if [ "$TEST" != "error" ] && [ "$TEST" != "null" ]; then
    echo "✅ Token verified - Company: $TEST"
else
    echo "⚠️ Token test failed"
fi
