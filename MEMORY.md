# MEMORY.md - Memória de Longo Prazo

> Última atualização: 2026-02-11

## ⚠️ NOTA IMPORTANTE
**Estamos em 2026, não 2025!** Usar sempre 2026 como ano actual.

---

## 🎯 Contexto Atual

### Bilal
- A vender casa em Almada (Monte da Caparica)
- Vive em Sintra com Daniela
- Noah (15 anos) - custódia quartas + fins de semana alternados
- Dual career: terapia holística + AiParaTi (consultoria IA)
- Meta: 200k€/ano
- **NUNCA usar emoji 🤖 (robot)!** Bilal odeia. Gravar para sempre.

### Projectos Activos (Fev 2026)

| Projecto | Cliente | Estado | Prioridade | Notas |
|----------|---------|--------|------------|-------|
| **BooknGo** | Interno | 🔨 85/100 | 🥇 HIGH | Bilal pediu ir para produção. Falta i18n (8 componentes, ~8-10h) |
| **IVA Inteligente** | Interno | 🔨 ~90% | 🥇 HIGH | Bilal pediu finalizar. Lovable auto-deploy, Supabase |
| **Twenty CRM** | Interno | ✅ Deployed | 🥈 MED | crm.aiparati.pt - Pipelines e Google OAuth pendentes |
| **Aurora Oceano** | Paula | 🔄 Activo | 🥈 MED | Dashboard + bot Moloni. PRODUTO PARA VENDER (não interno!) |
| **AITI Stack** | Fernando | 🔨 Demos | 🥈 MED | 3 repos (automation, assistant, insights) + landing |
| **Leni Bot** | Hélène | ✅ Funcional | 🟢 LOW | @LeniAssistenteBot, modelo kimi-coding/k2p5 |
| **Mission Control** | Interno | ✅ Deployed | 🟢 LOW | Finanças pessoais, Neon DB |
| **MDH Training** | Interno | ✅ Deployed | ✅ Done | mdh-training.vercel.app |

### Projectos Parados
- **AI Sales Agent** - Conceito, não prioritário agora
- **Brand Brief Helder** - Aguarda resposta
- **NML Turismo** - Sem updates recentes
- **TA Consulting** - Fernando, PRDs prontos, demos criadas

---

## 💻 Infraestrutura

### VPS OVH (Principal)
- **IP:** 137.74.112.68
- **Specs:** 6 vCPU, 12GB RAM (82% usado!), 96GB disk (60%), 8GB swap
- **OS:** Linux 6.11.0-19-generic (x64)
- **Uptime:** 14+ dias
- **Node:** v25.5.0 (nvm)

### Serviços Activos
| Serviço | URL | Stack |
|---------|-----|-------|
| **OpenClaw** | 127.0.0.1:3001 (local only) | v2026.2.6-3 |
| **Twenty CRM** | crm.aiparati.pt | Docker (server+worker+db+redis) |
| **Caddy** | Reverse proxy | crm.aiparati.pt → :3000, IP → :48491 |
| **n8n (Hostinger)** | n8n.srv944224.hstgr.cloud | 105 workflows |

### URLs Deployed (Todos 200 OK)
- https://crm.aiparati.pt (Twenty CRM)
- https://aurora-analytics.vercel.app (Dashboard principal Aurora)
- https://aiti-demo.vercel.app (Landing Fernando)
- https://mdh-training.vercel.app (Curso MDH)
- https://mission-control-delta-ten.vercel.app (Finanças)
- https://aurora-oceano-dashboard.vercel.app (Dashboard simplificado)

### Docker (Twenty CRM)
- Containers: twenty-server, twenty-worker, twenty-db (Postgres 16), twenty-redis
- Dir: ~/twenty-crm/
- Docker access: `systemd-run --user --scope sg docker` (bypass seccomp)
- Script: `/home/ubuntu/clawd/scripts/docker-run.sh`
- Admin: bilal.machraa@mail.com

### TTS Configurado
- **Provider actual:** Edge TTS (grátis, ilimitado)
- **ElevenLabs:** Sem créditos, reset 28 Fev (cron configurado)
- Jarvis/Aurora/Midas: `pt-PT-DuarteNeural`
- Leni: `pt-BR-FranciscaNeural`
- Modo: `tagged` (agente controla via `[[tts:text]]`)

### AI Models Disponíveis
- **OpenClaw:** Claude Opus 4.6 (default), Haiku 4.5, Kimi K2.5
- **Antigravity:** Claude Opus 4.5, Gemini 3 Pro (grátis via OAuth)
- **Gemini CLI:** v0.27.0, autenticado

---

## 🤖 Ecossistema Multi-Bot

| Bot | Plataforma | Modelo | Estado |
|-----|-----------|--------|--------|
| **Jarvis** | Telegram @jarvis | Claude Opus 4.6 | ✅ Principal |
| **Aurora Oceano** | Telegram | Claude Haiku 4.5 | ✅ Activo (Moloni sync diário) |
| **Leni** | Telegram @LeniAssistenteBot | Kimi K2.5 | ✅ Funcional |
| **Midas** | Telegram | Haiku | 🔄 Config |

