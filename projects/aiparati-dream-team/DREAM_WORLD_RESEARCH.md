# 🎮 Dream Team World - Research & Architecture

**Objectivo:** RPG 2D pixel art com agentes LLM que vivem num mundo inspirado em Secret of Mana
**Data:** 2026-02-01
**Status:** ✅ FASE 1 COMPLETA - 7 referências analisadas | 🔬 FASE 2 - Arquitectura definida

---

## 📚 FASE 1: ANÁLISE DE REFERÊNCIAS

### 1. Generative Agents (Smallville) - Stanford
**Repo:** https://github.com/joonspk-research/generative_agents

#### Representação do Mundo
- **Estrutura:** Grid-based tilemap usando Tiled Editor
- **Formato:** JSON exportado do Tiled, processado em Python
- **State:** Armazenado em ficheiros JSON por timestep
- **Colisões:** Tiles marcados com collision_block_id

#### Representação do Agente
```json
{
  "name": "Isabella Rodriguez",
  "age": 34,
  "innate_traits": ["friendly", "outgoing", "hospitable"],
  "learned_traits": [],
  "currently": "working at the cafe",
  "lifestyle": "..."
}
```
- **Memória:** Stream de observações com timestamps
- **Estado interno:** Plano diário, reflexões, observações

#### Integração LLM
- **Quando:** A cada decisão (movimento, fala, reacção)
- **System prompt:** Persona + memórias relevantes + observação actual
- **Tokens:** ~2000-4000 por decisão (expensive!)
- **Provider:** OpenAI GPT-3.5/4

#### Gestão de Memória
- **Storage:** Ficheiros JSON por agente
- **Recuperação:** Embedding similarity (OpenAI)
- **Critérios:** Recência + Importância + Relevância
- **Reflexão:** Periódica para criar memórias de alto nível

#### Comunicação Mundo ↔ Agentes
- **Protocol:** Interno (Python calls)
- **Eventos:** Tick-based (cada step = 10 segundos game time)
- **Acções:** move_to, chat, interact, wait

---

### 2. AI Town (a16z-infra)
**Repo:** https://github.com/a16z-infra/ai-town

#### Representação do Mundo
- **Engine:** Convex (reactive database) + PixiJS (rendering)
- **Estrutura:** Continuous physics (não grid)
- **Mapas:** Tiled JSON, convertido para formato próprio
- **State:** Convex database (real-time sync)

#### Representação do Agente
```typescript
{
  name: 'f1',
  textureUrl: '/assets/32x32folk.png',
  spritesheetData: f1SpritesheetData,
  speed: 0.1,
  // + memory, plans, conversations
}
```

#### Integração LLM
- **Providers:** Ollama (local), OpenAI, Together.ai
- **Embeddings:** mxbai-embed-large ou OpenAI
- **Quando:** Conversações, decisões, reflexões
- **Optimização:** Batch requests, caching

#### Gestão de Memória
- **Storage:** Convex (Postgres-like com vector search)
- **Vector search:** Built-in no Convex
- **Recuperação:** Embedding similarity

#### Comunicação Mundo ↔ Agentes
- **Protocol:** WebSocket (Convex real-time)
- **Frontend:** React + PixiJS
- **Backend:** Convex functions (TypeScript)

#### Vantagens para nós
- ✅ MIT License
- ✅ TypeScript/JavaScript
- ✅ Real-time multiplayer ready
- ✅ Mobile-friendly (PixiJS)
- ✅ Música gerada (Replicate MusicGen)

---

### 3. Phaser 3 (Game Engine)
**Site:** https://phaser.io

#### Para Mobile Responsiveness
```javascript
const config = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  // Touch controls automáticos
  input: {
    activePointers: 3,
  }
};
```

#### Vantagens
- ✅ Excelente suporte mobile
- ✅ Touch controls nativos
- ✅ Tilemap loader (Tiled)
- ✅ Sprite animations
- ✅ Audio manager
- ✅ Grande comunidade

---

### 4. CivAgent (Netease Fuxi Lab) - Strategy Game AI
**Repo:** https://github.com/asdqsczser/CivAgent
**Paper:** Digital Player: Evaluating LLM-based Human-like Agent in Games (NeurIPS 2024)

