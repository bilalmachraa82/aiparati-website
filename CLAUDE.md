# CLAUDE.md - Memory & Context Instructions

## 🧠 REGRA CRÍTICA: SEMPRE Usar Memória

Quando o contexto está truncado ("Summary unavailable"), ANTES de pedir informação ao Bilal:

```
1. memory_search("tema relevante")  → Procurar contexto
2. memory_get(path, from, lines)    → Ler detalhes específicos
3. SÓ DEPOIS agir ou perguntar
```

## Fontes de Memória

| Ficheiro | Conteúdo |
|----------|----------|
| `MEMORY.md` | Memória de longo prazo (curada) |
| `memory/YYYY-MM-DD.md` | Notas diárias (raw) |
| `memory/*.md` | Análises e referências |

## Projectos Activos

### Dream Team World
- **Path:** `~/clawd/projects/aiparati-dream-team/`
- **Frontend:** `game/frontend/src/` (Phaser 3)
- **Backend:** `game/backend/` (Express + Socket.IO)
- **URL:** https://aiparati-dream-team.vercel.app

### Outros
- MIDAS: `~/clawd/projects/midas-finance/`
- Aurora Bot: `~/clawd/demo/aurora_oceano/`
- Hélène Academy: `~/clawd/projects/helene-academy-bot/`

## Queries de Memória Úteis

```
# Contexto de projecto
memory_search("Dream Team Phaser jogo")
memory_search("MIDAS financial coach")
memory_search("Aurora Oceano bot")

# Configurações
memory_search("1Password op-get vault")
memory_search("TTS voz Paula ElevenLabs")
memory_search("Jira API credentials")

# Pessoas
memory_search("Luis CTO Telegram")
memory_search("Noah filho Bilal")
memory_search("Hélène Academy")
```

## Quando Perdes Contexto

1. **NÃO perguntes** "qual projecto?" sem primeiro pesquisar
2. **USA** memory_search com palavras-chave da mensagem do utilizador
3. **LÊ** memory/YYYY-MM-DD.md do dia actual
4. **SÓ ENTÃO** pede clarificação se necessário

---
*Actualizado: 2026-02-01*