### Dream Team (17 agentes)
- **Core (10):** ATLAS, FORGE, CIPHER, CODER, NOVA, VORTEX, PIXEL, NEXUS, SENTINEL, GUARDIAN
- **Produto (5):** BOOKNGO, CONDOASSIST, MARIAFAZ, FUNDOSPT, IVAZEN
- **Growth (2):** MARKETER, SALES

---

## 📅 Timeline Recente

### 2026-02-10
- Twenty CRM: Google OAuth configurado (API interception trick)
- Bilal pediu: BooknGo produção, IVA finalizar, auto-research, análise leads
- BooknGo clonado e analisado (85/100, falta i18n)
- IVA Inteligente clonado e analisado (~pronto)
- Aurora = PRODUTO PARA VENDER (para Paula, congelados)

### 2026-02-09
- Leni Bot configurada end-to-end (@LeniAssistenteBot)
- MDH Training site deployed (Vercel)
- Aurora dashboard confusão (5 versões!) → PRINCIPAL = aurora-analytics
- TTS migrado para Edge TTS (ElevenLabs sem créditos)

### 2026-02-08
- Mission Control v2.0 deployed (Neon DB + 1487 transacções reais)
- Phases 8-9 OpenClaw upgrade (crons Haiku, Claude Code hooks)
- Pesquisa gerador MXR2300 para Bilal

### 2026-02-07
- Mission Control API criada (5 endpoints, Neon DB)

### 2026-02-04
- 3 MVPs AITI criados overnight (automation, assistant, insights)
- AITI Demo landing deployed
- Moloni password grant implementado (token nunca mais expira)
- Antigravity + Gemini CLI configurados
- Dream Team expandida para 17 agentes

---

## 🧠 Lições Aprendidas (Resumo)

### Comunicação
- PT-PT sempre, nunca BR
- Prefere visualizações e gráficos
- Valoriza questionamento crítico
- NUNCA emoji 🤖

### Trabalho
- Revenue > Infrastructure (L014)
- Fechar antes de abrir (L011)
- Weekly delivery target: ≥2 entregas visíveis (L012)
- Verificar antes de entregar (L001)
- Não assumir, pesquisar primeiro (L002)
- MVP = algo que se vê e usa, não só código (L006)

### Técnico
- Stack: n8n, Claude, Next.js, Supabase, Lovable
- Moloni: password grant > refresh token (L007)
- Datas SEMPRE dinâmicas (L008)
- Uma versão canónica de cada coisa (L009)
- Infográficos = Gemini sempre (nunca SVG manual)
- 1Password: SEMPRE --vault "Jarvis Secrets" --reveal

---

## 🔗 Pessoas Importantes

| Pessoa | Relação | Notas |
|--------|---------|-------|
| Noah | Filho | 15 anos, quartas + weekends alternados |
| Daniela Alves | Companheira | Terapeuta, ASHAMA Sintra |
| Hélène Abiassi | Mãe | Helena Academia, Brasil. Bot Leni criado. |
| Majda | Irmã | - |
| Amorim | Irmão | - |
| Paulo Gaudêncio | Parceiro | Co-apresentador workshops |
| Fernando Basto | Cliente | TA Consulting, parceria AITI |
| Helder | Colaborador | Branding AiParaTi |
| Luis Sombreireiro | CTO | Telegram 537506411, reports diários 18h |
| Paula | Cliente | Aurora Oceano (congelados), Moloni |

---

## 📊 Crons Activos (16 jobs)

### Diários
| Hora (Lisbon) | Job | Modelo |
|---------------|-----|--------|
| 03:00 | Auto-Evolução | Opus 4.6 |
| 06:00 | Aurora Moloni Sync | Haiku |
| 06:00 UTC | Security Check | Haiku |
| 07:30 | AI Intel Scan | Haiku |
| 08:00 | Bom Dia Briefing | Haiku |
| 08:30 | Email Digest | Haiku |
| 09:00 | Helena Orders | Haiku |
| 09:30 | Relatório Matinal | Haiku |
| 18:00 | Daily Wrap + CTO | Haiku |
| 23:00 | Memory Brain Sync | Haiku |

### Semanais
- Dom 04:00: Memory Cleanup
- Dom 05:00: Dependency Audit
- Dom 10:00: Sugestões Automação
- Seg 10:00: Cost Report

### One-shot
- 28 Fev: ElevenLabs Reset Check

---

## 🔴 ALERTA: Revenue Emergency

**GOALS.md diz: "3 clientes IVAzen pagantes" até fim de Fevereiro.**
**Realidade: 0 clientes, 0 outreach, 0 marketing materials.**

Estamos a 11 Fev. Faltam 17 dias. URGÊNCIA MÁXIMA.

---

*Este ficheiro é a minha memória de longo prazo. Actualizado semanalmente.*
