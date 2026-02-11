# Pesquisa: Assistente IA para Gestão Financeira Pessoal
**Data:** 2026-01-30

## Sumário Executivo

Este documento analisa as melhores práticas para implementar um assistente de IA para gestão financeira pessoal como skill do Clawdbot. Cobre OCR de recibos, classificação de despesas, integração bancária, base de dados e insights financeiros.

---

## 1. OCR para Recibos

### Comparação de Soluções

| Solução | Accuracy (Recibos) | Preço | Melhor Para |
|---------|-------------------|-------|-------------|
| **Google Cloud Vision** | 87.8% ROUGE (STROIE) | $1.50/1000 unidades | Melhor accuracy geral |
| **Azure Document Intelligence** | 85%+ | $1.00/1000 páginas | Invoices/formulários estruturados |
| **AWS Textract** | 82%+ | $1.50/1000 páginas | Tabelas e forms |
| **Claude Vision** | Excelente | $3/M input tokens | Extração semântica complexa |
| **Gemini 2.5 Pro** | Muito bom | $1.25/M input tokens | Custo-benefício |

### Recomendação: Abordagem Híbrida

```
┌─────────────────────────────────────────────────────────────┐
│  RECIBO FOTO/SCAN                                           │
│         ↓                                                   │
│  Claude Vision / Gemini (extração estruturada)              │
│         ↓                                                   │
│  JSON: {valor, data, comerciante, items[], categoria}       │
└─────────────────────────────────────────────────────────────┘
```

**Por quê LLM Vision vs OCR tradicional:**
- LLMs "entendem" o contexto, não apenas lêem texto
- Melhor handling de recibos mal impressos, amassados, ou com layouts variados
- Output já estruturado (JSON) vs. texto cru que precisa parsing
- Claude 3.5/4 e Gemini têm ~95% accuracy em recibos simples

### Prompt Recomendado para Extração

```markdown
Analisa este recibo e extrai os seguintes campos em JSON:
{
  "merchant": "nome do comerciante/loja",
  "date": "YYYY-MM-DD",
  "time": "HH:MM (se disponível)",
  "total": número (valor total em EUR),
  "items": [{"name": "...", "qty": N, "price": N.NN}],
  "payment_method": "cartão/dinheiro/mbway/etc",
  "nif": "NIF do comerciante se visível",
  "category_suggestion": "categoria provável (alimentação/transportes/etc)"
}
Se algum campo não for visível, usa null.
```

### Custos Estimados

| Volume Mensal | Claude Sonnet 4 | Gemini 2.5 Flash | Azure |
|---------------|-----------------|------------------|-------|
| 50 recibos | ~€0.15 | ~€0.05 | ~€0.05 |
| 200 recibos | ~€0.60 | ~€0.20 | ~€0.20 |
| 500 recibos | ~€1.50 | ~€0.50 | ~€0.50 |

**Recomendação:** Usar **Gemini 2.5 Flash** para volume (mais barato) ou **Claude** para casos difíceis.

---

## 2. Classificação Automática de Despesas

### Categorias Standard (Taxonomia Recomendada)

```yaml
Categorias Principais:
  - alimentacao:
      subcategorias: [supermercado, restaurantes, cafes, takeaway]
  - transportes:
      subcategorias: [combustivel, transportes_publicos, taxi_uber, parques, portagens]
  - habitacao:
      subcategorias: [renda, agua, luz, gas, internet, manutencao]
  - saude:
      subcategorias: [farmacia, consultas, hospitais, dentista, otica]
  - lazer:
      subcategorias: [entretenimento, viagens, desporto, hobbies, streaming]
  - compras:
      subcategorias: [roupa, electronica, casa, livros]
  - financeiro:
      subcategorias: [seguros, impostos, taxas_bancarias, investimentos]
  - educacao:
      subcategorias: [cursos, materiais, formacao]
  - pessoal:
      subcategorias: [higiene, cabeleireiro, estetica]
  - outros:
      subcategorias: [presentes, doacoes, nao_categorizado]
```

### Técnicas de Classificação

**Abordagem Recomendada: LLM com Fallback para Regras**

```
┌────────────────────────────────────────────────┐
│  Transação: "CONTINENTE COLOMBO 45.32€"        │
│         ↓                                      │
│  1. Regras Simples (fast path):                │
│     - "CONTINENTE" → alimentação/supermercado  │
│     - "GALP" → transportes/combustível         │
│     - "EDP" → habitação/luz                    │
│         ↓                                      │
│  2. Se não matched → LLM (Claude Haiku/Gemini) │
│         ↓                                      │
│  3. Guardar match para futuro (learning)       │
└────────────────────────────────────────────────┘
```

