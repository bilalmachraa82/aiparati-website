#!/usr/bin/env python3
"""
Aurora Oceano Sales Bot - Demo
Agente IA para gestão de pedidos e negociação automática.
"""

import json
import re
from pathlib import Path
from datetime import datetime

# Load data
BASE_DIR = Path(__file__).parent.parent
PRODUTOS = json.load(open(BASE_DIR / 'data/produtos.json', encoding='utf-8'))
REGRAS = json.load(open(BASE_DIR / 'config/regras_negociacao.json', encoding='utf-8'))

# Index produtos by ref and name
PRODUTOS_BY_REF = {p['referencia']: p for p in PRODUTOS}
PRODUTOS_BY_NAME = {p['nome'].lower(): p for p in PRODUTOS}

# Simulated database
CLIENTES = {
    "restaurante_mar": {"nome": "Restaurante Mar Azul", "tipo": "fiel", "pedidos": 25, "divida": 0},
    "cafe_central": {"nome": "Café Central", "tipo": "regular", "pedidos": 8, "divida": 0},
    "hotel_sol": {"nome": "Hotel Sol", "tipo": "vip", "pedidos": 120, "divida": 0},
    "novo_cliente": {"nome": "Novo Cliente", "tipo": "novo", "pedidos": 0, "divida": 0}
}

PEDIDOS_PENDENTES = []

def buscar_produto(query):
    """Search for product by name or reference."""
    query = query.lower().strip()
    
    # Try exact ref match
    if query in PRODUTOS_BY_REF:
        return PRODUTOS_BY_REF[query]
    
    # Try name search
    matches = []
    for nome, prod in PRODUTOS_BY_NAME.items():
        if query in nome:
            matches.append(prod)
    
    return matches[0] if len(matches) == 1 else matches if matches else None

def calcular_desconto_max(cliente_tipo, quantidade, valor_total, categoria):
    """Calculate maximum allowed discount based on rules."""
    descontos = []
    
    # Por tipo cliente
    cliente_rules = REGRAS['regras_desconto']['por_cliente'].get(cliente_tipo, {})
    descontos.append(cliente_rules.get('desconto_max', 0))
    
    # Por quantidade
    for rule in REGRAS['regras_desconto']['por_quantidade']:
        if quantidade >= rule['min_unidades']:
            if rule['max_unidades'] is None or quantidade <= rule['max_unidades']:
                descontos.append(rule['desconto_max'])
    
    # Por valor
    for rule in REGRAS['regras_desconto']['por_valor_total']:
        if valor_total >= rule['min_euros']:
            if rule['max_euros'] is None or valor_total <= rule['max_euros']:
                descontos.append(rule['desconto_max'])
    
    # Ajustar para categorias margem baixa
    max_desconto = max(descontos) if descontos else 0
    if categoria in REGRAS['regras_desconto']['categorias_margem_baixa']:
        max_desconto = min(max_desconto, 5)  # Cap at 5% for low margin
    
    return max_desconto

def processar_pedido(cliente_id, itens):
    """Process an order and return response."""
    cliente = CLIENTES.get(cliente_id, CLIENTES['novo_cliente'])
    
    pedido = {
        'id': f"PED-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'cliente': cliente['nome'],
        'cliente_tipo': cliente['tipo'],
        'itens': [],
        'subtotal': 0,
        'desconto_aplicado': 0,
        'total': 0,
        'status': 'pendente',
        'data': datetime.now().isoformat()
    }
    
    for item in itens:
        produto = buscar_produto(item['produto'])
        if not produto or isinstance(produto, list):
            continue
        
        quantidade = item.get('quantidade', 1)
        preco_unit = produto['preco_sem_iva']
        subtotal_item = preco_unit * quantidade
        
        pedido['itens'].append({
            'produto': produto['nome'],
            'ref': produto['referencia'],
            'quantidade': quantidade,
            'preco_unit': preco_unit,
            'subtotal': subtotal_item,
            'categoria': produto['categoria']
        })
        pedido['subtotal'] += subtotal_item
    
    pedido['total'] = pedido['subtotal']
    PEDIDOS_PENDENTES.append(pedido)
    
    return pedido

def negociar_desconto(pedido_id, desconto_pedido):
    """Handle discount negotiation."""
    pedido = next((p for p in PEDIDOS_PENDENTES if p['id'] == pedido_id), None)
    if not pedido:
        return {"sucesso": False, "mensagem": "Pedido não encontrado."}
    
    # Calculate quantities and values
    total_quantidade = sum(i['quantidade'] for i in pedido['itens'])
    valor_total = pedido['subtotal']
    categoria_principal = pedido['itens'][0]['categoria'] if pedido['itens'] else ''
    
    # Get max allowed discount
    max_desconto = calcular_desconto_max(
        pedido['cliente_tipo'],
        total_quantidade,
        valor_total,
        categoria_principal
    )
    
    if desconto_pedido <= max_desconto:
        # Auto-approve
        pedido['desconto_aplicado'] = desconto_pedido
        pedido['total'] = pedido['subtotal'] * (1 - desconto_pedido/100)
        
        return {
            "sucesso": True,
            "aprovado": True,
            "desconto": desconto_pedido,
            "valor_final": round(pedido['total'], 2),
            "mensagem": f"✅ Desconto de {desconto_pedido}% aprovado! Total: {pedido['total']:.2f}€"
        }
    
    elif desconto_pedido <= max_desconto + 5:
        # Needs Paula approval
        return {
            "sucesso": True,
            "aprovado": False,
            "consultar_paula": True,
            "desconto_pedido": desconto_pedido,
            "desconto_max_auto": max_desconto,
            "mensagem": f"⚠️ Desconto de {desconto_pedido}% precisa aprovação da Paula. Posso aprovar até {max_desconto}% automaticamente."
        }
    
    else:
        # Reject
        return {
            "sucesso": True,
            "aprovado": False,
            "mensagem": f"❌ Não é possível {desconto_pedido}% de desconto. Máximo para este pedido: {max_desconto}%."
        }

