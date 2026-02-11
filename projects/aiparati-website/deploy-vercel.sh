#!/bin/bash

# Deploy aiparati-website para Vercel via API
PROJECT_DIR=$(pwd)
PROJECT_NAME="aiparati-website"

echo "📦 Preparando deploy para Vercel..."

# Criar arquivo de deploy (zip dos ficheiros)
cd "$PROJECT_DIR"

# Listar ficheiros a fazer deploy
echo "📁 Ficheiros a fazer deploy:"
ls -la

# Usar vercel-cli com configuração manual
# Criar vercel.json se não existir
if [ ! -f vercel.json ]; then
  cat > vercel.json << 'CONFIG'
{
  "version": 2,
  "buildCommand": "npm run build || true",
  "outputDirectory": "public",
  "redirects": [
    {
      "source": "/",
      "destination": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
CONFIG
fi

echo "✅ vercel.json configurado"

# Tentar fazer deploy usando VERCEL_TOKEN do ambiente
export VERCEL_ORG_ID=""
export VERCEL_PROJECT_ID=""

# Fazer login sem interação
echo "Tentando deploy..."
vercel --prod --yes --no-verify-commit 2>&1 | tee vercel-deploy.log

