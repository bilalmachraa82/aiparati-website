# 🗄️ Aurora Oceano - Database & Sync

Sistema de gestão de dados da Aurora Oceano com sincronização automática do Moloni.

## 📋 Estrutura

```
database/
├── schema.sql        # Estrutura das tabelas PostgreSQL
├── moloni_sync.py    # Sincronização com API Moloni
├── analytics.py      # Motor de analytics e relatórios
├── requirements.txt  # Dependências Python
├── .env.example      # Template de configuração
└── README.md         # Esta documentação
```

## 🚀 Setup Rápido

### 1. Criar Base de Dados no Neon

1. Ir a [neon.tech](https://neon.tech) e criar conta grátis
2. Criar novo projeto: `aurora-oceano`
3. Copiar a Connection String

### 2. Configurar Ambiente

```bash
cd /home/ubuntu/clawd/projects/aurora-oceano/database

# Criar virtualenv
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis
cp .env.example .env
nano .env  # Preencher DATABASE_URL e credenciais Moloni
```

### 3. Inicializar Base de Dados

```bash
# Criar tabelas
python moloni_sync.py init

# Importar dados dos ficheiros JSON já extraídos
python moloni_sync.py import /home/ubuntu/clawd/projects/aurora-analytics/data

# Ou sincronizar diretamente do Moloni
python moloni_sync.py sync
```

### 4. Ver Estatísticas

```bash
python moloni_sync.py stats
```

## 📊 Analytics

```bash
# Relatório completo no terminal
python analytics.py

# Exportar dados para dashboard
python analytics.py export dashboard_data.json
```

## 🔄 Sincronização Automática

Adicionar ao crontab para sync diário:

```bash
# Editar crontab
crontab -e

# Adicionar linha (sync às 6h da manhã)
0 6 * * * cd /home/ubuntu/clawd/projects/aurora-oceano/database && /home/ubuntu/clawd/projects/aurora-oceano/database/venv/bin/python moloni_sync.py sync >> /var/log/aurora-sync.log 2>&1
```

## 📈 Queries Úteis

### Revenue por Mês
```sql
SELECT * FROM monthly_revenue WHERE year = 2024;
```

### Top Clientes
```sql
SELECT * FROM customer_ranking LIMIT 10;
```

### Comparação Anual
```sql
SELECT * FROM yearly_comparison;
```

### Clientes por Segmento
```sql
SELECT 
    CASE 
        WHEN total > 50000 THEN 'VIP'
        WHEN total > 20000 THEN 'Gold'
        WHEN total > 5000 THEN 'Silver'
        ELSE 'Standard'
    END as segment,
    COUNT(*) as count,
    SUM(total) as revenue
FROM customer_ranking
GROUP BY segment;
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `MOLONI_CLIENT_ID` | Developer ID do Moloni |
| `MOLONI_CLIENT_SECRET` | Client Secret do Moloni |
| `MOLONI_EMPRESA_ID` | ID da empresa no Moloni (276603) |
| `MOLONI_ACCESS_TOKEN` | Token de acesso (renovado automaticamente) |
| `MOLONI_REFRESH_TOKEN` | Token para renovar access |

## 📁 Dados Extraídos

Os dados raw do Moloni estão em:
```
/home/ubuntu/clawd/projects/aurora-analytics/data/
├── invoices_2024_all.json   # 8.767 faturas (16MB)
├── invoices_2025_all.json   # 7.565 faturas (13MB)  
├── customers_all.json       # 469 clientes
└── products.json            # Produtos
```

---

**Criado:** 2026-01-29  
**Autor:** Jarvis (AI Assistant)
