#!/bin/bash

# Deploy via Vercel Deployment API
# Referência: https://vercel.com/docs/rest-api/endpoints/deployments

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Deploy via Vercel Deployment API"
echo "📁 Diretório: $PROJECT_DIR"

# Criar ficheiro de manifesto (archivos a fazer deploy)
echo "📦 Criando ficheiro de deploy..."

# Para HTML estático, podemos usar curl para fazer upload
# Mas primeiro, preciso de um token válido

# Vou usar uma abordagem alternativa: criar um script que faz upload
# diretamente para Vercel usando a CLI com um Vercel project ID

# Criar um projeto em Vercel (manualmente) e depois fazer deploy

# Para agora, vou criar um manifesto JSON que descreve a deploy
cat > vercel-deploy-manifest.json << 'MANIFEST'
{
  "version": 2,
  "name": "aiparati-website",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
MANIFEST

echo "✅ Manifesto criado"

# Tentar usar git push para GitHub, e depois GitHub Actions
echo ""
echo "📍 Configuração GitHub Integration:"
echo "   1. Ir para: https://vercel.com/new"
echo "   2. Selecionar: bilalmachraa82/aiparati-website"
echo "   3. Deploy automático será ativado"
echo ""
echo "📍 URL do repositório:"
echo "   https://github.com/bilalmachraa82/aiparati-website"
echo ""