def gerar_resposta_vendedor(mensagem, cliente_id="novo_cliente"):
    """Generate response for a seller message."""
    mensagem_lower = mensagem.lower()
    
    # Check for price/product query
    if any(word in mensagem_lower for word in ['preço', 'quanto', 'custa', 'valor']):
        # Try to extract product
        for nome, prod in PRODUTOS_BY_NAME.items():
            if any(word in mensagem_lower for word in nome.split()[:2]):
                if prod['preco_sem_iva'] > 0:
                    return f"📦 {prod['nome']}\nRef: {prod['referencia']}\n💰 Preço: {prod['preco_sem_iva']}€ (sem IVA)"
                else:
                    return f"📦 {prod['nome']}\nRef: {prod['referencia']}\n⚠️ Preço não disponível - consultar Paula"
        
        return "Não encontrei esse produto. Pode dar mais detalhes ou o código de referência?"
    
    # Check for order
    if any(word in mensagem_lower for word in ['pedido', 'encomenda', 'quero', 'preciso']):
        return "📝 Para registar pedido, indique:\n- Nome do cliente\n- Produtos e quantidades\n\nExemplo: 'Pedido Restaurante X: 10 camarão 30/40, 5 polvo'"
    
    # Check for discount
    if any(word in mensagem_lower for word in ['desconto', 'baixar', 'melhor preço']):
        cliente = CLIENTES.get(cliente_id, CLIENTES['novo_cliente'])
        if cliente['tipo'] == 'vip':
            return "Para clientes VIP, posso aprovar até 12% de desconto automaticamente. Qual o valor do pedido?"
        elif cliente['tipo'] == 'fiel':
            return "Posso aprovar até 8% para clientes fiéis. Para mais, preciso consultar a Paula."
        else:
            return "Descontos dependem da quantidade e valor do pedido. Acima de 500€ consigo até 5%."
    
    # Check for stock
    if any(word in mensagem_lower for word in ['stock', 'tem', 'disponível', 'há']):
        return "📦 Verifico o stock. Qual o produto?"
    
    # Default
    return "👋 Olá! Sou o assistente Aurora Oceano. Posso ajudar com:\n- Consultar preços\n- Registar pedidos\n- Verificar stock\n- Negociar descontos"

def gerar_resumo_paula():
    """Generate summary for Paula."""
    pendentes = len([p for p in PEDIDOS_PENDENTES if p['status'] == 'pendente'])
    valor_total = sum(p['total'] for p in PEDIDOS_PENDENTES)
    
    resumo = f"""📊 **Resumo Aurora Oceano**

📦 Pedidos pendentes: {pendentes}
💰 Valor total: {valor_total:.2f}€

📋 **Últimos pedidos:**
"""
    
    for pedido in PEDIDOS_PENDENTES[-5:]:
        resumo += f"\n• {pedido['id']} - {pedido['cliente']}: {pedido['total']:.2f}€ ({pedido['status']})"
    
    return resumo

# Demo functions
def demo():
    """Run demo scenarios."""
    print("=" * 50)
    print("🧊 AURORA OCEANO - BOT DEMO")
    print("=" * 50)
    
    # Scenario 1: Price query
    print("\n📱 VENDEDOR: Quanto custa o camarão 30/40?")
    resp = gerar_resposta_vendedor("Quanto custa o camarão 30/40?")
    print(f"🤖 BOT: {resp}")
    
    # Scenario 2: Order
    print("\n📱 VENDEDOR: Pedido Restaurante Mar Azul: 20 camarão 30/40, 10 polvo 2000/3000")
    pedido = processar_pedido("restaurante_mar", [
        {"produto": "camarão 30/40 van", "quantidade": 20},
        {"produto": "polvo 2000/3000 marr", "quantidade": 10}
    ])
    print(f"🤖 BOT: ✅ Pedido {pedido['id']} registado!")
    print(f"   Cliente: {pedido['cliente']} ({pedido['cliente_tipo']})")
    for item in pedido['itens']:
        print(f"   • {item['quantidade']}x {item['produto']} = {item['subtotal']:.2f}€")
    print(f"   💰 Total: {pedido['total']:.2f}€")
    
    # Scenario 3: Discount negotiation
    print("\n📱 VENDEDOR: O cliente quer 10% de desconto")
    result = negociar_desconto(pedido['id'], 10)
    print(f"🤖 BOT: {result['mensagem']}")
    
    # Scenario 4: Excessive discount
    print("\n📱 VENDEDOR: Ele insiste em 15%")
    result = negociar_desconto(pedido['id'], 15)
    print(f"🤖 BOT: {result['mensagem']}")
    
    # Scenario 5: Paula summary
    print("\n" + "=" * 50)
    print("👩‍💼 PAULA - DASHBOARD")
    print("=" * 50)
    print(gerar_resumo_paula())

if __name__ == '__main__':
    demo()
