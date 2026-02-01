# 🔄 Dream Team - Sistema de Trabalho Autónomo

**Versão:** 1.0
**Data:** 2026-01-31

---

## 🎯 Objectivo

Sistema de trabalho em loop que:
1. Analisa repositórios
2. Identifica problemas/tarefas
3. Distribui aos agentes certos
4. Valida o trabalho
5. Repete até conclusão
6. Escala dúvidas ao CTO (Luís)

---

## 🏗️ Arquitectura

```
                    ┌─────────────────────────────┐
                    │      JARVIS (Chief)         │
                    │   Coordenador Principal     │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
     │  FORGE         │  │  ATLAS         │  │  CIPHER        │
     │  Tech Analysis │  │  Product       │  │  Security      │
     └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    TASK DISTRIBUTION    │
                    └────────────┬────────────┘
                                 │
         ┌───────────┬───────────┼───────────┬───────────┐
         ▼           ▼           ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  CODER  │ │  NOVA   │ │ VORTEX  │ │ SENTINEL│ │  PIXEL  │
    │ General │ │Frontend │ │ Backend │ │  DevOps │ │  UI/UX  │
    └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
         │           │           │           │           │
         └───────────┴───────────┼───────────┴───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      GUARDIAN           │
                    │    (Validação QA)       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Loop até Conclusão    │
                    │   ou Escalação          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   LUÍS (CTO)            │
                    │   Dúvidas + Validação   │
                    │   @telegram             │
                    └─────────────────────────┘
```

---

## 📋 Workflow por Etapas

### Etapa 1: Análise Inicial
**Responsável:** FORGE (Tech Lead)

```
Input: Repositório GitHub
Output: Lista de issues/problemas

Acções:
1. Clone/pull do repo
2. Análise de código (estrutura, qualidade, gaps)
3. Comparação com Jira (o que falta?)
4. Lista priorizada de tarefas
```

### Etapa 2: Classificação de Tarefas
**Responsável:** JARVIS (Coordenador)

```
Input: Lista de tarefas do FORGE
Output: Tarefas atribuídas a agentes

Matriz de Atribuição:
| Tipo de Tarefa        | Agente Primário | Backup    |
|-----------------------|-----------------|-----------|
| Frontend/UI           | NOVA            | PIXEL     |
| Backend/API           | VORTEX          | CODER     |
| Database/Schema       | VORTEX          | FORGE     |
| DevOps/Deploy         | SENTINEL        | FORGE     |
| Security fixes        | CIPHER          | CODER     |
| General coding        | CODER           | NOVA      |
| UX/Design             | PIXEL           | NOVA      |
| Testing               | GUARDIAN        | CODER     |
| Architecture          | FORGE           | VORTEX    |
| Product decisions     | ATLAS           | NEXUS     |
```

### Etapa 3: Execução
**Responsável:** Agentes atribuídos

```
Para cada tarefa:
1. Agente recebe task + contexto
2. Implementa solução
3. Cria PR ou aplica mudanças
4. Documenta o que fez
5. Passa para validação
```

### Etapa 4: Validação
**Responsável:** GUARDIAN (QA)

```
Para cada implementação:
1. Testes funcionais
2. Code review básico
3. Verificação de regressões
4. Se OK → merge/close
5. Se NOK → volta ao agente com feedback
```

### Etapa 5: Loop ou Conclusão
**Responsável:** JARVIS

```
if (tarefas_pendentes > 0):
    goto Etapa 1
elif (dúvidas ou decisões de produto):
    escalate_to_luis()
else:
    report_conclusao()
```

---

## 🚨 Escalação ao CTO

### Quando Escalar
- Decisões de produto que afectam roadmap
- Conflitos de prioridade entre projectos
- Bloqueadores técnicos sem solução clara
- Questões de orçamento/recursos
- Dúvidas sobre requisitos

### Como Escalar
```python
# Via Telegram
message_to_luis(
    type="question" | "blocker" | "decision",
    project="DEV-XX",
    context="...",
    options=["A", "B", "C"],  # se aplicável
    urgency="low" | "medium" | "high"
)
```

### Formato da Mensagem
```
🚨 [TIPO] - [PROJECTO]

Contexto: ...

Opções:
A) ...
B) ...

Recomendação: A porque...

Urgência: 🟡 Média
```

---

## 📊 Reports Diários

### Para o CTO (Luís) - 18:00 Lisbon
```
📊 DREAM TEAM DAILY REPORT - DD/MM/YYYY

✅ CONCLUÍDO HOJE:
- [DEV-XX] Tarefa 1
- [DEV-YY] Tarefa 2

🔄 EM PROGRESSO:
- [DEV-ZZ] Tarefa 3 (CODER, 60%)

⚠️ BLOQUEADORES:
- Nenhum / Lista...

📈 MÉTRICAS:
- Tasks concluídas: X
- PRs merged: Y
- Issues fechadas: Z

🎯 PLANO AMANHÃ:
- Tarefa A
- Tarefa B
```

---

## 🔧 Implementação Técnica

### Cron Jobs Necessários
```bash
# Análise diária às 09:00 Lisbon
0 9 * * * /home/ubuntu/clawd/scripts/dream-team-daily.sh

# Report diário às 18:00 Lisbon
0 18 * * * /home/ubuntu/clawd/scripts/dream-team-report.sh
```

### Scripts a Criar
1. `dream-team-daily.sh` - Trigger análise matinal
2. `dream-team-report.sh` - Gera e envia report ao Luís
3. `dream-team-assign.sh` - Distribui tarefas aos agentes
4. `dream-team-validate.sh` - Executa validação

---

## 📝 Notas

- Todos os agentes trabalham em paralelo quando possível
- Jira é a fonte única de verdade para tarefas
- GitHub é onde o código vive
- Telegram é o canal de comunicação com o CTO
- Este sistema evolui com feedback

---

*Dream Team - AiParaTi 2026*
