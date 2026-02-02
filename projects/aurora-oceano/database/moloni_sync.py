#!/usr/bin/env python3
"""
Aurora Oceano - Moloni Sync Manager
Sincroniza dados do Moloni com a base de dados PostgreSQL (Neon)
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Any
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class MoloniAPI:
    """Cliente para a API do Moloni"""
    
    BASE_URL = "https://api.moloni.pt/v1"
    
    def __init__(self):
        self.client_id = os.getenv("MOLONI_CLIENT_ID")
        self.client_secret = os.getenv("MOLONI_CLIENT_SECRET")
        self.company_id = os.getenv("MOLONI_EMPRESA_ID")
        self.access_token = os.getenv("MOLONI_ACCESS_TOKEN")
        self.refresh_token = os.getenv("MOLONI_REFRESH_TOKEN")
        self.token_expires = None
    
    def refresh_access_token(self) -> bool:
        """Renova o access token usando o refresh token"""
        url = f"{self.BASE_URL}/grant/"
        params = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": self.refresh_token
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            self.access_token = data.get("access_token")
            self.refresh_token = data.get("refresh_token")
            self.token_expires = datetime.now() + timedelta(seconds=data.get("expires_in", 3600))
            print(f"✅ Token renovado, expira em: {self.token_expires}")
            return True
        else:
            print(f"❌ Erro ao renovar token: {response.text}")
            return False
    
    def _request(self, endpoint: str, params: Dict = None) -> Optional[Any]:
        """Faz um request à API do Moloni"""
        # Renovar token se necessário
        if self.token_expires and datetime.now() >= self.token_expires:
            self.refresh_access_token()
        
        url = f"{self.BASE_URL}/{endpoint}/"
        query_params = {"access_token": self.access_token}
        
        body = {"company_id": self.company_id}
        if params:
            body.update(params)
        
        response = requests.post(url, params=query_params, data=body)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Erro na API [{endpoint}]: {response.text}")
            return None
    
    def get_customers(self, qty: int = 50, offset: int = 0) -> List[Dict]:
        """Obtém lista de clientes"""
        return self._request("customers/getAll", {"qty": qty, "offset": offset}) or []
    
    def get_products(self, qty: int = 50, offset: int = 0) -> List[Dict]:
        """Obtém lista de produtos"""
        return self._request("products/getAll", {"qty": qty, "offset": offset}) or []
    
    def get_invoices(self, year: int, qty: int = 50, offset: int = 0) -> List[Dict]:
        """Obtém faturas de um ano específico"""
        return self._request("invoices/getAll", {"year": year, "qty": qty, "offset": offset}) or []
    
    def get_all_paginated(self, method: str, params: Dict = None, batch_size: int = 50) -> List[Dict]:
        """Obtém todos os registos com paginação automática"""
        all_records = []
        offset = 0
        
        while True:
            request_params = {"qty": batch_size, "offset": offset}
            if params:
                request_params.update(params)
            
            batch = self._request(method, request_params) or []
            
            if not batch:
                break
            
            all_records.extend(batch)
            print(f"  📦 {method}: {len(all_records)} registos...")
            
            if len(batch) < batch_size:
                break
            
            offset += batch_size
        
        return all_records


class DatabaseManager:
    """Gestor da base de dados PostgreSQL"""
    
    def __init__(self):
        self.connection_string = os.getenv("DATABASE_URL")
        self.conn = None
    
    def connect(self):
        """Estabelece conexão com a base de dados"""
        if not self.connection_string:
            raise ValueError("DATABASE_URL não configurado")
        
        self.conn = psycopg2.connect(self.connection_string)
        print("✅ Conectado à base de dados")
    
    def close(self):
        """Fecha a conexão"""
        if self.conn:
            self.conn.close()
    
    def execute_schema(self, schema_file: str):
        """Executa um ficheiro SQL de schema"""
        with open(schema_file, 'r') as f:
            sql = f.read()
        
        with self.conn.cursor() as cur:
            cur.execute(sql)
        self.conn.commit()
        print(f"✅ Schema executado: {schema_file}")
    
    def upsert_customers(self, customers: List[Dict]):
        """Insere ou atualiza clientes"""
        if not customers:
            return
        
        sql = """
            INSERT INTO customers (customer_id, name, vat, email, address, city, zip_code, country_id, moloni_sync_at)
            VALUES %s
            ON CONFLICT (customer_id) DO UPDATE SET
                name = EXCLUDED.name,
                vat = EXCLUDED.vat,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                zip_code = EXCLUDED.zip_code,
                country_id = EXCLUDED.country_id,
                updated_at = CURRENT_TIMESTAMP,
                moloni_sync_at = EXCLUDED.moloni_sync_at
        """
        
        values = [
            (
                c.get("customer_id"),
                c.get("name", "")[:255],
                c.get("vat"),
                c.get("email"),
                c.get("address"),
                c.get("city"),
                c.get("zip_code"),
                c.get("country_id", 1),
                datetime.now()
            )
            for c in customers
        ]
        
        with self.conn.cursor() as cur:
            execute_values(cur, sql, values)
        self.conn.commit()
        print(f"✅ {len(customers)} clientes sincronizados")
    
    def upsert_products(self, products: List[Dict]):
        """Insere ou atualiza produtos"""
        if not products:
            return
        
        sql = """
            INSERT INTO products (product_id, name, reference, category_id, unit, price, stock, has_stock, moloni_sync_at)
            VALUES %s
            ON CONFLICT (product_id) DO UPDATE SET
                name = EXCLUDED.name,
                reference = EXCLUDED.reference,
                category_id = EXCLUDED.category_id,
                unit = EXCLUDED.unit,
                price = EXCLUDED.price,
                stock = EXCLUDED.stock,
                has_stock = EXCLUDED.has_stock,
                updated_at = CURRENT_TIMESTAMP,
                moloni_sync_at = EXCLUDED.moloni_sync_at
        """
        
        values = [
            (
                p.get("product_id"),
                p.get("name", "")[:255],
                p.get("reference"),
                p.get("category_id"),
                p.get("unit"),
                p.get("price", 0),
                p.get("stock", 0),
                p.get("has_stock", False),
                datetime.now()
            )
            for p in products
        ]
        
        with self.conn.cursor() as cur:
            execute_values(cur, sql, values)
        self.conn.commit()
        print(f"✅ {len(products)} produtos sincronizados")
    
    def upsert_invoices(self, invoices: List[Dict]):
        """Insere ou atualiza faturas"""
        if not invoices:
            return
        
        sql = """
            INSERT INTO invoices (
                document_id, customer_id, date, document_type, number,
                net_value, gross_value, taxes_value, status,
                entity_name, entity_vat, salesman_id, our_reference, your_reference, moloni_sync_at
            )
            VALUES %s
            ON CONFLICT (document_id) DO UPDATE SET
                net_value = EXCLUDED.net_value,
                gross_value = EXCLUDED.gross_value,
                taxes_value = EXCLUDED.taxes_value,
                status = EXCLUDED.status,
                moloni_sync_at = EXCLUDED.moloni_sync_at
        """
        
        values = [
            (
                inv.get("document_id"),
                inv.get("customer_id"),
                inv.get("date", "")[:10] if inv.get("date") else None,
                inv.get("document_type"),
                inv.get("number"),
                inv.get("net_value", 0),
                inv.get("gross_value", 0),
                inv.get("taxes_value", 0),
                inv.get("status"),
                inv.get("entity_name", "")[:255] if inv.get("entity_name") else None,
                inv.get("entity_vat"),
                inv.get("salesman_id"),
                inv.get("our_reference"),
                inv.get("your_reference"),
                datetime.now()
            )
            for inv in invoices
        ]
        
        with self.conn.cursor() as cur:
            execute_values(cur, sql, values)
        self.conn.commit()
        print(f"✅ {len(invoices)} faturas sincronizadas")
    
    def get_stats(self) -> Dict:
        """Obtém estatísticas da base de dados"""
        stats = {}
        
        with self.conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM customers")
            stats["customers"] = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM products")
            stats["products"] = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM invoices")
            stats["invoices"] = cur.fetchone()[0]
            
            cur.execute("SELECT year, COUNT(*), SUM(net_value) FROM invoices GROUP BY year ORDER BY year")
            stats["by_year"] = cur.fetchall()
        
        return stats


def sync_from_json_files(db: DatabaseManager, data_dir: str):
    """Sincroniza dados a partir dos ficheiros JSON exportados"""
    import glob
    
    # Clientes
    customers_file = os.path.join(data_dir, "customers_all.json")
    if os.path.exists(customers_file):
        with open(customers_file, 'r') as f:
            customers = json.load(f)
        db.upsert_customers(customers)
    
    # Produtos
    products_file = os.path.join(data_dir, "products.json")
    if os.path.exists(products_file):
        with open(products_file, 'r') as f:
            products = json.load(f)
        db.upsert_products(products)
    
    # Faturas
    for invoice_file in glob.glob(os.path.join(data_dir, "invoices_*_all.json")):
        with open(invoice_file, 'r') as f:
            invoices = json.load(f)
        db.upsert_invoices(invoices)


def full_sync(api: MoloniAPI, db: DatabaseManager, years: List[int] = None):
    """Faz uma sincronização completa"""
    if years is None:
        years = [2024, 2025]
    
    print("\n🔄 Iniciando sincronização completa...")
    
    # Renovar token
    api.refresh_access_token()
    
    # Clientes
    print("\n📥 A sincronizar clientes...")
    customers = api.get_all_paginated("customers/getAll")
    db.upsert_customers(customers)
    
    # Produtos
    print("\n📥 A sincronizar produtos...")
    products = api.get_all_paginated("products/getAll")
    db.upsert_products(products)
    
    # Faturas por ano
    for year in years:
        print(f"\n📥 A sincronizar faturas de {year}...")
        invoices = api.get_all_paginated("invoices/getAll", {"year": year})
        db.upsert_invoices(invoices)
    
    # Mostrar estatísticas
    print("\n📊 Estatísticas finais:")
    stats = db.get_stats()
    print(f"  Clientes: {stats['customers']}")
    print(f"  Produtos: {stats['products']}")
    print(f"  Faturas: {stats['invoices']}")
    for year, count, total in stats['by_year']:
        print(f"    {year}: {count} faturas, €{total:,.2f}")


def incremental_sync(api: MoloniAPI, db: DatabaseManager):
    """
    Faz uma sincronização incremental (rápida)
    - Só faturas do ano actual
    - Último batch de clientes (para novos)
    """
    current_year = datetime.now().year
    
    print(f"\n⚡ Sincronização incremental ({datetime.now().strftime('%H:%M')})")
    
    # Renovar token se necessário
    api.refresh_access_token()
    
    # Últimos clientes (os mais recentes têm IDs maiores)
    print("  📥 A verificar novos clientes...")
    customers = api._request("customers/getAll", {"qty": 50, "offset": 0}) or []
    if customers:
        db.upsert_customers(customers)
        print(f"  ✅ {len(customers)} clientes verificados")
    
    # Faturas do ano actual (paginação completa para garantir todas)
    # Moloni ordena por data desc, então as mais recentes vêm primeiro
    print(f"  📥 A verificar faturas de {current_year}...")
    invoices = api.get_all_paginated("invoices/getAll", {"year": current_year})
    if invoices:
        db.upsert_invoices(invoices)
        print(f"  ✅ {len(invoices)} faturas de {current_year} sincronizadas")
    
    # Stats rápidas
    with db.conn.cursor() as cur:
        cur.execute("""
            SELECT COUNT(*), SUM(net_value) 
            FROM invoices 
            WHERE date >= CURRENT_DATE
        """)
        today_count, today_value = cur.fetchone()
        today_value = today_value or 0
        print(f"  📊 Hoje: {today_count or 0} faturas, €{today_value:,.2f}")
    
    print(f"  ✅ Sync incremental concluído")


if __name__ == "__main__":
    import sys
    
    # Verificar argumentos
    if len(sys.argv) < 2:
        print("""
