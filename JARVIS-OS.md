# JARVIS OS v1.0 - Sistema Operativo de Trabalho

> **Baseado em:** TechTiff AI OS 2026, Addy Osmani Workflow, Master of Code Automation
> **Data:** 2026-02-07

---

## 🎯 PRINCÍPIO CENTRAL

**"AI não é uma ferramenta que espera instruções. É um colaborador que conhece o plano."**

A diferença entre usar AI como chatbot vs ter um AI Operating System:
- **Chatbot:** Perguntas ad-hoc, respostas genéricas, zero memória de contexto
- **AI OS:** Conhece os objectivos, situação, padrões, constrangimentos. Executa com autonomia.

---

## 📋 OS 4 PROMPTS FUNDAMENTAIS (TechTiff Framework)

### 1. 🗓️ YEARLY MAPPING (Executar 1x no início do ano)
```
Baseado nos meus objectivos, cria um tracker de 12 meses para 2026.

Para cada mês, incluir:
- Milestone principal (a coisa que define sucesso este mês)
- 2-3 tarefas específicas que avançam este milestone
- Coluna "O que aconteceu" (preencho no fim do mês)

Formato: tabela. Ser realista com pacing. Não front-load tudo no Q1.
```

### 2. 📅 MONTHLY FOCUS (Executar dia 1 de cada mês)
```
Estamos em [MÊS]. Baseado no milestone tracker e no que aconteceu no mês passado:
- Qual é o meu foco principal este mês?
- O que NÃO devo fazer este mês?
- Escreve uma frase que define "ganhar o mês".
```

### 3. 📋 WEEKLY PLANNING (Executar segunda-feira)
```
Baseado no foco mensal, quais são as 3 coisas mais importantes esta semana?

Para cada uma:
- Definição clara de "done"
- Estimativa de tempo
- Qual ganha se só completar uma?
```

### 4. 🆘 UNSTUCK PROMPT (Quando bloqueado)
```
Estou bloqueado em [tarefa/objectivo].

Ajuda-me a perceber:
- Isto é importante, ou estou a procrastinar outra coisa?
- Qual o próximo passo mais pequeno possível?
- Há uma abordagem alternativa que não estou a ver?
- Devo ajustar o objectivo ou persistir?
```

---

## 🔄 RITMO DIÁRIO JARVIS

### 🌅 08:00 - MORNING BRIEFING (Automático via Cron)
```
📊 BRIEFING DIÁRIO - [DATA]

🗓️ AGENDA HOJE
- [eventos do Google Calendar]

📧 EMAILS URGENTES (últimas 12h)
- [resumo inbox prioritário]

📋 FOCUS DO DIA (do weekly plan)
- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

⚠️ ALERTAS
- [deadlines próximos]
- [follow-ups pendentes]

💡 SUGESTÃO DO DIA
- [uma coisa proactiva que posso fazer]
```

### 🔨 Durante o Dia - EXECUÇÃO
- Tracking automático do que foi feito
- Logging em `memory/YYYY-MM-DD.md` em tempo real
- Sub-agentes para tarefas paralelas (NOVA, VORTEX, SENTINEL)

### 🌙 18:00 - DAILY WRAP (Automático via Cron)
```
📊 WRAP-UP DIÁRIO - [DATA]

✅ COMPLETADO
- [lista do que foi feito]

⏳ EM PROGRESSO
- [o que ficou a meio]

🚫 BLOQUEIOS
- [problemas encontrados]

📝 NOTAS PARA AMANHÃ
- [contexto importante]

⏱️ TEMPO INVESTIDO
- [estimativa por projecto]
```

### 📊 Sexta 18:00 - WEEKLY REVIEW + CTO REPORT
```
📊 RELATÓRIO SEMANAL - Semana [N]

🎯 OBJECTIVO DA SEMANA
[o que tentámos alcançar]

✅ RESULTADOS
- [o que foi conseguido]
- [métricas relevantes]

📈 PROGRESSO POR PROJECTO
| Projecto | Estado | Próximo Passo |
|----------|--------|---------------|
| IVAzen | [estado] | [acção] |
| ... | ... | ... |

⚠️ RISCOS & BLOQUEIOS
- [problemas que precisam atenção]

📋 PLANO PRÓXIMA SEMANA
1. [prioridade 1]
2. [prioridade 2]
3. [prioridade 3]

💰 CUSTOS AI (estimativa)
- Tokens: [N]
- Custo: €[X]
```

---

## 🧠 CONTEXT MANAGEMENT (Addy Osmani Approach)

### Spec Before Code
Antes de qualquer desenvolvimento:
1. **Brainstorm spec** - definir problema e requisitos
2. **Generate plan** - quebrar em milestones
3. **Iterate plan** - refinar até coerente
4. **Execute in chunks** - pequenos passos iterativos

### Context Packing
Sempre fornecer ao AI:
- Código relevante
- Constraints técnicos
- Pitfalls conhecidos
- Exemplos de boas soluções
- Docs de APIs/libraries

### Small Iterative Chunks
- Uma feature de cada vez
- Uma função de cada vez
- Um bug de cada vez
- Testar entre cada chunk

---

## 🤖 MULTI-AGENT ORCHESTRATION

### Arquitectura Dream Team
```
         BILAL (Telegram)
              │
         JARVIS (Opus 4.6)
         Orchestrador Principal
              │
    ┌────┬────┼────┬────┬────┐
    │    │    │    │    │    │
  AURORA MIDAS NOVA VORTEX SENTINEL
  Oceano Finance Research Backend Security
```

