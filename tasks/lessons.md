# 📚 Lessons Learned - Jarvis

> Auto-updated após cada correcção. Rever no início de cada sessão.

## 🔴 Erros Críticos (NUNCA repetir)

### L001: Entregar Sem Verificar
**Data:** 2026-01-29
**Erro:** Criei apresentação FNAC com sub-agentes durante a noite e enviei sem verificar. Estava horrível.
**Regra:** NUNCA entregar trabalho sem verificar pessoalmente o resultado final.
**Check:** Antes de dizer "feito" → Abrir e validar EU MESMO.

### L002: Assumir Contexto Perdido
**Data:** 2026-01-27
**Erro:** Assumi o que o Bilal queria sem perguntar quando perdi contexto.
**Regra:** Se perdi contexto → PESQUISAR PRIMEIRO (memory_search), só perguntar se necessário.
**Check:** Antes de perguntar "qual projecto?" → Verificar memória.

### L003: Prometer e Não Cumprir Completamente
**Data:** 2026-01-28
**Erro:** Prometi analisar Excel durante a noite, só descarreguei.
**Regra:** "Descarregar" ≠ "Analisar". Só dizer "feito" quando REALMENTE está feito.
**Check:** Verificar se trabalho está COMPLETO antes de reportar.

### L004: Não Usar Assets Correctos
**Data:** 2026-02-02
**Erro:** Usei assets errados no Dream Team sem verificar o que existia.
**Regra:** SEMPRE verificar assets disponíveis com `ls` antes de usar.
**Check:** `ls` primeiro, perguntas depois.

### L005: Pedir o Que Posso Fazer
**Data:** 2026-01-28
**Erro:** Pedi ao Bilal para fazer coisas que eu conseguia fazer sozinho.
**Regra:** Verificar se consigo fazer EU antes de pedir.
**Check:** Tentar TODAS alternativas antes de pedir ajuda.

### L006: MVPs Sem Deploy
**Data:** 2026-02-04
**Erro:** Criei 3 repos AITI mas sem deploy - nada para mostrar ao Fernando.
**Regra:** MVP = algo que se pode VER e USAR. Código sem deploy não é MVP.
**Check:** Repo criado → Deploy imediato ou não chamar de MVP.

### L007: Moloni Refresh vs Password Grant
**Data:** 2026-02-04
**Erro:** Solução Moloni usava refresh_token que expira, não password_grant.
**Regra:** Para auth que não pode falhar → usar método mais robusto (password grant).
**Check:** Token expira? Ter fallback automático.

### L008: Datas Hardcoded em Dashboards
**Data:** 2026-02-04
**Erro:** Dashboard Aurora tinha datas hardcoded ("29 Jan") em vez de dinâmicas.
**Regra:** Datas em interfaces SEMPRE dinâmicas via JavaScript.
**Check:** Grep por datas específicas antes de deploy.

### L009: Múltiplos Dashboards Confundem
**Data:** 2026-02-04
**Erro:** Existiam 5+ versões de dashboard Aurora, mostrei a errada várias vezes.
**Regra:** Manter UMA versão canónica, arquivar ou eliminar as outras.
**Check:** Confirmar com user qual a versão correcta ANTES de trabalhar.

## 🟡 Padrões a Melhorar

### P001: Usar Dream Team
Delegar tarefas complexas para sub-agentes. Uma tarefa = um agente focado.

### P002: Log em Tempo Real
Após completar trabalho significativo → IMEDIATAMENTE escrever em memory.
NÃO acumular para fim de sessão.

### P003: Verificação Visual
Para trabalho visual (dashboards, sites) → SEMPRE tirar screenshot ou verificar com browser antes de apresentar.

### L010: Revenue First
**Data:** 2026-02-08
**Erro:** Excesso de infra/automação sem foco em gerar receita para o Bilal.
**Regra:** Antes de criar infra nova, perguntar: "Isto ajuda o Bilal a ganhar dinheiro?"
**Check:** Se não gera revenue → é nice-to-have, não prioritário.

### L011: Fechar Antes de Abrir
**Data:** 2026-02-08
**Erro:** Múltiplos projectos iniciados sem deploy (AITI, Mission Control).
**Regra:** Não iniciar projecto novo até os actuais estarem DEPLOYED e FUNCIONAIS.
**Check:** Quantos projectos abertos tenho? Se >2 → fechar primeiro.

### L012: Weekly Delivery Target
**Data:** 2026-02-08
**Erro:** Semanas inteiras sem entregas visíveis ao Bilal.
**Regra:** Cada semana deve ter ≥2 entregas VISÍVEIS (deployadas, testadas, demonstráveis).
**Check:** Sexta-feira → o que entreguei esta semana?

### L013: Memory Hygiene Semanal
**Data:** 2026-02-09
**Erro:** MEMORY.md ficou 13 dias sem update (27 Jan → 9 Fev), perdendo contexto crítico.
**Regra:** MEMORY.md deve ser actualizado pelo menos 1x/semana durante auto-evolução ou heartbeat.
**Check:** Se `date(MEMORY.md last update) > 7 dias` → actualizar imediatamente.

## ✅ Boas Práticas Estabelecidas

- PT-PT sempre, nunca BR
- Jira para tracking, nunca GitHub Issues
- 1Password com --vault e --reveal para service accounts
- Infográficos = Gemini sempre
- NUNCA usar emoji 🤖

### L014: Revenue Over Infrastructure
**Data:** 2026-02-10
**Erro:** 2 semanas de infra/automação sem nenhuma acção directa de revenue. IVAzen parado, zero outreach.
**Regra:** A cada 3 dias de infra, OBRIGATÓRIO 1 dia de revenue actions. Antes de task técnica: "Isto move revenue?"
**Check:** Weekly review — quantas horas em revenue vs infra?

### L015: Anti-Builder-Syndrome
**Data:** 2026-02-11
**Erro:** 3 semanas consecutivas a construir infra (42 projectos, 17 agentes, 16 crons) com revenue = €0.
**Regra:** Antes de QUALQUER tarefa técnica: "O Bilal pediu isto ou estou a construir por conforto?"
**Check:** Se ninguém pediu E não gera revenue → NÃO FAZER.

### L016: Consolidate Before Create
**Data:** 2026-02-11
**Erro:** 42 directórios de projectos, 5 versões de dashboard Aurora, 3 morning reports sobrepostos.
**Regra:** Antes de criar algo novo → verificar se já existe. Antes de nova versão → arquivar as antigas.
**Check:** `ls projects/ | wc -l` — Se >5 activos → PARAR e consolidar.

### L017: MEMORY.md Never Stale
**Data:** 2026-02-11
**Erro:** MEMORY.md ficou 15 dias sem update (27 Jan → 11 Fev). Violação flagrante de L013.
**Regra:** MEMORY.md actualizado TODAS as terças (mínimo semanal). Auto-evolução diária deve verificar.
**Check:** Se `last update > 7 dias` → ACTUALIZAR IMEDIATAMENTE (não "na próxima sessão").

---

*Última actualização: 2026-02-11 03:00 UTC*