Aurora Oceano - Moloni Sync Manager
===================================

Uso:
    python moloni_sync.py init          # Criar tabelas na DB
    python moloni_sync.py sync          # Sincronizar com Moloni API
    python moloni_sync.py import <dir>  # Importar de ficheiros JSON
    python moloni_sync.py stats         # Mostrar estatísticas
        """)
        sys.exit(1)
    
    command = sys.argv[1]
    
    db = DatabaseManager()
    
    try:
        db.connect()
        
        if command == "init":
            schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
            db.execute_schema(schema_file)
        
        elif command == "sync":
            api = MoloniAPI()
            full_sync(api, db)
        
        elif command == "incremental":
            api = MoloniAPI()
            incremental_sync(api, db)
        
        elif command == "import":
            data_dir = sys.argv[2] if len(sys.argv) > 2 else "../aurora-analytics/data"
            sync_from_json_files(db, data_dir)
        
        elif command == "stats":
            stats = db.get_stats()
            print("\n📊 Estatísticas da Base de Dados:")
            print(f"  Clientes: {stats['customers']}")
            print(f"  Produtos: {stats['products']}")
            print(f"  Faturas: {stats['invoices']}")
            for year, count, total in stats['by_year']:
                print(f"    {year}: {count} faturas, €{total:,.2f}")
        
        else:
            print(f"❌ Comando desconhecido: {command}")
    
    except Exception as e:
        print(f"❌ Erro: {e}")
        raise
    
    finally:
        db.close()
