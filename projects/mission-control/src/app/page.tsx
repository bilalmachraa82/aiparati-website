'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Target,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Calendar,
  CalendarDays,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Loader2,
  Zap,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Coffee,
  Smartphone,
  HeartPulse,
  Plane,
  GraduationCap,
  Gift,
  MoreHorizontal,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Repeat,
  Store,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// ============================================================
// INTERFACES
// ============================================================

interface Account {
  id: number;
  name: string;
  bank: string;
  balance: number;
  currency: string;
  lastSync: string;
}

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string | null;
  priority: string;
  status: string;
  progress: number;
}

interface BudgetItem {
  id: number;
  category: string;
  budget: number;
  spent: number;
  alertThreshold: number;
}

interface MerchantItem {
  merchant: string;
  transactions: number;
  total: number;
  firstSeen: string;
  lastSeen: string;
}

interface SubscriptionItem {
  name: string;
  occurrences: number;
  avgAmount: number;
  lastCharge: string;
  firstCharge: string;
  confirmedRecurring: boolean;
}

interface TrendsData {
  monthly: { month: string; label: string; income: number; expenses: number }[];
  categoryChanges: { category: string; current: number; previous: number; change: number }[];
  months: string[];
}

interface DashboardData {
  view: string;
  period: { start: string; end: string; label: string };
  balance: number;
  income: number;
  expenses: number;
  previousExpenses: number;
  expenseTrend: number;
  savingsRate: number;
  expensesByCategory: { category: string; total: number }[];
  recentTransactions: { id: number; description: string; amount: number; type: string; category: string; date: string }[];
  accounts: Account[];
  goals: Goal[];
}

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });

const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });

function cleanMerchantName(name: string): string {
  if (!name) return 'Desconhecido';
  let cleaned = name;
  if (/PAG\s*SERV.*BANCO\s*COMERCIAL/i.test(cleaned)) return 'Pagamento BCP';
  if (/REGULARIZA.*INCUMPRIMENTO/i.test(cleaned)) return 'Regularizacao Incumprimento';
  if (/TRF\s*MB\s*WAY\s*P\s*/i.test(cleaned)) {
    const person = cleaned.replace(/TRF\s*MB\s*WAY\s*P\s*/i, '').trim();
    return `MB Way - ${person.substring(0, 20)}`;
  }
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/\d{10,}/g, '').trim();
  if (cleaned.length > 30) cleaned = cleaned.substring(0, 30) + '...';
  return cleaned || 'Desconhecido';
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  'Alimentacao': Utensils,
  'Alimentação': Utensils,
  'Supermercado': ShoppingBag,
  'Restaurantes': Coffee,
  'Restauração': Coffee,
  'Habitacao': Home,
  'Habitação': Home,
  'Transporte': Car,
  'Transportes': Car,
  'Saude': HeartPulse,
  'Saúde': HeartPulse,
  'Educacao': GraduationCap,
  'Educação': GraduationCap,
  'Entretenimento': Gift,
  'Lazer': Gift,
  'Viagens': Plane,
  'Tecnologia': Smartphone,
  'Compras': ShoppingBag,
  'Servicos': CreditCard,
  'Serviços': CreditCard,
  'Finanças': DollarSign,
  'Financas': DollarSign,
};

const getCategoryIcon = (category: string) => {
  if (!category) return MoreHorizontal;
  const simpleCat = category.split(' - ')[0].trim();
  return categoryIcons[simpleCat] || MoreHorizontal;
};

const CHART_COLORS = [
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
];

const priorityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

// ============================================================
// KPICard
// ============================================================

