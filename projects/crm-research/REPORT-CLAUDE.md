# 🔍 Relatório Comparativo: Melhor CRM Open Source para Pequena Empresa (Fevereiro 2026)

**Contexto:** Empreendedor solo em Portugal com 3 pipelines de vendas (consultoria AI, terapia holística, revenda de produtos). VPS com 12GB RAM (~4-5GB disponíveis para CRM). Necessidades: kanban multi-pipeline, Docker self-hosted, API para n8n + Telegram bots, campos personalizados, UX moderna.

**Data da pesquisa:** 10 de Fevereiro de 2026
**Fontes:** GitHub, Marmelab Benchmark 2025/2026, CRM.org, GrowCRM, Reddit r/selfhosted, documentação oficial

---

## 📊 Tabela Resumo Rápido

| CRM | ⭐ GitHub | Licença | Docker | RAM | Multi-Pipeline | API | Score Final |
|-----|-----------|---------|--------|-----|----------------|-----|-------------|
| **Twenty CRM** | ~38k | AGPL-3.0 | ✅ Oficial | ~2-4GB | ⚠️ Limitado | GraphQL+REST+Webhooks | ⭐ 8.2/10 |
| **EspoCRM** | ~1.8k | AGPL-3.0 | ✅ Oficial | ~512MB-1GB | ✅ Nativo | REST+Webhooks | ⭐ 8.5/10 |
| **Krayin CRM** | ~12k | MIT | ✅ Oficial | ~1-2GB | ✅ Sim | REST | ⭐ 6.8/10 |
| **Frappe CRM** | ~1.8k | AGPL-3.0 | ✅ Oficial | ~2-3GB | ✅ Sim | REST+Webhooks | ⭐ 7.5/10 |
| **Atomic CRM** | ~1.5k | MIT | ✅ (Supabase) | ~500MB-1GB | ⚠️ Básico | REST (Supabase) | ⭐ 7.0/10 |
| **SuiteCRM** | ~4.5k | AGPL-3.0 | ✅ Community | ~1-2GB | ✅ Sim | REST (V8 API) | ⭐ 5.5/10 |
| **Odoo CRM** | ~39k | LGPL-3.0 | ✅ Oficial | ~2-4GB | ✅ Via Teams | REST+XML-RPC | ⭐ 6.5/10 |
| **ERPNext** | ~22k | GPL-3.0 | ✅ Oficial | ~4-6GB | ✅ Sim | REST | ⭐ 5.0/10 |
| **Corteza** | ~1.9k | Apache-2.0 | ✅ Oficial | ~1-2GB | ✅ Low-code | REST | ⭐ 5.8/10 |
| **Huly** | ~18k | EPL-2.0 | ✅ Oficial | ~4GB+ | ⚠️ CRM básico | Limitada | ⭐ 4.5/10 |

---

## 1. 🏆 Twenty CRM

**Website:** https://twenty.com | **GitHub:** https://github.com/twentyhq/twenty
**⭐ Stars:** ~38.000 | **Última actividade:** Fevereiro 2026 (muito activo)
**Licença:** AGPL-3.0 (contaminante - cuidado se modificar código)
**Tech Stack:** TypeScript, NestJS, React, PostgreSQL, Redis

### Docker & Recursos
- **Docker:** ✅ docker-compose oficial com 1-click install
- **RAM mínima:** 2GB (recomendado 4-8GB para produção com Redis + PostgreSQL)
- **Containers:** App + PostgreSQL + Redis = ~2-4GB total
- **Adequado ao VPS:** ✅ Sim, mas no limite dos 4-5GB disponíveis

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐ Kanban bonito e funcional, inspirado no Notion
- **Customização:** Drag-and-drop, filtros, agrupamento por campos, vistas guardadas
- **Multi-Pipeline:** ⚠️ **Limitação principal** - Twenty trata "Opportunities" como um único pipeline com stages. Para múltiplos pipelines independentes, seria necessário criar objectos customizados ou usar filtros avançados por tipo. Não tem conceito nativo de "múltiplos pipelines separados" como Pipedrive.

