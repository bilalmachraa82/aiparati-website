#!/usr/bin/env python3
"""
MIDAS Query - Consultas à base de dados
Uso: python3 midas-query.py <query_type> [args]

Tipos:
  month_summary - Resumo do mês actual
  category <nome> - Gastos por categoria
  last <N> - Últimas N transações
  balance - Balanço actual
"""

import sys
import os
import json
import psycopg2
from datetime import datetime

def get_db_url():
    secrets_path = os.path.expanduser("~/clawd/.env.secrets")
    if os.path.exists(secrets_path):
        with open(secrets_path) as f:
            for line in f:
                if line.startswith("MIDAS_DATABASE_URL="):
                    return line.split("=", 1)[1].strip()
    return None

def month_summary():
    """Resumo do mês actual."""
    db_url = get_db_url()
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Total despesas
    cur.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM midas_transactions 
        WHERE date >= date_trunc('month', CURRENT_DATE)
        AND type = 'expense'
    """)
    expenses = float(cur.fetchone()[0])
    
    # Total receitas
    cur.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM midas_transactions 
        WHERE date >= date_trunc('month', CURRENT_DATE)
        AND type = 'income'
    """)
    income = float(cur.fetchone()[0])
    
    # Por categoria
    cur.execute("""
        SELECT c.name, COALESCE(SUM(t.amount), 0) as total
        FROM midas_transactions t
        JOIN midas_categories c ON t.category_id = c.id
        WHERE t.date >= date_trunc('month', CURRENT_DATE)
        AND t.type = 'expense'
        GROUP BY c.name
        ORDER BY total DESC
        LIMIT 10
    """)
    by_category = [{"category": r[0], "total": float(r[1])} for r in cur.fetchall()]
    
    # Número de transações
    cur.execute("""
        SELECT COUNT(*)
        FROM midas_transactions 
        WHERE date >= date_trunc('month', CURRENT_DATE)
    """)
    tx_count = cur.fetchone()[0]
    
    conn.close()
    
    return {
        "period": datetime.now().strftime("%B %Y"),
        "expenses": expenses,
        "income": income,
        "balance": income - expenses,
        "transaction_count": tx_count,
        "by_category": by_category
    }

def category_expenses(category_name: str):
    """Gastos numa categoria específica."""
    db_url = get_db_url()
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM midas_transactions t
        JOIN midas_categories c ON t.category_id = c.id
        WHERE c.name ILIKE %s
        AND t.date >= date_trunc('month', CURRENT_DATE)
    """, (f"%{category_name}%",))
    
    total = float(cur.fetchone()[0])
    conn.close()
    
    return {"category": category_name, "total": total, "period": "este mês"}

def last_transactions(n: int = 10):
    """Últimas N transações."""
    db_url = get_db_url()
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT t.date, t.description, t.amount, c.name, c.icon
        FROM midas_transactions t
        LEFT JOIN midas_categories c ON t.category_id = c.id
        ORDER BY t.date DESC, t.id DESC
        LIMIT %s
    """, (n,))
    
    transactions = []
    for r in cur.fetchall():
        transactions.append({
            "date": r[0].strftime("%Y-%m-%d") if r[0] else None,
            "description": r[1],
            "amount": float(r[2]),
            "category": r[3],
            "icon": r[4]
        })
    
    conn.close()
    return {"transactions": transactions}

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 midas-query.py <query_type> [args]")
        sys.exit(1)
    
    query_type = sys.argv[1]
    
    try:
        if query_type == "month_summary":
            result = month_summary()
        elif query_type == "category" and len(sys.argv) > 2:
            result = category_expenses(sys.argv[2])
        elif query_type == "last":
            n = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            result = last_transactions(n)
        else:
            result = {"error": f"Query desconhecida: {query_type}"}
        
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
