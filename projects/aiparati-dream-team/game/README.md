# 🎮 AI Para Ti - Dream Team Game

> Autonomous AI agents living, fighting, and cooperating in a fantasy world

## 🌟 Overview

This is a simulation game where AI agents (powered by LLMs) make their own decisions. Each agent has:
- **Personality**: Unique traits, goals, and backstory
- **Memory**: Short-term and long-term memory with decay
- **Relationships**: Trust levels with other agents
- **Autonomy**: Observe → Decide → Execute loop

## 📁 Project Structure

```
game/
├── frontend/              # Phaser.js game client
│   ├── src/
│   │   ├── scenes/        # Game scenes (boot, play, UI)
│   │   ├── entities/      # Agent sprites, objects
│   │   ├── ui/            # HUD, menus, panels
│   │   └── audio/         # Sound manager
│   ├── assets/
│   │   ├── tilesets/      # World tiles
│   │   ├── sprites/       # Agent/object sprites
│   │   └── music/         # Background music
│   └── config.json        # Game configuration
│
├── backend/               # Node.js/Bun server
│   ├── agents/            # Agent class and logic
│   ├── memory/            # Memory management
│   ├── world/             # World simulation
│   ├── llm/               # LLM integration & prompts
│   ├── api/               # REST/WebSocket API
│   └── db/                # Database schemas
│
├── shared/                # Shared between FE/BE
│   ├── types/             # TypeScript interfaces
│   └── constants/         # Game constants
│
└── docs/                  # Documentation
```

## 🧠 Agent Architecture

### The Observe-Decide-Execute Loop

```
┌─────────────────────────────────────────────────────┐
│                     AGENT TICK                       │
├─────────────────────────────────────────────────────┤
│  1. OBSERVE                                         │
│     └── Gather world state                          │
│     └── Process nearby agents, objects, events      │
│     └── Store observations in memory                │
│                                                     │
│  2. DECIDE (via LLM)                               │
│     └── Build context from memories                 │
│     └── Load class-specific prompt                  │
│     └── Query LLM for decision                      │
│     └── Parse action, target, reasoning             │
│                                                     │
│  3. EXECUTE                                         │
│     └── Validate action is possible                 │
│     └── Apply action to world                       │
│     └── Store result in memory                      │
└─────────────────────────────────────────────────────┘
```

### Agent Classes

| Class | Role | Strengths | Weaknesses |
|-------|------|-----------|------------|
| ⚔️ Warrior | Tank/Damage | High HP, Attack | Low Mana |
| 🔮 Mage | DPS/Control | High Mana, AoE | Fragile |
| 💚 Healer | Support | Healing, Buffs | Low Damage |

### Memory System

- **Short-term**: Last 50 observations, decays quickly
- **Long-term**: Important events (importance ≥7), persists
- **Relationships**: Trust scores (-100 to +100) per agent

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- TypeScript 5+
- LLM API access (OpenAI, Anthropic, or local)

### Installation

```bash
# Clone and enter directory
cd game

# Install dependencies
npm install  # or: bun install

# Start development
npm run dev
```

### Configuration

Edit `frontend/config.json` for game settings:
- Display size and tile dimensions
- Agent tick rate and LLM call frequency
- Audio volumes
- Debug options

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Project structure
- [x] Agent types and interfaces
- [x] Base Agent class with O-D-E loop
- [x] Class-specific prompts
- [ ] Basic world simulation
- [ ] Simple tilemap rendering
- [ ] WebSocket communication

### Phase 2: Core Gameplay
- [ ] Combat system
- [ ] Inventory and items
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] NPC dialogue

### Phase 3: Advanced AI
- [ ] Memory consolidation (summarization)
- [ ] Emergent relationships
- [ ] Goal-directed behavior
- [ ] Learning from experiences

### Phase 4: Polish
- [ ] Save/load system
- [ ] Multiple scenarios
- [ ] Player interaction mode
- [ ] Performance optimization

## 🛠️ Tech Stack

- **Frontend**: Phaser 3, TypeScript
- **Backend**: Bun/Node.js, TypeScript
- **Database**: SQLite/PostgreSQL
- **LLM**: Claude API (Anthropic)
- **Build**: Vite, esbuild

## 📝 License

MIT License - AI Para Ti © 2025

---

*Built with ❤️ by the Dream Team*
