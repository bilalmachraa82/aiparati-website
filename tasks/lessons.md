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

## ✅ Boas Práticas Estabelecidas

- PT-PT sempre, nunca BR
- Jira para tracking, nunca GitHub Issues
- 1Password com --vault e --reveal para service accounts
- Infográficos = Gemini sempre
- NUNCA usar emoji 🤖

---

*Última actualização: 2026-02-04 08:15 UTC*
