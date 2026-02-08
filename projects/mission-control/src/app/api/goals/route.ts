import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const goalsResult = await query(`
      SELECT 
        id,
        name,
        target_amount,
        current_amount,
        deadline,
        priority,
        status,
        created_at
      FROM midas_goals
      ORDER BY 
        CASE status 
          WHEN 'active' THEN 1 
          WHEN 'paused' THEN 2 
          WHEN 'completed' THEN 3 
          ELSE 4 
        END,
        priority DESC,
        deadline ASC
    `);

    // Convert priority int to string: 1=high, 2=medium, 3=low
    const priorityLabels: Record<number, string> = { 1: 'high', 2: 'medium', 3: 'low' };
    
    return NextResponse.json({
      goals: goalsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        target: parseFloat(row.target_amount),
        current: parseFloat(row.current_amount),
        deadline: row.deadline,
        priority: priorityLabels[row.priority] || 'medium',
        status: row.status,
        progress: row.target_amount > 0 
          ? Math.min(100, (parseFloat(row.current_amount) / parseFloat(row.target_amount)) * 100)
          : 0,
        createdAt: row.created_at
      })),
      summary: {
        total: goalsResult.rowCount,
        active: goalsResult.rows.filter(r => r.status === 'active').length,
        completed: goalsResult.rows.filter(r => r.status === 'completed').length
      }
    });

  } catch (error) {
    console.error('Goals API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch goals',
      details: error instanceof Error ? error.message : 'Unknown error',
      goals: [],
      summary: { total: 0, active: 0, completed: 0 }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, target_amount, deadline, priority } = body;

    if (!name || !target_amount) {
      return NextResponse.json({
        error: 'Name and target_amount are required'
      }, { status: 400 });
    }

    // priority: 1=high, 2=medium, 3=low
    const priorityValue = priority === 'high' ? 1 : priority === 'low' ? 3 : 2;
    
    const result = await query(`
      INSERT INTO midas_goals (name, target_amount, current_amount, deadline, priority, status, created_at)
      VALUES ($1, $2, 0, $3, $4, 'active', NOW())
      RETURNING id, name, target_amount, current_amount, deadline, priority, status
    `, [name, target_amount, deadline || null, priorityValue]);

    const row = result.rows[0];
    
    return NextResponse.json({
      success: true,
      goal: {
        id: row.id,
        name: row.name,
        target: parseFloat(row.target_amount),
        current: 0,
        deadline: row.deadline,
        priority: row.priority,
        status: row.status,
        progress: 0
      }
    });

  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json({
      error: 'Failed to create goal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
