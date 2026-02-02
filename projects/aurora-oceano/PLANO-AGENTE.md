# 🧊 Aurora Oceano - Agente de Gestão de Vendas

**Cliente:** Aurora Oceano (Congelados)  
**Utilizador Principal:** Paula (Back Office)  
**Utilizadores Secundários:** Vendedores de Rua  
**Data:** 2026-01-29

---

## 🎯 VISÃO GERAL

### O Problema
- Paula gere múltiplos vendedores de rua manualmente
- Encomendas chegam por telefone/WhatsApp de forma desorganizada
- Falta visibilidade do estado de cada vendedor
- Rotas não optimizadas = menos clientes/dia
- Relatórios manuais = tempo perdido

### A Solução
**Agente IA "Aurora"** que:
- Centraliza comunicação vendedores ↔ back office
- Organiza encomendas automaticamente
- Sugere rotas optimizadas
- Gera relatórios em tempo real
- Responde a Paula e vendedores via WhatsApp/Telegram

---

## 🤖 FUNCIONALIDADES DO AGENTE

### Para Paula (Back Office)

| Funcionalidade | Descrição | Prioridade |
|----------------|-----------|------------|
| **Dashboard Diário** | Resumo matinal: vendedores activos, rotas, encomendas pendentes | Alta |
| **Gestão Encomendas** | Receber, validar, organizar encomendas por zona/vendedor | Alta |
| **Alertas** | Notificar problemas: atrasos, stock em falta, reclamações | Alta |
| **Relatórios** | Vendas diárias/semanais, performance vendedores, top clientes | Média |
| **Chat Assistido** | Perguntar "Quem tem mais encomendas hoje?" e receber resposta | Média |

### Para Vendedores (Rua)

| Funcionalidade | Descrição | Prioridade |
|----------------|-----------|------------|
| **Rota do Dia** | Receber lista de clientes optimizada por proximidade | Alta |
| **Registar Encomenda** | "Café Lisboa pediu 5 bacalhau congelado" → sistema | Alta |
| **Check-in/out** | Marcar visita a cliente com GPS | Média |
| **Consultar Stock** | "Temos camarão 1kg?" → resposta imediata | Média |
| **Histórico Cliente** | Ver últimas encomendas de um cliente | Baixa |

---

## 📊 BASE DE DADOS

### Tabelas Necessárias

```sql
-- Vendedores
CREATE TABLE vendedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    zona VARCHAR(50),
    activo BOOLEAN DEFAULT true
);

-- Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200),
    morada TEXT,
    telefone VARCHAR(20),
    zona VARCHAR(50),
    vendedor_id INTEGER REFERENCES vendedores(id),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8)
);

-- Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    nome VARCHAR(200),
    categoria VARCHAR(50),
    preco_unit DECIMAL(10,2),
    stock_actual INTEGER
);

-- Encomendas
CREATE TABLE encomendas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    vendedor_id INTEGER REFERENCES vendedores(id),
    data_encomenda TIMESTAMP DEFAULT NOW(),
    data_entrega DATE,
    estado VARCHAR(20) DEFAULT 'pendente',
    total DECIMAL(10,2),
    notas TEXT
);

-- Itens Encomenda
CREATE TABLE itens_encomenda (
    id SERIAL PRIMARY KEY,
    encomenda_id INTEGER REFERENCES encomendas(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER,
    preco_unit DECIMAL(10,2)
);

-- Visitas (check-in vendedores)
CREATE TABLE visitas (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER REFERENCES vendedores(id),
    cliente_id INTEGER REFERENCES clientes(id),
    data_hora TIMESTAMP DEFAULT NOW(),
    tipo VARCHAR(20), -- check-in, check-out
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    notas TEXT
);
```

---

## 💬 FLUXOS DE CONVERSAÇÃO

### Fluxo 1: Paula recebe resumo matinal (08:00)
```
Agente → Paula:
"Bom dia Paula! 🌅

📊 Resumo Aurora Oceano - 29 Jan:

👥 Vendedores activos: 4/5 (João em férias)
📦 Encomendas pendentes: 12
🚚 Entregas hoje: 8

Por zona:
• Lisboa Norte: 4 encomendas (Pedro)
• Lisboa Sul: 3 encomendas (Ana)
• Sintra: 3 encomendas (Carlos)
• Cascais: 2 encomendas (Maria)

⚠️ Alertas:
• Stock baixo: Bacalhau 1kg (5 unidades)
• Cliente Café Central sem visita há 15 dias

Precisa de mais alguma coisa?"
```

### Fluxo 2: Vendedor regista encomenda
```
Pedro → Agente:
"Restaurante Mar Azul pediu 10 camarão grande e 5 lulas"

Agente → Pedro:
"✅ Encomenda registada!

📝 Restaurante Mar Azul
• 10x Camarão Grande (€8.50/kg) = €85.00
• 5x Lula Limpa (€12.00/kg) = €60.00
📍 Total: €145.00

Entrega: Amanhã (30 Jan)
Confirmo com o cliente? (Sim/Não)"

Pedro → Agente:
"Sim"

Agente → Pedro:
"✅ Cliente notificado. Próximo: Café Lisboa (500m)"
```

### Fluxo 3: Paula consulta vendedor
```
Paula → Agente:
"Onde está o Pedro agora?"

Agente → Paula:
"📍 Pedro - Última actualização 10:32

Local: Restaurante Mar Azul (Av. Liberdade)
Estado: Em visita há 15 min
Encomendas hoje: 4/7 (€420 total)

Próxima paragem: Café Lisboa (12:00)"
```

---

## 🛠️ STACK TÉCNICO

### Backend
- **Base de dados:** PostgreSQL (Supabase ou local)
- **Agente:** Clawdbot/Moltbot com Claude
- **API:** Node.js ou Python FastAPI

### Comunicação
- **WhatsApp Business API** (vendedores + Paula)
- **Telegram Bot** (alternativa)

### Integrações
- **Google Maps API** - rotas e geocoding
- **ERP existente** (se houver)

### Skills Clawdbot Necessárias
- `gog` - Google Workspace (Calendar, Sheets)
- `supabase` ou `postgres` - Base de dados
- Skill customizada para lógica Aurora

---

## 📅 ROADMAP DEMO

### Semana 1: MVP
- [ ] Criar base de dados
- [ ] Carregar dados do PDF
- [ ] Agente responde a Paula via Telegram
- [ ] Resumo matinal automático

### Semana 2: Vendedores
- [ ] Fluxo registo encomendas
- [ ] Consulta stock
- [ ] Rota do dia

### Semana 3: Avançado
- [ ] Dashboard web
- [ ] Relatórios automáticos
- [ ] Optimização rotas (Google Maps)

---

## 💰 BENEFÍCIOS ESPERADOS

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Tempo Paula em admin | 4h/dia | 1h/dia | -75% |
| Encomendas perdidas | 5%/mês | <1%/mês | -80% |
| Visitas/vendedor/dia | 8 | 12 | +50% |
| Tempo resposta cliente | 2h | 5 min | -96% |

---

## 🎨 DEMO SCRIPT

### Cenário Demo (5 min)

1. **[0:30]** Paula recebe resumo matinal
2. **[1:00]** Paula pergunta "Quem tem mais encomendas?"
3. **[1:30]** Vendedor regista encomenda via voz
4. **[2:30]** Paula vê dashboard actualizado
5. **[3:30]** Alerta de stock baixo
6. **[4:30]** Relatório fim de dia

---

*Documento preparado por Jarvis para AiParaTi*