#### Representação do Mundo
- **Engine:** Unciv (Civilization clone open-source, Kotlin/LibGDX)
- **Estrutura:** Turn-based strategy grid (hex tiles)
- **State:** Game state completo via save files JSON
- **Mapas:** Procedural generation com biomes, recursos, civilizações

#### Representação do Agente
```json
{
  "civilization": "Rome",
  "leader": "Caesar",
  "era": "Medieval",
  "cities": [...],
  "units": [...],
  "diplomacy": {
    "China": { "relationship": "friendly", "treaties": ["open_borders"] },
    "Egypt": { "relationship": "hostile", "at_war": true }
  },
  "strategic_goals": ["expand_territory", "research_military"]
}
```

#### Integração LLM
- **Quando:** Turn-based (cada turno do jogo)
- **Decision Types:** Diplomacia, produção, movimentação, negociação
- **Providers:** OpenAI GPT-4 (premium), modelos gratuitos (fallback)
- **Latency:** Tolerante (turn-based, não real-time)
- **Diferencial:** LLM para decisões estratégicas complexas + diálogo natural

#### Gestão de Memória
- **Storage:** Server-side (Netease infrastructure)
- **History:** Histórico de diplomacia, acordos, guerras
- **Context Window:** Estado actual + histórico relevante comprimido

#### Comunicação Mundo ↔ Agentes
- **Protocol:** HTTP REST API (multiplayer server)
- **Client-Server:** Game client ↔ AI Server (separados)
- **Chat:** Discord integration para diplomacia via linguagem natural
- **Sync:** 3-second polling interval

#### Backend Patterns (Relevantes)
- ✅ **Separação Client/Server:** Game engine isolado do AI
- ✅ **Discord Bridge:** Permite chat natural entre humanos e AI
- ✅ **Data Flywheel:** Colecta dados de gameplay para treino
- ✅ **Turn-based Tolerance:** Latência LLM aceitável em jogos não real-time
- ⚠️ **Custo:** GPT-4 necessário para boa performance

---

### 5. Project Sid (Altera.AL) - Large-Scale Civilization
**Paper:** Project Sid: Many-agent simulations toward AI civilization (arXiv 2024)
**Escala:** 10 - 1000+ agentes simultâneos

#### Representação do Mundo
- **Engine:** Minecraft (sandbox 3D)
- **Estrutura:** Voxel-based, open world
- **State:** Distributed state management
- **Escala:** Múltiplas sociedades, 500-1000 agentes

#### Representação do Agente (PIANO Architecture)
```json
{
  "id": "agent_001",
  "modules": {
    "memory": { "working": [...], "short_term": [...], "long_term": [...] },
    "action_awareness": { "expected_outcome": "...", "actual_outcome": "..." },
    "goal_generation": { "current_goals": [...], "priority": [...] },
    "social_awareness": { "relationships": {...}, "social_cues": [...] },
    "talking": { "pending_speech": [...] },
    "skill_execution": { "current_skill": "mining", "progress": 0.7 }
  },
  "state": {
    "inventory": [...],
    "position": { "x": 100, "y": 64, "z": -50 },
    "health": 20,
    "hunger": 18
  }
}
```

