# Clawdbot Skills & Integrações - Relatório Completo

**Data:** 2026-01-28  
**Autor:** Subagent Research

---

## 📊 Resumo Executivo

O Clawdbot possui **49 skills bundled**, dos quais **9 estão prontos** no sistema atual. Existe um vasto ecossistema de **MCP servers** (Model Context Protocol) que podem ser integrados via `mcporter`. Este relatório identifica as integrações de maior valor para um assistente pessoal.

---

## 🎯 Skills Já Instalados (Ready)

| Skill | Descrição | Prioridade |
|-------|-----------|------------|
| 🔐 1password | Gestão de passwords e segredos | ⭐⭐⭐ |
| 📦 github | Issues, PRs, CI runs via `gh` CLI | ⭐⭐⭐ |
| 🎮 gog | Google Workspace (Gmail, Calendar, Drive) | ⭐⭐⭐⭐⭐ |
| 📝 notion | API do Notion para páginas e databases | ⭐⭐⭐ |
| 📦 skill-creator | Criar custom skills | ⭐⭐⭐⭐ |
| 📦 slack | Controlo do Slack | ⭐⭐ |
| 🧵 tmux | Controlo de sessões tmux | ⭐⭐⭐ |
| 🌤️ weather | Meteorologia sem API key | ⭐⭐⭐⭐ |
| 📦 bluebubbles | iMessage bridge | ⭐⭐ |

---

## 🚀 Skills Prioritários para Instalar

### Alta Prioridade (Instalar Imediatamente)

#### 1. **mcporter** 📦
```bash
npm install -g mcporter
```
- **Razão:** Gateway para **todos os MCP servers**
- **Permite:** Conectar a centenas de integrações externas
- **Valor:** Exponencial - abre portas para todo o ecossistema MCP

#### 2. **himalaya** 📧
```bash
# Verificar: clawdbot skills info himalaya
```
- **Razão:** Email via IMAP/SMTP direto do terminal
- **Funcionalidades:** Ler, enviar, responder, pesquisar emails
- **Valor:** Essencial para assistente pessoal

#### 3. **summarize** 🧾
- **Razão:** Resumir URLs, podcasts, vídeos YouTube
- **Funcionalidades:** Transcrição e resumo de conteúdo
- **Valor:** Produtividade diária

#### 4. **obsidian** 💎
- **Razão:** Gestão de notas e conhecimento
- **Integração:** Vaults Markdown locais
- **Valor:** PKM (Personal Knowledge Management)

#### 5. **spotify-player** 🎵
```bash
# Requer spogo ou spotify_player
```
- **Razão:** Controlo de música
- **Valor:** Qualidade de vida

### Média Prioridade (Instalar Conforme Necessidade)

| Skill | Descrição | Caso de Uso |
|-------|-----------|-------------|
| 📰 blogwatcher | Monitor RSS/Atom feeds | Acompanhar notícias/blogs |
| 📍 goplaces | Google Places API | Encontrar restaurantes, serviços |
| 🐦 bird | Twitter/X CLI | Social media management |
| 📸 camsnap | RTSP/ONVIF cameras | Segurança doméstica |
| 💡 openhue | Philips Hue | Smart home |
| 📋 trello | Gestão de tarefas | Produtividade |
| 🗣️ sag | ElevenLabs TTS | Voice output (já tens Azure grátis) |

### Baixa Prioridade (Nice to Have)

- 🐻 bear-notes - Só para macOS
- ⏰ apple-reminders - Só para macOS
- 📝 apple-notes - Só para macOS
- ✅ things-mac - Só para macOS
- 🫐 blucli - BluOS speakers
- 🎛️ eightctl - Eight Sleep pods
- 🔊 sonoscli - Sonos speakers

---

## 🔌 MCP Servers Recomendados

### O Que é MCP?
**Model Context Protocol** - protocolo aberto que permite a modelos AI interagir com recursos locais e remotos através de servers padronizados.

### Instalação via mcporter
```bash
# Instalar mcporter primeiro
npm install -g mcporter

# Listar servers configurados
mcporter list

# Chamar uma tool específica
mcporter call <server.tool> param=value

# Autenticação OAuth
mcporter auth <server>
```

### MCP Servers de Alto Valor

#### 🏆 Tier 1 - Essenciais

| Server | Descrição | Link |
|--------|-----------|------|
| **Filesystem** | Operações de ficheiros seguras | [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) |
| **Memory** | Sistema de memória persistente (knowledge graph) | [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) |
| **Git** | Manipular repositórios Git | [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/git) |
| **Fetch** | Buscar e converter conteúdo web | [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) |
| **Sequential Thinking** | Problem-solving dinâmico | [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) |

#### 🥈 Tier 2 - Produtividade

