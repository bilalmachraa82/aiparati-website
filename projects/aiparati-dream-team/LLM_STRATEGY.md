# 🧠 LLM Strategy - AiParaTi Dream Team

> **Última actualização:** 2026-02-01
> **Fonte:** LM Arena, benchmarks Jan 2026
> **Regra:** Este documento é a FONTE DE VERDADE para modelos LLM. Consultar antes de configurar agentes.

---

## 📊 LM Arena Rankings (Janeiro 2026)

| Rank | Modelo | Arena Score | Forte em | Provider |
|------|--------|-------------|----------|----------|
| 🥇 1 | **Claude Opus 4.5** | ~1510 | Coding, reasoning complexo, arquitectura | Anthropic |
| 🥈 2 | **Grok 4.1** | ~1495 | Reasoning, EQ-Bench, conversação | xAI |
| 🥉 3 | **GPT-5.2** | ~1477 | 400K context, baixo hallucination, AIME math | OpenAI |
| 4 | **Claude Sonnet 4.5** | ~1460 | Agent workflows, coding rápido, custo-eficiente | Anthropic |
| 5 | **Gemini 3 Pro** | ~1445 | 1M context, velocidade, multimodal | Google |
| 6 | **Kimi K2.5** | ~1440 | Multimodal nativo, agentic, video understanding | Moonshot |
| 7 | **GLM-4.7** | ~1420 | Open source #1, reasoning, grátis | Zhipu AI |

---

## 🔑 Modelos Disponíveis (Licenças AiParaTi)

### ✅ ILIMITADOS (Licença Paga)
| Modelo | Tipo | Acesso | API Key Location |
|--------|------|--------|------------------|
| **Claude Opus 4.5** | Tier 1 Strategic | Ilimitado | Clawdbot config |
| **Claude Sonnet 4.5** | Tier 2 Execution | Ilimitado | Clawdbot config |
| **Claude Haiku 4** | Tier 3 Tasks | Ilimitado | Clawdbot config |

### 💳 COM QUOTA
| Modelo | Quota | API Key Location |
|--------|-------|------------------|
| **Gemini 3 Pro** | Free tier generous | 1Password: "Gemini API Key" |
| **GLM-4.7** | Generous | 1Password: "GLM API Key 4.7" |
| **Kimi K2.5** | TBD | 1Password (a adicionar) |

---

## 🎯 Estratégia de Routing por Tarefa

### Princípio: "Right Model for Right Task"

```
┌─────────────────────────────────────────────────────────────────┐
│                    TASK COMPLEXITY ROUTER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STRATEGIC (Opus 4.5)          EXECUTION (Sonnet 4.5)           │
│  ├── Architecture decisions    ├── Feature implementation       │
│  ├── Security analysis         ├── Code review                  │
│  ├── Complex debugging         ├── Bug fixes                    │
│  ├── System design             ├── API integration              │
│  └── Multi-step reasoning      └── Documentation                │
│                                                                  │
│  SPEED (Gemini 3 / GLM-4.7)    TASKS (Haiku 4)                  │
│  ├── Large context analysis    ├── Simple transformations       │
│  ├── Quick summaries           ├── Data extraction              │
│  ├── Parallel processing       ├── Format conversion            │
│  └── Cost-sensitive bulk       └── Validation checks            │
│                                                                  │
│  MULTIMODAL (Kimi K2.5)        AGENTIC (Kimi K2.5)              │
│  ├── Video understanding       ├── 100 sub-agents parallel      │
│  ├── UI from screenshots       ├── Complex automation           │
│  └── Image-to-code             └── Multi-step workflows         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 Configuração por Agente

### Squad: Product
| Agente | Role | Primary | Fallback | Rationale |
|--------|------|---------|----------|-----------|
| **ATLAS** | Product Manager | Opus 4.5 | Sonnet 4.5 | Strategic decisions need best reasoning |
| **PIXEL** | UX/UI Designer | Sonnet 4.5 | Kimi K2.5 | Creative + multimodal para mockups |
| **NEXUS** | Business Analyst | Opus 4.5 | GLM-4.7 | Data analysis, complex reasoning |

### Squad: Dev
| Agente | Role | Primary | Fallback | Rationale |
|--------|------|---------|----------|-----------|
| **FORGE** | Tech Lead | Opus 4.5 | Sonnet 4.5 | Architecture needs top model |
| **CODER** | Senior Dev | Sonnet 4.5 | GLM-4.7 | Balance speed/quality |
| **NOVA** | Frontend | Sonnet 4.5 | Kimi K2.5 | UI work benefits from multimodal |
| **VORTEX** | Backend | Sonnet 4.5 | GLM-4.7 | API work, systematic |
| **SWIFT** | Mobile | Sonnet 4.5 | Haiku 4 | Platform-specific, faster |
| **NEURAL** | AI/ML | Opus 4.5 | GLM-4.7 | ML reasoning needs depth |
| **ORACLE** | Database | Opus 4.5 | GLM-4.7 | Complex SQL, optimization |

### Squad: Ops
| Agente | Role | Primary | Fallback | Rationale |
|--------|------|---------|----------|-----------|
| **SENTINEL** | DevOps | Sonnet 4.5 | Haiku 4 | Infrastructure, scripts |
| **GUARDIAN** | QA | Sonnet 4.5 | Haiku 4 | Testing, validation |
| **CIPHER** | Security | Opus 4.5 | Sonnet 4.5 | Security needs depth |
| **VELOCITY** | Performance | Opus 4.5 | GLM-4.7 | Optimization analysis |

### Squad: Support
| Agente | Role | Primary | Fallback | Rationale |
|--------|------|---------|----------|-----------|
| **SCRIBE** | Documentation | Sonnet 4.5 | GLM-4.7 | Writing, organization |

---

## 🔄 Best Practices: Multi-Model Routing

### 1. Latency-Based Routing
```
IF response_time_critical:
    USE Gemini 3 Pro (fastest)