function KPICard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  trendValue,
  gradient,
  delay,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className="glass-card kpi-card p-6 fade-in-up"
      style={{ animationDelay: `${delay || 0}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`icon-container ${gradient}`}>
          <Icon size={24} color="white" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

// ============================================================
// GoalCard
// ============================================================

function GoalCard({ goal }: { goal: Goal }) {
  const daysUntilDeadline = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: priorityColors[goal.priority] || '#8b5cf6' }}
          />
          <h3 className="text-sm font-medium text-white">{goal.name}</h3>
        </div>
        {goal.status === 'completed' && (
          <CheckCircle2 size={18} className="text-green-400" />
        )}
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">{formatCurrency(goal.current)}</span>
          <span className="text-white font-medium">{formatCurrency(goal.target)}</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${goal.progress}%`,
              background: `linear-gradient(90deg, ${priorityColors[goal.priority] || '#8b5cf6'}, #a855f7)`,
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{goal.progress.toFixed(0)}% completo</span>
        {daysUntilDeadline !== null && (
          <span className={`${daysUntilDeadline < 30 ? 'text-amber-400' : 'text-gray-500'}`}>
            {daysUntilDeadline > 0 ? `${daysUntilDeadline} dias restantes` : 'Prazo expirado'}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TransactionsModal
// ============================================================

function TransactionsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    } else {
      setPage(1);
      setTransactions([]);
    }
  }, [isOpen, page]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?page=${page}&limit=20`);
      const data = await res.json();
      if (page === 1) {
        setTransactions(data.transactions || []);
      } else {
        setTransactions(prev => [...prev, ...(data.transactions || [])]);
      }
      setHasMore(data.pagination?.hasNext ?? false);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" style={{ borderRadius: '20px' }}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Todas as Transacoes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" style={{ cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="transaction-row flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'income' ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    {t.type === 'income' ? (
                      <TrendingUp size={18} className="text-green-400" />
                    ) : (
                      <CreditCard size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.category} &bull; {formatDate(t.date)}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="w-full mt-4 py-3 text-center text-violet-400 hover:text-violet-300 transition-colors"
              style={{ cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {loading ? <Loader2 size={20} className="spin" style={{ margin: '0 auto' }} /> : 'Carregar mais...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CategoryDetailModal
// ============================================================

function CategoryDetailModal({
  category,
  budget,
  spent,
  onClose,
}: {
  category: string;
  budget: number;
  spent: number;
  onClose: () => void;
}) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryTransactions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/transactions?category=${encodeURIComponent(category)}&limit=50`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Failed to fetch category transactions:', error);
      }
      setLoading(false);
    }
    fetchCategoryTransactions();
  }, [category]);

  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const barColor = pct > 100 ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="glass-card w-full sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        style={{
          borderRadius: '20px 20px 0 0',
          ...(typeof window !== 'undefined' && window.innerWidth >= 640
            ? { borderRadius: '20px' }
            : {}),
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getCategoryIcon(category);
              return (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                  <Icon size={20} style={{ color: '#a78bfa' }} />
                </div>
              );
            })()}
            <h2 className="text-lg font-semibold text-white">{category}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" style={{ cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Budget progress */}
        {budget > 0 && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Gasto: {formatCurrency(spent)}</span>
              <span className="text-white font-medium">de {formatCurrency(budget)}</span>
            </div>
            <div className="progress-track" style={{ height: '8px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: barColor,
                  boxShadow: `0 0 10px ${barColor}50`,
                }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: barColor }}>
              {pct.toFixed(0)}% do orcamento
            </p>
          </div>
        )}

        {/* Transaction list */}
        <div className="overflow-y-auto flex-1 p-6 pt-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="spin text-violet-400" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Sem transacoes nesta categoria</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.map((t) => (
                <div key={t.id} className="transaction-row flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{t.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 text-xs text-gray-500 text-center">
          {transactions.length} transac{transactions.length === 1 ? 'ao' : 'oes'}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Chart Tooltips
// ============================================================

function CustomBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3" style={{ minWidth: '140px', borderRadius: '12px' }}>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.fill || entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3" style={{ minWidth: '120px', borderRadius: '12px' }}>
        <p className="text-sm font-semibold text-white">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

// ============================================================
// CircularBudgetCard
// ============================================================

