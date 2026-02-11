#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🧪 TESTE DE PÁGINAS AITI WEBSITE"
echo "================================="
echo ""

# Array das páginas a testar
declare -a PAGES=(
  "index.html:HomePage"
  "pages/solucoes.html:Soluções"
  "pages/metodologia.html:Metodologia"
  "pages/case-study.html:Case Study"
  "pages/contactos.html:Contactos"
)

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 Ficheiros encontrados:"
echo ""

total=0
found=0

for page_info in "${PAGES[@]}"; do
  IFS=':' read -r page_file page_name <<< "$page_info"
  total=$((total + 1))
  
  if [ -f "$page_file" ]; then
    file_size=$(stat -f%z "$page_file" 2>/dev/null || stat -c%s "$page_file" 2>/dev/null)
    found=$((found + 1))
    echo -e "${GREEN}✅${NC} $page_name"
    echo "   Ficheiro: $page_file"
    echo "   Tamanho: $((file_size / 1024)) KB"
    
    # Verificar se tem conteúdo HTML válido
    if grep -q "<!DOCTYPE html\|<html" "$page_file"; then
      echo "   HTML: ✅ Válido"
    else
      echo -e "   HTML: ${YELLOW}⚠️ Pode não ser válido${NC}"
    fi
    echo ""
  else
    echo -e "${RED}❌${NC} $page_name (ficheiro não encontrado)"
    echo "   Esperado em: $page_file"
    echo ""
  fi
done

echo "================================="
echo "📊 RESUMO: $found/$total páginas encontradas"
echo ""

if [ $found -eq $total ]; then
  echo -e "${GREEN}✅ TODAS AS PÁGINAS OK!${NC}"
  echo ""
  echo "📍 Próximo passo: Deploy no Vercel"
  echo "   https://vercel.com/new > Select Repository > bilalmachraa82/aiparati-website"
else
  echo -e "${RED}❌ FALTAM $((total - found)) PÁGINA(S)${NC}"
fi

