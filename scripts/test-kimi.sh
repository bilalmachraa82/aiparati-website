#!/bin/bash

# Teste Kimi K2.5 Deep Research

echo "=== Teste Kimi K2.5 ==="
echo "Fazendo deep research sobre mercado de congelados e congelações em Portugal..."

echo ""
echo "📝 Test 1: Geração de texto"

# Exportar a chave
KIMI_API_KEY="nvidia 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"

RESPONSE=$(curl -s -X "Authorization: Bearer $KIMI_API_KEY" \
  "https://api.together.xyz/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"moonshotai/kimi-k2.5-preview\",
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": \"Deep research de 30 minutos sobre mercado de congelados e congelações em Portugal. Estrutura: 1) Mercado Português (tamanho, segmentos, players), 2) Portugal vs Espanha comparativo, 3) Tendências globais 2024-2028, 4) Análise de 5-10 concorrentes principais (Frosta, Iglo, Pingo Doce, Campo Real, Jerónimo Martins), 5) KPIs e métricas relevantes (crescimento anual, penetração tecnológica, ticket médio, churn rate, margens típicas), 6) Recomendações estratégicas (para gestores, fornecedores, novos entrantes). Estilo: relatório executivo com tabelas, bullet points, e insights accionáveis.\"
      }
    ]
  }")

echo ""
echo "Resposta:"
echo "$RESPONSE" | jq -r '.choices[0].message'

echo ""
echo "✅ Teste 1 concluído!"