| Server | Descrição | Notas |
|--------|-----------|-------|
| **Notion** | API completa do Notion | Oficial |
| **Slack** | Messaging e channel management | [Zencoder](https://github.com/zencoderai/slack-mcp-server) |
| **Google Drive** | Acesso a ficheiros no Drive | [Archived](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) |
| **Google Calendar** | Gestão de calendário | Via gog skill |
| **Brave Search** | Web search | [Oficial](https://github.com/brave/brave-search-mcp-server) |

#### 🥉 Tier 3 - Especializados

| Server | Descrição | Caso de Uso |
|--------|-----------|-------------|
| **PostgreSQL** | Database read-only | Queries de dados |
| **SQLite** | Business intelligence | Análise local |
| **Puppeteer** | Browser automation | Web scraping |
| **GitHub** | Repo management | DevOps |
| **Sentry** | Error tracking | Debugging |

### Agregadores MCP (Um Server, Muitas Integrações)

| Agregador | Descrição |
|-----------|-----------|
| **Pipedream** | 2,500+ APIs, 8,000+ tools pré-construídas |
| **Anyquery** | 40+ apps via SQL |
| **MetaMCP** | Middleware unificado com GUI |
| **WayStation** | Notion, Slack, Monday, Airtable via OAuth |
| **Open-MCP** | Registry open source: [open-mcp.org](https://open-mcp.org) |

---

## 🛠️ Como Criar Custom Skills

### Estrutura de um Skill

```
my-skill/
├── SKILL.md          # Obrigatório - instruções e metadata
└── [Recursos opcionais]
    ├── scripts/      # Código executável (Python/Bash)
    ├── references/   # Documentação para contexto
    └── assets/       # Templates, imagens, etc.
```

### SKILL.md Template

```yaml
---
name: my-skill
description: Breve descrição do que faz e QUANDO usar. Inclui todos os triggers aqui.
---

# My Skill

## Quick Start
[Exemplo básico de uso]

## Funcionalidades
- Feature 1
- Feature 2

## Scripts Disponíveis
- `scripts/exemplo.py` - Descrição

## Referências
- [REFERENCE.md](references/REFERENCE.md) - Para detalhes avançados
```

### Princípios de Design

1. **Conciso é chave** - Só adicionar o que o modelo não sabe
2. **Degrees of Freedom** - Alta liberdade para heurísticas, baixa para operações frágeis
3. **Progressive Disclosure** - Metadata sempre visível, body só quando trigga, recursos sob demanda

### Criar um Novo Skill

```bash
# Usar o script de inicialização
~/.nvm/versions/node/v25.5.0/lib/node_modules/clawdbot/skills/skill-creator/scripts/init_skill.py my-skill --path ~/clawd/skills --resources scripts,references

# Editar o SKILL.md
# Testar scripts
# Empacotar
~/.nvm/versions/node/v25.5.0/lib/node_modules/clawdbot/skills/skill-creator/scripts/package_skill.py ~/clawd/skills/my-skill
```

---

## 📋 Plano de Implementação Recomendado

### Fase 1 - Imediata (Esta Semana)
1. ✅ Instalar **mcporter**: `npm install -g mcporter`
2. ✅ Configurar mcporter com MCP servers essenciais
3. ✅ Verificar/ativar **himalaya** para emails

### Fase 2 - Curto Prazo (Próximas 2 Semanas)
1. 📦 Instalar **summarize** skill
2. 📦 Configurar **obsidian** se usares vaults Markdown
3. 🔧 Criar skill custom para necessidades específicas

### Fase 3 - Médio Prazo (Próximo Mês)
1. 🎵 Configurar **spotify-player**
2. 📰 Ativar **blogwatcher** para feeds importantes
3. 🔌 Explorar MCP servers especializados conforme necessidade

---

## 🔗 Recursos Úteis

### Documentação
- [Clawdbot Docs - Skills](https://docs.clawd.bot/cli/skills)
- [ClawdHub](https://clawdhub.com/skills) - Registry de skills
- [MCP Registry](https://registry.modelcontextprotocol.io/) - Servers oficiais

### Repositórios
- [MCP Servers Oficial](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [ClawdHub GitHub](https://github.com/clawdbot/clawdhub)

### Comunidade
- [r/mcp Reddit](https://www.reddit.com/r/mcp)
- [MCP Discord](https://glama.ai/mcp/discord)

---

## 📈 Resumo de Valor

| Categoria | Skills/Servers | Impacto |
|-----------|---------------|---------|
| **Email & Comms** | himalaya, Slack, iMessage | Alto |
| **Produtividade** | Notion, Obsidian, Trello | Alto |
| **Conhecimento** | summarize, blogwatcher | Médio-Alto |
| **Dev Tools** | GitHub, Git MCP, tmux | Médio |
| **Smart Home** | openhue, camsnap | Baixo-Médio |
| **Extensibilidade** | mcporter, skill-creator | Crítico |

---

*Relatório gerado automaticamente pelo subagent de research*
