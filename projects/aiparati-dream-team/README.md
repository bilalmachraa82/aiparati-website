# ⚔️ Dream Team World: Secret of Mana × Generative Agents

> *Where AI agents live, work, and embark on epic quests in a 16-bit fantasy realm*

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Status: In Development](https://img.shields.io/badge/Status-In%20Development-blue.svg)](#roadmap)
[![Jira: DEV-46](https://img.shields.io/badge/Jira-DEV--46-0052CC.svg)](https://aiparati.atlassian.net/browse/DEV-46)

---

## 🌟 Vision

**Dream Team World** is an innovative RPG experience that fuses the nostalgic charm of *Secret of Mana* (1993) with cutting-edge LLM-powered generative agents. In this living, breathing 16-bit pixel art world, the Dream Team—10 AI agents with distinct personalities, memories, and relationships—autonomously live out their days: attending standups, tackling real Jira tasks as epic quests, forming friendships, and facing challenges together. Players can observe, interact with, and join these agents on adventures where every decision emerges from genuine AI reasoning, not scripted behaviour.

---

## ✨ Features

- 🎮 **16-bit Pixel Art** — Authentic Secret of Mana aesthetic with Mana Seed assets
- 🧠 **Generative Agents** — LLM-powered autonomous decision-making (Claude + GLM)
- 💭 **Persistent Memory** — Agents remember events, form opinions, build relationships
- 📋 **Jira Integration** — Real tasks become in-game quests
- 📱 **Mobile-First** — Responsive design with touch controls (Phaser 3)
- 🎵 **Authentic Soundtrack** — Secret of Mana-inspired audio design
- 🌍 **Living World** — Day/night cycles, schedules, emergent behaviours

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ LTS
- **pnpm** (or npm/yarn)
- **LLM API Key** (Anthropic Claude or GLM)

### Installation

```bash
# Clone the repository
git clone https://github.com/aiparati/dream-team-world.git
cd dream-team-world

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your LLM API key
```

### Running the Game

```bash
# Start backend (simulation server)
cd backend
pnpm dev
# Server runs at http://localhost:3001

# Start frontend (in another terminal)
cd frontend
pnpm dev
# Game runs at http://localhost:5173
```

### Configuration

Edit `.env` for your setup:

```env
# LLM Configuration
ANTHROPIC_API_KEY=sk-ant-...          # Primary (Claude Sonnet/Opus)
GLM_API_KEY=...                        # Fallback (cost-saving)

# Database
DATABASE_URL=postgres://...            # Supabase/Neon Postgres
REDIS_URL=redis://...                  # For caching & queues

# Jira Integration (optional)
JIRA_URL=https://yourorg.atlassian.net
JIRA_EMAIL=your@email.com
JIRA_TOKEN=...
```

---

## 🏗️ Architecture

Dream Team World follows a modern **Phaser 3 + Postgres + LLM** architecture designed for scalability from 2 to 20+ agents.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│         Browser (PWA) │ Mobile (Touch) │ Spectator           │
└───────────────────────────┬─────────────────────────────────┘
                            │ WebSocket + REST
┌───────────────────────────┴─────────────────────────────────┐
│                      API GATEWAY                             │
│                  Hono Server (Edge-ready)                    │
├───────────────────────────┬─────────────────────────────────┤
│   World Service │ Agent Service │ Memory Service             │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   SIMULATION ENGINE                          │
│           Tick Scheduler (10s intervals)                     │
│        PLANNER → OPTIMIZER → EXECUTOR                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      DATA LAYER                              │
│    Postgres │ pgvector │ Redis │ BullMQ                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      LLM LAYER                               │
│    Claude Opus (Strategy) │ Sonnet (Tactical) │ GLM (Routine)│
└─────────────────────────────────────────────────────────────┘
```

📖 **[Full Architecture Documentation →](./ARCHITECTURE.md)**

---

## 🎭 The Dream Team

The game features 10 unique AI agents, each with their own personality, skills, and role:

| Agent | Role | Personality |
|-------|------|-------------|
| ⚔️ **JARVIS** | Coordinator | Wise, orchestrating, diplomatic |
| 📋 **ATLAS** | Product Manager | Visionary, organized, communicative |
| ⚒️ **FORGE** | Tech Lead | Analytical, perfectionist, mentoring |
| 🔐 **CIPHER** | Security | Cautious, meticulous, protective |
| 💻 **CODER** | Senior Dev | Focused, creative, problem-solver |
| 🎨 **NOVA** | Frontend | Artistic, detail-oriented, user-focused |
| ⚡ **VORTEX** | Backend | Logical, efficient, systematic |
| 🖌️ **PIXEL** | UX/UI Designer | Creative, empathetic, aesthetic |
| 📊 **NEXUS** | Business Analyst | Data-driven, insightful, strategic |
| 🛡️ **SENTINEL** | DevOps | Reliable, proactive, infrastructure-minded |
| ✅ **GUARDIAN** | QA | Thorough, quality-focused, detail-obsessed |

📖 **[Full Agent Profiles →](./docs/AGENT_PROFILES.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📐 ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture, schemas, APIs |
| [🎨 MANA_STYLE_GUIDE.md](./MANA_STYLE_GUIDE.md) | Visual & audio design (Secret of Mana style) |
| [🔬 DREAM_WORLD_RESEARCH.md](./DREAM_WORLD_RESEARCH.md) | Research on generative agents & references |
| [🎭 docs/AGENT_PROFILES.md](./docs/AGENT_PROFILES.md) | Detailed agent personalities & prompts |
| [🗺️ docs/ROADMAP.md](./docs/ROADMAP.md) | Development phases & milestones |
| [🎮 game/README.md](./game/README.md) | Game-specific setup & structure |

---

## 🗺️ Roadmap

| Version | Status | Features |
|---------|--------|----------|
| **v0.1 MVP** | 🔄 In Progress | 2 agents, 1 map, basic simulation |
| **v0.5 Beta** | 📅 Planned | 10 agents, 3 maps, combat system |
| **v1.0 Release** | 🎯 Target | 20+ agents, full world, multiplayer |

📖 **[Full Roadmap →](./docs/ROADMAP.md)**

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes and test
pnpm test

# Submit a pull request
```

---

## 📜 License

MIT License © 2026 AiParaTi

---

## 🙏 Acknowledgments

- **Secret of Mana** (Square, 1993) — Inspiration for the visual style and world design
- **Generative Agents** (Stanford, 2023) — Foundational research on LLM-powered agents
- **AI Town** (a16z, 2023) — Technical reference for real-time agent simulation
- **Mana Seed** (Seliel the Shaper) — Beautiful 16-bit pixel art assets
- **Hiroki Kikuta** — Legendary composer of the Secret of Mana soundtrack

---

<div align="center">

*Built with ❤️ by the Dream Team @ AiParaTi*

**[🎮 Play Demo](https://dreamteam.aiparati.pt)** · **[📖 Docs](./docs/)** · **[🐛 Issues](https://github.com/aiparati/dream-team-world/issues)**

</div>
