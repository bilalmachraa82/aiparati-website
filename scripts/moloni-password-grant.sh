#!/bin/bash
# Moloni Password Grant - NEVER EXPIRES
# Uses username/password to get fresh tokens anytime

set -e

# Get credentials from 1Password (most secure)
export OP_SERVICE_ACCOUNT_TOKEN=$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | cut -d'"' -f2 2>/dev/null)

if [ -n "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    MOLONI_CLIENT_ID=$(op item get "Moloni Aurora" --vault "Jarvis Secrets" --fields username --reveal 2>/dev/null | head -1)
    # Actually client_id is the developer ID, not username
    MOLONI_CLIENT_ID="auroroceanolda"
    MOLONI_CLIENT_SECRET=$(op item get "Moloni Aurora" --vault "Jarvis Secrets" --fields "Empresa ID" --reveal 2>/dev/null || echo "")
    MOLONI_CLIENT_SECRET="db5640005feb0d6d8f6f47c8a1ee56391e49a304"
    MOLONI_USERNAME=$(op item get "Moloni Aurora" --vault "Jarvis Secrets" --fields username --reveal 2>/dev/null)
    MOLONI_PASSWORD=$(op item get "Moloni Aurora" --vault "Jarvis Secrets" --fields password --reveal 2>/dev/null)
else
    # Fallback to env file
    source ~/clawd/.env.secrets.moloni
    MOLONI_PASSWORD="${MOLONI_PASSWORD:-}"
fi

if [ -z "$MOLONI_PASSWORD" ]; then
    echo "❌ No Moloni password found"
    exit 1
fi

echo "🔄 Getting fresh Moloni tokens via password grant..."

RESPONSE=$(curl -s "https://api.moloni.pt/v1/grant/?grant_type=password&client_id=${MOLONI_CLIENT_ID}&client_secret=${MOLONI_CLIENT_SECRET}&username=${MOLONI_USERNAME}&password=${MOLONI_PASSWORD}")

if echo "$RESPONSE" | grep -q '"error"'; then
    echo "❌ Error: $(echo "$RESPONSE" | jq -r '.error_description // .error')"
    exit 1
fi

ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
REFRESH_TOKEN=$(echo "$RESPONSE" | jq -r '.refresh_token')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Invalid response"
    exit 1
fi

# Update secrets file
cat > ~/clawd/.env.secrets.moloni << EOF
# Moloni Aurora Oceano - Auto-refreshed $(date +%Y-%m-%d\ %H:%M)
MOLONI_CLIENT_ID="auroroceanolda"
MOLONI_CLIENT_SECRET="db5640005feb0d6d8f6f47c8a1ee56391e49a304"
MOLONI_USERNAME="bilal.machraa@aiparati.pt"
MOLONI_ACCESS_TOKEN="${ACCESS_TOKEN}"
MOLONI_REFRESH_TOKEN="${REFRESH_TOKEN}"
MOLONI_COMPANY_ID="276603"
EOF

# Update 1Password
if [ -n "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    op item edit "Moloni Aurora" --vault "Jarvis Secrets" \
        "Access Token=${ACCESS_TOKEN}" \
        "Refresh Token=${REFRESH_TOKEN}" \
        2>/dev/null && echo "✅ 1Password updated"
fi

echo "✅ Fresh tokens obtained!"
echo "   Access: ${ACCESS_TOKEN:0:20}..."
echo "   Valid for: 1 hour (but password grant can refresh anytime)"