**Regras Base para Portugal:**
```python
MERCHANT_RULES = {
    # Supermercados
    "CONTINENTE": ("alimentacao", "supermercado"),
    "PINGO DOCE": ("alimentacao", "supermercado"),
    "LIDL": ("alimentacao", "supermercado"),
    "ALDI": ("alimentacao", "supermercado"),
    "MINIPRECO": ("alimentacao", "supermercado"),
    "INTERMARCHE": ("alimentacao", "supermercado"),
    
    # Combustível
    "GALP": ("transportes", "combustivel"),
    "REPSOL": ("transportes", "combustivel"),
    "BP ": ("transportes", "combustivel"),
    "CEPSA": ("transportes", "combustivel"),
    
    # Utilities
    "EDP": ("habitacao", "luz"),
    "ENDESA": ("habitacao", "luz"),
    "AGUAS": ("habitacao", "agua"),
    "EPAL": ("habitacao", "agua"),
    "NOS ": ("habitacao", "internet"),
    "MEO ": ("habitacao", "internet"),
    "VODAFONE": ("habitacao", "internet"),
    
    # Farmácia
    "FARM": ("saude", "farmacia"),
    "WELLS": ("saude", "farmacia"),
    
    # Transportes
    "UBER": ("transportes", "taxi_uber"),
    "BOLT": ("transportes", "taxi_uber"),
    "CP ": ("transportes", "transportes_publicos"),
    "METRO": ("transportes", "transportes_publicos"),
    "CARRIS": ("transportes", "transportes_publicos"),
    "VIA VERDE": ("transportes", "portagens"),
}
```

### Treino com Dados do Utilizador

**Estratégia de Personalização:**
1. **Cold Start:** Usar regras base + LLM
2. **Learning:** Guardar correcções do utilizador
3. **Personalização:** Após ~50 transacções corrigidas, ajustar regras
4. **Feedback Loop:** "Classificado como X. Correcto?" → refinar

```sql
-- Tabela de aprendizagem
CREATE TABLE merchant_learning (
    merchant_pattern TEXT,      -- padrão do comerciante
    user_category TEXT,         -- categoria escolhida pelo user
    confidence REAL,            -- 0-1
    times_seen INTEGER,
    last_seen TIMESTAMP
);
```

### Handling de Edge Cases

| Edge Case | Solução |
|-----------|---------|
| Amazon (múltiplas categorias) | Perguntar ao user ou usar valor médio |
| Transferências entre contas | Detectar e não categorizar |
| Reembolsos | Marcar como crédito na mesma categoria |
| Compras mistas (ex: WORTEN) | Default + opção de split |
| Pagamentos periódicos | Auto-detectar e sugerir categorização |

---

## 3. Base de Dados

### Schema Recomendado

