import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get all accounts
    const accountsResult = await query(`
      SELECT 
        id,
        name,
        bank,
        account_type,
        currency,
        current_balance,
        last_sync,
        created_at
      FROM midas_accounts
      ORDER BY id
    `);

    // Get total balance in EUR
    const totalResult = await query(`
      SELECT COALESCE(SUM(current_balance), 0) as total
      FROM midas_accounts
      WHERE currency = 'EUR'
    `);

    // Get recent transactions per account (last 5 each)
    const recentByAccountResult = await query(`
      SELECT DISTINCT ON (source)
        source,
        date as last_transaction_date,
        description as last_transaction
      FROM midas_transactions
      WHERE source IN ('millennium', 'revolut')
      ORDER BY source, date DESC
    `);

    const recentByAccount: Record<string, { date: string; description: string }> = {};
    recentByAccountResult.rows.forEach(row => {
      recentByAccount[row.source] = {
        date: row.last_transaction_date,
        description: row.last_transaction
      };
    });

    return NextResponse.json({
      accounts: accountsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        bank: row.bank,
        type: row.account_type,
        currency: row.currency,
        balance: parseFloat(row.current_balance),
        lastSync: row.last_sync,
        createdAt: row.created_at,
        lastTransaction: recentByAccount[row.bank.toLowerCase()] || null
      })),
      summary: {
        totalBalanceEUR: parseFloat(totalResult.rows[0]?.total || 0),
        accountCount: accountsResult.rowCount
      }
    });

  } catch (error) {
    console.error('Accounts API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch accounts',
      details: error instanceof Error ? error.message : 'Unknown error',
      accounts: [],
      summary: { totalBalanceEUR: 0, accountCount: 0 }
    }, { status: 500 });
  }
}
