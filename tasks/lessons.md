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

## 🟡 Padrões a Melhorar

### P001: Usar Dream Team
Delegar tarefas complexas para sub-agentes. Uma tarefa = um agente focado.

### P002: Log em Tempo Real
Após completar trabalho significativo → IMEDIATAMENTE escrever em memory.
NÃO acumular para fim de sessão.

### P003: Verificação Visual
Para trabalho visual (dashboards, sites) → SEMPRE tirar screenshot ou verificar com browser antes de apresentar.

## ✅ Boas Práticas Estabelecidas

- PT-PT sempre, nunca BR
- Jira para tracking, nunca GitHub Issues
- 1Password com --vault e --reveal para service accounts
- Infográficos = Gemini sempre
- NUNCA usar emoji 🤖

---

*Última actualização: 2026-02-04 08:15 UTC*