### API & Integrações
- **API:** ✅ GraphQL + REST API completa
- **Webhooks:** ✅ Nativos
- **n8n:** Possível via HTTP Request node + webhooks (sem node dedicado)
- **Telegram:** Integrável via n8n + API
- **Zapier:** Integração oficial

### Campos Personalizados
- ✅ Criação de objectos e campos custom via GUI (sem código)
- ✅ Muito flexível - podes criar entidades completamente novas

### Mobile UI
- ❌ Sem app mobile nativa
- ⚠️ Interface web responsiva básica

### AI Features
- ❌ Sem features AI nativas (por agora)

### Comunidade
- **Contributors:** 700+ no GitHub
- **Actividade:** Muito activa, commits diários
- **Discord:** Comunidade grande e responsiva
- **Issues:** Resposta em 1-3 dias

### Prós
- ✅ UX mais moderna de todos os CRMs open source
- ✅ API excelente (GraphQL + REST)
- ✅ Desenvolvimento muito activo
- ✅ Customização de objectos via GUI
- ✅ Webhooks nativos para automação
- ✅ Inspirado em Notion/Linear - UX de topo

### Contras
- ❌ AGPL-3.0 (licença contaminante)
- ❌ Multi-pipeline não é nativo de forma intuitiva
- ❌ Sem app mobile
- ❌ Codebase enorme para o feature set
- ❌ Redis obrigatório (mais RAM)
- ❌ Relativamente jovem - podem haver bugs

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 9 |
| Customização | 8 |
| Facilidade Setup | 8 |
| Uso de Recursos | 6 |
| Comunidade | 9 |
| **Média** | **8.0** |

---

## 2. 🥇 EspoCRM

**Website:** https://www.espocrm.com | **GitHub:** https://github.com/espocrm/espocrm
**⭐ Stars:** ~1.800 | **Última actividade:** Fevereiro 2026 (actualizações regulares)
**Licença:** AGPL-3.0
**Tech Stack:** PHP 8, Framework próprio, Handlebars, Bootstrap, MySQL/PostgreSQL

