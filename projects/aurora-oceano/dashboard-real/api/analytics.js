// Vercel Serverless Function - Analytics API
// Lê dados reais do Neon PostgreSQL

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  try {
    let data;
    
    switch (action) {
      case 'summary':
        // Resumo geral
        const summaryResult = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM customers) as total_customers,
            (SELECT COUNT(*) FROM invoices) as total_invoices,
            (SELECT COALESCE(SUM(net_value), 0) FROM invoices) as total_revenue
        `);
        data = summaryResult.rows[0];
        break;

      case 'yearly':
        // Por ano
        const yearlyResult = await pool.query(`
          SELECT 
            EXTRACT(YEAR FROM date)::int as year,
            COUNT(*)::int as invoice_count,
            ROUND(SUM(net_value)::numeric, 2) as total_revenue,
            ROUND(AVG(net_value)::numeric, 2) as avg_ticket
          FROM invoices
          GROUP BY EXTRACT(YEAR FROM date)
          ORDER BY year
        `);
        data = yearlyResult.rows;
        break;

      case 'monthly':
        // Por mês
        const year = req.query.year || new Date().getFullYear();
        const monthlyResult = await pool.query(`
          SELECT 
            EXTRACT(MONTH FROM date)::int as month,
            COUNT(*)::int as invoice_count,
            ROUND(SUM(net_value)::numeric, 2) as total_revenue,
            ROUND(AVG(net_value)::numeric, 2) as avg_ticket
          FROM invoices
          WHERE EXTRACT(YEAR FROM date) = $1
          GROUP BY EXTRACT(MONTH FROM date)
          ORDER BY month
        `, [year]);
        data = monthlyResult.rows;
        break;

      case 'top_customers':
        // Top clientes
        const limit = parseInt(req.query.limit) || 10;
        const topYear = req.query.year;
        
        let topQuery = `
          SELECT 
            entity_name as customer_name,
            COUNT(*)::int as invoice_count,
            ROUND(SUM(net_value)::numeric, 2) as total_revenue,
            ROUND(AVG(net_value)::numeric, 2) as avg_ticket
          FROM invoices
          WHERE entity_name IS NOT NULL
        `;
        
        if (topYear) {
          topQuery += ` AND EXTRACT(YEAR FROM date) = ${parseInt(topYear)}`;
        }
        
        topQuery += `
          GROUP BY entity_name
          ORDER BY total_revenue DESC
          LIMIT ${limit}
        `;
        
        const topResult = await pool.query(topQuery);
        data = topResult.rows;
        break;

      case 'dashboard':
        // Dados completos para o dashboard
        const [yearly, monthly2024, monthly2025, topAll] = await Promise.all([
          pool.query(`
            SELECT 
              EXTRACT(YEAR FROM date)::int as year,
              COUNT(*)::int as invoice_count,
              ROUND(SUM(net_value)::numeric, 2) as total_revenue,
              ROUND(AVG(net_value)::numeric, 2) as avg_ticket
            FROM invoices
            GROUP BY EXTRACT(YEAR FROM date)
            ORDER BY year
          `),
          pool.query(`
            SELECT 
              EXTRACT(MONTH FROM date)::int as month,
              COUNT(*)::int as invoice_count,
              ROUND(SUM(net_value)::numeric, 2) as total_revenue
            FROM invoices
            WHERE EXTRACT(YEAR FROM date) = 2024
            GROUP BY EXTRACT(MONTH FROM date)
            ORDER BY month
          `),
          pool.query(`
            SELECT 
              EXTRACT(MONTH FROM date)::int as month,
              COUNT(*)::int as invoice_count,
              ROUND(SUM(net_value)::numeric, 2) as total_revenue
            FROM invoices
            WHERE EXTRACT(YEAR FROM date) = 2025
            GROUP BY EXTRACT(MONTH FROM date)
            ORDER BY month
          `),
          pool.query(`
            SELECT 
              entity_name as customer_name,
              COUNT(*)::int as invoice_count,
              ROUND(SUM(net_value)::numeric, 2) as total_revenue
            FROM invoices
            WHERE entity_name IS NOT NULL
            GROUP BY entity_name
            ORDER BY total_revenue DESC
            LIMIT 10
          `)
        ]);

        data = {
          yearly: yearly.rows,
          monthly_2024: monthly2024.rows,
          monthly_2025: monthly2025.rows,
          top_customers: topAll.rows,
          updated_at: new Date().toISOString()
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: error.message });
  }
}
