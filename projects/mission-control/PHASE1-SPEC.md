# PHASE 1 — Expense Awareness Features

## Context
- Dashboard: Next.js 14 App Router, Tailwind CSS, Recharts, Lucide icons
- DB: PostgreSQL (Neon) via `src/lib/db.ts`
- Tables: `midas_transactions`, `midas_categories`, `midas_budgets`, `midas_accounts`, `midas_goals`
- Existing API: `src/app/api/dashboard/route.ts` (already filters source IN millennium/revolut/manual)
- Current page: `src/app/page.tsx` (841 lines, single-page dashboard)
- Style: Dark mode, glassmorphism, violet/purple palette (#8b5cf6 primary)
- DO NOT touch `src/lib/db.ts` — it already works

## DB Schema for Budgets
```sql
midas_budgets: id, category_id (FK → midas_categories.id), month_year (varchar '2026-02'), budget_amount (numeric), alert_threshold (numeric 0-1), created_at
```

There are 32 budgets already inserted for '2026-02'.

## New Features to Add

### 1. API: `/api/budgets/route.ts` (NEW)
Query that returns budget vs actual for current month:
```sql
SELECT b.id, c.name as category, b.budget_amount as budget,
  COALESCE(SUM(ABS(t.amount)), 0) as spent,
  b.alert_threshold
FROM midas_budgets b
JOIN midas_categories c ON b.category_id = c.id
LEFT JOIN midas_transactions t ON t.category_id = b.category_id
  AND t.type = 'expense'
  AND t.date >= DATE_TRUNC('month', CURRENT_DATE)
  AND t.date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  AND (t.source IS NULL OR t.source IN ('millennium', 'revolut', 'manual'))
WHERE b.month_year = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
GROUP BY b.id, c.name, b.budget_amount, b.alert_threshold
ORDER BY spent DESC;
```

### 2. "Quanto Posso Gastar" Widget (TOP of dashboard, before KPIs)
- Large prominent card with glassmorphism
- Shows: Total Budget Month − Total Spent = **€X disponível**
- Sub-info: "€Y por dia restante" (divide by remaining days in month)
- Color: Green if >30%, Yellow if 10-30%, Red if <10%
- Icon: Wallet

### 3. Budget Progress Bars Section (NEW section after KPIs)
- Title: "Orçamento por Categoria"
- Grid of budget items (2 cols on desktop, 1 on mobile)
- Each item: Category name | Progress bar | €spent / €budget
- Bar colors: Green (<75%), Yellow (75-90%), Red (>90%), Pulsing red (>100%)
- Only show categories that have budgets (32 items → group by parent: Alimentação, Habitação, etc.)
- Collapsible groups by parent category (first word before " - ")

### 4. Fixed vs Variable Split (add to KPI row)
- New KPI card: "Despesas Fixas" — sum of categories: Renda, Crédito Pessoal, Cartão Crédito, Pensão Noah, Impostos, Seguro, Telecomunicações, Ginásio, Streaming, Comissões
- New KPI card: "Despesas Variáveis" — everything else
- These replace the less useful existing cards if needed

### 5. Update Dashboard API
Add budget data to the existing `/api/dashboard/route.ts` response:
- `budgets`: array from the query above
- `totalBudget`: sum of all budget_amounts
- `totalSpent`: sum of all spent
- `fixedExpenses`: sum of fixed categories
- `variableExpenses`: sum of variable categories

### 6. Spending Insights (simple version)
At the bottom, a card "💡 Insights" with auto-generated text:
- Top 3 biggest categories this month
- Any category over budget (red alert)
- Categories approaching limit (>75%)
- Compare: "Alimentação: €X gasto de €Y (Z%)"

## Style Guidelines
- Keep existing glassmorphism dark style
- Use existing `glass-card`, `kpi-card` CSS classes
- Progress bars: rounded, with gradient fills
- Animations: fade-in-up like existing cards
- Mobile responsive (grid cols adjust)
- PORTUGUESE labels everywhere

## Important
- Keep ALL existing features working (KPIs, charts, accounts, goals, transactions modal, sync)
- Add new sections BETWEEN existing ones logically
- The "Quanto posso gastar" widget goes at the VERY TOP
- Budget bars go after KPIs, before the charts section