#### PIANO Architecture (Parallel Information Aggregation via Neural Orchestration)
```
┌─────────────────────────────────────────────────────────────┐
│                    PIANO ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────┤
│  Key Principles:                                             │
│  1. CONCURRENCY - Módulos correm em paralelo                │
│  2. COHERENCE - Cognitive Controller sincroniza outputs      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Memory     │  │    Social    │  │     Goal     │       │
│  │   Module     │  │  Awareness   │  │  Generation  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └────────────────┬┴─────────────────┘                │
│                          ▼                                   │
│              ┌────────────────────────┐                      │
│              │  COGNITIVE CONTROLLER  │ ← Information        │
│              │    (Decision Maker)    │   Bottleneck         │
│              └────────────┬───────────┘                      │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Talking    │  │    Skill     │  │   Action     │       │
│  │   Module     │  │  Execution   │  │  Awareness   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

#### Integração LLM
- **Model:** GPT-4o (latest required for performance)
- **Concurrency:** Múltiplos LLM calls em paralelo por agente
- **Latency:** Real-time (human interaction capable)
- **Coherence Problem:** Outputs de módulos diferentes podem conflitar
- **Solution:** Cognitive Controller como bottleneck de decisão

#### Gestão de Memória
- **Working Memory (WM):** Estado actual, muito curto prazo
- **Short-Term Memory (STM):** Eventos recentes, conversas
- **Long-Term Memory (LTM):** Experiências importantes, relações
- **Retrieval:** Similarity-based com context relevance

#### Comunicação Mundo ↔ Agentes
- **Protocol:** Minecraft server API
- **Real-time:** Agents interagem com humanos e outros agents
- **Social:** Formam roles, regras, transmissão cultural
- **Scale:** Testado até 1000+ agentes

#### Backend Patterns (Relevantes)
- ✅ **Parallel Modules:** Diferentes aspectos do agente correm independentemente
- ✅ **Bottleneck Architecture:** Cognitive Controller evita incoerência
- ✅ **Action Awareness:** Compara expectativa vs resultado real (anti-hallucination)
- ✅ **Civilizational Metrics:** Especialização, regras colectivas, cultura
- ✅ **Real-time Capable:** Interacção humano-agente
- ⚠️ **Complexity:** Arquitectura muito elaborada

---

### 6. iAgents (ChatDev/THUNLP) - Information Asymmetry
**Repo:** https://github.com/thunlp/iAgents
**Paper:** Autonomous Agents for Collaborative Task under Information Asymmetry (NeurIPS 2024)

#### Representação do Mundo
- **Engine:** Chat-based (não há mundo visual)
- **Estrutura:** Social network graph
- **State:** MySQL database
- **Escala:** Testado com 140 indivíduos, 588 relações

#### Representação do Agente
```json
{
  "user_id": "ross",
  "agent": {
    "profile": "Paleontologist, interested in dinosaurs...",
    "files": ["emnlp_papers.pdf", "research_notes.txt"],
    "relationships": ["monica", "rachel", "joey"],
    "memory": {
      "mixed": { "semantic": [...], "episodic": [...] }
    }
  },
  "conversations": {
    "active": [...],
    "history": [...]
  }
}
```

#### InfoNav (Information Navigation Mechanism)
```
┌─────────────────────────────────────────────────────────────┐
│                    InfoNav MECHANISM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. TASK RECEPTION                                           │
│     "@find survey papers in EMNLP"                          │
│                                                              │
│  2. INFORMATION NEED ANALYSIS                                │
│     - What info do I need?                                   │
│     - What info do I have?                                   │
│     - Who might have missing info?                           │
│                                                              │
│  3. AGENT-TO-AGENT COMMUNICATION                             │
│     Agent A ←→ Agent B (30+ turns autonomous)               │
│                                                              │
│  4. INFORMATION AGGREGATION                                  │
│     - Retrieve from ~70,000 messages                         │
│     - Synthesize answer                                      │
│                                                              │
│  5. TASK COMPLETION                                          │
│     - Deliver result to user                                 │
│     - Update memories                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Integração LLM
- **Providers:** OpenAI, Ollama, DeepSeek, GLM, Hunyuan, Ernie, Spark, Qwen
- **Embeddings:** HuggingFace models ou OpenAI
- **RAG:** Llama Index integration para ficheiros do utilizador
- **Agent Cultivate:** Human feedback para optimizar agent profile

#### Gestão de Memória
- **Storage:** MySQL database
- **Mixed Memory:** Semantic + Episodic combined
- **File Storage:** User files via Llama Index
- **Jina Reader:** URL → LLM-friendly text transformation

#### Comunicação Mundo ↔ Agentes
- **Protocol:** WebSocket (chat interface)
- **Frontend:** Flask web app (IM-style interface)
- **Trigger:** Mensagens com "@" iniciam collaborative task
- **Docker:** Full containerization support

