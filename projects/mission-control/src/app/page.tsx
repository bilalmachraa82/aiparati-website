'use client';

import { useState, useEffect } from 'react';
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
  Building2,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';

// Format helpers
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });

const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });

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

// Category icon mapping
const categoryIcons: Record<string, React.ComponentType<any>> = {
  'Alimentação': Utensils,
  'Supermercado': ShoppingBag,
  'Restaurantes': Coffee,
  'Habitação': Home,
  'Transporte': Car,
  'Saúde': HeartPulse,
  'Educação': GraduationCap,
  'Entretenimento': Gift,
  'Viagens': Plane,
  'Tecnologia': Smartphone,
};

// Chart colors (premium palette)
const CHART_COLORS = [
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
];

// Priority colors
const priorityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

// KPI Card Component
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

// Account Card Component
function AccountCard({ account }: { account: Account }) {
  const bankIcons: Record<string, string> = {
    'Millennium BCP': '🏦',
    'Revolut': '💳',
  };
  
  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg">
          {bankIcons[account.bank] || '💰'}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{account.name}</p>
          <p className="text-xs text-gray-500">{account.bank}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${account.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
          {formatCurrency(account.balance)}
        </p>
        <p className="text-xs text-gray-500">
          {account.lastSync ? `Sync: ${formatShortDate(account.lastSync)}` : 'Sem sync'}
        </p>
      </div>
    </div>
  );
}

// Goal Card Component
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
              background: `linear-gradient(90deg, ${priorityColors[goal.priority] || '#8b5cf6'}, #a855f7)` 
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

// Custom Tooltip for Pie Chart
function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3" style={{ minWidth: '120px' }}>
        <p className="text-sm font-semibold text-white">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Line Chart
function CustomLineTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Transactions Modal
function TransactionsModal({ 
  isOpen, 
  onClose 
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
    }
  }, [isOpen, page]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?page=${page}&limit=20`);
      const data = await res.json();
      if (page === 1) {
        setTransactions(data.transactions);
      } else {
        setTransactions(prev => [...prev, ...data.transactions]);
      }
      setHasMore(data.pagination.hasNext);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Todas as Transacções</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="transaction-row flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'income' ? 'bg-green-500/20' : t.type === 'transfer' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                  }`}>
                    {t.type === 'income' ? (
                      <TrendingUp size={18} className="text-green-400" />
                    ) : t.type === 'transfer' ? (
                      <RefreshCw size={18} className="text-blue-400" />
                    ) : (
                      <CreditCard size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.category} • {formatDate(t.date)}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  t.type === 'income' ? 'text-green-400' : t.type === 'transfer' ? 'text-blue-400' : 'text-white'
                }`}>
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
            >
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Carregar mais...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<'mtd' | 'wtd' | 'ytd'>('mtd');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const result = await res.json();
      setSyncResult(result);
      if (result.success) {
        // Refresh dashboard data
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard?view=${view}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [view]);

  // Generate trend data for line chart
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

  // Pie chart data
  const pieData = data?.expensesByCategory?.map((cat, i) => ({
    name: cat.category.split(' - ')[0], // Simplify category names
    value: cat.total,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];

  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);

  const getCategoryIcon = (category: string) => {
    const simpleCat = category.split(' - ')[0];
    return categoryIcons[simpleCat] || MoreHorizontal;
  };

  return (
    <main className="min-h-screen p-6 lg:p-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header className="mb-8 fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="icon-container gradient-violet">
              <Target size={28} color="white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Mission Control</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <Calendar size={14} />
                {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                syncing ? 'bg-amber-500/20' : syncResult?.success ? 'bg-green-500/20' : 'bg-violet-500/20 hover:bg-violet-500/30'
              }`}
            >
              <RefreshCw size={16} className={`${syncing ? 'animate-spin text-amber-400' : syncResult?.success ? 'text-green-400' : 'text-violet-400'}`} />
              <span className={`text-sm font-medium ${syncing ? 'text-amber-400' : syncResult?.success ? 'text-green-400' : 'text-violet-400'}`}>
                {syncing ? 'A sincronizar...' : syncResult?.success ? `✓ ${syncResult.newTransactions || 0} novas` : 'Sincronizar'}
              </span>
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${loading ? 'bg-amber-500/20' : 'bg-green-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400' : 'bg-green-400 pulse'}`} />
              <span className={`text-sm font-medium ${loading ? 'text-amber-400' : 'text-green-400'}`}>
                {loading ? 'A carregar...' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="tab-container inline-flex gap-1 mb-6 fade-in-up" style={{ animationDelay: '100ms' }}>
        {([
          { key: 'wtd', label: 'Semana', icon: Calendar },
          { key: 'mtd', label: 'Mês', icon: CalendarDays },
          { key: 'ytd', label: 'Ano', icon: BarChart3 },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`tab-button ${view === key ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Period Badge */}
      {data && (
        <div className="period-badge mb-8 fade-in-up" style={{ animationDelay: '150ms' }}>
          <Clock size={14} />
          {data.period.label}: {formatDate(data.period.start)} - {formatDate(data.period.end)}
        </div>
      )}

      {/* Accounts Section */}
      {data?.accounts && data.accounts.length > 0 && (
        <section className="mb-8 fade-in-up" style={{ animationDelay: '175ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={20} className="text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Contas Bancárias</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>
      )}

      {/* KPI Cards */}
      <section className="kpi-grid mb-8 stagger-children">
        <KPICard
          icon={Wallet}
          label="Saldo Total"
          value={formatCurrency(data?.balance || 0)}
          subtext="Todas as contas EUR"
          gradient="gradient-violet"
          delay={200}
        />
        <KPICard
          icon={TrendingUp}
          label="Receitas"
          value={formatCurrency(data?.income || 0)}
          subtext={data?.period.label || 'Este período'}
          gradient="gradient-green"
          delay={300}
        />
        <KPICard
          icon={CreditCard}
          label="Despesas"
          value={formatCurrency(data?.expenses || 0)}
          subtext={data?.period.label || 'Este período'}
          trend={data?.expenseTrend !== undefined ? (data.expenseTrend > 0 ? 'up' : 'down') : undefined}
          trendValue={data?.expenseTrend !== undefined ? `${Math.abs(data.expenseTrend).toFixed(1)}%` : undefined}
          gradient="gradient-red"
          delay={400}
        />
        <KPICard
          icon={PiggyBank}
          label="Taxa Poupança"
          value={`${(data?.savingsRate || 0).toFixed(1)}%`}
          subtext="Meta: 20%"
          trend={(data?.savingsRate || 0) >= 20 ? 'up' : 'down'}
          gradient="gradient-blue"
          delay={500}
        />
      </section>

      {/* Main Grid - Charts & Transactions */}
      <div className="charts-grid mb-8">
        {/* Line Chart - Trend */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="icon-container gradient-violet" style={{ width: '40px', height: '40px' }}>
                <TrendingUp size={20} color="white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Tendência Financeira</h2>
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Receitas"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Despesas"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Categories */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container gradient-red" style={{ width: '40px', height: '40px' }}>
              <BarChart3 size={20} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Por Categoria</h2>
          </div>
          <div style={{ height: '200px' }}>
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
          </div>
          {/* Center Total */}
          <div className="text-center -mt-32 mb-24 relative z-10 pointer-events-none">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totalExpenses)}</p>
          </div>
          {/* Legend */}
          <div className="space-y-2 mt-4">
            {pieData.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.fill }} />
                  <span className="text-gray-400">{cat.name}</span>
                </div>
                <span className="text-white font-medium">
                  {totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions & Categories Detail */}
      <div className="two-col-grid mb-8">
        {/* Recent Transactions */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="icon-container gradient-green" style={{ width: '40px', height: '40px' }}>
                <Zap size={20} color="white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Últimas Transacções</h2>
            </div>
            <button 
              onClick={() => setShowTransactions(true)}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
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
                      <p className="text-xs text-gray-500">{t.category?.split(' - ')[0]} • {formatDate(t.date)}</p>
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
                <Wallet size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Sem transacções registadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container gradient-blue" style={{ width: '40px', height: '40px' }}>
              <ShoppingBag size={20} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Gastos por Categoria</h2>
          </div>
          <div className="space-y-4">
            {(data?.expensesByCategory || []).slice(0, 5).map((cat, i) => {
              const maxTotal = Math.max(...(data?.expensesByCategory || []).map((c) => c.total), 1);
              const percentage = (cat.total / maxTotal) * 100;
              const CategoryIcon = getCategoryIcon(cat.category);
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${CHART_COLORS[i]}20` }}>
                        <CategoryIcon size={16} style={{ color: CHART_COLORS[i] }} />
                      </div>
                      <span className="text-sm text-white">{cat.category?.split(' - ')[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-400">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
            {(!data?.expensesByCategory || data.expensesByCategory.length === 0) && (
              <div className="text-center py-8">
                <BarChart3 size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Sem dados de categorias</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <section className="fade-in-up mb-8" style={{ animationDelay: '800ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="icon-container gradient-violet" style={{ width: '40px', height: '40px' }}>
              <Target size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Os Meus Objectivos</h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors text-sm">
            <Plus size={16} />
            Novo Objectivo
          </button>
        </div>
        
        {data?.goals && data.goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Target size={48} className="text-violet-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Ainda não tens objectivos definidos</p>
            <p className="text-gray-500 text-sm">Clica em "Novo Objectivo" para começar</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center fade-in-up" style={{ animationDelay: '900ms' }}>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Zap size={16} className="text-violet-400" />
          <span>Mission Control v2.1</span>
          <span className="text-gray-600">•</span>
          <span>Powered by AiParaTi</span>
        </div>
      </footer>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-violet-400 animate-spin" />
            <p className="text-gray-400">A carregar dados...</p>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      <TransactionsModal 
        isOpen={showTransactions} 
        onClose={() => setShowTransactions(false)} 
      />
    </main>
  );
}