ELIF quality_critical:
    USE Opus 4.5 (best)
ELSE:
    USE Sonnet 4.5 (balanced)
```

### 2. Cost Optimization
```
FREE/CHEAP tier:
├── GLM-4.7 (open source, generous quota)
├── Gemini 3 Pro (free tier)
└── Haiku 4 (lowest Claude cost)

PAID tier (use when needed):
├── Sonnet 4.5 (good balance)
└── Opus 4.5 (strategic only)
```

### 3. Fallback Chain
```
Primary failed? → Try fallback
Fallback failed? → Alert + queue for retry

Example chain:
Opus 4.5 → Sonnet 4.5 → GLM-4.7 → Gemini 3 Pro
```

### 4. Context Window Strategy
```
< 32K tokens  → Any model
32K - 128K    → Sonnet 4.5, Gemini 3
128K - 400K   → GPT-5.2, Gemini 3
> 400K        → Gemini 3 Pro (1M context)
```

### 5. Multimodal Routing
```
Text only       → Claude family
Image + Text    → Kimi K2.5, Gemini 3
Video + Text    → Kimi K2.5
UI Generation   → Kimi K2.5 (native)
```

---

## 🚀 Kimi K2.5 - Especial Atenção

**Lançado:** 27 Janeiro 2026 (Moonshot AI)

### Specs
- **Parâmetros:** 1T total, 32B activos (MoE)
- **Multimodal:** Texto, imagem, vídeo nativos
- **Agentic:** Até 100 sub-agentes paralelos
- **Speed:** 4.5x mais rápido em coding
- **Licença:** MIT modificado (open source)

### Use Cases Ideais
1. **UI from Video** - Upload vídeo → gera interface completa
2. **Parallel Agents** - Tarefas complexas divididas em 100 workers
3. **Visual Coding** - Screenshot → código funcional
4. **Multimodal Analysis** - Entender contexto visual + texto

### Integração Recomendada
```javascript
// Usar para NOVA (Frontend) e PIXEL (UX/UI)
agents: {
  "NOVA": { fallback: "kimi-k2.5" },
  "PIXEL": { fallback: "kimi-k2.5" }
}
```

---

## 📋 Checklist de Implementação

- [x] GLM-4.7 API key em 1Password
- [ ] Kimi K2.5 API key (Bilal a arranjar)
- [ ] Actualizar MASTER_CONFIG.json com fallbacks
- [ ] Criar router service para Dream Team
- [ ] Dashboard com model usage metrics
- [ ] Alerting para quota limits

---

## 🔗 Recursos

- **LM Arena:** https://lmarena.ai/leaderboard/text
- **OpenRouter (unified API):** https://openrouter.ai
- **Martian (router):** https://withmartian.com
- **Kimi Code CLI:** https://www.kimi.com/code
- **GLM API:** https://open.bigmodel.cn

---

## 📝 Notas de Actualização

| Data | Mudança |
|------|---------|
| 2026-02-01 | Documento criado, GLM-4.7 adicionado |
| 2026-01-27 | Kimi K2.5 lançado (investigar) |

---

*Este documento é mantido pelo JARVIS e actualizado com cada mudança de modelo ou benchmark.*
