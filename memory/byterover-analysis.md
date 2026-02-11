# ByteRover Analysis - Gestão de Memória para Clawdbot

> **⏸️ STATUS: PAUSADO** (2026-02-01)  
> Decisão: Optimizar sistema actual (MEMORY.md + embeddings) antes de adicionar dependências externas.  
> Rever depois com Bilal.

**Data:** 2026-02-01  
**Objectivo:** Avaliar ByteRover como solução para perda de contexto em sessões longas do Clawdbot

---

## O Que é ByteRover (Resumo)

ByteRover é uma **plataforma de gestão de contexto e memória para AI coding agents**. Funciona como uma "camada de memória partilhada" que captura, versiona e recupera conhecimento de projecto para que agentes de IA possam trabalhar com contexto persistente.

**Slogan:** "Ship faster, at half of current token billing"

**Pontos-chave:**
- Memory layer para coding agents (Cursor, Claude Code, Windsurf, etc.)
- Git-like version control para memória de IA
- Context retrieval semântico com ranking temporal
- Colaboração de equipa com RBAC
- Redução de ~50% no uso de tokens

---

## Como Funciona (Arquitectura)

### Arquitectura Multi-Memória

ByteRover usa uma arquitectura de "Dual Memory System":

1. **System 1 Memory (Knowledge Memory)**
   - Conceitos de programação
   - Lógica de negócio
   - Interacções passadas
   - Sugestões rápidas baseadas em contexto

2. **System 2 Memory (Reflection Memory)**
   - Passos de raciocínio do modelo
   - Padrões de problem-solving
   - Melhoria contínua da geração de código

3. **Workspace Memory (Team)**
   - Conhecimento partilhado entre equipa
   - Contexto cross-IDE
   - Best practices e convenções

### Componentes Técnicos

```
┌─────────────────────────────────────────────────────┐
│                   ByteRover Platform                │
├─────────────────────────────────────────────────────┤
│  Context Composer  │  Memory VC (Git-like)  │ RBAC │
├─────────────────────────────────────────────────────┤
│         Vector Database (embeddings)                │
├─────────────────────────────────────────────────────┤
│  MCP Integration Layer (Cursor, Claude Code, etc.)  │
└─────────────────────────────────────────────────────┘
```

### Fluxo de Funcionamento

1. **Curate:** `brv curate "contexto sobre X"` → armazena memória
2. **Query:** `brv query "como fazer Y?"` → recupera contexto relevante
3. **Sync:** Sincroniza memórias entre team members
4. **Version:** Rollback e comparação de versões

---

## Integração com AI Agents (Clawdbot?)

### ✅ Compatibilidade Confirmada
- Claude Code ✓
- Cursor ✓
- Windsurf ✓
- VS Code ✓
- Gemini CLI ✓
- AWS Kiro ✓

### ⚠️ Limitações para Clawdbot

**Problema Principal:** ByteRover CLI **NÃO suporta ambientes headless/server**

Da documentação oficial:
> "ByteRover CLI is designed as an interactive terminal application and does not support headless server environments"

**Requisitos não compatíveis com Clawdbot:**
- ❌ Requer TTY-enabled terminal
- ❌ OAuth login via browser
- ❌ Desktop credential manager (libsecret + dbus)
- ❌ Não funciona em SSH sem pseudo-terminal
- ❌ Não funciona em Docker sem TTY
- ❌ Não funciona em CI/CD pipelines

### 🔧 Alternativa: Cipher (Open Source)

ByteRover tem um componente **open source chamado Cipher** que pode ser mais flexível:

**GitHub:** https://github.com/campfirein/cipher

**Cipher suporta:**
- ✅ MCP server mode (pode integrar via protocolo)
- ✅ API server mode (`cipher --mode api`)
- ✅ Docker deployment
- ✅ Self-hosted
- ✅ Múltiplos providers (OpenAI, Anthropic, Gemini, Ollama)

**Possível integração com Clawdbot:**
```json
{
  "mcpServers": {
    "cipher": {
      "type": "stdio",
      "command": "cipher",
      "args": ["--mode", "mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "..."
      }
    }
  }
}
```

---

## Prós e Contras

### ✅ Prós

| Aspecto | Detalhe |
|---------|---------|
| **Persistência** | Memória sobrevive entre sessões |
| **Redução de tokens** | ~50% menos tokens por query preciso |
| **Version control** | Git-like para memória (rollback, diff) |
| **Team collaboration** | Partilha de contexto entre devs |
| **Semantic retrieval** | Busca por significado, não keywords |
| **Time-aware ranking** | Prioriza informação recente |
| **Open source option** | Cipher é gratuito e self-hostable |
| **Multi-provider** | OpenAI, Anthropic, Gemini, Ollama |
| **RAG built-in** | Vector store integrado (Qdrant, Milvus) |

### ❌ Contras

| Aspecto | Detalhe |
|---------|---------|
| **Não headless** | CLI principal não funciona em servers |
| **Browser auth** | OAuth requer browser (não automático) |
| **Complexidade** | Mais uma camada para manter |
| **Lock-in parcial** | Platform ByteRover vs Cipher OSS |
| **Pricing** | Pro = $29/seat/mês (não trivial) |
| **Produto jovem** | Version 2.0 recente, ainda em maturação |
| **Foco em coding** | Optimizado para code, não chat genérico |

