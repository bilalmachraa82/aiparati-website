#!/usr/bin/env python3
"""
Aurora Oceano - Daily Sync
Sincroniza dados novos do Moloni para o Neon
Executar via cron: 0 6 * * * /path/to/venv/bin/python /path/to/daily_sync.py
"""

import os
import sys
import json
import requests
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values

# Configuração
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_eyV0cWXPA3wp@ep-patient-snow-agyxeuj2-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require")
MOLONI_CLIENT_ID = os.getenv("MOLONI_CLIENT_ID", "auroroceanolda")
MOLONI_CLIENT_SECRET = os.getenv("MOLONI_CLIENT_SECRET", "db5640005feb0d6d8f6f47c8a1ee56391e49a304")
MOLONI_COMPANY_ID = os.getenv("MOLONI_EMPRESA_ID", "276603")

# Carregar tokens do ficheiro
TOKENS_FILE = "/home/ubuntu/clawd/.env.secrets.moloni"

def load_tokens():
    """Carrega tokens do ficheiro"""
    tokens = {}
    if os.path.exists(TOKENS_FILE):
        with open(TOKENS_FILE, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    tokens[key] = value
    return tokens

def save_tokens(access_token, refresh_token):
    """Guarda tokens actualizados"""
    content = f"""# Moloni API Credentials - Aurora Oceano
# Actualizado: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}

MOLONI_CLIENT_ID={MOLONI_CLIENT_ID}
MOLONI_CLIENT_SECRET={MOLONI_CLIENT_SECRET}
MOLONI_EMPRESA_ID={MOLONI_COMPANY_ID}

# OAuth Tokens
MOLONI_ACCESS_TOKEN={access_token}
MOLONI_REFRESH_TOKEN={refresh_token}
"""
    with open(TOKENS_FILE, 'w') as f:
        f.write(content)

def refresh_moloni_token(refresh_token):
    """Renova o access token"""
    url = "https://api.moloni.pt/v1/grant/"
    params = {
        "grant_type": "refresh_token",
        "client_id": MOLONI_CLIENT_ID,
        "client_secret": MOLONI_CLIENT_SECRET,
        "refresh_token": refresh_token
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return data.get("access_token"), data.get("refresh_token")
    else:
        print(f"❌ Erro ao renovar token: {response.text}")
        return None, None

def get_moloni_invoices(access_token, year, offset=0):
    """Obtém faturas do Moloni"""
    url = f"https://api.moloni.pt/v1/invoices/getAll/?access_token={access_token}"
    data = {
        "company_id": MOLONI_COMPANY_ID,
        "year": year,
        "qty": 50,
        "offset": offset
    }
    
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json()
    return []

def safe_str(val, max_len=255):
    """Converte valor para string segura"""
    if val is None:
        return None
    if isinstance(val, dict):
        return str(val.get('name', val.get('value', str(val))))[:max_len]
    return str(val)[:max_len]

def sync_invoices(conn, access_token, year):
    """Sincroniza faturas de um ano"""
    cur = conn.cursor()
    
    # Obter último document_id para este ano
    cur.execute("""
        SELECT MAX(document_id) FROM invoices 
        WHERE EXTRACT(YEAR FROM date) = %s
    """, (year,))
    last_id = cur.fetchone()[0] or 0
    
    print(f"  📥 A sincronizar {year} (último ID: {last_id})...")
    
    all_invoices = []
    offset = 0
    new_count = 0
    
    while True:
        batch = get_moloni_invoices(access_token, year, offset)
        if not batch:
            break
        
        # Filtrar apenas novos
        new_invoices = [inv for inv in batch if inv.get("document_id", 0) > last_id]
        all_invoices.extend(new_invoices)
        new_count += len(new_invoices)
        
        if len(batch) < 50:
            break
        offset += 50
    
    if all_invoices:
        values = [
            (
                inv.get("document_id"),
                inv.get("customer_id"),
                inv.get("date", "")[:10] if inv.get("date") else None,
                safe_str(inv.get("document_type"), 50),
                safe_str(inv.get("number"), 50),
                float(inv.get("net_value", 0) or 0),
                float(inv.get("gross_value", 0) or 0),
                float(inv.get("taxes_value", 0) or 0),
                inv.get("status"),
                safe_str(inv.get("entity_name")),
                safe_str(inv.get("entity_vat"), 20),
                inv.get("salesman_id"),
                safe_str(inv.get("our_reference")),
                datetime.now()
            )
            for inv in all_invoices
        ]
        
        execute_values(cur, """
            INSERT INTO invoices (document_id, customer_id, date, document_type, number, 
                net_value, gross_value, taxes_value, status, entity_name, entity_vat, 
                salesman_id, our_reference, moloni_sync_at)
            VALUES %s
            ON CONFLICT (document_id) DO NOTHING
        """, values)
        conn.commit()
    
    print(f"  ✅ {new_count} novas faturas de {year}")
    return new_count

def main():
    print(f"\n🔄 Aurora Oceano Daily Sync - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)
    
    # Carregar tokens
    tokens = load_tokens()
    refresh_token = tokens.get("MOLONI_REFRESH_TOKEN")
    
    if not refresh_token:
        print("❌ Refresh token não encontrado!")
        sys.exit(1)
    
    # Renovar token
    print("🔑 A renovar token Moloni...")
    access_token, new_refresh = refresh_moloni_token(refresh_token)
    
    if not access_token:
        print("❌ Falha ao renovar token!")
        sys.exit(1)
    
    # Guardar novos tokens
    save_tokens(access_token, new_refresh)
    print("✅ Token renovado!")
    
    # Conectar à DB
    print("🗄️ A conectar ao Neon...")
    conn = psycopg2.connect(DATABASE_URL)
    
    # Sincronizar anos actuais
    current_year = datetime.now().year
    total_new = 0
    
    for year in [current_year - 1, current_year]:
        total_new += sync_invoices(conn, access_token, year)
    
    # Estatísticas finais
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM invoices")
    total_invoices = cur.fetchone()[0]
    
    cur.execute("""
        SELECT EXTRACT(YEAR FROM date)::int, COUNT(*), ROUND(SUM(net_value)::numeric, 2)
        FROM invoices GROUP BY EXTRACT(YEAR FROM date) ORDER BY 1
    """)
    stats = cur.fetchall()
    
    conn.close()
    
    print("\n📊 RESUMO:")
    print(f"   Novas faturas: {total_new}")
    print(f"   Total na DB: {total_invoices}")
    for year, count, total in stats:
        print(f"   {year}: {count} faturas, €{total:,.2f}")
    
    print(f"\n✅ Sync completo às {datetime.now().strftime('%H:%M')}")

if __name__ == "__main__":
    main()
