# 🎙️ Dream Team - Vozes por Agente

Cada agente tem uma voz Azure única baseada na sua personalidade.

## 🇵🇹 Vozes PT-PT Disponíveis
- **Duarte** (DuarteNeural) - Masculino, confiante, profissional
- **Raquel** (RaquelNeural) - Feminino, amigável, articulado
- **Fernanda** (FernandaNeural) - Feminino, sério, executivo

## 🇬🇧 Vozes EN Disponíveis
- **Andrew** (AndrewMultilingualNeural) - Masculino, warm, líder
- **Ava** (AvaMultilingualNeural) - Feminino, expressivo
- **Guy** (GuyNeural) - Masculino, técnico, directo
- **Jenny** (JennyNeural) - Feminino, friendly

## 🇫🇷 Vozes FR Disponíveis
- **Remy** (RemyMultilingualNeural) - Masculino, elegante
- **Vivienne** (VivienneMultilingualNeural) - Feminino, sofisticado

---

## 📊 Atribuição por Agente

### PRODUCT SQUAD

| Agente | Role | Personalidade | Voz Azure | Código |
|--------|------|---------------|-----------|--------|
| **ATLAS** | Product Manager | Estratégico, visionário | Andrew (EN) | en-US-AndrewMultilingualNeural |
| **PIXEL** | UX/UI Designer | Criativo, artístico | Ava (EN) | en-US-AvaMultilingualNeural |
| **NEXUS** | Business Analyst | Analítico, preciso | Guy (EN) | en-US-GuyNeural |

### DEV SQUAD

| Agente | Role | Personalidade | Voz Azure | Código |
|--------|------|---------------|-----------|--------|
| **FORGE** | Tech Lead | Líder, arquitecto | Duarte (PT) | pt-PT-DuarteNeural |
| **CODER** | Senior Full-Stack | Pragmático, eficiente | Andrew (EN) | en-US-AndrewMultilingualNeural |
| **NOVA** | Frontend Specialist | Moderno, dinâmico | Jenny (EN) | en-US-JennyNeural |
| **VORTEX** | Backend Specialist | Sólido, sistemático | Guy (EN) | en-US-GuyNeural |
| **SWIFT** | Mobile Developer | Ágil, adaptável | Ava (EN) | en-US-AvaMultilingualNeural |
| **NEURAL** | AI/ML Engineer | Intelectual, curioso | Remy (FR) | fr-FR-RemyMultilingualNeural |
| **ORACLE** | Database Architect | Sábio, paciente | Andrew (EN) | en-US-AndrewMultilingualNeural |

### OPS SQUAD

| Agente | Role | Personalidade | Voz Azure | Código |
|--------|------|---------------|-----------|--------|
| **SENTINEL** | DevOps Engineer | Vigilante, automatizado | Guy (EN) | en-US-GuyNeural |
| **GUARDIAN** | QA Engineer | Meticuloso, rigoroso | Raquel (PT) | pt-PT-RaquelNeural |
| **CIPHER** | Security Specialist | Paranóico, protector | Duarte (PT) | pt-PT-DuarteNeural |
| **VELOCITY** | Performance Engineer | Rápido, optimizado | Guy (EN) | en-US-GuyNeural |

### SUPPORT

| Agente | Role | Personalidade | Voz Azure | Código |
|--------|------|---------------|-----------|--------|
| **SCRIBE** | Documentation Lead | Claro, organizado | Jenny (EN) | en-US-JennyNeural |

---

## 🎯 Lógica de Atribuição

1. **Líderes/Arquitectos** → Vozes autoritárias (Andrew, Duarte)
2. **Criativos** → Vozes expressivas (Ava, Jenny)
3. **Técnicos** → Vozes directas (Guy)
4. **Security/QA** → Vozes PT-PT (mais sérias)
5. **AI/ML** → Voz FR (NEURAL é sofisticado, "neural" soa francês)

---

## 📝 Uso no Código

```javascript
const AGENT_VOICES = {
  ATLAS: { voice: "en-US-AndrewMultilingualNeural", lang: "en" },
  PIXEL: { voice: "en-US-AvaMultilingualNeural", lang: "en" },
  NEXUS: { voice: "en-US-GuyNeural", lang: "en" },
  FORGE: { voice: "pt-PT-DuarteNeural", lang: "pt" },
  CODER: { voice: "en-US-AndrewMultilingualNeural", lang: "en" },
  NOVA: { voice: "en-US-JennyNeural", lang: "en" },
  VORTEX: { voice: "en-US-GuyNeural", lang: "en" },
  SWIFT: { voice: "en-US-AvaMultilingualNeural", lang: "en" },
  NEURAL: { voice: "fr-FR-RemyMultilingualNeural", lang: "fr" },
  ORACLE: { voice: "en-US-AndrewMultilingualNeural", lang: "en" },
  SENTINEL: { voice: "en-US-GuyNeural", lang: "en" },
  GUARDIAN: { voice: "pt-PT-RaquelNeural", lang: "pt" },
  CIPHER: { voice: "pt-PT-DuarteNeural", lang: "pt" },
  VELOCITY: { voice: "en-US-GuyNeural", lang: "en" },
  SCRIBE: { voice: "en-US-JennyNeural", lang: "en" }
};
```

---

*Actualizado: 2026-01-31*