```sql
-- ============================================
-- SCHEMA: Finanças Pessoais
-- ============================================

-- Contas (bancárias, cartões, dinheiro)
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,         -- 'checking', 'savings', 'credit', 'cash', 'investment'
    institution TEXT,           -- banco/instituição
    currency TEXT DEFAULT 'EUR',
    initial_balance REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorias
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT REFERENCES categories(id),
    icon TEXT,                  -- emoji ou icon name
    color TEXT,                 -- cor hex
    is_income BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,  -- categorias do sistema (não editáveis)
    sort_order INTEGER DEFAULT 0
);

-- Transacções
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id),
    category_id TEXT REFERENCES categories(id),
    
    amount REAL NOT NULL,       -- negativo = despesa, positivo = receita
    currency TEXT DEFAULT 'EUR',
    
    date DATE NOT NULL,
    time TIME,
    
    description TEXT,           -- descrição original do banco
    merchant TEXT,              -- nome do comerciante (parsed)
    notes TEXT,                 -- notas do utilizador
    
    type TEXT NOT NULL,         -- 'expense', 'income', 'transfer'
    
    -- Para transferências
    transfer_account_id TEXT REFERENCES accounts(id),
    
    -- Origem dos dados
    source TEXT,                -- 'manual', 'bank_sync', 'receipt_ocr', 'import'
    source_ref TEXT,            -- referência externa (ID banco, etc)
    
    -- OCR/Recibo
    receipt_image_path TEXT,
    ocr_confidence REAL,
    
    -- Metadados
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_id TEXT,          -- link para regra recorrente
    
    tags TEXT,                  -- JSON array de tags
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets
CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES categories(id),
    
    amount REAL NOT NULL,
    period TEXT NOT NULL,       -- 'monthly', 'weekly', 'yearly'
    
    start_date DATE,
    end_date DATE,              -- NULL = ongoing
    
    alert_threshold REAL DEFAULT 0.8,  -- alertar a 80%
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Objectivos de Poupança
CREATE TABLE savings_goals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    target_date DATE,
    account_id TEXT REFERENCES accounts(id),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transacções Recorrentes (templates)
CREATE TABLE recurring_rules (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category_id TEXT REFERENCES categories(id),
    account_id TEXT REFERENCES accounts(id),
    
    frequency TEXT NOT NULL,    -- 'daily', 'weekly', 'monthly', 'yearly'
    day_of_month INTEGER,       -- para monthly
    day_of_week INTEGER,        -- para weekly (0=domingo)
    
    next_date DATE,
    last_generated DATE,
    
    is_active BOOLEAN DEFAULT TRUE
);

-- Aprendizagem de Categorização
CREATE TABLE categorization_rules (
    id TEXT PRIMARY KEY,
    pattern TEXT NOT NULL,      -- regex ou substring
    pattern_type TEXT DEFAULT 'contains',  -- 'contains', 'regex', 'exact'
    category_id TEXT REFERENCES categories(id),
    priority INTEGER DEFAULT 0,
    times_applied INTEGER DEFAULT 0,
    created_by TEXT DEFAULT 'user',  -- 'user', 'system', 'learned'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync com Bancos
CREATE TABLE bank_connections (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,     -- 'gocardless', 'sibs'
    institution_id TEXT,
    institution_name TEXT,
    requisition_id TEXT,        -- ID do GoCardless
    account_mapping TEXT,       -- JSON: {remote_account_id: local_account_id}
    last_sync TIMESTAMP,
    status TEXT DEFAULT 'active',  -- 'active', 'expired', 'error'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_merchant ON transactions(merchant);

-- Views úteis
CREATE VIEW monthly_summary AS
SELECT 
    strftime('%Y-%m', date) as month,
    category_id,
    SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as expenses,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
    COUNT(*) as transaction_count
FROM transactions
GROUP BY strftime('%Y-%m', date), category_id;

CREATE VIEW account_balances AS
SELECT 
    a.id,
    a.name,
    a.type,
    a.initial_balance + COALESCE(SUM(t.amount), 0) as current_balance
FROM accounts a
LEFT JOIN transactions t ON t.account_id = a.id
GROUP BY a.id;
```

### SQLite vs PostgreSQL vs Supabase

| Critério | SQLite | PostgreSQL | Supabase |
|----------|--------|------------|----------|
| **Setup** | Zero config | Requer servidor | Hosted |
| **Custo** | Grátis | Grátis (self) / €€ (hosted) | Free tier + €25/mês |
| **Multi-device** | Difícil | Fácil | Fácil + Real-time |
| **Backup** | Ficheiro simples | pg_dump | Automático |
| **Real-time** | ❌ | Com extensões | ✅ Built-in |
| **Auth** | Manual | Manual | ✅ Built-in |

**Recomendação:**
- **SQLite** para uso pessoal single-device (mais simples)
- **Supabase** se quiser app mobile/web com sync (free tier generoso)

### Backup e Segurança

```bash
# SQLite backup diário (cron)
0 3 * * * cp ~/finances.db ~/backups/finances_$(date +%Y%m%d).db

# Encriptação at-rest (SQLite)
# Usar SQLCipher ou encriptar ficheiro com age/gpg

# Dados sensíveis
- Nunca guardar credenciais bancárias localmente
- Tokens de API em variáveis de ambiente
- Considerar encriptação de campos sensíveis (NIF, IBAN)
```

---

## 4. Integração Bancária em Portugal

### Opções Disponíveis

#### GoCardless (ex-Nordigen) - RECOMENDADO
- **Preço:** Grátis para AIS (Account Information Services)
- **Cobertura PT:** Todos os bancos principais via PSD2
- **Acesso:** Até 24 meses de histórico
- **Limitações:** 90 dias de acesso contínuo, depois re-auth

**Bancos Portugueses Suportados:**
- CGD (Caixa Geral de Depósitos)
- Millennium BCP
- Santander
- BPI
- Novo Banco
- ActivoBank
- Bankinter
- Montepio
- E muitos mais (2300+ bancos EU)

