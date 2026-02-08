import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Helper para calcular datas
function getDateRange(view: string): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  let start: Date;

  switch (view) {
    case 'wtd': // Week to Date (desde segunda-feira)
      start = new Date(now);
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    case 'ytd': // Year to Date (desde 1 Jan)
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'mtd': // Month to Date (desde dia 1 do mês)
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'mtd';
    
    const { start, end } = getDateRange(view);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    // ========================================
    // DADOS REAIS - midas_transactions
    // NOTA: Despesas são guardadas com valores NEGATIVOS
    // ========================================

    // Total Income no período (valores positivos = income)
    const incomeResult = await query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM midas_transactions
      WHERE type = 'income'
      AND date >= $1 AND date <= $2
      AND (source IS NULL OR source IN ('millennium', 'revolut', 'manual'))
    `, [startStr, endStr]);

    // Total Expenses no período (valores negativos, usar ABS)
    const expenseResult = await query(`
      SELECT COALESCE(SUM(ABS(amount)), 0) as total
      FROM midas_transactions
      WHERE type = 'expense'
      AND date >= $1 AND date <= $2
      AND (source IS NULL OR source IN ('millennium', 'revolut', 'manual'))
    `, [startStr, endStr]);

    // Período anterior para comparação
    const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - periodDays);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    
    const prevExpenseResult = await query(`
      SELECT COALESCE(SUM(ABS(amount)), 0) as total
      FROM midas_transactions
      WHERE type = 'expense'
      AND date >= $1 AND date <= $2
      AND (source IS NULL OR source IN ('millennium', 'revolut', 'manual'))
    `, [prevStart.toISOString().split('T')[0], prevEnd.toISOString().split('T')[0]]);

    // Saldo actual (soma de contas bancárias)
    const balanceResult = await query(`
      SELECT COALESCE(SUM(current_balance), 0) as balance
      FROM midas_accounts
      WHERE currency = 'EUR'
    `);

    // Gastos por categoria no período (ABS para valores positivos)
    const categoryResult = await query(`
      SELECT 
        COALESCE(c.name, 'Sem Categoria') as category, 
        COALESCE(SUM(ABS(t.amount)), 0) as total
      FROM midas_transactions t
      LEFT JOIN midas_categories c ON t.category_id = c.id
      WHERE t.type = 'expense'
      AND t.date >= $1 AND t.date <= $2
      AND (t.source IS NULL OR t.source IN ('millennium', 'revolut', 'manual'))
      GROUP BY c.name
      ORDER BY total DESC
      LIMIT 8
    `, [startStr, endStr]);

    // Últimas transacções pessoais
    const recentResult = await query(`
      SELECT 
        t.id, 
        t.description, 
        ABS(t.amount) as amount,
        t.type, 
        COALESCE(c.name, 'Sem Categoria') as category, 
        t.date,
        t.merchant,
        t.source
      FROM midas_transactions t
      LEFT JOIN midas_categories c ON t.category_id = c.id
      WHERE (t.source IS NULL OR t.source IN ('millennium', 'revolut', 'manual'))
      ORDER BY t.date DESC, t.id DESC
      LIMIT 10
    `);

    // Contas bancárias
    const accountsResult = await query(`
      SELECT id, name, bank, current_balance, currency, last_sync
      FROM midas_accounts
      ORDER BY id
    `);

    // Goals (objectivos financeiros)
    const goalsResult = await query(`
      SELECT id, name, target_amount, current_amount, deadline, priority, status
      FROM midas_goals
      ORDER BY priority DESC, deadline ASC
      LIMIT 4
    `);

    // Calcular valores
    const income = parseFloat(incomeResult.rows[0]?.total || 0);
    const expenses = parseFloat(expenseResult.rows[0]?.total || 0);
    const prevExpenses = parseFloat(prevExpenseResult.rows[0]?.total || 0);
    const balance = parseFloat(balanceResult.rows[0]?.balance || 0);
    
    // Savings Rate: (income - expenses) / income * 100
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Expense Trend: quanto mudou vs período anterior (positivo = gastou mais)
    const expenseTrend = prevExpenses > 0 
      ? ((expenses - prevExpenses) / prevExpenses) * 100 
      : (expenses > 0 ? 100 : 0);

    return NextResponse.json({
      view,
      period: {
        start: startStr,
        end: endStr,
        label: view === 'mtd' ? 'Este Mês' : view === 'wtd' ? 'Esta Semana' : 'Este Ano'
      },
      balance,
      income,
      expenses, // Agora é positivo!
      previousExpenses: prevExpenses,
      expenseTrend, // Trend correcto
      savingsRate: Math.max(-100, Math.min(100, savingsRate)), // Limitar entre -100% e 100%
      expensesByCategory: categoryResult.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.total)
      })),
      recentTransactions: recentResult.rows.map(row => ({
        id: row.id,
        description: row.merchant || row.description,
        amount: parseFloat(row.amount), // Agora positivo
        type: row.type,
        category: row.category,
        date: row.date
      })),
      accounts: accountsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        bank: row.bank,
        balance: parseFloat(row.current_balance),
        currency: row.currency,
        lastSync: row.last_sync
      })),
      goals: goalsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        target: parseFloat(row.target_amount),
        current: parseFloat(row.current_amount),
        deadline: row.deadline,
        priority: row.priority,
        status: row.status,
        progress: row.target_amount > 0 
          ? Math.min(100, (parseFloat(row.current_amount) / parseFloat(row.target_amount)) * 100)
          : 0
      })),
      dataSource: 'midas_transactions',
      recordCount: recentResult.rowCount
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      view: 'mtd',
      period: { start: '', end: '', label: 'Erro' },
      balance: 0,
      income: 0,
      expenses: 0,
      previousExpenses: 0,
      expenseTrend: 0,
      savingsRate: 0,
      expensesByCategory: [],
      recentTransactions: [],
      accounts: [],
      goals: [],
      dataSource: 'error'
    }, { status: 500 });
  }
}