#### Backend Patterns (Relevantes)
- ✅ **MySQL Storage:** Simples e robusto para mensagens/users/relações
- ✅ **Multi-provider LLM:** Fallback entre providers
- ✅ **RAG Integration:** Llama Index para documentos
- ✅ **Agent Cultivation:** Loop de feedback humano
- ✅ **Information Asymmetry:** Cada agente só tem info do seu humano
- ✅ **Docker Ready:** Fácil deployment
- ⚠️ **Não visual:** Sem representação de mundo 2D/3D

---

### 7. CosmoAgent - Alien Civilizations
**Repo:** https://github.com/MingyuJ666/Simulating-Alien-Civilizations-with-LLM-based-Agents
**Paper:** What if LLMs Have Different World Views (arXiv 2024)

#### Representação do Mundo
- **Estrutura:** Abstract simulation (não visual)
- **Modelo:** State transition matrix para trajectórias de civilização
- **Métricas:** Nível de desenvolvimento civilizacional quantificado

#### Representação do Agente
```json
{
  "civilization": "Alpha Centauri",
  "ethical_paradigm": "utilitarian",
  "worldview": "expansionist",
  "tech_level": 3.7,
  "resources": {...},
  "diplomatic_stance": "cautious"
}
```

#### Integração LLM
- **Uso:** LLMs com diferentes "paradigmas éticos"
- **Diferencial:** Simula bias não-terráqueo
- **Decisões:** Estratégia inter-civilizacional

#### Gestão de Memória
- **State Transition:** Matriz de transição de estados
- **History:** Trajectória de desenvolvimento

#### Comunicação Mundo ↔ Agentes
- **Protocol:** Python simulation
- **Interactions:** Civilização ↔ Civilização

#### Backend Patterns (Relevantes)
- ✅ **State Machine:** Modelo matemático de progressão
- ✅ **Ethical Paradigms:** Diferentes "personalidades" de civilização
- ✅ **Game Theory:** Decisões sob assimetria de informação
- ⚠️ **Abstract:** Não aplicável directamente a jogos visuais

---

## 📊 COMPARAÇÃO DE REFERÊNCIAS

| Projecto | Mundo | Escala | Real-time | Memória | LLM Cost | Visual |
|----------|-------|--------|-----------|---------|----------|--------|
| Generative Agents | 2D Grid | 25 agents | Não | JSON files | Alto | Sim |
| AI Town | 2D Continuous | ~10 agents | Sim | Convex DB | Médio | Sim |
| CivAgent | Hex Strategy | 6 civs | Não (turn) | Server | Alto | Sim |
| Project Sid | 3D Voxel | 1000+ agents | Sim | Multi-tier | Muito Alto | Sim |
| iAgents | Chat-based | 140+ users | Sim | MySQL | Médio | Não |
| CosmoAgent | Abstract | N civs | Não | State Matrix | Baixo | Não |

### Padrões Comuns Identificados

1. **Memory Hierarchy:** Todos usam alguma forma de short-term + long-term
2. **LLM Bottleneck:** Custo e latência são sempre trade-offs
3. **State Persistence:** Database ou ficheiros para persistência
4. **Social Awareness:** Agentes precisam de "Theory of Mind"
5. **Action Awareness:** Detectar hallucinations comparando expectativa vs realidade

### Lições para Dream Team World

| Lição | Fonte | Aplicação |
|-------|-------|-----------|
| Turn-based é mais barato | CivAgent | Usar ticks de 10-30s, não real-time |
| MySQL é suficiente | iAgents | Não precisamos de Convex |
| Cognitive Controller | Project Sid | Implementar bottleneck de decisão |
| Action Awareness | Project Sid | Validar acções contra expectativas |
| Multi-provider LLM | iAgents | Fallback GLM quando Claude caro |
| Discord Bridge | CivAgent | Considerar chat externo opcional |

---

## 🏗️ FASE 2: ARQUITECTURA DREAM TEAM WORLD

### Stack Proposto

