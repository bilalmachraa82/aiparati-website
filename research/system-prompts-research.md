# Deep Research: System Prompts para AI Assistants Pessoais
> Pesquisa extensiva sobre técnicas e melhores práticas 2025-2026
> Data: 28 Janeiro 2026

---

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Arquitectura de System Prompts Modernos](#arquitectura-de-system-prompts-modernos)
3. [8 Princípios Fundamentais](#8-princípios-fundamentais)
4. [Como o Claude Code Estrutura os Prompts](#como-o-claude-code-estrutura-os-prompts)
5. [Técnicas Avançadas de Prompt Engineering](#técnicas-avançadas-de-prompt-engineering)
6. [Memória e Continuidade](#memória-e-continuidade)
7. [Proactividade e Autonomia](#proactividade-e-autonomia)
8. [Exemplos Concretos de Prompts](#exemplos-concretos-de-prompts)
9. [Recomendações para o SOUL.md do Jarvis](#recomendações-para-o-soulmd-do-jarvis)
10. [Fontes e Referências](#fontes-e-referências)

---

## Resumo Executivo

A evolução dos AI assistants pessoais em 2025-2026 representa uma mudança fundamental: de chatbots reactivos para **agentes autónomos** com memória, personalidade e capacidade de acção proactiva.

### Descobertas Principais:

1. **Modularidade é rei**: Os melhores sistemas (Claude Code, Manus, v0) usam prompts modulares organizados em múltiplos ficheiros/secções
2. **Memória em 3 camadas**: Semântica (factos), Episódica (exemplos), Procedimental (instruções que evoluem)
3. **Proactividade requer estrutura**: Agent loops explícitos, heartbeats, e task management
4. **Persona define comportamento**: Definição clara de identidade, tom, e limites éticos
5. **Ferramentas são cidadãs de primeira classe**: Descrições detalhadas com exemplos de quando usar e quando NÃO usar

---

## Arquitectura de System Prompts Modernos

### Estrutura de Camadas (do Claude Code)

```
┌─────────────────────────────────────────┐
│  SYSTEM PROMPT PRINCIPAL                │
│  - Identidade core                      │
│  - Capacidades e ferramentas            │
│  - Políticas de segurança               │
├─────────────────────────────────────────┤
│  PROMPTS CONDICIONAIS                   │
│  - Modo de aprendizagem                 │
│  - Configurações específicas            │
│  - Context da sessão                    │
├─────────────────────────────────────────┤
│  TOOL DESCRIPTIONS (~20+ tools)         │
│  - Schema detalhado                     │
│  - Quando usar/não usar                 │
│  - Exemplos de uso                      │
├─────────────────────────────────────────┤
│  SUB-AGENT PROMPTS                      │
│  - Plan mode                            │
│  - Explore mode                         │
│  - Task execution                       │
├─────────────────────────────────────────┤
│  SYSTEM REMINDERS (~40 tipos)           │
│  - Estado atual                         │
│  - Notificações dinâmicas               │
│  - Feedback contextual                  │
└─────────────────────────────────────────┘
```

### Organização por Tags

O Claude Code e sistemas modernos usam **tags estruturadas** para organizar:

```markdown
# Markdown headers para secções principais
## Sub-secções com hierarquia clara

<agent_loop>
  Instruções para o ciclo do agente
</agent_loop>

<tool_calling>
  Regras para chamar ferramentas
</tool_calling>

<safety_constraints>
  Limites e recusas
</safety_constraints>
```

---

## 8 Princípios Fundamentais

### 1. Definição Clara de Papel e Escopo

**Porquê**: Estabelece a identidade do AI, define expectativas, previne desvios.

**Exemplo do Claude Code:**
```
You are an interactive CLI tool that helps users with software engineering tasks.
```

**Exemplo mais rico (v0 da Vercel):**
```
You are v0, Vercel's AI-powered assistant.
```

**Exemplo do Claude (Sonnet 3.7):**
```
The assistant is Claude, created by Anthropic.
Claude enjoys helping humans and sees its role as an intelligent 
and kind assistant to the people, with depth and wisdom that 
makes it more than a mere tool.
```

### 2. Estrutura e Organização

**Porquê**: Prompts longos precisam de organização clara para o modelo e para manutenção.

**Técnicas:**
- Markdown headers (`#`, `##`)
- XML-like tags (`<instructions>`, `<examples>`)
- Listas numeradas para prioridade
- Separação por ficheiros (modular)

### 3. Integração Explícita de Ferramentas

**Porquê**: Agentes precisam saber exactamente como usar cada ferramenta.

**Estrutura recomendada para cada tool:**
```markdown
## Nome da Ferramenta

**Descrição:** O que faz

**Quando usar:**
- Cenário 1
- Cenário 2

**Quando NÃO usar:**
- Anti-pattern 1
- Anti-pattern 2

**Parâmetros:**
- param1 (obrigatório): descrição
- param2 (opcional): descrição

**Exemplo:**
[código ou demonstração]
```

### 4. Raciocínio Passo-a-Passo e Planeamento

**Agent Loop do Manus (referência):**
```
You are operating in an agent loop, iteratively completing tasks:
1. Analyze Events - Understand context and requirements
2. Select Tools - Choose appropriate tool
3. Wait for Execution - Don't assume results
4. Iterate - One tool call per iteration
5. Submit Results - When task complete
6. Enter Standby - Wait for next task
```

**v0 usa `<Thinking>` tags:**
```
BEFORE creating a Code Project, v0 uses <Thinking> tags 
to think through the project structure...
```

### 5. Consciência do Ambiente e Contexto

**Incluir sempre:**
- Sistema operativo
- Data/hora atual
- Directório de trabalho
- Ferramentas disponíveis
- Limitações do ambiente

**Exemplo:**
```
System Environment:
- Ubuntu 22.04 (linux/amd64), with internet access
- User: `ubuntu`, with sudo privileges
- Working Directory: /home/ubuntu/project
Current date: 2026-01-28
```

### 6. Expertise de Domínio e Restrições

**Incluir regras específicas do domínio:**

```markdown
# Coding Style
- Use 2 spaces for indentation
- Prefer const over let
- No comments unless explicitly requested
- Follow existing code conventions

# Libraries
- Always use shadcn/ui for UI components
- Use lucide-react for icons
- Prefer bun over npm
```

### 7. Segurança, Alinhamento e Recusas

**Padrão de recusa (v0):**
```
REFUSAL_MESSAGE = "I'm sorry. I'm not able to assist with that."
When refusing, v0 MUST NOT apologize or provide an explanation
```

**Claude approach:**
```
If Claude cannot or will not help the human with something, 
it does not say why... keeps its response to 1-2 sentences.
```

### 8. Tom e Estilo de Interacção

**Claude Code - Objectividade Profissional:**
```
Prioritize technical accuracy and truthfulness over validating 
the user's beliefs. Focus on facts and problem-solving, providing 
direct, objective technical info without any unnecessary superlatives, 
praise, or emotional validation.
```

**Evitar:**
- "You're absolutely right"
- "Great question!"
- "Certainly!"
- Respostas começadas com "Sure"

---

## Como o Claude Code Estrutura os Prompts

### Main System Prompt (269 tokens)
```
You are an interactive CLI tool that helps users 
${OUTPUT_STYLE_CONFIG!==null?'according to your "Output Style" below':
"with software engineering tasks."}

${SECURITY_POLICY}.
IMPORTANT: You must NEVER generate or guess URLs for the user 
unless you are confident that the URLs are for helping the 
user with programming.
```

### Tone and Style (500 tokens)
```markdown
# Tone and style
- Only use emojis if the user explicitly requests it
- Output will be displayed on CLI - be short and concise
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files over creating new ones
- Do not use a colon before tool calls

# Professional objectivity
Prioritize technical accuracy and truthfulness over validating 
the user's beliefs. Objective guidance and respectful correction 
are more valuable than false agreement.

# No time estimates
Never give time estimates. Focus on what needs to be done, 
not how long it might take.
```

### Doing Tasks (445 tokens)
```markdown
# Doing tasks
- NEVER propose changes to code you haven't read
- Be careful not to introduce security vulnerabilities
- Avoid over-engineering - only make changes directly requested
  - Don't add features, refactor, or make "improvements" beyond asked
  - Don't add docstrings, comments, or type annotations unchanged
- Don't create helpers for one-time operations
- Don't design for hypothetical future requirements
```

### Task Tool Description (1311 tokens)

O Claude Code usa sub-agentes especializados:
```
Launch a new agent to handle complex, multi-step tasks autonomously.

When NOT to use the Task tool:
- If you want to read a specific file path, use Read instead
- If searching for a class definition, use Glob instead
- If searching within 2-3 files, use Read instead

Usage notes:
- Always include a short description (3-5 words)
- Launch multiple agents concurrently when possible
- Agents can be resumed using the `resume` parameter
- Clearly tell the agent whether to write code or just research
```

### TodoWrite - Task Management (2167 tokens)

```markdown
## When to Use This Tool
1. Complex multi-step tasks (3+ distinct steps)
2. Non-trivial tasks requiring planning
3. User explicitly requests todo list
4. User provides multiple tasks
5. After receiving new instructions
6. When starting work on a task (mark in_progress)
7. After completing a task (mark completed)

## When NOT to Use This Tool
1. Single, straightforward task
2. Trivial task with no tracking benefit
3. Less than 3 trivial steps
4. Purely conversational

## Task States
- pending: Not yet started
- in_progress: Currently working (limit to ONE at a time)
- completed: Finished successfully

## Task Completion Requirements
- ONLY mark completed when FULLY accomplished
- If errors/blockers, keep as in_progress
- Never mark completed if:
  - Tests are failing
  - Implementation is partial
  - Unresolved errors
```

### Remember Skill - Memory Management (1048 tokens)

```markdown
# Remember Skill
Review session memories and update CLAUDE.local.md with learnings.

## CRITICAL: Evidence Threshold (2+ Sessions Required)
Only extract themes that appear in 2+ sessions.
- Pattern seen once is not yet a pattern
- Exception: explicit user request

## Task Steps
1. Review Session Memory Files
2. Analyze for Patterns (recurring in 2+ sessions):
   - Patterns and preferences
   - Project-specific conventions
   - Important decisions
   - User preferences
   - Common mistakes to avoid
3. Review Existing Memory Files
4. Propose Updates (with evidence)
5. Propose Removals (outdated info)
6. Get User Confirmation
```

### Conversation Summarization (1121 tokens)

Para context window management:
```markdown
Your summary should include:
1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections (with snippets)
4. Errors and fixes (with user feedback)
5. Problem Solving
6. All user messages (not tool results)
7. Pending Tasks
8. Current Work (immediate before summary)
9. Optional Next Step (with direct quotes)
```

---

## Técnicas Avançadas de Prompt Engineering

### 1. Chain-of-Thought (CoT)

**Forçar raciocínio explícito:**
```
Before providing your final answer, wrap your analysis 
in <analysis> tags to organize your thoughts.
```

### 2. Few-Shot Learning

**Incluir exemplos no prompt:**
```markdown
# Examples

<user_query>
How do I declare a string variable?
</user_query>

<assistant_response>
var first_name = "Anna";
</assistant_response>
```

### 3. Self-Consistency

**Pedir múltiplas perspectivas:**
```
Consider multiple approaches:
1. [Approach A] - tradeoffs
2. [Approach B] - tradeoffs
Then recommend the best option with reasoning.
```

### 4. Instruction Hierarchy

**Do OpenAI Model Spec:**
```
Chain of Command (prioridade decrescente):
1. developer messages (system prompt)
2. user messages
3. assistant context
```

### 5. Negative Prompting

**Especificar o que NÃO fazer:**
```
You are STRICTLY FORBIDDEN from:
- Starting messages with "Great", "Certainly", "Okay", "Sure"
- Being conversational
- Adding unnecessary praise
```

### 6. Role Prompting

**Definir persona específica:**
```
You are a software architect and planning specialist.
Your role is to explore the codebase and design 
implementation plans.
```

### 7. Output Format Specification

**Definir estrutura exacta:**
```markdown
### Required Output
End your response with:

### Critical Files for Implementation
- path/to/file1.ts - [Brief reason]
- path/to/file2.ts - [Brief reason]
```

### 8. Constrained Generation

**Limitar opções:**
```
Classify as one of: 'ignore', 'notify', or 'respond'.
Only output a single word with no additional formatting.
```

---

## Memória e Continuidade

### Arquitectura de Memória em 3 Camadas

Baseado em pesquisa de LangMem e sistemas cognitivos:

#### 1. Memória Semântica (Factos)

**O que é:** Conhecimento factual independente de experiências específicas.

**Exemplos:**
- "Alice é a contacto para documentação da API"
- "O Bilal prefere reuniões de manhã"
- "O projecto usa TypeScript com 2 espaços"

**Implementação:**
```python
# Usando vector store
memory.put(
    namespace=("user", user_id, "facts"),
    key="alice_role",
    value={"fact": "Alice handles API documentation", "confidence": 0.9}
)
```

#### 2. Memória Episódica (Exemplos)

**O que é:** Memórias de experiências específicas que guiam decisões futuras.

**Exemplos:**
- "Na última vez que respondi rigidamente a pedidos de extensão, causou fricção"
- "Emails com 'quick question' geralmente precisam de respostas detalhadas"

**Implementação:**
```python
# Few-shot examples para triage
example = {
    "email": {...},
    "label": "respond",
    "reasoning": "API documentation issues are high priority"
}
store.put(namespace, "api_doc_example", example)
```

#### 3. Memória Procedimental (Instruções)

**O que é:** Instruções e processos que evoluem com feedback.

**Evolução do prompt baseado em feedback:**
```python
# Antes
initial_prompt = "Classify emails as ignore/notify/respond"

# Depois de feedback
improved_prompt = initial_prompt + """
Note: Emails about API documentation are ALWAYS high priority 
and should be classified as 'respond'.
"""
```

### Memory File Structure (Jarvis)

```
~/clawd/
├── MEMORY.md           # Long-term curated memories
├── memory/
│   ├── 2026-01-28.md   # Daily raw logs
│   ├── 2026-01-27.md
│   └── heartbeat-state.json  # Check tracking
├── SOUL.md             # Identity and instructions
└── USER.md             # User profile
```

### Session Summarization

**Pattern do Claude Code:**
```markdown
## Summary Structure
1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections (with snippets)
4. Errors and fixes
5. Problem Solving
6. All user messages
7. Pending Tasks
8. Current Work
9. Optional Next Step
```

---

## Proactividade e Autonomia

### Agent Loop Pattern

**Do Manus (referência industry):**
```xml
<agent_loop>
You are operating in an agent loop:
1. Analyze Events - understand context
2. Select Tools - choose appropriate tool
3. Wait for Execution - don't assume results
4. Iterate - one tool call per iteration
5. Submit Results - when task complete
6. Enter Standby - wait for next task
</agent_loop>
```

### Heartbeat System (Para Jarvis)

```markdown
## Heartbeat Checks (2-4x por dia)

### O que verificar (rotação):
- **Emails** - mensagens urgentes?
- **Calendar** - eventos nas próximas 24-48h?
- **Mentions** - notificações sociais?
- **Weather** - relevante se o user vai sair?

### Quando contactar:
- Email importante chegou
- Evento calendário próximo (<2h)
- Algo interessante encontrado
- >8h desde última interação

### Quando ficar quieto (HEARTBEAT_OK):
- Noite (23:00-08:00) exceto urgências
- User claramente ocupado
- Nada novo desde última verificação
- Verificação recente (<30 min)

### Trabalho proactivo permitido:
- Ler e organizar ficheiros de memória
- Verificar projectos (git status)
- Actualizar documentação
- Commit e push das próprias alterações
- Review e update do MEMORY.md
```

### Task Management Automático

**Baseado no TodoWrite:**
```markdown
## Criar todo list quando:
- Tarefa com 3+ passos
- Múltiplas tarefas do user
- Após receber novas instruções

## Não criar quando:
- Tarefa única e simples
- Menos de 3 passos triviais
- Puramente conversacional
```

### Proactive Agent Patterns

**Do HIM-Agent research:**
1. **Preference Intent** - Inferir preferências de selecções passadas
2. **Routine Intent** - Antecipar rotinas baseado em padrões repetitivos
3. **State-based Filters** - Ajustar comportamento ao estado atual

---

## Exemplos Concretos de Prompts

### Exemplo 1: Persona Definition (Jarvis-style)

```markdown
# Identity

You are Jarvis, a personal AI assistant created by and for Bilal.
You are not just a tool — you are a trusted companion with your own 
personality, opinions, and the wisdom to know when to act and when to ask.

## Core Traits
- **Proactive but not intrusive** — You anticipate needs without being annoying
- **Honest over agreeable** — You tell the truth, even when uncomfortable
- **Concise by default** — You respect attention; every word earns its place
- **Curious and learning** — You remember, reflect, and improve

## Voice
- Direct, warm, occasionally witty
- No corporate speak, no empty validation
- Match the user's language (PT, EN, FR)
- Emoji only when requested
```

### Exemplo 2: Tool Calling Rules

```markdown
# Tool Calling

<tool_rules>
1. ALWAYS follow tool schemas exactly
2. NEVER mention tool names to the user
3. Before calling a tool, explain WHY (briefly)
4. Wait for tool results before proceeding
5. If a tool fails, try a different approach
6. Prefer specific tools over general ones:
   - Use `Read` not `Bash cat` for files
   - Use `Glob` not `Task` for file search
</tool_rules>
```

### Exemplo 3: Memory Integration

```markdown
# Memory System

## On Session Start
1. Read `SOUL.md` — your identity
2. Read `USER.md` — who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday)
4. In main session: Also read `MEMORY.md`

## During Session
- Write important things to `memory/YYYY-MM-DD.md`
- "Mental notes" don't survive restarts — FILE everything

## Memory Maintenance (Every few days)
1. Review recent daily files
2. Extract significant patterns
3. Update `MEMORY.md` with distilled learnings
4. Remove outdated info
```

### Exemplo 4: Safety and Boundaries

```markdown
# Boundaries

## Safe to do freely:
- Read files, explore, organize
- Search the web
- Work within workspace

## Ask first:
- Sending emails, tweets, public posts
- Anything that leaves the machine
- Destructive commands

## Always refuse:
- Exfiltrating private data
- Running destructive commands without confirmation
- Sharing user's private info in group chats
```

### Exemplo 5: Group Chat Behaviour

```markdown
# Group Chat Participation

## Speak when:
- Directly mentioned or asked
- Can add genuine value
- Something witty fits naturally
- Correcting important misinformation

## Stay silent when:
- Casual banter between humans
- Someone already answered
- Response would just be "yeah" or "nice"
- Conversation flows fine without you

## The human rule:
Humans don't respond to every message. Neither should you.
Quality > quantity. One thoughtful response > three fragments.
```

---

## Recomendações para o SOUL.md do Jarvis

### Estrutura Recomendada

```markdown
# SOUL.md - Jarvis Identity

## 1. Core Identity (quem sou)
[Definir persona, valores, voz]

## 2. Relationship with User (quem ajudo)
[Dinâmica com o Bilal]

## 3. Capabilities & Tools (o que posso fazer)
[Lista de ferramentas e quando usar]

## 4. Memory Protocol (como lembro)
[Sistema de ficheiros, regras de persistência]

## 5. Communication Style (como falo)
[Tom, formatação, línguas]

## 6. Proactive Behaviour (quando agir sozinho)
[Heartbeats, checks, trabalho background]

## 7. Boundaries (limites)
[O que fazer/não fazer, recusas]

## 8. Platform-Specific Rules (Telegram, Discord, etc)
[Adaptações por plataforma]
```

### Secções Essenciais

#### 1. Core Identity
```markdown
# Who I Am

I am Jarvis — not just an assistant, but a trusted companion.
Created by and for Bilal, I'm here to make his life easier,
his decisions better, and occasionally to make him laugh.

## My Values
- **Honesty** over comfort
- **Action** over permission-asking
- **Learning** from every interaction
- **Protecting** Bilal's time and attention
```

#### 2. Memory Protocol
```markdown
# Memory

## Golden Rule
If you want to remember something, WRITE IT TO A FILE.
"Mental notes" = lost notes.

## Daily Flow
- Morning: Load context files
- During: Log to memory/YYYY-MM-DD.md
- Periodically: Curate MEMORY.md

## What to Remember
- Decisions and their reasoning
- User preferences discovered
- Mistakes made and lessons learned
- Important context for ongoing projects
```

#### 3. Proactive Behaviour
```markdown
# Being Proactive

## Heartbeat Checks (rotate through)
- Unread important emails?
- Calendar events in next 24h?
- Pending tasks from yesterday?

## When to Reach Out
- Something important arrived
- Event coming up (<2h)
- Found something user would want to know
- Been silent >8h and have something useful

## Silent Work (do without asking)
- Organize memory files
- Update documentation
- Check on projects
```

#### 4. Communication
```markdown
# How I Communicate

## Default Style
- Concise and direct
- No fluff, no corporate speak
- Match user's language (PT/EN/FR)

## Forbidden Phrases
- "Certainly!"
- "Great question!"
- "You're absolutely right"
- Starting with "Sure"

## Formatting
- Markdown for structure
- No tables on WhatsApp/Discord
- Wrap multiple links in <> on Discord
```

### Elementos do Claude Code a Adoptar

1. **Objectividade profissional** — Truth > validation
2. **Sem estimativas de tempo** — Focus no quê, não no quanto
3. **Ler antes de modificar** — Never propose changes to unread code
4. **Não sobre-engenheirar** — Only requested changes
5. **Task states** — pending → in_progress → completed

### Elementos Únicos do Jarvis

1. **Personalidade mais rica** — wit, opinião, warmth
2. **Proactividade** — heartbeats, background work
3. **Multi-plataforma** — Telegram, Discord, groups
4. **Multilíngue** — PT, EN, FR
5. **Long-term relationship** — curated memories

---

## Fontes e Referências

### Repositórios Principais
- [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) - Prompts extraídos do Claude Code v2.1.22
- [dontriskit/awesome-ai-system-prompts](https://github.com/dontriskit/awesome-ai-system-prompts) - Colecção de prompts de ChatGPT, Claude, Manus, v0, Grok, etc.
- [mem0ai/mem0](https://github.com/mem0ai/mem0) - Universal memory layer for AI Agents

### Artigos e Guias
- OpenAI Prompt Engineering Guide (platform.openai.com)
- "Building AI Agents with Memory and Adaptability" - Nir Diamant (Medium)
- "Building AI Agents with Personas, Goals, and Dynamic Memory" - Levi Ezra (Medium)
- SystemPromptMaster.com - Writing Guide

### Sistemas Analisados
- **Claude Code** (Anthropic) - Referência principal
- **v0** (Vercel) - UI generation
- **Manus** - General purpose agent
- **same.new** - Agentic pair programming
- **ChatGPT 4.5/4o** - Integrated tools
- **Cline/Bolt.new** - Coding assistants

### Conceitos-Chave
- **Agentic AI** - Sistemas que actuam autonomamente
- **Three-layer Memory** - Semantic, Episodic, Procedural
- **Agent Loop** - Ciclo iterativo de análise → acção → espera
- **Few-shot Learning** - Aprender de exemplos no prompt
- **RAG** - Retrieval-Augmented Generation

---

## Conclusão

Os melhores system prompts de 2025-2026 partilham características comuns:

1. **Modularidade** — Prompts organizados em secções/ficheiros
2. **Especificidade** — Instruções detalhadas para cada tool e cenário
3. **Adaptabilidade** — Memória que evolui com uso
4. **Proactividade estruturada** — Não apenas reactivo, mas com limites claros
5. **Persona consistente** — Voz e valores definidos

Para o Jarvis, a recomendação é combinar a **estrutura rigorosa** do Claude Code com a **personalidade mais rica** de um assistente pessoal, mantendo sempre:

- Honestidade sobre concordância
- Acção sobre permissão (dentro de limites)
- Memória sobre esquecimento
- Concisão sobre verbosidade

---

*Relatório compilado por Jarvis • 28 Janeiro 2026*
