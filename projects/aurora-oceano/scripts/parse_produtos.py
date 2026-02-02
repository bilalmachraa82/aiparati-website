#!/usr/bin/env python3
"""
Parse Aurora Oceano product list from extracted markdown to structured data.
"""

import json
import re
import csv
from pathlib import Path

def parse_products(md_file):
    """Parse markdown file and extract products."""
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    products = []
    current_category = None
    
    # Regex patterns
    category_pattern = r'^([A-ZÁÉÍÓÚÂÊÔÀÇ\s\|\-]+)$'
    product_pattern = r'^(.+?)\s*\nRefª:\s*(\S+)\s*\n([\d,]+€|0,00€)'
    
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip page markers and headers
        if line.startswith('<!--') or line.startswith('Página') or line.startswith('Emitido') or not line:
            i += 1
            continue
        
        # Check for category headers (all caps, no numbers)
        if line.isupper() and not any(c.isdigit() for c in line) and 'ARTIGOS' not in line and 'PREÇO' not in line:
            if '|' in line:
                # Subcategory like "PRODUTOS | BACALHAU"
                current_category = line.strip()
            else:
                current_category = line.strip()
            i += 1
            continue
        
        # Skip header rows
        if 'Artigos' in line or 'Preço sem IVA' in line:
            i += 1
            continue
        
        # Try to parse product (name, ref, price pattern)
        # Products span multiple lines
        if current_category and line and not line.startswith('Qtd'):
            # Collect product name (may span multiple lines until Refª)
            product_name = line
            i += 1
            
            # Continue collecting name until we hit Refª
            while i < len(lines) and not lines[i].strip().startswith('Refª:'):
                next_line = lines[i].strip()
                if next_line and not next_line.startswith('<!--') and not next_line.startswith('Página'):
                    if next_line.endswith('€'):
                        break
                    product_name += ' ' + next_line
                i += 1
            
            # Now look for Refª
            if i < len(lines) and lines[i].strip().startswith('Refª:'):
                ref_line = lines[i].strip()
                ref_match = re.search(r'Refª:\s*(\S+)', ref_line)
                ref = ref_match.group(1) if ref_match else ''
                i += 1
                
                # Look for price
                if i < len(lines):
                    price_line = lines[i].strip()
                    price_match = re.search(r'([\d,]+)€', price_line)
                    if price_match:
                        price_str = price_match.group(1).replace(',', '.')
                        try:
                            price = float(price_str)
                        except:
                            price = 0.0
                        
                        products.append({
                            'categoria': current_category,
                            'nome': ' '.join(product_name.split()),  # Normalize whitespace
                            'referencia': ref,
                            'preco_sem_iva': price
                        })
                    i += 1
            continue
        
        i += 1
    
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
        print(f"  - {cat}: {len(prods)} produtos")
    
    # Products with price
    with_price = [p for p in products if p['preco_sem_iva'] > 0]
    print(f"\nProdutos com preço: {len(with_price)}")
    print(f"Produtos sem preço (0.00€): {len(products) - len(with_price)}")
    
    print(f"\nFicheiros criados:")
    print(f"  - {json_file}")
    print(f"  - {csv_file}")

if __name__ == '__main__':
    main()
