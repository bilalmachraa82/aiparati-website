#!/usr/bin/env python3
"""
Parse Aurora Oceano product list - Version 2
Better category detection.
"""

import json
import re
import csv
from pathlib import Path

# Known categories from the PDF
CATEGORIES = [
    "BACALHAU",
    "CARNES", 
    "LEGUMES",
    "MARISCOS",
    "PEIXE E MOLUSCOS",
    "PEIXE HIGIENIZADO",
    "PRODUTOS | BACALHAU",
    "PRODUTOS | CARNES",
    "PRODUTOS | DOCES",
    "PRODUTOS | LEGUMES",
    "PRODUTOS | MARISCOS",
    "PRODUTOS | PEIXE",
    "PRODUTOS | SALGADOS",
    "PRODUTOS | Sub-Categoria exemplo - Produtos/Serviços",
    "PRODUTOS | Sub-Categoria exemplo - Produtos/Serviços | SERVIÇOS"
]

def parse_products(md_file):
    """Parse markdown file and extract products."""
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    products = []
    current_category = "SEM CATEGORIA"
    
    # Pattern for product entries: name lines, then Refª, then price
    # Split by Refª to find products
    parts = re.split(r'(Refª:\s*\S+)', content)
    
    i = 0
    while i < len(parts) - 1:
        # Before Refª should be the product name (and possibly category)
        before = parts[i].strip()
        ref_part = parts[i + 1] if i + 1 < len(parts) else ""
        
        # Extract reference
        ref_match = re.search(r'Refª:\s*(\S+)', ref_part)
        if not ref_match:
            i += 1
            continue
        
        ref = ref_match.group(1)
        
        # Get lines before ref to find product name and possibly category
        lines = [l.strip() for l in before.split('\n') if l.strip()]
        
        # Check for category changes
        for line in lines:
            # Skip page markers
            if line.startswith('<!--') or line.startswith('Página') or line.startswith('Emitido'):
                continue
            if line in ['Artigos', 'Preço sem IVA', 'Resumo']:
                continue
            if line.startswith('Qtd.'):
                continue
            
            # Check if it's a known category
            for cat in CATEGORIES:
                if line == cat or line.upper() == cat.upper():
                    current_category = cat
                    break
        
        # Product name is usually the last non-category, non-header lines
        product_lines = []
        for line in reversed(lines):
            if line.startswith('<!--') or line.startswith('Página') or line.startswith('Emitido'):
                continue
            if line in ['Artigos', 'Preço sem IVA', 'Resumo']:
                continue
            if line.startswith('Qtd.'):
                continue
            if line in CATEGORIES or line.upper() in [c.upper() for c in CATEGORIES]:
                break
            if line.endswith('€'):
                continue
            product_lines.insert(0, line)
        
        product_name = ' '.join(product_lines)
        
        # Now find the price after the Refª
        # It should be in the next part or after
        price = 0.0
        if i + 2 < len(parts):
            after = parts[i + 2]
            price_match = re.search(r'^[\s\n]*([\d,]+)€', after)
            if price_match:
                price_str = price_match.group(1).replace(',', '.')
                try:
                    price = float(price_str)
                except:
                    price = 0.0
        
        if product_name and ref:
            products.append({
                'categoria': current_category,
                'nome': ' '.join(product_name.split()),
                'referencia': ref,
                'preco_sem_iva': price
            })
        
        i += 2
    
    return products

def main():
    base_dir = Path('/home/ubuntu/clawd/projects/aurora-oceano')
    md_file = base_dir / 'data/9cfff98c-ea64-44f2-bd65-f526bf45b947/output.md'
    
    products = parse_products(md_file)
    
    # Save as JSON
    json_file = base_dir / 'data/produtos.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Save as CSV
    csv_file = base_dir / 'data/produtos.csv'
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['categoria', 'nome', 'referencia', 'preco_sem_iva'])
        writer.writeheader()
        writer.writerows(products)
    
    # Print summary
    print(f"Total produtos: {len(products)}")
    
    # Group by category
    categories = {}
    for p in products:
        cat = p['categoria']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(p)
    
    print(f"\nCategorias ({len(categories)}):")
    for cat, prods in sorted(categories.items()):
        with_price = len([p for p in prods if p['preco_sem_iva'] > 0])
        print(f"  - {cat}: {len(prods)} produtos ({with_price} com preço)")
    
    # Products with price
    with_price = [p for p in products if p['preco_sem_iva'] > 0]
    print(f"\nProdutos com preço: {len(with_price)}")
    print(f"Produtos sem preço (0.00€): {len(products) - len(with_price)}")
    
    # Sample products
    print(f"\nExemplos de produtos:")
    for p in products[:5]:
        print(f"  [{p['categoria']}] {p['nome']} (Ref: {p['referencia']}) - {p['preco_sem_iva']}€")
    
    print(f"\nFicheiros criados:")
    print(f"  - {json_file}")
    print(f"  - {csv_file}")

if __name__ == '__main__':
    main()