### Quando Usar Cada Agente

| Agente | Trigger | Exemplo |
|--------|---------|---------|
| **AURORA** | Gestão empresarial | "Aurora, actualiza orçamento Q1" |
| **MIDAS** | Finanças pessoais | "Midas, analisa despesas Janeiro" |
| **NOVA** | Research paralelo | Pesquisa mercado enquanto trabalho |
| **VORTEX** | Coding tasks | Implementar feature X em background |
| **SENTINEL** | Security checks | Audit diário automático |

### Padrão de Delegação
```
1. Jarvis recebe tarefa complexa
2. Analisa e decide: fazer sozinho ou delegar?
3. Se delegar: spawn sub-agent com contexto
4. Sub-agent executa e reporta
5. Jarvis consolida e entrega ao Bilal
```

---

## 📊 STRUCTURED CONTEXT (O Segredo do AI OS)

### Goals.md (Objectivos Estruturados)
```markdown
# GOALS 2026

## 🎯 Meta Principal
200k€/ano de receita combinada

## 📊 Breakdown
| Fonte | Target | Actual | Gap |
|-------|--------|--------|-----|
| AiParaTi Consulting | 100k€ | 0 | 100k€ |
| IVAzen SaaS | 50k€ | 0 | 50k€ |
| Terapia Holística | 50k€ | ? | ? |

## 🚫 O Que NÃO Fazer
- Projectos que pagam <5k€
- Clientes que não respeitam tempo
- Features que ninguém pediu

## ⚠️ Constraints
- Tempo limitado (Noah quartas + weekends)
- Budget IA ~200€/mês
- Solo founder (sem equipa)
```

### Situation.md (Contexto Actual)
```markdown
# SITUAÇÃO ACTUAL

## 💼 Projectos Activos
| Projecto | Cliente | Estado | Deadline |
|----------|---------|--------|----------|
| IVAzen | AA | MVP feito | Marketing Q1 |
| TA Consulting | Fernando | Em dev | ? |

## 🔥 Urgentes
- [lista]

## 💰 Financeiro
- Runway: [N meses]
- MRR: €[X]
- Burn rate: €[Y]/mês
```

### Patterns.md (Auto-conhecimento)
```markdown
# PADRÕES DO BILAL

## 🟢 O Que Funciona
- Vibe coding (no-code first)
- Sprints curtos (5 dias)
- Visualizações e tabelas
- Desafios directos

## 🔴 O Que Derrapa
- Projectos longos sem milestone
- Demasiadas frentes abertas
- Perfeccionismo em detalhes
- Dizer sim a tudo

## 💡 Como o Jarvis Deve Agir
- Questionar premissas
- Propor alternativas mais simples
- Lembrar constraints
- Celebrar wins (mesmo pequenos)
```

---

## ⚙️ CRON JOBS A CONFIGURAR

### Diários
| Hora | Job | Agente | Modelo |
|------|-----|--------|--------|
| 08:00 | Morning Briefing | Jarvis | Haiku |
| 18:00 | Daily Wrap | Jarvis | Haiku |
| 06:00 | Security Audit | Sentinel | Haiku |

### Semanais
| Dia | Hora | Job | Agente |
|-----|------|-----|--------|
| Seg | 08:00 | Weekly Planning | Jarvis |
| Sex | 18:00 | Weekly Review + CTO Report | Jarvis |
| Dom | 10:00 | Memory Consolidation | Jarvis |

### Mensais
| Dia | Job |
|-----|-----|
| 1 | Monthly Focus Review |
| 15 | Cost Report |
| 28 | Next Month Planning |

---

## 🚀 IMPLEMENTAÇÃO FASEADA

### Fase 1: Esta Semana (Quick Wins)
- [x] Criar JARVIS-OS.md (este ficheiro)
- [ ] Configurar Morning Briefing (cron 08:00)
- [ ] Configurar Daily Wrap (cron 18:00)
- [ ] Criar Goals.md estruturado
- [ ] Definir 3 projectos prioritários

### Fase 2: Próxima Semana (Estrutura)
- [ ] Weekly Planning automático (segunda)
- [ ] Weekly Review + CTO Report (sexta)
- [ ] Activar sub-agentes (NOVA, VORTEX)
- [ ] Dashboard custos por projecto

### Fase 3: Este Mês (Escala)
- [ ] Memory consolidation automático
- [ ] Situation.md auto-update
- [ ] Patterns.md baseado em análise
- [ ] Voice-first para tarefas rápidas

---

## 📚 FONTES

1. **TechTiff - The 2026 AI Operating System**
   - Framework dos 4 prompts
   - Context structuring
   - https://techtiff.substack.com/p/the-2026-ai-operating-system

2. **Addy Osmani - My LLM Coding Workflow**
   - Spec before code
   - Small iterative chunks
   - Context packing
   - https://addyosmani.com/blog/ai-coding-workflow/

3. **Master of Code - AI Workflow Automation**
   - 80/20 rule (automatizar casos comuns)
   - AI como assistente inteligente, não substituição
   - https://masterofcode.com/blog/ai-workflow-automation

4. **Reddit r/datascience**
   - "Workflow discipline and shared patterns matter more than which model"
   - Standardizar prompts e convenções

---

*Última actualização: 2026-02-07*
*Próxima revisão: 2026-02-14*