---

## Pricing / Self-Hosting

### Planos ByteRover Cloud

| Plano | Preço | Limites |
|-------|-------|---------|
| **Starter** | GRÁTIS | 5 users, 200 credits |
| **Pro** | $29/seat/mês | Unlimited users, 3,000 credits |
| **Enterprise** | Custom | Self-hosted, custom integrations |

### Self-Hosting (Cipher)

**Cipher é 100% open source e self-hostable:**

```bash
# NPM
npm install -g @byterover/cipher

# Docker
docker-compose up --build -d
```

**Requisitos para self-host:**
- Node.js 20+
- Vector store: In-memory, Qdrant, ou Milvus
- Chat history: SQLite (default) ou PostgreSQL
- API key de um LLM provider

**Custos self-hosted:**
- Hosting: ~$10-50/mês (VPS)
- LLM API: Depende do uso (ou Ollama local = grátis)
- Vector DB: Qdrant Cloud free tier ou self-hosted

---

## Feedback da Comunidade

### Quotes Relevantes

**De ChatGate.ai:**
> "AI agents often forget prior work. They miss recent changes, repeat past mistakes, or ignore business rules. ByteRover preserves hard-won knowledge and retrieves it contextually."

**De Cursor Directory:**
> "ByteRover helps create a shared memory layer that captures and indexes all agent interactions, reasoning paths, and developer feedback during coding tasks."

**De MOGE.ai:**
> "ByteRover integrates seamlessly with popular AI IDEs and coding agents, providing a unified architecture that supports continuous learning, memory organization, and efficient retrieval."

**De Relyvo:**
> "The weekly update of its knowledge base ensures that the assistant stays current with the latest developments."

### Observações

- Produto relativamente novo (2025)
- Comunidade pequena mas activa
- Discord oficial disponível
- Sem reviews negativos encontrados (mas também poucos reviews no geral)
- Mencionado em Reddit r/cursor e r/windsurf (não consegui aceder ao conteúdo)

---

## Recomendação: Usar ou Não?

### 🟡 Recomendação: **INVESTIGAR CIPHER, NÃO ByteRover Platform**

**Para Clawdbot especificamente:**

| ByteRover Platform | Cipher (OSS) |
|-------------------|--------------|
| ❌ Não compatível (headless) | ✅ Potencialmente compatível |
| ❌ Requer browser auth | ✅ API keys simples |
| ❌ $29/seat/mês | ✅ Gratuito |
| ❌ Cloud lock-in | ✅ Self-hosted |

### Veredicto

**ByteRover Platform** = ❌ Não usar (incompatível com servidor headless)

**Cipher (OSS)** = 🟡 Vale investigar mais para:
- Integração via MCP server mode
- API server mode para queries
- Vector store para memória persistente

### Alternativas a Considerar

1. **Mem0** - Memory layer alternativo (mais genérico)
2. **LangChain Memory** - Integração nativa com LangChain
3. **ChromaDB + custom** - Vector store simples
4. **Solução custom** - MEMORY.md + daily files (já temos!)

---

## Próximos Passos de Integração (Se Avançar)

### Opção A: Cipher via MCP

```bash
# 1. Instalar Cipher
npm install -g @byterover/cipher

# 2. Configurar .env
ANTHROPIC_API_KEY=...
VECTOR_STORE_TYPE=qdrant
CIPHER_PG_URL=postgresql://...

# 3. Correr em modo API
cipher --mode api

# 4. Integrar no Clawdbot via HTTP calls
curl http://localhost:3000/api/memory/search -d '{"query": "..."}'
```

### Opção B: Usar apenas Vector Store

```bash
# 1. Setup Qdrant local
docker run -p 6333:6333 qdrant/qdrant

# 2. Custom integration
# - Embeddings via OpenAI/Anthropic
# - Store em Qdrant
# - Query semântico para contexto
```

### Opção C: Melhorar Sistema Actual

O Clawdbot já tem:
- `MEMORY.md` - Long-term memory
- `memory/YYYY-MM-DD.md` - Daily notes
- `HEARTBEAT.md` - Periodic tasks

**Melhoria possível:**
- Adicionar embeddings aos ficheiros de memória
- Vector search local para queries
- Summarization automática de sessões longas

---

## Conclusão

ByteRover é uma solução interessante para **coding agents em IDEs desktop**, mas **não é directamente compatível com Clawdbot** devido à natureza headless do nosso ambiente.

A alternativa open source **Cipher** merece investigação mais profunda, especialmente os modos API e MCP server que podem funcionar em ambiente servidor.

No entanto, dado o overhead de setup e manutenção, pode ser mais pragmático **melhorar o sistema de memória existente** com vector embeddings simples, em vez de adoptar uma plataforma externa.

**Próxima acção sugerida:** Testar Cipher em modo API num ambiente de teste antes de decidir integração.

---

*Análise realizada por JARVIS em 2026-02-01*