```
┌─────────────────────────────────────────────────────────────┐
│                    DREAM TEAM WORLD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    FRONTEND                              ││
│  │  Engine: Phaser 3 (mobile-first)                        ││
│  │  Style: 16-bit pixel art (Secret of Mana)               ││
│  │  Maps: Tiled Editor → JSON                              ││
│  │  Assets: Mana Seed (Seliel) sprites                     ││
│  │  Audio: Web Audio API + Secret of Mana OST loops        ││
│  │  UI: HUD, dialogue boxes, party system                  ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│                     WebSocket/REST                           │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    BACKEND                               ││
│  │  Runtime: Node.js + TypeScript                          ││
│  │  Framework: Convex OR Supabase Edge Functions           ││
│  │  Database: Supabase Postgres                            ││
│  │  Vector Store: Supabase pgvector                        ││
│  │  Real-time: Supabase Realtime OR Convex                 ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   AGENT LAYER                            ││
│  │  LLMs: Claude Opus 4.5 (strategy)                       ││
│  │        Claude Sonnet 4.5 (execution)                    ││
│  │        GLM-4.7 (fallback, cost-saving)                  ││
│  │  Memory: pgvector embeddings                            ││
│  │  Decision loop: 10-30 second ticks                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Dados

#### Agente (JSON)
```json
{
  "id": "forge",
  "name": "FORGE",
  "role": "Tech Lead",
  "position": { "x": 450, "y": 320, "map": "office" },
  "state": "working",
  "currentTask": "code_review",
  "stats": {
    "energy": 85,
    "focus": 92,
    "morale": 78
  },
  "memory": {
    "shortTerm": [...],
    "longTerm": "pgvector_ref"
  },
  "schedule": {
    "09:00": "morning_standup",
    "10:00": "deep_work",
    "12:00": "lunch",
    "14:00": "meetings",
    "17:00": "wrap_up"
  },
  "relationships": {
    "ATLAS": 0.8,
    "CODER": 0.9,
    "JARVIS": 1.0
  }
}
```

#### Mundo State
```json
{
  "time": {
    "tick": 4520,
    "gameHour": 14,
    "gameMinute": 30,
    "dayOfWeek": "Monday"
  },
  "weather": "sunny",
  "activeAgents": ["forge", "coder", "nova", "jarvis"],
  "events": [
    { "type": "meeting", "room": "conference", "agents": ["atlas", "forge", "nexus"] }
  ],
  "tasks": {
    "jira": [...],
    "active": [...]
  }
}
```

### Loop de Simulação

```
┌─────────────────────────────────────────────────┐
│              GAME TICK (10 seconds)              │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. UPDATE WORLD STATE                           │
│     - Advance game time                          │
│     - Check scheduled events                     │
│     - Update environment                         │
│                                                  │
│  2. FOR EACH ACTIVE AGENT:                       │
│     ┌─────────────────────────────────────────┐ │
│     │ a) OBSERVE                              │ │
│     │    - What's around me?                  │ │
│     │    - Who's nearby?                      │ │
│     │    - Any new events?                    │ │
│     │                                         │ │
│     │ b) RETRIEVE MEMORIES                    │ │
│     │    - Query pgvector (top 5 relevant)    │ │
│     │    - Include recent short-term          │ │
│     │                                         │ │
│     │ c) DECIDE (LLM call)                    │ │
│     │    - System: Agent persona + rules      │ │
│     │    - Context: Observations + memories   │ │
│     │    - Output: Action JSON                │ │
│     │                                         │ │
│     │ d) ACT                                  │ │
│     │    - Execute action in world            │ │
│     │    - Update position/state              │ │
│     │    - Store new memory                   │ │
│     └─────────────────────────────────────────┘ │
│                                                  │
│  3. BROADCAST STATE                              │
│     - Send updates to frontend via WebSocket    │
│     - Trigger animations/sounds                 │
│                                                  │
│  4. SAVE STATE                                   │
│     - Persist to database                       │
│     - Log for replay                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Integração com Jira (Real Tasks!)

```javascript
// Sync real Jira tasks to game world
async function syncJiraTasks() {
  const tasks = await jira.getActiveTasks();
  
  for (const task of tasks) {
    // Assign to appropriate agent based on type
    const agent = assignTaskToAgent(task);
    
    // Create in-game task object
    await createGameTask({
      jiraKey: task.key,
      title: task.summary,
      assignee: agent.id,
      priority: task.priority,
      // Visual representation in game
      location: agent.desk,
      icon: getTaskIcon(task.type)
    });
  }
}
```

