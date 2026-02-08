import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // income, expense, transfer, all
    const category = searchParams.get('category');
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clauses
    const conditions: string[] = [
      "(t.source IS NULL OR t.source IN ('millennium', 'revolut', 'manual'))"
    ];
    const params: any[] = [];
    let paramIndex = 1;

    if (type && type !== 'all') {
      conditions.push(`t.type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (category) {
      conditions.push(`c.name = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (startDate) {
      conditions.push(`t.date >= $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      conditions.push(`t.date <= $${paramIndex}`);
      params.push(endDate);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(t.description ILIKE $${paramIndex} OR t.merchant ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM midas_transactions t
      LEFT JOIN midas_categories c ON t.category_id = c.id
      ${whereClause}
    `, params);

    // Get transactions
    const transactionsResult = await query(`
      SELECT 
        t.id,
        t.date,
        t.description,
        t.merchant,
        ABS(t.amount) as amount,
        t.currency,
        t.type,
        t.source,
        t.is_recurring,
        t.notes,
        COALESCE(c.name, 'Sem Categoria') as category,
        c.icon as category_icon
      FROM midas_transactions t
      LEFT JOIN midas_categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.date DESC, t.id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    const total = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      transactions: transactionsResult.rows.map(row => ({
        id: row.id,
        date: row.date,
        description: row.merchant || row.description,
        amount: parseFloat(row.amount),
        currency: row.currency || 'EUR',
        type: row.type,
        source: row.source,
        category: row.category,
        categoryIcon: row.category_icon,
        isRecurring: row.is_recurring,
        notes: row.notes
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error',
      transactions: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
    }, { status: 500 });
  }
}
