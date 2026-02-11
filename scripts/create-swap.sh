#!/bin/bash
# Script para criar swap de 2GB
# REQUER: Correr como root ou com sudo

set -e

SWAP_SIZE="8G"
SWAP_FILE="/swapfile"

echo "🔧 Criando swap de $SWAP_SIZE..."

# Verificar se já existe
if [ -f "$SWAP_FILE" ]; then
    echo "⚠️  Swapfile já existe. A saltar criação."
    swapon --show
    exit 0
fi

# Criar ficheiro
echo "1. Criando ficheiro..."
fallocate -l $SWAP_SIZE $SWAP_FILE

# Permissões seguras
echo "2. Definindo permissões..."
chmod 600 $SWAP_FILE

# Formatar como swap
echo "3. Formatando como swap..."
mkswap $SWAP_FILE

# Activar
echo "4. Activando swap..."
swapon $SWAP_FILE

# Verificar
echo ""
echo "✅ Swap criado e activo:"
swapon --show
free -h | grep -i swap

# Tornar permanente
echo ""
echo "5. Tornando permanente..."
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✅ Adicionado ao /etc/fstab"
else
    echo "ℹ️  Já está no /etc/fstab"
fi

echo ""
echo "🎉 Swap de $SWAP_SIZE configurado com sucesso!"