function CircularBudgetCard({
  item,
  onClick,
}: {
  item: BudgetItem;
  onClick: () => void;
}) {
  const pct = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
  const isOver = pct > 100;
  const displayPct = Math.round(pct);
  const color = isOver ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e';

  const r = 36;
  const circumference = 2 * Math.PI * r;
  const fillPct = Math.min(pct, 100);
  const offset = circumference - (fillPct / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className="glass-card flex flex-col items-center p-4 fade-in-up"
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ...(isOver ? { boxShadow: `0 0 20px ${color}30` } : {}),
      }}
    >
      <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="42" cy="42" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="42" cy="42" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        marginTop: '-60px',
        marginBottom: '18px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <span className="text-sm font-bold" style={{ color }}>
          {displayPct}%
        </span>
      </div>
      <p className="text-xs font-medium text-white text-center" style={{ marginTop: '4px', lineHeight: '1.2' }}>
        {item.category.split(' - ')[0]}
      </p>
      <p className="text-xs text-gray-400 text-center" style={{ marginTop: '2px' }}>
        {formatCurrency(item.spent)}
      </p>
      <p className="text-xs text-gray-500 text-center">
        de {formatCurrency(item.budget)}
      </p>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function Dashboard() {
  // State
  const [view, setView] = useState<'mtd' | 'wtd' | 'ytd'>('mtd');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  // Budget state
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalBudgetSpent, setTotalBudgetSpent] = useState(0);

  // Extra data
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [subTotalMonthly, setSubTotalMonthly] = useState(0);
  const [trends, setTrends] = useState<TrendsData | null>(null);

  // Category drill-down
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryBudget, setSelectedCategoryBudget] = useState(0);
  const [selectedCategorySpent, setSelectedCategorySpent] = useState(0);

  // ---- Fetch dashboard ----
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard?view=${view}`);
        const json = await res.json();
        if (!json.error) setData(json);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [view]);

  // ---- Fetch budgets, merchants, subscriptions, trends ----
  useEffect(() => {
    async function fetchExtra() {
      try {
        const [bRes, mRes, sRes, tRes] = await Promise.all([
          fetch('/api/budgets'),
          fetch('/api/merchants'),
          fetch('/api/subscriptions'),
          fetch('/api/trends'),
        ]);
        const [bData, mData, sData, tData] = await Promise.all([
          bRes.json(), mRes.json(), sRes.json(), tRes.json(),
        ]);

        setBudgets(bData.budgets || []);
        setTotalBudget(bData.totalBudget || 0);
        setTotalBudgetSpent(bData.totalSpent || 0);
        setMerchants(mData.merchants || []);
        setSubscriptions(sData.subscriptions || []);
        setSubTotalMonthly(sData.totalMonthly || 0);
        setTrends(tData.error ? null : tData);
      } catch (error) {
        console.error('Failed to fetch extra data:', error);
      }
    }
    fetchExtra();
  }, []);

  // ---- Sync ----
  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const result = await res.json();
      setSyncResult(result);
      if (result.success) {
        const dashRes = await fetch(`/api/dashboard?view=${view}`);
        const dashData = await dashRes.json();
        if (!dashData.error) setData(dashData);
      }
    } catch (e: any) {
      setSyncResult({ success: false, error: e.message });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 5000);
    }
  }

  // ---- Category click handler ----
  const handleCategoryClick = useCallback((cat: string, budget: number, spent: number) => {
    setSelectedCategory(cat);
    setSelectedCategoryBudget(budget);
    setSelectedCategorySpent(spent);
  }, []);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const bankBalance = data?.balance || 0;
  const budgetRemaining = totalBudget - totalBudgetSpent;
  const spentPercentage = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

  // Remaining days in month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - now.getDate());
  const perDayBudget = budgetRemaining > 0 ? budgetRemaining / remainingDays : 0;

  // Budget health
  const budgetHealthColor = spentPercentage > 90 ? '#ef4444' : spentPercentage > 70 ? '#f59e0b' : '#22c55e';
  const budgetHealthBg = spentPercentage > 90 ? 'rgba(239,68,68,0.08)' : spentPercentage > 70 ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)';

  // Only budgets with spending
  const activeBudgets = budgets.filter(b => b.spent > 0);

  // Insights
  const overBudget = budgets.filter(b => b.budget > 0 && b.spent > b.budget);
  const approaching = budgets.filter(b => {
    const pct = b.budget > 0 ? (b.spent / b.budget) * 100 : 0;
    return pct >= 75 && pct <= 100;
  });

  // Monthly comparison from trends
  const monthlyBarData = trends?.monthly?.map(m => ({
    name: m.label.charAt(0).toUpperCase() + m.label.slice(1),
    Receitas: m.income,
    Despesas: m.expenses,
  })) || [];

  const expenseChange = (() => {
    if (!trends?.monthly || trends.monthly.length < 2) return null;
    const current = trends.monthly[trends.monthly.length - 1];
    const previous = trends.monthly[trends.monthly.length - 2];
    if (!previous || previous.expenses === 0) return null;
    return ((current.expenses - previous.expenses) / previous.expenses) * 100;
  })();

  // Pie data
  const pieData = data?.expensesByCategory?.map((cat, i) => ({
    name: cat.category.split(' - ')[0],
    fullName: cat.category,
    value: cat.total,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];
  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);

  // Top merchants
  const merchantMax = merchants.length > 0 ? Math.max(...merchants.map(m => m.total)) : 1;

  // Bank breakdown string
  const bankBreakdown = data?.accounts
    ?.map(a => {
      const icon = a.bank === 'Revolut' ? '💳' : '🏦';
      return `${icon} ${a.bank} ${formatCurrency(a.balance)}`;
    })
    .join(' \u2022 ') || '';

  // Alerts
  const alerts: { type: 'danger' | 'warning' | 'success' | 'info'; icon: React.ReactNode; title: string; message: string }[] = [];

  overBudget.forEach(b => {
    alerts.push({
      type: 'danger',
      icon: <AlertCircle size={18} />,
      title: `${b.category} ultrapassou`,
      message: `${formatCurrency(b.spent)} de ${formatCurrency(b.budget)}`,
    });
  });

  approaching.forEach(b => {
    const pct = Math.round((b.spent / b.budget) * 100);
    alerts.push({
      type: 'warning',
      icon: <AlertTriangle size={18} />,
      title: `${b.category} a ${pct}%`,
      message: `Restam ${formatCurrency(b.budget - b.spent)}`,
    });
  });

  if (expenseChange !== null) {
    alerts.push({
      type: expenseChange < 0 ? 'success' : 'danger',
      icon: expenseChange < 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />,
      title: expenseChange < 0 ? 'Despesas em queda' : 'Despesas a subir',
      message: `${Math.abs(expenseChange).toFixed(1)}% vs mes anterior`,
    });
  }

  if (subTotalMonthly > 0) {
    alerts.push({
      type: 'info',
      icon: <Repeat size={18} />,
      title: 'Subscricoes recorrentes',
      message: `~${formatCurrency(subTotalMonthly)}/mes`,
    });
  }

  const alertColors = {
    danger: { border: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
    warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.1)', text: '#fbbf24' },
    success: { border: '#22c55e', bg: 'rgba(34,197,94,0.1)', text: '#4ade80' },
    info: { border: '#06b6d4', bg: 'rgba(6,182,212,0.1)', text: '#22d3ee' },
  };

  // Fallback trendData from recent transactions (if no trends API)
  const trendData = data?.recentTransactions
    ?.reduce((acc: any[], t) => {
      const date = formatShortDate(t.date);
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expenses += t.amount;
      } else {
        acc.push({
          date,
          income: t.type === 'income' ? t.amount : 0,
          expenses: t.type === 'expense' ? t.amount : 0,
        });
      }
      return acc;
    }, [])
    ?.reverse()
    ?.slice(-7) || [];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen" style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
      <div style={{ padding: '0 0px' }} className="sm:p-6 lg:p-8">

        {/* ============================================ */}
        {/* SECTION 1: HEADER                           */}
        {/* ============================================ */}
        <header className="mb-8 fade-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
                <Zap size={24} color="#0a0a0f" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: '#FFD700', letterSpacing: '2px' }}>
                  MIDAS
                </h1>
                <p className="text-xs text-gray-500">Financas Pessoais</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Tabs */}
              <div className="tab-container inline-flex gap-1">
                {([
                  { key: 'wtd', label: 'Semana', icon: Calendar },
                  { key: 'mtd', label: 'Mes', icon: CalendarDays },
                  { key: 'ytd', label: 'Ano', icon: BarChart3 },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`tab-button ${view === key ? 'active' : ''}`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
              {/* Sync */}
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors`}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: syncing ? 'rgba(245,158,11,0.2)' : syncResult?.success ? 'rgba(34,197,94,0.2)' : 'rgba(139,92,246,0.2)',
                }}
              >
                <RefreshCw size={16} className={syncing ? 'spin' : ''} style={{ color: syncing ? '#fbbf24' : syncResult?.success ? '#4ade80' : '#a78bfa' }} />
                <span className="text-sm font-medium" style={{ color: syncing ? '#fbbf24' : syncResult?.success ? '#4ade80' : '#a78bfa' }}>
                  {syncing ? 'A sincronizar...' : syncResult?.success ? `OK ${syncResult.newTransactions || 0} novas` : 'Sync'}
                </span>
              </button>
              {/* Status */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: loading ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: loading ? '#fbbf24' : '#4ade80' }} />
                <span className="text-xs font-medium" style={{ color: loading ? '#fbbf24' : '#4ade80' }}>
                  {loading ? 'A carregar...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          {/* Period Badge */}
          {data && (
            <div className="period-badge fade-in-up" style={{ animationDelay: '100ms' }}>
              <Clock size={14} />
              {data.period.label}: {formatDate(data.period.start)} - {formatDate(data.period.end)}
            </div>
          )}
        </header>

        {/* ============================================ */}
        {/* SECTION 2: HERO — Saldo + Orcamento         */}
        {/* ============================================ */}
        <section
          className="glass-card mb-8 fade-in-up"
          style={{
            animationDelay: '150ms',
            background: `linear-gradient(135deg, ${budgetHealthBg}, rgba(255,255,255,0.03))`,
            padding: '20px',
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6" style={{ padding: '4px 4px' }}>
            {/* Left: Balance + Budget Overview */}
            <div style={{ flex: '1' }}>
              <p className="text-sm text-gray-400 mb-1">Saldo Total</p>
              <p className="text-4xl font-extrabold text-white" style={{ lineHeight: '1.1' }}>
                {formatCurrency(bankBalance)}
              </p>
              {bankBreakdown && (
                <p className="text-xs text-gray-500 mt-2">{bankBreakdown}</p>
              )}
              {totalBudget > 0 && (
                <p className="text-sm text-gray-400 mt-3">
                  Orcamento:{' '}
                  <span className="text-white font-medium">{formatCurrency(totalBudgetSpent)}</span>
                  {' / '}
                  <span className="text-gray-500">{formatCurrency(totalBudget)}</span>
                  {' '}
                  <span style={{ color: budgetHealthColor }} className="font-semibold">
                    ({spentPercentage.toFixed(0)}%)
                  </span>
                </p>
              )}
            </div>

            {/* Right: Budget Remaining */}
            {totalBudget > 0 && (
              <div className="flex flex-col items-end lg:items-end" style={{ minWidth: '200px' }}>
                <p className="text-sm text-gray-400">Restante no Orcamento</p>
                <p className="text-3xl font-extrabold" style={{ color: budgetHealthColor, lineHeight: '1.2' }}>
                  {formatCurrency(budgetRemaining)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ~{formatCurrency(perDayBudget)}/dia para {remainingDays} dias
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {totalBudget > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div className="progress-track" style={{ height: '10px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(spentPercentage, 100)}%`,
                    background: budgetHealthColor,
                    boxShadow: `0 0 10px ${budgetHealthColor}50`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* SECTION 3: THREE KPI CARDS                  */}
        {/* ============================================ */}
        <section className="mb-8 stagger-children" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(1, 1fr)' }}>
          <style>{`
            @media (min-width: 640px) {
              .kpi-3-grid { grid-template-columns: repeat(3, 1fr) !important; }
            }
          `}</style>
          <div className="kpi-3-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr' }}>
            <KPICard
              icon={TrendingUp}
              label="Receitas"
              value={formatCurrency(data?.income || 0)}
              subtext={data?.period.label || 'Este periodo'}
              gradient="gradient-green"
              delay={250}
            />
            <KPICard
              icon={CreditCard}
              label="Despesas"
              value={formatCurrency(data?.expenses || 0)}
              subtext={data?.period.label || 'Este periodo'}
              trend={data?.expenseTrend !== undefined ? (data.expenseTrend > 0 ? 'down' : 'up') : undefined}
              trendValue={data?.expenseTrend !== undefined ? `${Math.abs(data.expenseTrend).toFixed(1)}%` : undefined}
              gradient="gradient-red"
              delay={350}
            />
            <KPICard
              icon={PiggyBank}
              label="Taxa Poupanca"
              value={`${(data?.savingsRate || 0).toFixed(1)}%`}
              subtext="Meta: 20%"
              trend={(data?.savingsRate || 0) >= 20 ? 'up' : 'down'}
              gradient="gradient-blue"
              delay={450}
            />
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 4: INSIGHTS / ALERTS                */}
        {/* ============================================ */}
        {alerts.length > 0 && (
          <section className="mb-8 fade-in-up" style={{ animationDelay: '500ms' }}>
            <div style={{
              display: 'grid',
              gap: '12px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}>
              {alerts.slice(0, 4).map((alert, i) => {
                const colors = alertColors[alert.type];
                return (
                  <div
                    key={i}
                    className="glass-card p-4"
                    style={{
                      borderLeft: `3px solid ${colors.border}`,
                      background: colors.bg,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color: colors.text, flexShrink: 0 }}>{alert.icon}</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: colors.text }}>{alert.title}</p>
                        <p className="text-xs text-gray-400">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================ */}
        {/* SECTION 5: ORCAMENTO — Circular Cards       */}
        {/* ============================================ */}
        {activeBudgets.length > 0 && (
          <section className="mb-8 fade-in-up" style={{ animationDelay: '550ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="icon-container gradient-orange" style={{ width: '40px', height: '40px' }}>
                  <Wallet size={20} color="white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Orcamento Mensal</h2>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(totalBudgetSpent)} de {formatCurrency(totalBudget)}
                  </p>
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            }}>
              {activeBudgets.map((b) => (
                <CircularBudgetCard
                  key={b.id}
                  item={b}
                  onClick={() => handleCategoryClick(b.category, b.budget, b.spent)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ============================================ */}
        {/* SECTION 6: ANALISE — Charts + Top 5         */}
        {/* ============================================ */}
        <section className="mb-8 fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="charts-grid">
            {/* LEFT: Monthly Trend BarChart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="icon-container gradient-violet" style={{ width: '40px', height: '40px' }}>
                    <BarChart3 size={20} color="white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Tendencia Mensal</h2>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                    <span className="text-gray-400">Receitas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#8b5cf6' }} />
                    <span className="text-gray-400">Despesas</span>
                  </div>
                </div>
              </div>
              <div style={{ height: '280px' }}>
                {monthlyBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyBarData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="Receitas" fill="#22c55e" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Despesas" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">Sem dados de tendencia</p>
                  </div>
                )}
              </div>
              {expenseChange !== null && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Despesas{' '}
                  <span style={{ color: expenseChange < 0 ? '#4ade80' : '#f87171' }} className="font-semibold">
                    {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}%
                  </span>
                  {' '}vs mes anterior
                </p>
              )}
            </div>

            {/* RIGHT: Donut PieChart */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container gradient-red" style={{ width: '40px', height: '40px' }}>
                  <ShoppingBag size={20} color="white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Por Categoria</h2>
              </div>
              <div style={{ height: '200px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center total overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
              {/* Legend - clickable */}
              <div className="space-y-2 mt-4">
                {pieData.slice(0, 4).map((cat) => {
                  const budgetForCat = budgets.find(b => b.category === cat.fullName || b.category.split(' - ')[0] === cat.name);
                  return (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between text-sm"
                      style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s' }}
                      onClick={() => handleCategoryClick(
                        cat.fullName || cat.name,
                        budgetForCat?.budget || 0,
                        budgetForCat?.spent || cat.value,
                      )}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: cat.fill }} />
                        <span className="text-gray-400">{cat.name}</span>
                      </div>
                      <span className="text-white font-medium">
                        {totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top 5 Merchants */}
          {merchants.length > 0 && (
            <div className="glass-card p-6 mt-6 fade-in-up" style={{ animationDelay: '650ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container gradient-blue" style={{ width: '36px', height: '36px' }}>
                  <Store size={18} color="white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Top 5 Comerciantes</h2>
              </div>
              <div style={{
                display: 'grid',
                gap: '8px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              }}>
                {merchants.slice(0, 5).map((m, i) => (
                  <div
                    key={m.merchant}
                    className="flex items-center gap-3"
                    style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-xs font-bold" style={{ color: '#FFD700', minWidth: '20px' }}>#{i + 1}</span>
                    <div style={{ flex: '1', minWidth: 0 }}>
                      <p className="text-sm font-medium text-white" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cleanMerchantName(m.merchant)}
                      </p>
                      <p className="text-xs text-gray-500">{m.transactions}x transacoes</p>
                    </div>
                    <span className="text-sm font-semibold text-white" style={{ flexShrink: 0 }}>
                      {formatCurrency(m.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* SECTION 7: ACTIVIDADE + OBJECTIVOS          */}
        {/* ============================================ */}
        <div className="two-col-grid mb-8">
          {/* Transactions */}
          <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '700ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="icon-container gradient-green" style={{ width: '40px', height: '40px' }}>
                  <Zap size={20} color="white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Ultimas Transacoes</h2>
              </div>
              <button
                onClick={() => setShowTransactions(true)}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Ver todas <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {(data?.recentTransactions || []).slice(0, 6).map((t) => {
                const CategoryIcon = getCategoryIcon(t.category);
                return (
                  <div key={t.id} className="transaction-row flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        t.type === 'income' ? 'bg-green-500/20' : 'bg-gray-500/20'
                      }`}>
                        {t.type === 'income' ? (
                          <TrendingUp size={18} className="text-green-400" />
                        ) : (
                          <CategoryIcon size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.description}</p>
                        <p className="text-xs text-gray-500">{t.category?.split(' - ')[0]} &bull; {formatDate(t.date)}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                );
              })}
              {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                <div className="text-center py-8">
                  <Wallet size={40} className="text-gray-500" style={{ margin: '0 auto 12px' }} />
                  <p className="text-gray-500">Sem transacoes registadas</p>
                </div>
              )}
            </div>
          </div>

          {/* Goals */}
          <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '750ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="icon-container gradient-violet" style={{ width: '40px', height: '40px' }}>
                  <Target size={20} color="white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Objectivos</h2>
              </div>
            </div>
            {data?.goals && data.goals.length > 0 ? (
              <div className="space-y-4">
                {data.goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target size={40} className="text-gray-500" style={{ margin: '0 auto 12px' }} />
                <p className="text-gray-400 mb-1">Sem objectivos definidos</p>
                <p className="text-xs text-gray-500">Define metas para acompanhar o progresso</p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* FOOTER                                      */}
        {/* ============================================ */}
        <footer className="mt-16 text-center fade-in-up" style={{ animationDelay: '850ms' }}>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Zap size={16} style={{ color: '#FFD700' }} />
            <span>MIDAS v3.0</span>
            <span className="text-gray-500">&bull;</span>
            <span>Powered by AiParaTi</span>
          </div>
        </footer>

      </div>

      {/* ============================================ */}
      {/* LOADING OVERLAY                              */}
      {/* ============================================ */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 flex flex-col items-center gap-4">
            <Loader2 size={40} className="spin" style={{ color: '#FFD700' }} />
            <p className="text-gray-400">A carregar dados...</p>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS                                       */}
      {/* ============================================ */}
      <TransactionsModal
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
      />

      {selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          budget={selectedCategoryBudget}
          spent={selectedCategorySpent}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </main>
  );
}