**Flow de Integração:**
```
1. Criar conta GoCardless Bank Account Data
2. Obter secret_id e secret_key
3. User escolhe banco → redirect para auth do banco
4. Receber requisition_id → aceder transactions/balances
```

**Código Exemplo:**
```python
import requests

BASE_URL = "https://bankaccountdata.gocardless.com/api/v2"

# 1. Obter token
token = requests.post(f"{BASE_URL}/token/new/", json={
    "secret_id": SECRET_ID,
    "secret_key": SECRET_KEY
}).json()["access"]

# 2. Listar bancos PT
banks = requests.get(
    f"{BASE_URL}/institutions/?country=pt",
    headers={"Authorization": f"Bearer {token}"}
).json()

# 3. Criar link de autorização
requisition = requests.post(
    f"{BASE_URL}/requisitions/",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "redirect": "https://myapp.com/callback",
        "institution_id": "CGD_CGDIPTPL",
        "reference": "user_123"
    }
).json()
# User vai para requisition["link"] para autorizar

# 4. Após auth, obter contas
accounts = requests.get(
    f"{BASE_URL}/requisitions/{requisition['id']}/",
    headers={"Authorization": f"Bearer {token}"}
).json()["accounts"]

# 5. Obter transacções
for acc_id in accounts:
    txns = requests.get(
        f"{BASE_URL}/accounts/{acc_id}/transactions/",
        headers={"Authorization": f"Bearer {token}"}
    ).json()
```

#### SIBS API Market
- **Preço:** Comercial (contactar)
- **Cobertura:** 95% das contas PT
- **Vantagem:** API única para todos os bancos PT
- **Desvantagem:** Processo de onboarding mais complexo, orientado a empresas

### Limitações e Workarounds

**Problema:** Acesso expira após 90 dias
**Solução:** 
- Alertar user para re-autorizar
- Guardar dados localmente após sync
- Sync frequente (diário) para minimizar gaps

**Problema:** Rate limits (4 calls/dia/conta)
**Solução:**
- Sync uma vez por dia
- Cache local das transacções
- Não fazer polling frequente

---

## 5. Relatórios e Insights

### KPIs Financeiros Pessoais

| KPI | Fórmula | Target Saudável |
|-----|---------|-----------------|
| **Savings Rate** | (Receita - Despesas) / Receita | > 20% |
| **Debt-to-Income** | Pagamentos Dívida / Receita | < 36% |
| **Emergency Fund** | Poupança Líquida / Despesas Mensais | 3-6 meses |
| **Housing Cost Ratio** | Custos Habitação / Receita | < 30% |
| **Expense Ratio** | Despesas Fixas / Despesas Totais | Monitorar |
| **Net Worth** | Activos - Passivos | Crescente |

### Insights Automáticos a Gerar

```yaml
Alertas:
  - Budget ultrapassado (categoria X passou 80%)
  - Despesa anómala (>2x média da categoria)
  - Transacção duplicada detectada
  - Conta sem movimentos há X dias
  - Subscrição nova detectada

Insights Mensais:
  - Top 5 categorias de gastos
  - Comparação mês anterior
  - Tendência de gastos (crescente/decrescente)
  - Comerciantes mais frequentes
  - Previsão de gastos fim do mês

Insights Anuais:
  - Resumo por categoria
  - Mês mais caro vs mais barato
  - Evolução savings rate
  - Impacto da inflação (mesmo comerciante, preços diferentes)
```

### Visualizações Recomendadas

1. **Dashboard Principal:**
   - Saldo total (todas as contas)
   - Gasto este mês vs budget
   - Mini gráfico últimos 30 dias

2. **Breakdown de Gastos:**
   - Donut chart por categoria
   - Barras comparativas mês a mês
   - Treemap para subcategorias

3. **Tendências:**
   - Line chart de gastos mensais (12 meses)
   - Área chart de savings rate
   - Scatter plot de despesas (detectar outliers)

4. **Calendário:**
   - Heatmap de gastos por dia
   - Marcação de transacções recorrentes

---

## 6. Modelos de IA - Recomendações

### Para OCR de Recibos

| Uso | Modelo | Custo/Recibo | Notas |
|-----|--------|--------------|-------|
| **Produção (volume)** | Gemini 2.5 Flash | ~€0.001 | Rápido, barato |
| **Qualidade máxima** | Claude Sonnet 4 | ~€0.003 | Melhor estruturação |
| **Fallback gratuito** | Gemini 2.0 Flash | Grátis* | Free tier |
| **Edge/Offline** | Tesseract + regex | €0 | Accuracy menor |

