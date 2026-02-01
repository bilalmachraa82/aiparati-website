# 🏗️ Dream Team World - Architecture Document

**Author:** FORGE (Tech Lead)  
**Version:** 1.0.0  
**Date:** 2026-02-01  
**Status:** ✅ APPROVED  
**Jira:** DEV-43

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Stack Decision](#stack-decision)
3. [Backend Design](#backend-design)
4. [Architecture Diagram](#architecture-diagram)
5. [Simulation Loop](#simulation-loop)
6. [Agent Schema](#agent-schema)
7. [World State Schema](#world-state-schema)
8. [API Specification](#api-specification)
9. [Scalability Considerations](#scalability-considerations)
10. [Implementation Phases](#implementation-phases)

---

## 🎯 Executive Summary

Dream Team World é um RPG 2D pixel art inspirado em Secret of Mana onde agentes LLM (a Dream Team da AiParaTi) vivem, trabalham e interagem num mundo simulado. Os agentes têm memória persistente, relações entre si, e executam tarefas reais sincronizadas com o Jira.

### Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Mobile-friendly | 🔴 Critical | Touch controls, responsive |
| Real-time multiplayer | 🟡 High | Spectator mode, async play |
| 2→20+ agents | 🔴 Critical | Scalable architecture |
| LLM-powered decisions | 🔴 Critical | Memory + context |
| Jira integration | 🟡 High | Real tasks as quests |
| Secret of Mana aesthetic | 🟡 High | 16-bit pixel art |

---

## 🔧 Stack Decision

### Frontend: **Phaser 3** ✅ (Selected)

#### Comparison Matrix

| Criteria | Phaser 3 | Godot 4 | Winner |
|----------|----------|---------|--------|
| **Web deployment** | Native (JS/TS) | Export to HTML5 | Phaser |
| **Mobile responsiveness** | Excellent, built-in | Good, but heavier | Phaser |
| **Bundle size** | ~1MB | ~30MB+ WASM | Phaser |
| **TypeScript support** | First-class | Limited (GDScript) | Phaser |
| **Real-time WebSocket** | Native JS | Requires plugins | Phaser |
| **Learning curve** | Lower (JS ecosystem) | Higher (custom engine) | Phaser |
| **2D RPG features** | Excellent | Excellent | Tie |
| **Tiled map support** | Native loader | Plugin required | Phaser |
| **Community/Plugins** | Large JS ecosystem | Growing | Phaser |
| **Offline/Desktop** | Electron wrapper | Native export | Godot |

#### Decision: Phaser 3

**Justification:**
1. **Same language stack** - TypeScript frontend + TypeScript backend = shared types, faster development
2. **Web-native** - No WASM overhead, instant loading, PWA-ready
3. **Mobile-first** - Built-in responsive scaling, touch controls, virtual joystick plugins
4. **Real-time ready** - Native WebSocket/Convex client integration
5. **Lightweight** - ~1MB vs 30MB+ for Godot HTML5 export
6. **Faster iteration** - Hot reload, no compile step for game logic

**Trade-offs accepted:**
- No native desktop build (acceptable - target is web/mobile)
- Less powerful 3D (not needed - we're 2D pixel art)

### Phaser 3 Configuration

```typescript
// src/game/config.ts
import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    min: {
      width: 320,
      height: 240
    },
    max: {
      width: 1600,
      height: 1200
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: process.env.NODE_ENV === 'development'
    }
  },
  input: {
    activePointers: 3, // Multi-touch support
  },
  pixelArt: true, // Crisp pixel scaling
  antialias: false,
  roundPixels: true
};
```

---

## 🗄️ Backend Design

### Database: **Postgres + pgvector** via Supabase ✅ (Selected)

#### Comparison Matrix

| Criteria | Convex | Postgres (Supabase) | Winner |
|----------|--------|---------------------|--------|
| **Real-time sync** | Built-in, magical | Supabase Realtime | Convex |
| **Vector search** | Built-in | pgvector extension | Tie |
| **SQL flexibility** | No SQL, mutations only | Full SQL | Postgres |
| **Self-hosting** | ❌ SaaS only | ✅ Self-host possible | Postgres |
| **Cost at scale** | Can get expensive | Predictable | Postgres |
| **Learning curve** | New paradigm | Standard SQL | Postgres |
| **Existing infra** | None | Already using Neon | Postgres |
| **Edge functions** | ✅ Great | ✅ Supabase Edge | Tie |
| **Type safety** | Excellent | Excellent (Drizzle) | Tie |

#### Decision: Postgres + Supabase

**Justification:**
1. **Existing infrastructure** - Already using Neon Postgres, easy migration
2. **pgvector** - Native vector similarity for agent memory retrieval
3. **SQL flexibility** - Complex queries for analytics, reporting
4. **Self-hosting option** - Important for AiParaTi long-term
5. **Supabase Realtime** - WebSocket subscriptions for game state
6. **Predictable costs** - No surprise bills at scale

**Convex consideration:** We'll design the architecture to be Convex-compatible. If real-time performance becomes critical, migration path is clear.

### Backend Stack

```
┌──────────────────────────────────────────────────────────┐
│                    BACKEND STACK                          │
├──────────────────────────────────────────────────────────┤
│  Runtime:      Node.js 22+ LTS                           │
│  Language:     TypeScript 5.x (strict mode)              │
│  Framework:    Hono (lightweight, edge-ready)            │
│  ORM:          Drizzle (type-safe, SQL-like)             │
│  Database:     Postgres 16 (Supabase/Neon)               │
│  Vector:       pgvector 0.7+                             │
│  Real-time:    Supabase Realtime / WebSocket             │
│  Queue:        BullMQ + Redis (agent tick jobs)          │
│  Cache:        Redis (world state, hot data)             │
│  LLM:          Z.ai → Claude/GLM abstraction             │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DREAM TEAM WORLD ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           CLIENTS                                        ││
│  │                                                                          ││
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             ││
│  │   │   Browser    │    │   Mobile     │    │   Spectator  │             ││
│  │   │   (PWA)      │    │   (Touch)    │    │   (Read-only)│             ││
│  │   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             ││
│  │          │                   │                   │                      ││
│  │          └───────────────────┼───────────────────┘                      ││
│  │                              │                                          ││
│  │                    ┌─────────▼─────────┐                                ││
│  │                    │    Phaser 3       │                                ││
│  │                    │  Game Engine      │                                ││
│  │                    │  + React UI       │                                ││
│  │                    └─────────┬─────────┘                                ││
│  │                              │                                          ││
│  └──────────────────────────────┼──────────────────────────────────────────┘│
│                                 │                                            │
│                    WebSocket ───┼─── REST API                               │
│                    (Real-time)  │   (Commands)                              │
│                                 │                                            │
│  ┌──────────────────────────────┼──────────────────────────────────────────┐│
│  │                         API GATEWAY                                      ││
│  │                                                                          ││
│  │                    ┌─────────▼─────────┐                                ││
│  │                    │   Hono Server     │                                ││
│  │                    │   (Edge-ready)    │                                ││
│  │                    └─────────┬─────────┘                                ││
│  │                              │                                          ││
│  │        ┌─────────────────────┼─────────────────────┐                    ││
│  │        │                     │                     │                    ││
│  │  ┌─────▼─────┐        ┌──────▼──────┐      ┌──────▼──────┐             ││
│  │  │  World    │        │   Agent     │      │   Memory    │             ││
│  │  │  Service  │        │   Service   │      │   Service   │             ││
│  │  └─────┬─────┘        └──────┬──────┘      └──────┬──────┘             ││
│  │        │                     │                    │                     ││
│  └────────┼─────────────────────┼────────────────────┼─────────────────────┘│
│           │                     │                    │                      │
│  ┌────────┼─────────────────────┼────────────────────┼─────────────────────┐│
│  │        │           SIMULATION ENGINE              │                      ││
│  │        │                     │                    │                      ││
│  │  ┌─────▼─────────────────────▼────────────────────▼─────┐               ││
│  │  │                    TICK SCHEDULER                     │               ││
│  │  │                    (10s intervals)                    │               ││
│  │  │                                                       │               ││
│  │  │   ┌───────────┐   ┌───────────┐   ┌───────────┐     │               ││
│  │  │   │  PLANNER  │──▶│ OPTIMIZER │──▶│ EXECUTOR  │     │               ││
│  │  │   │           │   │           │   │           │     │               ││
│  │  │   │ "What to  │   │ "Best way │   │ "Do it"   │     │               ││
│  │  │   │  do?"     │   │  to do?"  │   │           │     │               ││
│  │  │   └───────────┘   └───────────┘   └───────────┘     │               ││
│  │  │                                                       │               ││
│  │  └───────────────────────────┬───────────────────────────┘               ││
│  │                              │                                           ││
│  └──────────────────────────────┼───────────────────────────────────────────┘│
│                                 │                                            │
│  ┌──────────────────────────────┼───────────────────────────────────────────┐│
│  │                         DATA LAYER                                        ││
│  │                              │                                            ││
│  │    ┌─────────────┬───────────┴───────────┬─────────────┐                 ││
│  │    │             │                       │             │                 ││
│  │  ┌─▼───────┐  ┌──▼─────────┐  ┌─────────▼──┐  ┌──────▼─────┐           ││
│  │  │ Postgres │  │  pgvector  │  │   Redis    │  │   BullMQ   │           ││
│  │  │          │  │            │  │            │  │            │           ││
│  │  │ World    │  │ Agent      │  │ Hot State  │  │ Tick Jobs  │           ││
│  │  │ State    │  │ Memories   │  │ Cache      │  │ Queue      │           ││
│  │  │ Agents   │  │ Embeddings │  │ Sessions   │  │            │           ││
│  │  └──────────┘  └────────────┘  └────────────┘  └────────────┘           ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                         LLM LAYER                                         ││
│  │                                                                           ││
│  │   ┌─────────────────────────────────────────────────────────────────────┐││
│  │   │                    LLM Gateway (Z.ai Abstraction)                   │││
│  │   │                                                                     │││
│  │   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │││
│  │   │   │ Claude      │   │ Claude      │   │ GLM-4.7     │              │││
│  │   │   │ Opus 4.5    │   │ Sonnet 4.5  │   │ (Fallback)  │              │││
│  │   │   │             │   │             │   │             │              │││
│  │   │   │ Strategy    │   │ Execution   │   │ Cost-saving │              │││
│  │   │   │ Reflection  │   │ Actions     │   │ Routine     │              │││
│  │   │   └─────────────┘   └─────────────┘   └─────────────┘              │││
│  │   │                                                                     │││
│  │   └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                      EXTERNAL INTEGRATIONS                                ││
│  │                                                                           ││
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                   ││
│  │   │    Jira     │   │  Vercel     │   │ ElevenLabs  │                   ││
│  │   │  (Tasks)    │   │  (Deploy)   │   │  (Voice)    │                   ││
│  │   └─────────────┘   └─────────────┘   └─────────────┘                   ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Simulation Loop

### Tick Architecture (10 seconds game time)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SIMULATION TICK (10s)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────────┐│
│   │ PHASE 1: WORLD UPDATE (sync, ~10ms)                                ││
│   ├────────────────────────────────────────────────────────────────────┤│
│   │  • Advance game time (tick++)                                      ││
│   │  • Check scheduled events (meetings, tasks due)                    ││
│   │  • Update environment (day/night, weather)                         ││
│   │  • Process incoming player commands                                ││
│   │  • Sync Jira tasks (every 10 ticks)                               ││
│   └────────────────────────────────────────────────────────────────────┘│
│                                    │                                     │
│                                    ▼                                     │
│   ┌────────────────────────────────────────────────────────────────────┐│
│   │ PHASE 2: AGENT PROCESSING (parallel, ~500ms per agent)             ││
│   ├────────────────────────────────────────────────────────────────────┤│
│   │                                                                    ││
│   │   FOR EACH ACTIVE AGENT (parallel batches of 4):                   ││
│   │                                                                    ││
│   │   ┌──────────────────────────────────────────────────────────────┐ ││
│   │   │ PLANNER: "What should I do?"                                 │ ││
│   │   ├──────────────────────────────────────────────────────────────┤ ││
│   │   │  Input:                                                      │ ││
│   │   │    • Current state (position, energy, mood)                  │ ││
│   │   │    • Observations (nearby agents, objects, events)           │ ││
│   │   │    • Schedule (what's planned for this time)                 │ ││
│   │   │    • Active tasks (from Jira)                                │ ││
│   │   │    • Relevant memories (pgvector top-5)                      │ ││
│   │   │                                                              │ ││
│   │   │  LLM Call (Sonnet 4.5):                                      │ ││
│   │   │    System: Agent persona + world rules                       │ ││
│   │   │    User: Structured observation context                      │ ││
│   │   │    Output: { intent, priority, targets[] }                   │ ││
│   │   └──────────────────────────────────────────────────────────────┘ ││
│   │                              │                                     ││
│   │                              ▼                                     ││
│   │   ┌──────────────────────────────────────────────────────────────┐ ││
│   │   │ OPTIMIZER: "What's the best way to do it?"                   │ ││
│   │   ├──────────────────────────────────────────────────────────────┤ ││
│   │   │  Input:                                                      │ ││
│   │   │    • Planner output (intent + targets)                       │ ││
│   │   │    • World constraints (collisions, locked doors)            │ ││
│   │   │    • Agent capabilities (skills, items)                      │ ││
│   │   │    • Other agents' planned actions (conflict detection)      │ ││
│   │   │                                                              │ ││
│   │   │  Processing (deterministic, no LLM):                         │ ││
│   │   │    • Pathfinding (A*)                                        │ ││
│   │   │    • Action sequencing                                       │ ││
│   │   │    • Resource allocation                                     │ ││
│   │   │    • Conflict resolution                                     │ ││
│   │   │                                                              │ ││
│   │   │  Output: { actions[], path[], timing }                       │ ││
│   │   └──────────────────────────────────────────────────────────────┘ ││
│   │                              │                                     ││
│   │                              ▼                                     ││
│   │   ┌──────────────────────────────────────────────────────────────┐ ││
│   │   │ EXECUTOR: "Do it"                                            │ ││
│   │   ├──────────────────────────────────────────────────────────────┤ ││
│   │   │  Input:                                                      │ ││
│   │   │    • Optimized action plan                                   │ ││
│   │   │                                                              │ ││
│   │   │  Processing:                                                 │ ││
│   │   │    • Execute movement (update position)                      │ ││
│   │   │    • Execute interactions (use object, talk)                 │ ││
│   │   │    • Update agent state (energy, mood)                       │ ││
│   │   │    • Create new memories                                     │ ││
│   │   │    • Emit events for frontend                                │ ││
│   │   │                                                              │ ││
│   │   │  Output: { newState, events[], memories[] }                  │ ││
│   │   └──────────────────────────────────────────────────────────────┘ ││
│   │                                                                    ││
│   └────────────────────────────────────────────────────────────────────┘│
│                                    │                                     │
│                                    ▼                                     │
│   ┌────────────────────────────────────────────────────────────────────┐│
│   │ PHASE 3: BROADCAST & PERSIST (~50ms)                               ││
│   ├────────────────────────────────────────────────────────────────────┤│
│   │  • Broadcast state changes via WebSocket                          ││
│   │  • Persist to Postgres (batch write)                              ││
│   │  • Update Redis cache                                             ││
│   │  • Store new memories in pgvector                                 ││
│   │  • Log tick for replay/debugging                                  ││
│   └────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Total tick budget: 2-5 seconds (real time) for 10 seconds game time
```

### LLM Usage Optimization

```typescript
// LLM tier assignment based on decision complexity
const LLM_TIERS = {
  // Tier 1: Strategic decisions (use Opus)
  STRATEGIC: {
    model: 'claude-opus-4-5-20250514',
    triggers: ['daily_planning', 'major_decision', 'reflection'],
    maxTokens: 2000,
    costPerCall: 0.10
  },
  
  // Tier 2: Tactical decisions (use Sonnet)
  TACTICAL: {
    model: 'claude-sonnet-4-5-20250514',
    triggers: ['conversation', 'task_execution', 'reaction'],
    maxTokens: 1000,
    costPerCall: 0.01
  },
  
  // Tier 3: Routine actions (use GLM or skip LLM)
  ROUTINE: {
    model: 'glm-4-air',
    triggers: ['movement', 'idle', 'repetitive_task'],
    maxTokens: 500,
    costPerCall: 0.001
  }
};
```

---

## 👤 Agent Schema

### Complete Agent JSON Structure

```json
{
  "id": "forge",
  "version": 1,
  "metadata": {
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-02-01T14:30:00Z",
    "createdBy": "system"
  },
  
  "identity": {
    "name": "FORGE",
    "displayName": "⚒️ FORGE",
    "role": "tech_lead",
    "title": "Tech Lead",
    "description": "Senior technical architect who leads engineering decisions",
    "avatar": "/assets/agents/forge.png",
    "sprite": {
      "sheet": "/assets/sprites/agents.png",
      "frameWidth": 32,
      "frameHeight": 32,
      "row": 2
    }
  },
  
  "personality": {
    "traits": ["analytical", "perfectionist", "pragmatic", "mentoring"],
    "values": ["code_quality", "scalability", "team_growth"],
    "communication_style": "technical but approachable",
    "quirks": ["uses architecture diagrams to explain everything"],
    "llm_system_prompt": "You are FORGE, the Tech Lead of Dream Team..."
  },
  
  "stats": {
    "energy": {
      "current": 85,
      "max": 100,
      "regenRate": 5
    },
    "focus": {
      "current": 92,
      "max": 100,
      "decayRate": 2
    },
    "morale": {
      "current": 78,
      "max": 100,
      "factors": ["task_completion", "team_interaction", "code_review"]
    },
    "skills": {
      "architecture": 95,
      "coding": 88,
      "mentoring": 80,
      "communication": 75
    }
  },
  
  "position": {
    "map": "office",
    "x": 450,
    "y": 320,
    "facing": "south",
    "zone": "tech_corner"
  },
  
  "state": {
    "current": "working",
    "substate": "code_review",
    "startedAt": "2026-02-01T14:00:00Z",
    "interruptible": true,
    "animation": "typing"
  },
  
  "schedule": {
    "timezone": "Europe/Lisbon",
    "template": "tech_lead_standard",
    "today": [
      { "time": "09:00", "activity": "morning_standup", "location": "meeting_room", "duration": 30 },
      { "time": "09:30", "activity": "inbox_review", "location": "desk", "duration": 30 },
      { "time": "10:00", "activity": "deep_work", "location": "desk", "duration": 120 },
      { "time": "12:00", "activity": "lunch", "location": "kitchen", "duration": 60 },
      { "time": "13:00", "activity": "code_review", "location": "desk", "duration": 120 },
      { "time": "15:00", "activity": "mentoring", "location": "meeting_room", "duration": 60 },
      { "time": "16:00", "activity": "architecture_planning", "location": "whiteboard", "duration": 90 },
      { "time": "17:30", "activity": "daily_report", "location": "desk", "duration": 30 },
      { "time": "18:00", "activity": "end_of_day", "location": "exit", "duration": 0 }
    ]
  },
  
  "tasks": {
    "current": {
      "jiraKey": "DEV-43",
      "title": "Design Dream Team World Architecture",
      "priority": "high",
      "progress": 75,
      "startedAt": "2026-02-01T10:00:00Z"
    },
    "queue": [
      { "jiraKey": "DEV-44", "priority": "medium" },
      { "jiraKey": "DEV-45", "priority": "low" }
    ]
  },
  
  "memory": {
    "shortTerm": [
      {
        "timestamp": "2026-02-01T14:25:00Z",
        "type": "observation",
        "content": "CODER asked about TypeScript best practices",
        "importance": 0.6,
        "relatedAgents": ["coder"]
      },
      {
        "timestamp": "2026-02-01T14:20:00Z",
        "type": "action",
        "content": "Completed architecture diagram for Dream Team World",
        "importance": 0.8,
        "relatedTasks": ["DEV-43"]
      }
    ],
    "longTermRef": "pgvector:forge_memories",
    "reflections": [
      {
        "timestamp": "2026-02-01T09:00:00Z",
        "insight": "The team is more productive when I provide clear technical specs upfront",
        "importance": 0.9
      }
    ]
  },
  
  "relationships": {
    "agents": {
      "jarvis": { "score": 1.0, "type": "supervisor", "lastInteraction": "2026-02-01T14:00:00Z" },
      "atlas": { "score": 0.85, "type": "collaborator", "lastInteraction": "2026-02-01T09:30:00Z" },
      "coder": { "score": 0.92, "type": "mentee", "lastInteraction": "2026-02-01T14:25:00Z" },
      "nova": { "score": 0.78, "type": "collaborator", "lastInteraction": "2026-01-31T16:00:00Z" },
      "cipher": { "score": 0.88, "type": "peer", "lastInteraction": "2026-02-01T11:00:00Z" }
    },
    "opinions": {
      "coder": "Great potential, eager to learn, sometimes rushes code",
      "nova": "Creative but needs more backend understanding"
    }
  },
  
  "inventory": [
    { "id": "laptop", "type": "tool", "equipped": true },
    { "id": "coffee_mug", "type": "consumable", "quantity": 1 },
    { "id": "whiteboard_marker", "type": "tool", "equipped": false }
  ],
  
  "preferences": {
    "workStyle": "deep_focus_blocks",
    "communicationChannel": "slack",
    "meetingPreference": "morning",
    "breakFrequency": "every_2_hours"
  }
}
```

### Agent Types (Dream Team)

| ID | Name | Role | Specialty |
|----|------|------|-----------|
| `jarvis` | JARVIS | Coordinator | Orchestration, communication |
| `atlas` | ATLAS | Product Manager | Requirements, roadmap |
| `forge` | FORGE | Tech Lead | Architecture, code review |
| `cipher` | CIPHER | Security | Security audits, pen testing |
| `coder` | CODER | Senior Dev | Implementation, debugging |
| `nova` | NOVA | Frontend | UI/UX implementation |
| `vortex` | VORTEX | Backend | APIs, databases |
| `pixel` | PIXEL | UX/UI Designer | Design, prototypes |
| `nexus` | NEXUS | Business Analyst | Analytics, reporting |
| `sentinel` | SENTINEL | DevOps | CI/CD, infrastructure |
| `guardian` | GUARDIAN | QA | Testing, quality |

---

## 🌍 World State Schema

```json
{
  "id": "dream-team-office",
  "version": 1,
  
  "time": {
    "tick": 4520,
    "gameTime": {
      "hour": 14,
      "minute": 30,
      "second": 0
    },
    "gameDate": {
      "day": 1,
      "dayOfWeek": "Monday",
      "month": "February",
      "year": 2026
    },
    "realTime": "2026-02-01T14:30:00Z",
    "tickRate": 10,
    "timeScale": 1.0
  },
  
  "environment": {
    "weather": "sunny",
    "temperature": 22,
    "dayPhase": "afternoon",
    "lightLevel": 1.0,
    "ambientSound": "office_hum"
  },
  
  "maps": {
    "active": "office",
    "available": ["office", "meeting_room", "kitchen", "rooftop", "server_room"]
  },
  
  "agents": {
    "active": ["jarvis", "forge", "coder", "nova", "atlas"],
    "idle": ["cipher", "pixel"],
    "offline": ["vortex", "nexus", "sentinel", "guardian"],
    "positions": {
      "jarvis": { "map": "office", "x": 400, "y": 300 },
      "forge": { "map": "office", "x": 450, "y": 320 },
      "coder": { "map": "office", "x": 480, "y": 320 },
      "nova": { "map": "meeting_room", "x": 200, "y": 150 },
      "atlas": { "map": "meeting_room", "x": 220, "y": 150 }
    }
  },
  
  "events": {
    "active": [
      {
        "id": "evt-001",
        "type": "meeting",
        "title": "Sprint Planning",
        "location": "meeting_room",
        "participants": ["atlas", "nova", "forge"],
        "startTick": 4500,
        "endTick": 4560
      }
    ],
    "scheduled": [
      {
        "id": "evt-002",
        "type": "standup",
        "title": "Evening Standup",
        "location": "meeting_room",
        "participants": ["all"],
        "triggerTick": 4800
      }
    ]
  },
  
  "tasks": {
    "jiraSync": {
      "lastSync": "2026-02-01T14:25:00Z",
      "nextSync": "2026-02-01T14:35:00Z"
    },
    "active": [
      {
        "jiraKey": "DEV-43",
        "summary": "Design Dream Team World Architecture",
        "assignee": "forge",
        "status": "In Progress",
        "priority": "High",
        "gameRepresentation": {
          "icon": "scroll",
          "location": { "map": "office", "x": 450, "y": 320 }
        }
      }
    ]
  },
  
  "interactables": {
    "objects": [
      { "id": "coffee-machine", "map": "kitchen", "x": 100, "y": 50, "state": "ready" },
      { "id": "whiteboard-1", "map": "meeting_room", "x": 50, "y": 100, "state": "has_content" },
      { "id": "server-rack", "map": "server_room", "x": 200, "y": 200, "state": "running" }
    ]
  },
  
  "metrics": {
    "teamMorale": 82,
    "productivity": 78,
    "tasksCompleted": 5,
    "tasksInProgress": 3,
    "conversationsToday": 12
  }
}
```

---

## 🔌 API Specification

### REST Endpoints

#### World Management

```yaml
# Get current world state
GET /api/v1/world
Response: WorldState

# Advance world tick manually (debug)
POST /api/v1/world/tick
Body: { "count": 1 }
Response: { "tick": 4521, "events": [...] }

# Get world configuration
GET /api/v1/world/config
Response: WorldConfig

# Update world settings
PATCH /api/v1/world/config
Body: { "timeScale": 2.0 }
Response: WorldConfig
```

#### Agent Management

```yaml
# List all agents
GET /api/v1/agents
Query: ?status=active&map=office
Response: Agent[]

# Get specific agent
GET /api/v1/agents/:id
Response: Agent

# Get agent's current state
GET /api/v1/agents/:id/state
Response: AgentState

# Send observation to agent
POST /api/v1/agents/:id/observe
Body: {
  "type": "event",
  "content": "Player waved at FORGE",
  "source": "player"
}
Response: { "acknowledged": true, "reaction": "wave_back" }

# Request agent decision (manual trigger)
POST /api/v1/agents/:id/decide
Body: {
  "context": "urgent_task",
  "options": ["continue_work", "attend_meeting", "help_coder"]
}
Response: {
  "decision": "help_coder",
  "reasoning": "CODER seems stuck, and mentoring is important",
  "confidence": 0.85
}

# Get agent's planned actions
GET /api/v1/agents/:id/actions
Query: ?limit=10
Response: Action[]

# Override agent action (debug)
POST /api/v1/agents/:id/actions
Body: {
  "type": "move",
  "target": { "x": 500, "y": 400 }
}
Response: Action
```

#### Memory Management

```yaml
# Search agent memories
GET /api/v1/agents/:id/memories
Query: ?query=architecture&limit=5&minImportance=0.5
Response: Memory[]

# Add memory to agent
POST /api/v1/agents/:id/memories
Body: {
  "type": "observation",
  "content": "Learned new optimization technique from CIPHER",
  "importance": 0.7,
  "relatedAgents": ["cipher"]
}
Response: Memory

# Trigger reflection (generate high-level memories)
POST /api/v1/agents/:id/reflect
Response: Reflection[]
```

#### Conversations

```yaml
# Start conversation between agents
POST /api/v1/conversations
Body: {
  "participants": ["forge", "coder"],
  "topic": "code_review",
  "initiator": "forge"
}
Response: Conversation

# Get conversation history
GET /api/v1/conversations/:id
Response: Conversation

# Add message to conversation (player input)
POST /api/v1/conversations/:id/messages
Body: {
  "sender": "player",
  "content": "What do you think about the architecture?"
}
Response: Message

# End conversation
DELETE /api/v1/conversations/:id
Response: { "ended": true, "summary": "..." }
```

#### Jira Integration

```yaml
# Sync tasks from Jira
POST /api/v1/jira/sync
Response: { "synced": 15, "new": 3, "updated": 5 }

# Get tasks as game quests
GET /api/v1/quests
Query: ?assignee=forge&status=active
Response: Quest[]

# Update task progress from game
PATCH /api/v1/quests/:jiraKey
Body: { "progress": 80, "comment": "Architecture complete" }
Response: Quest
```

### WebSocket Protocol

```yaml
# Connection
ws://api.dreamteam.world/ws/v1

# Authentication
{
  "type": "auth",
  "token": "jwt_token_here"
}

# Subscribe to world updates
{
  "type": "subscribe",
  "channels": ["world", "agents", "conversations"]
}

# Server broadcasts
{
  "type": "world.tick",
  "data": {
    "tick": 4521,
    "time": { "hour": 14, "minute": 30 },
    "changes": [...]
  }
}

{
  "type": "agent.moved",
  "data": {
    "agentId": "forge",
    "from": { "x": 450, "y": 320 },
    "to": { "x": 480, "y": 320 },
    "animation": "walk_right"
  }
}

{
  "type": "agent.spoke",
  "data": {
    "agentId": "forge",
    "target": "coder",
    "message": "Let me help you with that architecture question.",
    "emotion": "helpful"
  }
}

{
  "type": "conversation.started",
  "data": {
    "id": "conv-123",
    "participants": ["forge", "coder"],
    "location": { "map": "office", "x": 465, "y": 320 }
  }
}

# Client commands
{
  "type": "command",
  "action": "player.interact",
  "data": {
    "target": "forge",
    "interaction": "talk"
  }
}
```

---

## 📈 Scalability Considerations

### Scaling from 2 to 20+ Agents

```
┌─────────────────────────────────────────────────────────────┐
│                    SCALABILITY STRATEGY                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: 2-5 Agents (MVP)                                  │
│  ├─ Single Node.js process                                  │
│  ├─ Sequential LLM calls                                    │
│  ├─ Single Postgres instance                                │
│  └─ ~$5-10/day LLM costs                                   │
│                                                              │
│  PHASE 2: 5-10 Agents (Growth)                              │
│  ├─ Parallel LLM calls (Promise.all)                       │
│  ├─ Redis caching for hot state                            │
│  ├─ Tiered LLM usage (Opus/Sonnet/GLM)                     │
│  └─ ~$20-30/day LLM costs                                  │
│                                                              │
│  PHASE 3: 10-20+ Agents (Scale)                             │
│  ├─ BullMQ job queue for agent ticks                       │
│  ├─ Horizontal scaling (multiple workers)                  │
│  ├─ Read replicas for Postgres                             │
│  ├─ Aggressive caching (decisions, paths)                  │
│  ├─ Batch embedding generation                             │
│  └─ ~$50-100/day LLM costs                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Performance Optimizations

| Optimization | Impact | Complexity |
|-------------|--------|------------|
| **LLM Caching** | -60% LLM costs | Low |
| **Decision batching** | -40% latency | Medium |
| **Pathfinding cache** | -80% CPU | Low |
| **State diffing** | -70% bandwidth | Medium |
| **Memory pruning** | -50% storage | Low |
| **Parallel agent processing** | 4x throughput | Medium |

### Cost Projections

```
┌────────────────────────────────────────────────────────────┐
│              MONTHLY COST ESTIMATES                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  5 Agents, 8h/day active:                                  │
│  ├─ LLM (Sonnet heavy): ~$150/month                       │
│  ├─ Postgres (Supabase Pro): $25/month                    │
│  ├─ Redis (Upstash): $10/month                            │
│  ├─ Vercel (Pro): $20/month                               │
│  └─ Total: ~$205/month                                     │
│                                                             │
│  10 Agents, 12h/day active:                                │
│  ├─ LLM (tiered): ~$350/month                             │
│  ├─ Postgres (Supabase Pro): $25/month                    │
│  ├─ Redis (Upstash Pro): $20/month                        │
│  ├─ Vercel (Pro): $20/month                               │
│  └─ Total: ~$415/month                                     │
│                                                             │
│  20 Agents, 24/7 active:                                   │
│  ├─ LLM (aggressive tiering): ~$800/month                 │
│  ├─ Postgres (Supabase Team): $75/month                   │
│  ├─ Redis (dedicated): $50/month                          │
│  ├─ Workers (Railway): $50/month                          │
│  └─ Total: ~$975/month                                     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Setup monorepo structure
- [ ] Phaser 3 game scaffold
- [ ] Basic tilemap rendering
- [ ] Agent sprites and animations
- [ ] WebSocket connection

### Phase 2: Backend Core (Week 2-3)
- [ ] Hono API server
- [ ] Postgres schema (Drizzle)
- [ ] Agent CRUD endpoints
- [ ] World state management
- [ ] Basic tick loop

### Phase 3: LLM Integration (Week 3-4)
- [ ] Z.ai abstraction layer
- [ ] Agent decision prompts
- [ ] Memory storage (pgvector)
- [ ] Memory retrieval
- [ ] Basic conversations

### Phase 4: Full Simulation (Week 4-5)
- [ ] Complete Planner→Optimizer→Executor
- [ ] Schedule system
- [ ] Event system
- [ ] Jira integration
- [ ] Real-time sync

### Phase 5: Polish (Week 5-6)
- [ ] Mobile touch controls
- [ ] UI/HUD system
- [ ] Audio system
- [ ] Performance optimization
- [ ] Testing and QA

---

## 📚 References

- [Generative Agents Paper](https://arxiv.org/abs/2304.03442)
- [AI Town Repository](https://github.com/a16z-infra/ai-town)
- [Phaser 3 Documentation](https://phaser.io/docs)
- [Supabase Vector](https://supabase.com/docs/guides/ai)
- [Secret of Mana Design](https://www.gamedeveloper.com/design/the-making-of-secret-of-mana)

---

*Architecture designed by FORGE (Tech Lead) - Dream Team*  
*Last updated: 2026-02-01*
