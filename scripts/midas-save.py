#!/usr/bin/env python3
"""
MIDAS Save - Guarda transação na base de dados Neon
Uso: python3 midas-save.py '<json_data>'
"""

import sys
import os
import json
import psycopg2
from datetime import datetime

def get_db_url():
    """Obtém URL da base de dados."""
    secrets_path = os.path.expanduser("~/clawd/.env.secrets")
    if os.path.exists(secrets_path):
        with open(secrets_path) as f:
            for line in f:
                if line.startswith("MIDAS_DATABASE_URL="):
                    return line.split("=", 1)[1].strip()
    return None

def get_category_id(cur, category_name: str) -> int:
    """Obtém ID da categoria, cria se não existir."""
    cur.execute("SELECT id FROM midas_categories WHERE name ILIKE %s", (f"%{category_name}%",))
    row = cur.fetchone()
    if row:
        return row[0]
    
    # Criar categoria nova
    cur.execute("""
        INSERT INTO midas_categories (name, type, icon) 
        VALUES (%s, 'expense', '📦') 
        RETURNING id
    """, (category_name,))
    return cur.fetchone()[0]

def save_transaction(data: dict) -> dict:
    """Guarda transação na base de dados."""
    
    db_url = get_db_url()
    if not db_url:
        return {"error": "MIDAS_DATABASE_URL não encontrada"}
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Obter categoria
        category_name = data.get("category_suggestion", "Outros")
        category_id = get_category_id(cur, category_name)
        
        # Inserir transação
        cur.execute("""
            INSERT INTO midas_transactions 
            (date, description, amount, category_id, type, source, merchant, receipt_image_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            data.get("date", datetime.now().strftime("%Y-%m-%d")),
            data.get("merchant", "Desconhecido"),
            data.get("total", 0),
            category_id,
            "expense",
            data.get("source", "manual"),
            data.get("merchant"),
            data.get("image_path")
        ))
        
        tx_id = cur.fetchone()[0]
        conn.commit()
        
        # Obter totais do mês
        cur.execute("""
            SELECT COALESCE(SUM(amount), 0) 
            FROM midas_transactions 
            WHERE date >= date_trunc('month', CURRENT_DATE)
            AND type = 'expense'
        """)
        month_total = float(cur.fetchone()[0])
        
        conn.close()
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "category": category_name,
            "month_total": month_total
        }
        
    except Exception as e:
        return {"error": str(e)}


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 midas-save.py '<json_data>'")
        sys.exit(1)
    
    try:
        data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"JSON inválido: {e}"}))
        sys.exit(1)
    
    result = save_transaction(data)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
