#!/usr/bin/env python3
"""
Aurora Oceano - Analytics Engine
Gera relatórios e análises a partir da base de dados
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


class AnalyticsEngine:
    """Motor de analytics para Aurora Oceano"""
    
    def __init__(self):
        self.conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    
    def close(self):
        self.conn.close()
    
    def _query(self, sql: str, params: tuple = None) -> List[Dict]:
        """Executa uma query e retorna resultados como lista de dicts"""
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params)
            return [dict(row) for row in cur.fetchall()]
    
    def monthly_revenue(self, year: int = None) -> List[Dict]:
        """Revenue por mês"""
        sql = """
            SELECT 
                year, month,
                COUNT(*) as invoice_count,
                ROUND(SUM(net_value)::numeric, 2) as total_revenue,
                ROUND(AVG(net_value)::numeric, 2) as avg_ticket
            FROM invoices
            WHERE (%s IS NULL OR year = %s)
            GROUP BY year, month
            ORDER BY year, month
        """
        return self._query(sql, (year, year))
    
    def top_customers(self, year: int = None, limit: int = 10) -> List[Dict]:
        """Top clientes por faturação"""
        sql = """
            SELECT 
                i.entity_name as customer_name,
                COUNT(*) as invoice_count,
                ROUND(SUM(i.net_value)::numeric, 2) as total_revenue,
                ROUND(AVG(i.net_value)::numeric, 2) as avg_ticket,
                MAX(i.date) as last_purchase
            FROM invoices i
            WHERE i.entity_name IS NOT NULL
                AND (%s IS NULL OR EXTRACT(YEAR FROM i.date) = %s)
            GROUP BY i.entity_name
            ORDER BY total_revenue DESC
            LIMIT %s
        """
        return self._query(sql, (year, year, limit))
    
    def yearly_comparison(self) -> List[Dict]:
        """Comparação ano a ano"""
        sql = """
            SELECT 
                year,
                COUNT(*) as invoice_count,
                ROUND(SUM(net_value)::numeric, 2) as total_revenue,
                ROUND(AVG(net_value)::numeric, 2) as avg_ticket
            FROM invoices
            GROUP BY year
            ORDER BY year
        """
        return self._query(sql)
    
    def growth_analysis(self) -> Dict:
        """Análise de crescimento YoY"""
        yearly = self.yearly_comparison()
        
        if len(yearly) < 2:
            return {"error": "Dados insuficientes para comparação"}
        
        # Ordenar por ano
        yearly.sort(key=lambda x: x['year'])
        
        current = yearly[-1]
        previous = yearly[-2]
        
        revenue_growth = ((current['total_revenue'] - previous['total_revenue']) / previous['total_revenue']) * 100
        ticket_growth = ((current['avg_ticket'] - previous['avg_ticket']) / previous['avg_ticket']) * 100
        
        return {
            "current_year": current['year'],
            "previous_year": previous['year'],
            "current_revenue": float(current['total_revenue']),
            "previous_revenue": float(previous['total_revenue']),
            "revenue_growth_pct": round(revenue_growth, 2),
            "current_avg_ticket": float(current['avg_ticket']),
            "previous_avg_ticket": float(previous['avg_ticket']),
            "ticket_growth_pct": round(ticket_growth, 2)
        }
    
    def seasonality_analysis(self) -> List[Dict]:
        """Análise de sazonalidade (média por mês, todos os anos)"""
        sql = """
            SELECT 
                month,
                ROUND(AVG(monthly_total)::numeric, 2) as avg_revenue,
                ROUND(AVG(invoice_count)::numeric, 0) as avg_invoices
            FROM (
                SELECT 
                    year, month,
                    SUM(net_value) as monthly_total,
                    COUNT(*) as invoice_count
                FROM invoices
                GROUP BY year, month
            ) monthly
            GROUP BY month
            ORDER BY month
        """
        return self._query(sql)
    
    def customer_segments(self) -> Dict:
        """Segmentação de clientes por valor"""
        sql = """
            WITH customer_totals AS (
                SELECT 
                    entity_name,
                    SUM(net_value) as total
                FROM invoices
                WHERE entity_name IS NOT NULL
                GROUP BY entity_name
            )
            SELECT 
                CASE 
                    WHEN total >= 50000 THEN 'VIP (>50k)'
                    WHEN total >= 20000 THEN 'Gold (20-50k)'
                    WHEN total >= 5000 THEN 'Silver (5-20k)'
                    ELSE 'Standard (<5k)'
                END as segment,
                COUNT(*) as customer_count,
                ROUND(SUM(total)::numeric, 2) as segment_revenue
            FROM customer_totals
            GROUP BY segment
            ORDER BY segment_revenue DESC
        """
        return self._query(sql)
    
    def generate_full_report(self) -> Dict:
        """Gera relatório completo"""
        return {
            "generated_at": datetime.now().isoformat(),
            "yearly_comparison": self.yearly_comparison(),
            "growth_analysis": self.growth_analysis(),
            "seasonality": self.seasonality_analysis(),
            "top_customers_2024": self.top_customers(year=2024, limit=10),
            "top_customers_2025": self.top_customers(year=2025, limit=10),
            "customer_segments": self.customer_segments(),
            "monthly_2024": self.monthly_revenue(year=2024),
            "monthly_2025": self.monthly_revenue(year=2025)
        }
    
    def export_for_dashboard(self, output_file: str = "dashboard_data.json"):
        """Exporta dados formatados para o dashboard"""
        report = self.generate_full_report()
        
        # Converter Decimals para float
        def convert_decimals(obj):
            if isinstance(obj, dict):
                return {k: convert_decimals(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_decimals(i) for i in obj]
            elif hasattr(obj, '__float__'):
                return float(obj)
            return obj
        
        report = convert_decimals(report)
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"✅ Dashboard data exportado: {output_file}")
        return report


if __name__ == "__main__":
    import sys
    
    engine = AnalyticsEngine()
    
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "export":
            output = sys.argv[2] if len(sys.argv) > 2 else "dashboard_data.json"
            engine.export_for_dashboard(output)
        else:
            # Mostrar relatório resumido
            print("\n📊 Aurora Oceano - Analytics Report")
            print("=" * 50)
            
            growth = engine.growth_analysis()
            if "error" not in growth:
                print(f"\n🚀 Crescimento {growth['previous_year']} → {growth['current_year']}:")
                print(f"   Revenue: €{growth['previous_revenue']:,.0f} → €{growth['current_revenue']:,.0f} ({growth['revenue_growth_pct']:+.1f}%)")
                print(f"   Ticket: €{growth['previous_avg_ticket']:,.0f} → €{growth['current_avg_ticket']:,.0f} ({growth['ticket_growth_pct']:+.1f}%)")
            
            print("\n📅 Por Ano:")
            for y in engine.yearly_comparison():
                print(f"   {y['year']}: {y['invoice_count']} faturas, €{float(y['total_revenue']):,.0f} (ticket médio: €{float(y['avg_ticket']):,.0f})")
            
            print("\n🏆 Top 5 Clientes (Total):")
            for i, c in enumerate(engine.top_customers(limit=5), 1):
                print(f"   {i}. {c['customer_name'][:40]}: €{float(c['total_revenue']):,.0f}")
            
            print("\n👥 Segmentos de Clientes:")
            for s in engine.customer_segments():
                print(f"   {s['segment']}: {s['customer_count']} clientes, €{float(s['segment_revenue']):,.0f}")
    
    finally:
        engine.close()
