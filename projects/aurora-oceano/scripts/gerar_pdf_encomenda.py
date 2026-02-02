#!/usr/bin/env python3
"""
Aurora Oceano - Gerador de PDFs de Encomendas
Integra com Moloni API para gerar PDFs automaticamente.
"""

import os
import json
import requests
from datetime import datetime
from pathlib import Path

# Moloni API Config
MOLONI_CLIENT_ID = os.getenv('MOLONI_CLIENT_ID', 'auroroceanolda')
MOLONI_CLIENT_SECRET = os.getenv('MOLONI_CLIENT_SECRET', 'db5640005feb0d6d8f6f47c8a1ee56391e49a304')
MOLONI_COMPANY_ID = os.getenv('MOLONI_EMPRESA_ID', '276603')
MOLONI_REDIRECT_URI = 'https://aiparati.pt/moloni/callback'
MOLONI_API_URL = 'https://api.moloni.pt/v1'

# Output directory
PDF_DIR = Path('/home/ubuntu/clawd/projects/aurora-oceano/pdfs')
PDF_DIR.mkdir(exist_ok=True)

class MoloniAPI:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
    
    def authenticate(self, code=None):
        """Get access token using authorization code or refresh token."""
        data = {
            'client_id': MOLONI_CLIENT_ID,
            'client_secret': MOLONI_CLIENT_SECRET,
        }
        
        if code:
            data['grant_type'] = 'authorization_code'
            data['code'] = code
            data['redirect_uri'] = MOLONI_REDIRECT_URI
        elif self.refresh_token:
            data['grant_type'] = 'refresh_token'
            data['refresh_token'] = self.refresh_token
        else:
            raise Exception("No code or refresh token available")
        
        response = requests.post(f'{MOLONI_API_URL}/grant/', data=data)
        
        if response.status_code == 200:
            tokens = response.json()
            self.access_token = tokens.get('access_token')
            self.refresh_token = tokens.get('refresh_token')
            return True
        else:
            print(f"Auth error: {response.text}")
            return False
    
    def get_documents(self, doc_type='encomendas', date_from=None, date_to=None):
        """Get documents from Moloni."""
        if not self.access_token:
            raise Exception("Not authenticated")
        
        params = {
            'access_token': self.access_token,
            'company_id': MOLONI_COMPANY_ID,
        }
        
        if date_from:
            params['date_from'] = date_from
        if date_to:
            params['date_to'] = date_to
        
        # Map doc_type to endpoint
        endpoints = {
            'encomendas': 'customerOrders/getAll',
            'facturas': 'invoices/getAll',
            'guias': 'deliveryNotes/getAll'
        }
        
        endpoint = endpoints.get(doc_type, 'customerOrders/getAll')
        response = requests.post(f'{MOLONI_API_URL}/{endpoint}/', data=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error getting documents: {response.text}")
            return []
    
    def get_document_pdf(self, doc_type, doc_id):
        """Get PDF of a specific document."""
        if not self.access_token:
            raise Exception("Not authenticated")
        
        params = {
            'access_token': self.access_token,
            'company_id': MOLONI_COMPANY_ID,
            'document_id': doc_id
        }
        
        endpoints = {
            'encomendas': 'customerOrders/getPDFLink',
            'facturas': 'invoices/getPDFLink',
            'guias': 'deliveryNotes/getPDFLink'
        }
        
        endpoint = endpoints.get(doc_type, 'customerOrders/getPDFLink')
        response = requests.post(f'{MOLONI_API_URL}/{endpoint}/', data=params)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('url')
        else:
            print(f"Error getting PDF: {response.text}")
            return None
    
    def download_pdf(self, pdf_url, filename):
        """Download PDF to local file."""
        response = requests.get(pdf_url)
        if response.status_code == 200:
            filepath = PDF_DIR / filename
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return str(filepath)
        return None


def gerar_pdf_demo(encomenda_id: str, cliente: str, itens: list, total: float):
    """Generate a demo PDF without Moloni (for testing)."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import cm
    
    filename = f"encomenda_{encomenda_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = PDF_DIR / filename
    
    c = canvas.Canvas(str(filepath), pagesize=A4)
    width, height = A4
    
    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(2*cm, height - 2*cm, "AURORA OCEANO")
    c.setFont("Helvetica", 10)
    c.drawString(2*cm, height - 2.6*cm, "Rua Fernando Moser nº 9, Foros de Amora")
    c.drawString(2*cm, height - 3*cm, "2845-281 Seixal | NIF: 517670461")
    
    # Document info
    c.setFont("Helvetica-Bold", 14)
    c.drawString(2*cm, height - 4.5*cm, f"ENCOMENDA #{encomenda_id}")
    c.setFont("Helvetica", 10)
    c.drawString(2*cm, height - 5.1*cm, f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    
    # Client
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, height - 6.5*cm, "Cliente:")
    c.setFont("Helvetica", 10)
    c.drawString(2*cm, height - 7.1*cm, cliente)
    
    # Items table
    y = height - 9*cm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2*cm, y, "Produto")
    c.drawString(10*cm, y, "Qtd")
    c.drawString(12*cm, y, "Preço")
    c.drawString(15*cm, y, "Subtotal")
    
    c.setFont("Helvetica", 10)
    y -= 0.6*cm
    for item in itens:
        c.drawString(2*cm, y, item['produto'][:40])
        c.drawString(10*cm, y, f"{item['quantidade']} kg")
        c.drawString(12*cm, y, f"€{item['preco']:.2f}")
        c.drawString(15*cm, y, f"€{item['quantidade'] * item['preco']:.2f}")
        y -= 0.5*cm
    
    # Total
    y -= 1*cm
    c.setFont("Helvetica-Bold", 12)
    c.drawString(12*cm, y, "TOTAL:")
    c.drawString(15*cm, y, f"€{total:.2f}")
    
    # Footer
    c.setFont("Helvetica", 8)
    c.drawString(2*cm, 2*cm, "Documento gerado automaticamente por Aurora Oceano Bot | AiParaTi")
    
    c.save()
    return str(filepath)


def processar_encomendas_pendentes():
    """Process all pending orders and generate PDFs."""
    # Demo data (would come from Moloni in production)
    encomendas = [
        {
            'id': 'ENC-001',
            'cliente': 'Restaurante Mar Azul',
            'itens': [
                {'produto': 'Camarão 30/40', 'quantidade': 20, 'preco': 4.75},
                {'produto': 'Polvo 2000/3000', 'quantidade': 10, 'preco': 12.20}
            ],
            'total': 217.00
        },
        {
            'id': 'ENC-002',
            'cliente': 'Hotel Sol',
            'itens': [
                {'produto': 'Bacalhau Posta 400/600', 'quantidade': 15, 'preco': 16.62},
                {'produto': 'Salmão Posta Extra', 'quantidade': 20, 'preco': 9.65},
                {'produto': 'Linguado 500/700', 'quantidade': 8, 'preco': 8.17}
            ],
            'total': 507.66
        }
    ]
    
    pdfs_gerados = []
    for enc in encomendas:
        pdf_path = gerar_pdf_demo(enc['id'], enc['cliente'], enc['itens'], enc['total'])
        pdfs_gerados.append(pdf_path)
        print(f"✅ PDF gerado: {pdf_path}")
    
    return pdfs_gerados


if __name__ == '__main__':
    print("🐟 Aurora Oceano - Gerador de PDFs\n")
    
    # Check if reportlab is installed
    try:
        import reportlab
        pdfs = processar_encomendas_pendentes()
        print(f"\n📄 {len(pdfs)} PDFs gerados em {PDF_DIR}")
    except ImportError:
        print("⚠️ reportlab não instalado. A instalar...")
        import subprocess
        subprocess.run(['pip', 'install', 'reportlab'])
        pdfs = processar_encomendas_pendentes()
        print(f"\n📄 {len(pdfs)} PDFs gerados em {PDF_DIR}")
