# 🐟 Aurora Oceano Bot

**Bot Telegram + Dashboard para gestão de empresa de congelados**

Cliente: Aurora Oceano (Paula)  
Integração: Moloni ERP

---

## 📊 Estado Actual: ~25-30%

### ✅ O Que Funciona
- **Dados Moloni exportados** (produtos, clientes, faturas, categorias)
- **Schema PostgreSQL** completo com views de analytics
- **Sistema de regras de negociação** configurável
- **Bot demo** funcional localmente
- **Sync Moloni → DB** estruturado (moloni_sync.py)
- **Dashboard HTML** básico

### 🚧 Em Desenvolvimento
- Bot Telegram em produção
- TTS com voz Paula (ElevenLabs)
- Analytics em tempo real
- Optimização de rotas

### ❌ Por Fazer (MVP)
- [ ] Deploy do bot em produção
- [ ] Autenticação de utilizadores
- [ ] Webhook Telegram (vs polling)
- [ ] Dashboard interactivo
- [ ] Alertas automáticos (stock baixo, pagamentos)
- [ ] Integração bidireccional Moloni

---

## 🗂️ Estrutura do Projecto

```
aurora-oceano/
├── bot/                    # Código do bot
│   ├── aurora_telegram.py  # Bot principal (produção)
│   ├── aurora_agent.py     # Lógica de negociação
│   ├── demo_bot.py         # Bot demonstração
│   └── tts_aurora.py       # Text-to-speech
├── database/               # Database sync
│   ├── moloni_sync.py      # Sincronização Moloni
│   ├── analytics.py        # Queries analytics
│   ├── daily_sync.py       # Sync diário
│   └── schema.sql          # Schema PostgreSQL
├── dashboard/              # Dashboard web
│   └── *.html              # Páginas HTML
├── dashboard-real/         # Dashboard Vercel
│   └── data/               # Dados JSON
├── config/                 # Configuração
│   └── regras_negociacao.json
├── data/                   # Dados exportados
│   └── real/               # Dados Moloni reais
├── scripts/                # Utilitários
│   ├── route_optimizer.py  # Optimização rotas
│   ├── parse_produtos.py   # Parser produtos
│   └── gerar_pdf_encomenda.py
└── pdfs/                   # PDFs gerados
```

---

## 🔧 Setup

### 1. Criar Ambiente Virtual
```bash
cd aurora-oceano
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar .env com os valores reais
```

### 3. Inicializar Base de Dados
```bash
cd database
python moloni_sync.py init   # Criar tabelas
python moloni_sync.py sync   # Sincronizar dados
```

### 4. Executar Bot (demo)
```bash
cd bot
python demo_bot.py
```

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `AURORA_BOT_TOKEN` | Token do bot Telegram |
| `MOLONI_CLIENT_ID` | Client ID Moloni API |
| `MOLONI_CLIENT_SECRET` | Client Secret Moloni |
| `MOLONI_ACCESS_TOKEN` | Access Token Moloni |
| `MOLONI_REFRESH_TOKEN` | Refresh Token Moloni |
| `MOLONI_EMPRESA_ID` | ID da empresa no Moloni |
| `ELEVENLABS_API_KEY` | API Key ElevenLabs (TTS) |
| `DATABASE_URL` | Connection string PostgreSQL |

---

## 📱 Funcionalidades do Bot

1. **Encomendas** - Ver encomendas pendentes, histórico
2. **Stock** - Alertas de stock baixo/crítico
3. **Pagamentos** - Pagamentos a fornecedores
4. **Preços** - Histórico de preços por cliente
5. **Rotas** - Rotas de entrega optimizadas
6. **Ranking** - Performance de vendedores
7. **Fichas** - Fichas técnicas de produtos
8. **Voz** - Respostas em áudio (Paula PT-PT)

---

## 🔗 Dependências Externas

- **Moloni** - ERP para facturação e stock
- **Telegram Bot API** - Interface utilizador
- **ElevenLabs** - Text-to-speech premium
- **PostgreSQL (Neon)** - Base de dados
- **Vercel** - Hosting dashboard

---

## 📈 Dados Disponíveis

- ~500+ produtos com preços e stock
- Histórico de faturas 2024-2025
- Lista de clientes completa
- Categorias de produtos
- Regras de negociação automáticas

---

## 🚀 Próximos Passos (MVP)

1. Deploy bot em VPS com webhook
2. Dashboard com dados em tempo real
3. Alertas diários automáticos
4. Sistema de aprovação de descontos
5. Integração WhatsApp (futuro)

---

## 📞 Contacto

Projecto desenvolvido por **AiParaTi Dream Team**  
Cliente: **Aurora Oceano** (Paula)

---

*Última actualização: 2026-01-30*
