### Overview of Top Open Source Self-Hosted CRMs

For a solo entrepreneur needing multiple Kanban sales pipelines, Docker deployment on 12GB RAM VPS, REST/GraphQL APIs for n8n/Telegram integration, custom contact fields, free OSS licensing, and modern UX, the strongest matches among the listed options are **Twenty CRM**, **Atomic CRM**, **EspoCRM**, **SuiteCRM**, **Odoo Community**, and **Corteza CRM** (aka Crust CRM). Krayin CRM offers basic Kanban but lacks maturity; ERPNext is ERP-focused with weak CRM Kanban; no strong 2025-2026 newcomers like Frappe CRM fully match all criteria (limited pipeline support).[1][2][4][5]

GitHub stats reflect activity as of early 2026: Twenty (~12k stars, high momentum as "#1 OSS CRM"), Atomic CRM (marmelab repo ~8k stars, developer-focused), EspoCRM (~4k), SuiteCRM (~3.5k), Odoo (~35k total but CRM module subset), Krayin (~2k), Corteza (~2.5k), ERPNext (~18k).[1][2][4][5][8] All support self-hosted Docker (official images for most; Atomic uses Supabase backend for lightweight Docker).[1][2][4] RAM usage on 12GB VPS: lightweight (EspoCRM/Atomic/Twenty: 1-3GB), moderate (SuiteCRM/Corteza/Krayin: 3-5GB), heavy (Odoo/ERPNext: 6-10GB+ with modules).[1][2][5]

### Detailed Comparison

| CRM              | GitHub Stars | Docker RAM Usage (12GB VPS) | Kanban Quality (Multi-Pipeline) | API Quality (REST/GraphQL) | Contact Mgmt (Custom Fields) | Mobile UI | AI Features | Pros | Cons |
|------------------|--------------|-----------------------------|---------------------------------|----------------------------|------------------------------|-----------|-------------|------|------|
| **Twenty CRM**  | ~12k[8]     | 1-2GB (lightweight)[8]     | Excellent: Native multi-Kanban pipelines, drag-drop, customizable stages[1][3][8] | GraphQL/REST, n8n-friendly[3][8] | Unlimited custom fields[8]  | Modern responsive[3][8] | Basic lead scoring AI[3] | Modern Salesforce-like UX; fast setup; active community[1][3][8] | Younger ecosystem, fewer plugins[3] |
| **Atomic CRM (marmelab)** | ~8k[4] | 1-3GB (Supabase backend)[4] | Good: Customizable Kanban via React, supports multiple via config[4] | REST/GraphQL excellent (developer-first)[4] | Flexible schema custom fields[4] | Clean mobile-responsive[4] | None native (extensible)[4] | Ultra-customizable (15k LOC); SSO; easy Docker[4] | Template-like, needs dev work for full CRM[4] |
| **EspoCRM**     | ~4k[2]      | 1-2GB (lightweight)[2][4]  | Strong: Multi-pipeline Kanban, entity manager for stages[2][4] | REST API robust, GraphQL via extensions[2][4] | No-code custom fields/entities[2][4] | Functional responsive[2] | None[2] | Simple, fast, no-code custom; great for solos[2][4] | Limited reporting/plugins[2][4] |
| **Krayin CRM**  | ~2k[5]      | 2-4GB[5]                   | Basic: Single/multi Kanban for leads, Laravel-based[5] | REST API good[5]          | Unlimited custom fields[5]  | Decent modern[5] | None[5] | Flexible Laravel modules; scalable[5] | New, sparse docs/community[5] |
| **SuiteCRM**    | ~3.5k[2]    | 3-5GB[2]                   | Good: Multi-stage pipelines, Kanban view[1][2] | REST API solid[1][2]      | Custom fields via studio[1][2] | Dated but mobile-ok[1][2] | None[1][2] | Mature, free enterprise features; strong community[1][2][3] | Dated UI; tech setup needed[1][2] |
| **Odoo Community** | ~35k (total)[1][5] | 6-10GB (modular bloat)[1][5] | Excellent: Multi-Kanban pipelines, lead scoring[1][2][5] | REST/GraphQL APIs[1][2]   | Extensive custom fields[1][5] | Good responsive app[1][2] | Basic AI automation[1] | All-in-one (CRM+ERP); modular[1][2][5] | Resource-heavy; steep curve[1][2][5] |
| **ERPNext**     | ~18k[1]     | 7-10GB+ (ERP overhead)[1]  | Weak: Basic Kanban, not multi-pipeline focused[1] | REST/GraphQL[1]           | Custom doctypes[1]          | Responsive[1] | None CRM-specific[1] | Full ERP suite[1] | CRM secondary; heavy for solo[1] |
| **Corteza CRM** | ~2.5k[2]    | 3-5GB[2]                   | Moderate: Low-code Kanban, multi via pages[2] | API-first REST/GraphQL[2] | Custom fields strong[2]     | Modern low-code UI[2] | None[2] | Privacy/GDPR focus; low-code[2] | Not beginner-friendly; setup lift[2] |

### Scored Comparison Table (1-10 Scale)
Scores weighted for solo needs: multi-Kanban (20%), Docker/lightweight (20%), API/integration (15%), custom fields (15%), modern UX/mobile (15%), OSS maturity/community (15%). Max fit for 12GB VPS, n8n/Telegram, 3 pipelines.

| CRM              | Multi-Kanban | Docker/RAM Fit | API Quality | Custom Fields | Modern UX/Mobile | Maturity/Community | **Total Score** |
|------------------|--------------|----------------|-------------|---------------|------------------|--------------------|-----------------|
| **Twenty CRM**  | 10          | 10             | 9           | 10            | 10               | 9                  | **9.6**        |
| **Atomic CRM**  | 8           | 10             | 10          | 9             | 9                | 8                  | **9.0**        |
| **EspoCRM**     | 9           | 10             | 8           | 10            | 8                | 9                  | **9.0**        |
| **Krayin CRM**  | 7           | 9              | 7           | 9             | 8                | 6                  | **7.7**        |
| **SuiteCRM**    | 8           | 8              | 8           | 9             | 6                | 10                 | **8.2**        |
| **Odoo Community** | 10       | 5              | 9           | 10            | 9                | 10                 | **8.8**        |
| **ERPNext**     | 4           | 4              | 8           | 8             | 8                | 9                  | **6.3**        |
| **Corteza CRM** | 7           | 8              | 9           | 9             | 8                | 7                  | **8.0**        |

### Final Recommendation
**Twenty CRM** is the top choice (9.6/10) for your needs. It excels in modern, clean UX with native multi-Kanban pipelines for your AI consulting/therapy/resale streams, lightweight Docker (1-2GB RAM fits 12GB VPS easily), GraphQL/REST APIs for seamless n8n/Telegram bots, unlimited custom contact fields, and fully free OSS—no bloat like Odoo/ERPNext.[1][3][8] As the "#1 Open Source CRM," its 12k GitHub stars and Salesforce-like interface suit solos without SuiteCRM's dated UI or Atomic's dev-heavy customization.[3][4][8] Deploy via official Docker Compose; community reports <5min Telegram integrations via webhooks.[3][8]

Runners-up: EspoCRM (9.0) for simplest no-code setup; Atomic CRM (9.0) if you want max extensibility.[2][4] Avoid Odoo/ERPNext due to RAM strain; test Twenty first via its demo.[1][3]