---

## 🎵 MÚSICA & ÁUDIO

### Secret of Mana Inspiration

| Track | Use Case | Mood |
|-------|----------|------|
| "Mana Village" | Office/Hub | Peaceful, collaborative |
| "Forest of Seasons" | Exploration | Adventurous |
| "Battle!" | Sprint/Deadline | Energetic |
| "Rusty Dungeon" | Deep work | Focused |
| "Into the Thick of It" | Problem solving | Tense |

### Implementation
- Web Audio API for synthesis (current)
- Optional: Pre-recorded loops (royalty-free)
- Dynamic mixing based on game state

---

## 📱 MOBILE-FIRST DESIGN

### Touch Controls
```javascript
// Virtual joystick for movement
const joystick = this.plugins.get('rexVirtualJoystick');

// Tap to interact
this.input.on('pointerdown', (pointer) => {
  const target = this.getObjectAt(pointer.x, pointer.y);
  if (target.type === 'agent') {
    this.openDialogue(target);
  }
});
```

### Responsive UI
- Scalable HUD elements
- Pinch to zoom
- Swipe for menus
- Portrait AND landscape support

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Mobile-Friendly Base (Current)
- [x] Basic pixel art world
- [x] 16 agents with animations
- [x] Procedural music
- [ ] **Mobile responsive** ← NEXT
- [ ] Touch controls

### Phase 2: Real Simulation
- [ ] Phaser 3 engine migration
- [ ] Agent movement system
- [ ] Basic AI decision loop
- [ ] Day/night cycle

### Phase 3: LLM Integration
- [ ] Memory system (pgvector)
- [ ] Decision prompts
- [ ] Agent conversations
- [ ] Jira task sync

### Phase 4: Full RPG
- [ ] Party system (select 3-4 agents)
- [ ] Quests from Jira tasks
- [ ] XP/leveling
- [ ] Items/abilities

---

## 🔗 Recursos

### Repositórios de Referência
| Projecto | Repo | Paper | Licença |
|----------|------|-------|---------|
| Generative Agents | [GitHub](https://github.com/joonspk-research/generative_agents) | Stanford 2023 | Research |
| AI Town | [GitHub](https://github.com/a16z-infra/ai-town) | - | MIT |
| CivAgent | [GitHub](https://github.com/asdqsczser/CivAgent) | NeurIPS 2024 | Research |
| Project Sid | [arXiv](https://arxiv.org/abs/2411.00114) | Altera.AL 2024 | Closed |
| iAgents | [GitHub](https://github.com/thunlp/iAgents) | NeurIPS 2024 | Apache 2.0 |
| CosmoAgent | [GitHub](https://github.com/MingyuJ666/Simulating-Alien-Civilizations-with-LLM-based-Agents) | arXiv 2024 | Research |

### Assets
- [Mana Seed (Seliel)](https://seliel-the-shaper.itch.io) - Sprites pixel art 16-bit
- [OpenGameArt](https://opengameart.org) - Assets gratuitos
- [Unciv](https://github.com/yairm210/Unciv) - Referência para strategy game

### Tools
- [Tiled Map Editor](https://www.mapeditor.org/) - Criação de mapas
- [Phaser 3](https://phaser.io) - Game engine HTML5
- [Convex](https://convex.dev) - Reactive database (alternativa)
- [Llama Index](https://docs.llamaindex.ai) - RAG framework

### Papers Relevantes
1. "Generative Agents: Interactive Simulacra of Human Behavior" (Stanford 2023)
2. "Digital Player: Evaluating LLM-based Human-like Agent in Games" (NeurIPS 2024)
3. "Project Sid: Many-agent simulations toward AI civilization" (Altera.AL 2024)
4. "Autonomous Agents for Collaborative Task under Information Asymmetry" (NeurIPS 2024)
5. "What if LLMs Have Different World Views: Simulating Alien Civilizations" (arXiv 2024)

---

*Documento criado por JARVIS - 2026-02-01*
*Actualizado por VORTEX (Backend Research) - 2026-02-01*
