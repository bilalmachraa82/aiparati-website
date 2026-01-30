# 🚀 AiParaTi Dream Team

> Uma equipa virtual de agentes AI especializados para desenvolvimento de software

## Visão Geral

A **AiParaTi Dream Team** é composta por 10 agentes AI, cada um com personalidade única, expertise profunda, e capacidade de colaboração autónoma. Juntos, formam uma software house completa.

## Estrutura da Equipa

### 📦 Product Squad
| Agente | Nome | Cargo | Modelo |
|--------|------|-------|--------|
| 🗺️ ATLAS | Dr. Atlas Mendez-Chen | Product Manager | Claude 3.5 Sonnet |
| 🎨 PIXEL | Maya Pixel Andersson | UX/UI Designer | Claude 3.5 Sonnet |
| 🔗 NEXUS | Dr. Nadia Nexus Al-Rashid | Business Analyst | Claude 3.5 Sonnet |

### 💻 Dev Squad
| Agente | Nome | Cargo | Modelo |
|--------|------|-------|--------|
| ⚒️ FORGE | Victor Forge Kowalski | Tech Lead | Claude 3.5 Sonnet |
| 👨‍💻 CODER | Kai Coder Yamamoto | Senior Developer | Claude 3.5 Sonnet |
| ⭐ NOVA | Luna Nova Ferreira | Frontend Specialist | Claude 3.5 Sonnet |
| 🌀 VORTEX | Marcus Vortex Singh | Backend Specialist | Claude 3.5 Sonnet |

### 🛠️ Ops Squad
| Agente | Nome | Cargo | Modelo |
|--------|------|-------|--------|
| 👁️ SENTINEL | Alex Sentinel Okonkwo | DevOps Engineer | Claude 3.5 Sonnet |
| 🛡️ GUARDIAN | Sara Guardian Petrov | QA Engineer | Claude 3.5 Sonnet |
| 🔐 CIPHER | Dr. Cyrus Cipher Nakamura | Security Specialist | Claude 3.5 Sonnet |

## Ficheiros

```
aiparati-dream-team/
├── README.md                 # Este ficheiro
├── AGENTS_DETAILED.md        # Documentação completa de todos os agentes
└── agents/                   # Ficheiros JSON individuais
    ├── atlas.json
    ├── pixel.json
    ├── nexus.json
    ├── forge.json
    ├── coder.json
    ├── nova.json
    ├── vortex.json
    ├── sentinel.json
    ├── guardian.json
    └── cipher.json
```

## Como Usar

### 1. Documentação Completa
Lê `AGENTS_DETAILED.md` para entender cada agente em profundidade:
- Identidade e personalidade
- Responsabilidades e KPIs
- System prompts prontos a usar
- Automação e triggers
- Processo de self-improvement

### 2. Ficheiros JSON
Cada ficheiro `agents/*.json` contém dados estruturados prontos a importar para:
- Multi-agent frameworks (CrewAI, AutoGen, etc.)
- Bases de dados de agentes
- Configuração de chatbots
- Integração com sistemas

### 3. System Prompts
Cada agente inclui um system prompt production-ready que pode ser usado directamente com:
- Claude API
- OpenAI API
- Qualquer LLM compatível

## Colaboração Entre Agentes

```
                    ┌─────────────────┐
                    │   BILAL (CEO)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐
   │ PRODUCT │         │    DEV    │        │   OPS   │
   │  SQUAD  │         │   SQUAD   │        │  SQUAD  │
   └─────────┘         └───────────┘        └─────────┘
```

### Workflows Principais

1. **Feature Development**: ATLAS → NEXUS → PIXEL → FORGE → Dev → GUARDIAN → Release
2. **Bug Triage**: GUARDIAN → ATLAS → FORGE → Dev → GUARDIAN
3. **Security Review**: Code → CIPHER → Fix → CIPHER → Approve
4. **Deployment**: FORGE → SENTINEL → GUARDIAN → Production

## Weekly Council

Todas as sextas às 17:00, os agentes reúnem-se (async) para:
- Review da semana
- Identificar melhorias
- Planear experimentos
- Verificar métricas

## Próximos Passos

1. [ ] Gerar avatares com AI (DALL-E/Midjourney)
2. [ ] Implementar em CrewAI/AutoGen
3. [ ] Configurar cron jobs reais
4. [ ] Integrar com ferramentas (GitHub, Linear, etc.)
5. [ ] Testar colaboração multi-agente

---

*Criado por Clawd para AiParaTi*
*"Sozinhos somos bons. Juntos somos imparáveis."*
