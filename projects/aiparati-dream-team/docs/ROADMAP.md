# 🗺️ Development Roadmap

> Dream Team World — From MVP to Full Release

---

## Overview

This roadmap outlines the phased development of Dream Team World, from a minimal viable product to a fully-featured RPG simulation with 20+ autonomous AI agents.

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT TIMELINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  v0.1 MVP          v0.5 Beta           v1.0 Release         │
│     │                  │                    │                │
│     ▼                  ▼                    ▼                │
│  ●━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━●       │
│  │                │                │                │       │
│  Q1 2026          Q2 2026          Q3 2026          Q4 2026 │
│                                                              │
│  ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ████ Current Progress (~20%)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 v0.1 — MVP (Minimum Viable Product)

> **Goal:** Prove the concept works. 2 agents making autonomous decisions in a simple world.

### Status: 🔄 In Progress

**Target Date:** February 2026

### Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🗺️ Single Map | ✅ Done | Office environment (16×16 tiles) |
| 👥 2 Agents | 🔄 In Progress | FORGE + CODER with basic AI |
| 🧠 Basic Decision Loop | 📋 Planned | Observe → Decide → Execute |
| 💬 Simple Dialogue | 📋 Planned | Agents can talk to each other |
| 🎮 Basic Controls | 📋 Planned | Click to observe, basic UI |
| 📡 WebSocket Sync | 📋 Planned | Real-time state updates |

### Technical Scope

```
Backend:
├── Single Node.js process
├── SQLite database (local)
├── Sequential LLM calls (Claude Sonnet)
└── ~10 second tick rate

Frontend:
├── Phaser 3 basic setup
├── 1 tilemap (office)
├── 2 agent sprites
└── Minimal HUD
```

### Success Criteria

- [ ] Two agents walk around the map autonomously
- [ ] Agents make decisions via LLM (logged)
- [ ] Agents can have a basic conversation
- [ ] State persists across browser refresh
- [ ] Works on mobile (responsive)

### Cost Estimate

| Item | Monthly Cost |
|------|-------------|
| LLM (light usage) | ~$20 |
| Supabase Free Tier | $0 |
| Vercel Free Tier | $0 |
| **Total** | **~$20/month** |

---

## 🚀 v0.5 — Beta

> **Goal:** A playable game. 10 agents, multiple maps, combat system, real engagement.

### Status: 📅 Planned

**Target Date:** May 2026

### Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🗺️ 3 Maps | 📋 Planned | Office, Forest, Dungeon |
| 👥 10 Agents | 📋 Planned | Full Dream Team |
| ⚔️ Combat System | 📋 Planned | Turn-based or real-time (TBD) |
| 🎭 Party System | 📋 Planned | Select 3-4 agents for quests |
| 📋 Jira Integration | 📋 Planned | Real tasks = in-game quests |
| 💭 Memory System | 📋 Planned | pgvector for long-term memories |
| 🌅 Day/Night Cycle | 📋 Planned | Time affects agent behaviour |
| 🎵 Music System | 📋 Planned | Dynamic soundtrack |
| 📱 Touch Controls | 📋 Planned | Virtual joystick, gestures |

### Technical Scope

```
Backend:
├── Hono server (edge-ready)
├── Postgres + pgvector (Supabase)
├── Redis caching
├── Parallel LLM calls (batched)
├── Tiered LLM (Opus/Sonnet/GLM)
└── 10 second tick rate

Frontend:
├── Phaser 3 full setup
├── 3 tilemaps with transitions
├── 10 agent sprites + animations
├── Combat UI
├── Inventory system
├── Full HUD with menus
└── Mobile touch controls
```

### New Maps

| Map | Theme | Size | Features |
|-----|-------|------|----------|
| 🏢 Office | Modern workplace | 32×24 | Desks, meeting rooms, coffee |
| 🌲 Forest | Mana-style nature | 48×36 | Paths, clearings, enemies |
| 🏰 Dungeon | Dark mystery | 32×32 | Puzzles, bosses, treasure |

### Agent Roster

| Agent | Role | Combat Class |
|-------|------|--------------|
| ⚔️ JARVIS | Coordinator | Paladin |
| 📋 ATLAS | Product Manager | Bard |
| ⚒️ FORGE | Tech Lead | Warrior |
| 🔐 CIPHER | Security | Rogue |
| 💻 CODER | Senior Dev | Mage |
| 🎨 NOVA | Frontend | Illusionist |
| ⚡ VORTEX | Backend | Warlock |
| 🖌️ PIXEL | UX/UI | Enchanter |
| 📊 NEXUS | Analyst | Sage |
| 🛡️ SENTINEL | DevOps | Guardian |

### Success Criteria

- [ ] 10 agents with distinct personalities
- [ ] Players can form a party and go on quests
- [ ] Combat system is functional and fun
- [ ] Jira tasks appear as in-game quests
- [ ] Agents remember past events
- [ ] Day/night affects agent schedules
- [ ] Game runs smoothly on mobile
- [ ] 30+ minute play sessions are engaging

### Cost Estimate

| Item | Monthly Cost |
|------|-------------|
| LLM (moderate usage) | ~$150 |
| Supabase Pro | $25 |
| Redis (Upstash) | $10 |
| Vercel Pro | $20 |
| **Total** | **~$205/month** |

---

## 🎯 v1.0 — Release

> **Goal:** A complete, polished game ready for public release. 20+ agents, full world, multiplayer.

### Status: 🎯 Target

**Target Date:** September 2026

### Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🗺️ 7+ Maps | 🎯 Target | Complete world with regions |
| 👥 20+ Agents | 🎯 Target | Dream Team + NPCs + Bosses |
| ⚔️ Full Combat | 🎯 Target | Skills, elements, equipment |
| 🎒 Inventory | 🎯 Target | Items, equipment, crafting |
| 📈 Progression | 🎯 Target | XP, levels, skill trees |
| 🌐 Multiplayer | 🎯 Target | Spectator mode, co-op (optional) |
| 🏆 Achievements | 🎯 Target | Unlockables, completion tracking |
| 🔄 Save System | 🎯 Target | Cloud saves, multiple slots |
| 🎙️ Voice (TTS) | 🎯 Target | ElevenLabs agent voices |
| 📺 Streaming | 🎯 Target | OBS-friendly, content creator tools |

### World Map

```
┌─────────────────────────────────────────────────────────────┐
│                    DREAM TEAM WORLD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ❄️ Ice Peaks                                    │
│                   │                                          │
│      🏔️ Mountains─┼─🏰 Castle                                │
│           │       │                                          │
│      🌲 Forest────●────🏜️ Desert                             │
│           │    (Hub)    │                                    │
│      🏢 Office────┼─🌊 Coast                                  │
│                   │                                          │
│              🌋 Volcano                                       │
│                                                              │
│  ● = Mana Village (Central Hub)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Maps Detail

| Map | Theme | Difficulty | Unique Feature |
|-----|-------|------------|----------------|
| 🏢 Office | Tutorial/Hub | ⭐ | Jira quest board |
| 🌲 Forest | Nature | ⭐⭐ | Day/night wildlife |
| 🏰 Dungeon | Mystery | ⭐⭐⭐ | Puzzles & traps |
| 🏜️ Desert | Harsh | ⭐⭐⭐ | Water management |
| ❄️ Ice Peaks | Frozen | ⭐⭐⭐⭐ | Temperature system |
| 🌋 Volcano | Fire | ⭐⭐⭐⭐ | Environmental damage |
| 🏰 Castle | Final | ⭐⭐⭐⭐⭐ | Boss gauntlet |

### Technical Scope

```
Backend:
├── Distributed workers (BullMQ)
├── Postgres cluster (read replicas)
├── Redis cluster
├── Advanced LLM tiering
├── Action validation (anti-hallucination)
├── Replay system
└── 5-10 second adaptive tick rate

Frontend:
├── Phaser 3 optimized
├── 7+ tilemaps with seamless transitions
├── 50+ sprites with full animations
├── Particle effects
├── Dynamic lighting
├── Advanced audio (positional, layered)
├── Accessibility features
└── Gamepad support
```

### Success Criteria

- [ ] 20+ agents feel alive and unique
- [ ] 10+ hours of engaging content
- [ ] Story arc with satisfying conclusion
- [ ] Combat is strategic and rewarding
- [ ] Players want to replay with different parties
- [ ] Community forms around the game
- [ ] Streaming-friendly (watchable)
- [ ] Mobile experience is first-class
- [ ] Performance: 60fps on mid-range devices

### Cost Estimate

| Item | Monthly Cost |
|------|-------------|
| LLM (heavy usage) | ~$500 |
| Supabase Team | $75 |
| Redis (dedicated) | $50 |
| Workers (Railway) | $50 |
| CDN (assets) | $20 |
| Voice (ElevenLabs) | $50 |
| **Total** | **~$745/month** |

---

## 🔮 Future (v1.x+)

> Ideas for post-release expansion

### Potential Features

| Feature | Description | Priority |
|---------|-------------|----------|
| 🌍 User-Created Agents | Players design their own agents | High |
| 🏠 Base Building | Construct and upgrade the office | Medium |
| 🎭 Mod Support | Custom maps, agents, stories | High |
| 📖 Story DLC | New story arcs, regions | Medium |
| 🤝 PvP Arena | Agent vs Agent battles | Low |
| 📱 Native Apps | iOS/Android native builds | Medium |
| 🎮 Console Ports | Switch, Steam Deck | Low |

---

## 📊 Metrics & KPIs

### Development Metrics

| Metric | v0.1 Target | v0.5 Target | v1.0 Target |
|--------|-------------|-------------|-------------|
| Agents | 2 | 10 | 20+ |
| Maps | 1 | 3 | 7+ |
| LLM calls/day | ~100 | ~2,000 | ~10,000 |
| Active users (test) | 5 | 50 | 500+ |
| Avg session time | 5 min | 20 min | 45 min |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Mobile lighthouse score | 90+ |
| Time to first interaction | <3s |
| Crash rate | <0.1% |
| Player satisfaction | 4.5/5 |

---

## 🏷️ Version History

| Version | Date | Highlights |
|---------|------|------------|
| v0.0.1 | 2026-01-30 | Initial research complete |
| v0.0.2 | 2026-02-01 | Architecture document approved |
| v0.1.0 | TBD | MVP release |
| v0.5.0 | TBD | Beta release |
| v1.0.0 | TBD | Public release |

---

## 📋 Related Documents

- [📐 ARCHITECTURE.md](../ARCHITECTURE.md) — Technical implementation details
- [🎨 MANA_STYLE_GUIDE.md](../MANA_STYLE_GUIDE.md) — Visual design guidelines
- [🎭 AGENT_PROFILES.md](./AGENT_PROFILES.md) — Agent personalities
- [🔬 DREAM_WORLD_RESEARCH.md](../DREAM_WORLD_RESEARCH.md) — Research references

---

*Roadmap by ATLAS (Product Manager) — Dream Team @ AiParaTi*  
*Version 1.0 — 2026-02-01*  
*Jira Epic: DEV-46*