### Docker & Recursos
- **Docker:** ✅ Imagem oficial no Docker Hub (`espocrm/espocrm`)
- **RAM:** ~512MB-1GB (muito leve! PHP + MySQL/MariaDB)
- **Containers:** App + MariaDB = ~700MB-1.2GB total
- **Adequado ao VPS:** ✅ **PERFEITO** - o mais leve de todos!

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐ Kanban funcional com drag-and-drop
- **Customização:** Stages customizáveis por entidade
- **Multi-Pipeline:** ✅ **NATIVO!** - Via Entity Manager, podes criar múltiplos "Opportunity" types com diferentes stages. Referência do [Issue #1089](https://github.com/espocrm/espocrm/issues/1089): é possível ter múltiplos pipelines via configuração de stages por tipo/grupo.

### API & Integrações
- **API:** ✅ REST API completa e bem documentada
- **Webhooks:** ✅ Nativos (envio em eventos de criação/actualização/eliminação)
- **n8n:** ✅ Node da comunidade disponível (`@traien/n8n-nodes-espocrm`). Também funciona via HTTP Request + webhooks.
- **Telegram:** Integrável via n8n + webhooks

### Campos Personalizados
- ✅ **Entity Manager** - criar entidades, campos, relações via GUI
- ✅ Extremamente flexível sem tocar em código
- ✅ Campos de vários tipos (texto, número, enum, multi-enum, link, etc.)

### Mobile UI
- ⚠️ Interface web responsiva (funcional mas não óptima)
- Sem app nativa

### AI Features
- ❌ Sem AI nativa

### Comunidade
- **Contributors:** Projecto liderado maioritariamente por 1 developer (yurikuzn) + comunidade
- **Fórum:** Activo (forum.espocrm.com)
- **Actualizações:** Regulares (versões minor a cada 2-3 meses)
- **Extensions:** Marketplace com extensões pagas e gratuitas

### Prós
- ✅ **O mais leve em recursos** - ideal para VPS com RAM limitada
- ✅ Multi-pipeline nativo via Entity Manager
- ✅ Entity Manager poderoso (criar entidades sem código)
- ✅ REST API completa + webhooks
- ✅ n8n community node disponível
- ✅ Interface limpa e intuitiva
- ✅ Docker oficial simplíssimo
- ✅ Extensões pagas para funcionalidades avançadas
- ✅ Email sync integrado
- ✅ Workflow engine (BPM) incorporado

### Contras
- ❌ AGPL-3.0 (licença contaminante)
- ❌ Frameworks frontend/backend proprietários (difícil de modificar código profundamente)
- ❌ Documentação para developers limitada
- ❌ Projecto depende muito de 1 developer principal
- ❌ UI menos moderna que Twenty (mas funcional)
- ❌ GitHub stars baixas (subestimado!)

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 7 |
| Customização | 9 |
| Facilidade Setup | 9 |
| Uso de Recursos | 10 |
| Comunidade | 7 |
| **Média** | **8.4** |

---

## 3. Frappe CRM (Novo candidato - descoberto na pesquisa)

**Website:** https://frappe.io/crm | **GitHub:** https://github.com/frappe/crm
**⭐ Stars:** ~1.800 | **Última actividade:** Fevereiro 2026
**Licença:** AGPL-3.0
**Tech Stack:** Python (Frappe Framework), Vue.js, MariaDB

### Docker & Recursos
- **Docker:** ✅ Script de deploy oficial + docker-compose
- **RAM:** ~2-3GB (Frappe framework + MariaDB + Redis)
- **Adequado ao VPS:** ✅ No limite, mas possível

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐ Kanban moderno com drag-and-drop
- **Multi-Pipeline:** ✅ Suporta múltiplas vistas e pipelines

### API & Integrações
- **API:** ✅ REST API via Frappe Framework (completa)
- **Webhooks:** ✅ Nativos no Frappe
- **n8n:** Via HTTP Request
- **Telegram:** Integração WhatsApp nativa via Frappe WhatsApp
- **Twilio:** Integração nativa para chamadas

### Campos Personalizados
- ✅ Via Frappe Framework (Customize Form)

### Mobile UI
- ⚠️ Responsiva (baseada em Frappe UI - Vue)

### AI Features
- ❌ Básico

### Prós
- ✅ UX moderna e bonita (Vue.js)
- ✅ Integração nativa com WhatsApp e Twilio
- ✅ Pode integrar com ERPNext para facturação
- ✅ Framework Frappe maduro e bem documentado
- ✅ Kanban excelente

### Contras
- ❌ Dependente do ecossistema Frappe (curva de aprendizagem)
- ❌ Setup mais complexo
- ❌ AGPL-3.0
- ❌ Comunidade menor que Twenty
- ❌ Mais pesado que EspoCRM

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 8 |
| Customização | 7 |
| Facilidade Setup | 6 |
| Uso de Recursos | 6 |
| Comunidade | 7 |
| **Média** | **6.8** |

---

## 4. Krayin CRM

**Website:** https://krayincrm.com | **GitHub:** https://github.com/krayin/laravel-crm
**⭐ Stars:** ~12.000 | **Última actividade:** Janeiro 2026
**Licença:** MIT (não contaminante! 👍)
**Tech Stack:** PHP 8, Laravel, Vue.js, MySQL

### Docker & Recursos
- **Docker:** ✅ Imagem oficial + docker-compose
- **RAM:** ~1-2GB (Laravel + MySQL)
- **Adequado ao VPS:** ✅ Sim

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐ Kanban funcional mas com UX datada
- **Multi-Pipeline:** ✅ Múltiplos pipelines de vendas com stages independentes

### API & Integrações
- **API:** ✅ REST API
- **Webhooks:** ⚠️ Básico
- **n8n:** Via HTTP Request
- **Extensões pagas:** WhatsApp, VoIP, Multi-tenant SaaS

### Campos Personalizados
- ✅ Custom Attributes via GUI

### Mobile UI
- ⚠️ Responsiva mas com problemas de usabilidade

### AI Features
- ⚠️ Integração OpenRouter.ai para AI

### Prós
- ✅ **Licença MIT** - total liberdade
- ✅ Multi-pipeline nativo
- ✅ Laravel ecosystem (familiar para PHP devs)
- ✅ Muitas stars no GitHub
- ✅ Extensão WhatsApp disponível (paga)

### Contras
- ❌ UX frustante e lenta (feedback do benchmark Marmelab 2026)
- ❌ Baixa densidade de informação na UI
- ❌ Sem testes unitários
- ❌ Performance subpar
- ❌ Extensões importantes são pagas
- ❌ Mobile UI problemática

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 5 |
| Customização | 7 |
| Facilidade Setup | 8 |
| Uso de Recursos | 8 |
| Comunidade | 7 |
| **Média** | **7.0** |

---

## 5. Atomic CRM

**Website:** https://marmelab.com/atomic-crm | **GitHub:** https://github.com/marmelab/atomic-crm
**⭐ Stars:** ~1.500 | **Última actividade:** Fevereiro 2026
**Licença:** MIT (não contaminante! 👍)
**Tech Stack:** React, shadcn/ui, Supabase, PostgreSQL

### Docker & Recursos
- **Docker:** ✅ Via Supabase local (Docker)
- **RAM:** ~500MB-1GB (muito leve - apenas 15k LOC!)
- **Adequado ao VPS:** ✅ Excelente

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐ Kanban bonito (shadcn/ui)
- **Multi-Pipeline:** ⚠️ Pipeline único por defeito (customizável via código)

### API & Integrações
- **API:** ✅ REST via Supabase (automática para todas as tabelas)
- **Webhooks:** ⚠️ Via Supabase Edge Functions
- **n8n:** Via Supabase API + HTTP Request
- **MCP Server:** ✅ Para integração com AI!

### Campos Personalizados
- ⚠️ Requer código (não tem GUI de administração)

### Mobile UI
- ✅ Boa UI mobile (shadcn responsivo)

### AI Features
- ✅ MCP Server para integração AI

### Prós
- ✅ **Codebase mínimo** - 15k LOC (fácil de personalizar)
- ✅ Licença MIT
- ✅ Stack moderno (React + Supabase)
- ✅ SSO incluído (Google, Azure, Keycloak, Auth0)
- ✅ MCP Server para AI
- ✅ Boa UI mobile

### Contras
- ❌ Funcionalidades básicas (sem email sync, sem workflow)
- ❌ Campos custom requerem código
- ❌ Comunidade muito pequena
- ❌ Sem conectores third-party
- ❌ Multi-pipeline requer customização
- ❌ Dependente de Supabase

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 8 |
| Customização | 6 |
| Facilidade Setup | 7 |
| Uso de Recursos | 9 |
| Comunidade | 4 |
| **Média** | **6.8** |

---

## 6. SuiteCRM

**Website:** https://suitecrm.com | **GitHub:** https://github.com/salesagility/SuiteCRM
**⭐ Stars:** ~4.500 | **Última actividade:** 2025-2026
**Licença:** AGPL-3.0
**Tech Stack:** PHP 8, Smarty, jQuery, MySQL/MariaDB

### Docker & Recursos
- **Docker:** ✅ Via Bitnami e imagens community (sem oficial do projecto)
- **RAM:** ~1-2GB
- **Adequado ao VPS:** ✅ Sim

### Kanban Pipeline
- **Qualidade:** ⭐⭐ Interface datada, mais lista que kanban
- **Multi-Pipeline:** ✅ Sim, via módulos

### API & Integrações
- **API:** ✅ REST API (V8 em SuiteCRM 8)
- **Webhooks:** ⚠️ Via Logic Hooks (mais complexo)
- **n8n:** Possível via API

### Campos Personalizados
- ✅ Module Builder e Studio (via GUI)

### Mobile UI
- ❌ Muito fraca

### AI Features
- ⚠️ Em desenvolvimento (SuiteCRM 8)

### Prós
- ✅ Feature-rich (marketing, casos, workflow)
- ✅ Comunidade grande e madura
- ✅ Herança do SugarCRM (muitos plugins)
- ✅ Module Builder poderoso

### Contras
- ❌ **UI completamente datada** - parece 2010
- ❌ Codebase legacy (jQuery, Smarty)
- ❌ Performance lenta
- ❌ Mobile horrível
- ❌ Curva de aprendizagem alta
- ❌ Docker não oficial

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 3 |
| Customização | 8 |
| Facilidade Setup | 5 |
| Uso de Recursos | 7 |
| Comunidade | 8 |
| **Média** | **6.2** |

---

## 7. Odoo CRM (Community Edition)

**Website:** https://odoo.com | **GitHub:** https://github.com/odoo/odoo
**⭐ Stars:** ~39.000 | **Última actividade:** Fevereiro 2026 (muito activo)
**Licença:** LGPL-3.0 (não contaminante para dynamic linking)
**Tech Stack:** Python, OWL (JS in-house), PostgreSQL

### Docker & Recursos
- **Docker:** ✅ Imagem oficial (`odoo` no Docker Hub)
- **RAM:** ~2-4GB (recomendado 2GB mínimo)
- **Adequado ao VPS:** ⚠️ Possível mas no limite

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐ Kanban excelente com drag-and-drop
- **Multi-Pipeline:** ✅ **Via Sales Teams** - cada equipa pode ter stages/pipeline diferentes. Solução elegante: criar "AI Consulting Team", "Holistic Therapy Team", "Product Resale Team".

### API & Integrações
- **API:** ✅ REST + XML-RPC
- **Webhooks:** ⚠️ Apenas via módulos custom ou Automated Actions
- **n8n:** ✅ Node oficial do n8n para Odoo!

### Campos Personalizados
- ✅ Sim, via Studio (Edition Enterprise) ou código (Community)

### Mobile UI
- ✅ App mobile oficial (mas limitada na Community Edition)

### AI Features
- ⚠️ Apenas na Enterprise Edition

### Prós
- ✅ Ecossistema massivo (CRM + facturação + inventário + website)
- ✅ Multi-pipeline nativo via Sales Teams
- ✅ Node oficial no n8n
- ✅ Kanban excelente
- ✅ Comunidade enorme
- ✅ Licença LGPL (menos restritiva)

### Contras
- ❌ **Complexidade massiva** - é um ERP inteiro, não apenas CRM
- ❌ Community Edition limitada (Studio, AI, etc. são Enterprise)
- ❌ Curva de aprendizagem muito alta
- ❌ Actualizações difíceis
- ❌ Framework JS proprietário (OWL)
- ❌ Pesado para um solo entrepreneur
- ❌ Custom fields na Community requerem código

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 7 |
| Customização | 5 (Community) |
| Facilidade Setup | 5 |
| Uso de Recursos | 5 |
| Comunidade | 10 |
| **Média** | **6.4** |

---

## 8. ERPNext

**Website:** https://erpnext.com | **GitHub:** https://github.com/frappe/erpnext
**⭐ Stars:** ~22.000 | **Última actividade:** Fevereiro 2026
**Licença:** GPL-3.0
**Tech Stack:** Python, Frappe Framework, MariaDB, Redis

### Docker & Recursos
- **Docker:** ✅ Via Frappe Docker (complexo)
- **RAM:** ~4-6GB mínimo (Frappe + MariaDB + Redis + múltiplos workers)
- **Adequado ao VPS:** ❌ **NÃO** - ultrapassa os 4-5GB disponíveis!

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐ Funcional mas genérico
- **Multi-Pipeline:** ✅ Customizável

### API & Integrações
- **API:** ✅ REST API via Frappe
- **Webhooks:** ✅ Nativos

### Prós
- ✅ ERP completo (contabilidade, inventário, HR)
- ✅ Comunidade grande

### Contras
- ❌ **Demasiado pesado para o use case** (4-6GB RAM)
- ❌ Setup extremamente complexo
- ❌ Overkill para CRM simples
- ❌ Curva de aprendizagem enorme

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 6 |
| Customização | 7 |
| Facilidade Setup | 3 |
| Uso de Recursos | 2 |
| Comunidade | 8 |
| **Média** | **5.2** |

---

## 9. Corteza (ex-Crust CRM)

**Website:** https://cortezaproject.org | **GitHub:** https://github.com/cortezaproject/corteza
**⭐ Stars:** ~1.900 | **Última actividade:** Dezembro 2025
**Licença:** Apache-2.0 (não contaminante! 👍)
**Tech Stack:** Go (backend), Vue.js (frontend), PostgreSQL

### Docker & Recursos
- **Docker:** ✅ Docker oficial
- **RAM:** ~1-2GB
- **Adequado ao VPS:** ✅ Sim

### Kanban Pipeline
- **Qualidade:** ⭐⭐ Low-code - tens de construir tu mesmo
- **Multi-Pipeline:** ✅ Totalmente customizável (é uma plataforma low-code)

### API & Integrações
- **API:** ✅ REST API completa
- **Webhooks:** ✅ Via automações
- **n8n:** Via HTTP Request

### Prós
- ✅ Licença Apache-2.0 (a melhor!)
- ✅ Plataforma low-code flexível
- ✅ Go backend (rápido e leve)
- ✅ Pode construir CRM totalmente customizado

### Contras
- ❌ **Não é um CRM pronto** - é uma plataforma para construir um
- ❌ Curva de aprendizagem alta
- ❌ Comunidade pequena
- ❌ Documentação limitada
- ❌ Desenvolvimento parece ter abrandado
- ❌ Precisas construir tudo (pipelines, dashboards, etc.)

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 4 |
| Customização | 9 |
| Facilidade Setup | 5 |
| Uso de Recursos | 8 |
| Comunidade | 4 |
| **Média** | **6.0** |

---

## 10. Huly

**Website:** https://huly.io | **GitHub:** https://github.com/hcengineering/platform
**⭐ Stars:** ~18.000 | **Última actividade:** Fevereiro 2026 (muito activo)
**Licença:** EPL-2.0
**Tech Stack:** TypeScript, Svelte, MongoDB, MinIO

### Docker & Recursos
- **Docker:** ✅ Via huly-selfhost
- **RAM:** ~4GB+ (recomendado 4GB RAM + 2 vCPU)
- **Adequado ao VPS:** ⚠️ Pesado - 5+ databases/serviços (MongoDB, MinIO, Elastic, etc.)

### Kanban Pipeline
- **Qualidade:** ⭐⭐⭐⭐⭐ O melhor kanban de todos (é um PM tool)
- **CRM Module:** ⚠️ CRM é módulo secundário - foco é Project Management

### API & Integrações
- **API:** ⚠️ API limitada/não documentada para CRM
- **Webhooks:** ⚠️ GitHub sync, não webhooks genéricos

### Prós
- ✅ UI linda e moderna
- ✅ Chat integrado
- ✅ Project Management excelente
- ✅ Comunidade activa

### Contras
- ❌ **Não é um CRM dedicado** - CRM é módulo secundário
- ❌ Pesado (5+ serviços Docker)
- ❌ API CRM limitada
- ❌ Sem multi-pipeline de vendas real
- ❌ Sem campos custom para contactos
- ❌ Sem webhooks para automação CRM

### Scores (1-10)
| Critério | Score |
|----------|-------|
| UX | 9 |
| Customização | 3 |
| Facilidade Setup | 4 |
| Uso de Recursos | 3 |
| Comunidade | 8 |
| **Média** | **5.4** |

---

## 📊 Ranking Final por Critério

### Por UX (Interface)
1. 🥇 Twenty CRM (9/10)
2. 🥈 Huly (9/10) - mas não é CRM
3. 🥉 Frappe CRM / Atomic CRM (8/10)

### Por Customização
1. 🥇 EspoCRM (9/10)
2. 🥈 Corteza (9/10) - mas requer construir tudo
3. 🥉 Twenty CRM / SuiteCRM (8/10)

### Por Facilidade de Setup
1. 🥇 EspoCRM (9/10) - docker-compose e pronto
2. 🥈 Twenty CRM / Krayin (8/10)
3. 🥉 Atomic CRM (7/10)

### Por Uso de Recursos (RAM)
1. 🥇 EspoCRM (10/10) - ~700MB total!
2. 🥈 Atomic CRM (9/10) - ~500MB-1GB
3. 🥉 Corteza / Krayin (8/10)

### Por Comunidade
1. 🥇 Odoo (10/10) - a maior comunidade
2. 🥈 Twenty CRM (9/10)
3. 🥉 ERPNext / Huly / SuiteCRM (8/10)

---

## 🎯 RECOMENDAÇÃO FINAL

### 🏆 1º Lugar: EspoCRM — A Escolha Mais Inteligente

**Score Final: 8.4/10**

**Porquê o EspoCRM vence para este use case específico:**

1. **Multi-Pipeline Nativo** 🎯 — Podes criar pipelines independentes (AI Consulting, Terapia Holística, Revenda) com stages diferentes cada um. É exactamente o que precisas.

2. **O Mais Leve** 💪 — Com ~700MB-1.2GB total (PHP + MariaDB), deixa espaço de sobra no VPS de 4-5GB para n8n, Telegram bots, e outros serviços.

3. **API REST + Webhooks** 🔌 — REST API completa documentada + webhooks nativos. Community node para n8n já existe. Integração com Telegram via n8n é directa.

4. **Entity Manager** 🛠️ — Campos personalizados, entidades customizadas, relações - tudo via GUI sem tocar em código.

5. **Docker Oficial Simples** 🐳 — `docker-compose up` e tens o CRM a funcionar em 5 minutos.

6. **Custo Zero** 💰 — Totalmente gratuito para self-hosting. Extensões pagas opcionais para features avançadas.

7. **Workflow/BPM Engine** ⚡ — Automação de processos integrada (enviar emails, criar tarefas automaticamente, etc.)

8. **Email Sync** 📧 — Sincronização de email integrada (IMAP).

### 🥈 2º Lugar: Twenty CRM — Se a UX é Prioridade

**Score Final: 8.0/10**

Escolhe o Twenty se:
- A beleza da interface é crítica para ti
- Não precisas de multi-pipeline nativo (podes simular com filtros)
- Tens 4GB+ disponíveis para o CRM
- Queres GraphQL API
- Valorizas uma comunidade grande e activa

### 🥉 3º Lugar: Krayin CRM — Se Queres Licença MIT

**Score Final: 7.0/10**

Escolhe o Krayin se:
- A licença MIT é importante (sem restrições AGPL)
- Conheces bem Laravel/PHP
- Aceitas uma UX menos polida
- Precisas de multi-pipeline nativo

---

## 📋 Setup Recomendado (EspoCRM)

```yaml
# docker-compose.yml para EspoCRM
version: '3.8'
services:
  espocrm-db:
    image: mariadb:latest
    container_name: espocrm-db
    environment:
      MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MARIADB_DATABASE: espocrm
      MARIADB_USER: espocrm
      MARIADB_PASSWORD: ${DB_PASSWORD}
    volumes:
      - espocrm-db:/var/lib/mysql
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M

  espocrm:
    image: espocrm/espocrm
    container_name: espocrm
    environment:
      ESPOCRM_DATABASE_PLATFORM: Mysql
      ESPOCRM_DATABASE_HOST: espocrm-db
      ESPOCRM_DATABASE_USER: espocrm
      ESPOCRM_DATABASE_PASSWORD: ${DB_PASSWORD}
      ESPOCRM_ADMIN_USERNAME: admin
      ESPOCRM_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      ESPOCRM_SITE_URL: https://crm.teudominio.pt
    volumes:
      - espocrm-data:/var/www/html
    ports:
      - "8080:80"
    restart: always
    depends_on:
      - espocrm-db
    deploy:
      resources:
        limits:
          memory: 512M

volumes:
  espocrm-db:
  espocrm-data:
```

### Próximos Passos Após Instalação:
1. **Criar 3 Pipelines:** Admin > Entity Manager > Opportunity > criar campo "Pipeline Type" (enum: AI Consulting, Holistic Therapy, Product Resale) com stages diferentes
2. **Configurar Webhooks:** Admin > Webhooks > criar para eventos de Opportunity (create, update)
3. **n8n Integration:** Instalar node `@traien/n8n-nodes-espocrm` ou usar HTTP Request com API key
4. **Telegram Bot:** n8n workflow: Webhook EspoCRM → Process → Telegram Bot API
5. **Campos Custom:** Entity Manager > Contact > Add Field (tipo empresa, segmento, fonte, etc.)

---

*Relatório gerado a 10 de Fevereiro de 2026 por pesquisa profunda de 10+ CRMs open source.*
*Fontes: GitHub, Marmelab Benchmark 2025/2026, CRM.org, Reddit r/selfhosted, documentação oficial de cada projecto.*