### Para Classificação

| Uso | Modelo | Custo | Notas |
|-----|--------|-------|-------|
| **Batch** | Regras + Claude Haiku | ~€0.0001/tx | Híbrido eficiente |
| **Real-time** | Gemini 2.0 Flash | Grátis* | Free tier suficiente |
| **Fine-tuned** | GPT-4o mini fine-tuned | Variável | Se volume alto |

### Para Insights/Chat

| Uso | Modelo | Notas |
|-----|--------|-------|
| **Análise complexa** | Claude Sonnet 4 | Raciocínio financeiro |
| **Respostas rápidas** | Claude Haiku | Queries simples |
| **Gráficos** | Code interpreter | Gerar visualizações |

---

## 7. Arquitectura Recomendada para Skill Clawdbot

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLAWDBOT FINANCE SKILL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Recibo    │  │   Banco     │  │   Manual    │             │
│  │   (foto)    │  │   (sync)    │  │   (chat)    │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────────────────────────────────────────┐           │
│  │              Transaction Processor               │           │
│  │  - OCR (Gemini/Claude Vision)                   │           │
│  │  - Classification (Rules + LLM)                 │           │
│  │  - Dedup & Merge                                │           │
│  └─────────────────────┬───────────────────────────┘           │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────┐           │
│  │              SQLite Database                     │           │
│  │  ~/clawd/data/finances.db                       │           │
│  └─────────────────────┬───────────────────────────┘           │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────┐           │
│  │              Analytics Engine                    │           │
│  │  - KPIs calculation                             │           │
│  │  - Anomaly detection                            │           │
│  │  - Insights generation                          │           │
│  └─────────────────────┬───────────────────────────┘           │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────┐           │
│  │              Output Layer                        │           │
│  │  - Chat responses                               │           │
│  │  - Charts (matplotlib/plotly)                   │           │
│  │  - Alerts (telegram)                            │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Comandos Sugeridos

```
📸 Recibos:
- [enviar foto] → OCR automático, confirmar categoria
- "quanto gastei no Continente este mês?"

💳 Transacções:
- "adiciona despesa 45€ restaurante"
- "mostra transacções de ontem"
- "categoriza como lazer"

📊 Relatórios:
- "resumo do mês"
- "quanto gastei em alimentação?"
- "compara Janeiro com Fevereiro"

🎯 Budgets:
- "define budget 300€ restaurantes"
- "como está o meu budget?"
- "alerta se passar 80%"

🏦 Banco:
- "sync banco" → re-autorizar se necessário
- "importa transacções"
```

---

## 8. Próximos Passos para Implementação

### Fase 1: MVP (1-2 semanas)
- [ ] Setup SQLite com schema básico
- [ ] OCR de recibos com Gemini/Claude
- [ ] Classificação básica (regras hard-coded)
- [ ] Comandos: adicionar, listar, resumo mensal

### Fase 2: Classificação Inteligente (1 semana)
- [ ] Regras expandidas para comerciantes PT
- [ ] LLM fallback para casos não cobertos
- [ ] Sistema de aprendizagem com feedback

### Fase 3: Integração Bancária (1-2 semanas)
- [ ] Setup GoCardless
- [ ] Flow de autorização
- [ ] Sync automático diário
- [ ] Merge com transacções manuais

### Fase 4: Insights & Alerts (1 semana)
- [ ] Cálculo de KPIs
- [ ] Alertas de budget
- [ ] Relatórios semanais/mensais automáticos
- [ ] Detecção de anomalias

### Fase 5: Polish (ongoing)
- [ ] Gráficos bonitos
- [ ] Export para CSV/Excel
- [ ] Backup automático
- [ ] Multi-conta familiar?

---

## Referências

1. Nanonets OCR Benchmark 2025: https://nanonets.com/blog/identifying-the-best-ocr-api/
2. GoCardless Bank Account Data: https://developer.gocardless.com/bank-account-data/
3. SIBS API Market: https://www.pay.sibs.com/en/solutions/api-market/
4. BBVA AI Expense Classification: https://www.bbvaaifactory.com/money-talks-how-ai-helps-us-classify-our-expenses-and-income/
5. Personal Finance KPIs: https://www.klipfolio.com/blog/personal-finance-kpis

---

*Documento gerado por pesquisa automatizada em 2026-01-30*
