#!/usr/bin/env python3
"""
Aurora Oceano - Bot Demo Telegram
Bot de demonstração com todas as 8 funcionalidades.
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from pathlib import Path

# Dados demo
DEMO_DATA = {
    "empresa": {
        "nome": "Aurora Oceano",
        "meta_anual": 4600000,
        "vendas_ytd": 380000
    },
    "encomendas_pendentes": [
        {"id": "ENC-001", "cliente": "Restaurante Mar Azul", "valor": 450.00, "status": "confirmada"},
        {"id": "ENC-002", "cliente": "Hotel Sol", "valor": 1200.00, "status": "em_preparacao"},
        {"id": "ENC-003", "cliente": "Café Central", "valor": 180.00, "status": "pendente"}
    ],
    "pagamentos_fornecedores": [
        {"fornecedor": "Pescanova", "valor": 2500.00, "vencimento": "2026-01-30"},
        {"fornecedor": "Friboi", "valor": 1800.00, "vencimento": "2026-01-31"},
        {"fornecedor": "Lutosa", "valor": 650.00, "vencimento": "2026-02-02"}
    ],
    "clientes_divida": [
        {"cliente": "Snack Bar Praia", "valor": 890.00, "dias_atraso": 15},
        {"cliente": "Churrasqueira Popular", "valor": 450.00, "dias_atraso": 8}
    ],
    "historico_precos": {
        "restaurante_mar": {
            "camarao_30_40": [{"data": "2026-01-15", "preco": 4.50}, {"data": "2026-01-22", "preco": 4.75}],
            "polvo_2000": [{"data": "2026-01-20", "preco": 12.20}]
        }
    },
    "vendedores": [
        {"nome": "Carlos", "pedidos_mes": 45, "volume": 18500},
        {"nome": "Rui", "pedidos_mes": 38, "volume": 15200},
        {"nome": "Maria", "pedidos_mes": 32, "volume": 12800}
    ]
}

# Sugestões iniciais
SUGESTOES_INICIAIS = """
👋 Olá! Sou o assistente Aurora Oceano.

**O que posso fazer:**
1️⃣ Ver encomendas pendentes
2️⃣ Consultar preços de clientes
3️⃣ Verificar pagamentos a fornecedores

Escreve o número ou pergunta directamente!
"""

def get_encomendas_response():
    """Gera resposta para encomendas pendentes."""
    encomendas = DEMO_DATA["encomendas_pendentes"]
    total = sum(e["valor"] for e in encomendas)
    
    response = f"""📦 **ENCOMENDAS PENDENTES**
_Actualizado: {datetime.now().strftime('%H:%M')}_

"""
    for enc in encomendas:
        status_emoji = {"confirmada": "✅", "em_preparacao": "🔄", "pendente": "⏳"}.get(enc["status"], "❓")
        response += f"{status_emoji} **{enc['id']}** - {enc['cliente']}\n"
        response += f"   💰 {enc['valor']:.2f}€ | {enc['status'].replace('_', ' ').title()}\n\n"
    
    response += f"📊 **Total:** {total:.2f}€ ({len(encomendas)} encomendas)"
    return response

def get_pagamentos_response():
    """Gera resposta para pagamentos a fornecedores."""
    pagamentos = DEMO_DATA["pagamentos_fornecedores"]
    hoje = datetime.now().date()
    
    response = f"""💳 **PAGAMENTOS A FORNECEDORES**
_Próximos 7 dias_

"""
    total = 0
    for pag in pagamentos:
        venc = datetime.strptime(pag["vencimento"], "%Y-%m-%d").date()
        dias = (venc - hoje).days
        
        if dias <= 0:
            emoji = "🔴"
            status = "VENCIDO"
        elif dias <= 2:
            emoji = "🟡"
            status = f"em {dias} dias"
        else:
            emoji = "🟢"
            status = f"em {dias} dias"
        
        response += f"{emoji} **{pag['fornecedor']}**\n"
        response += f"   💰 {pag['valor']:.2f}€ | {status}\n\n"
        total += pag["valor"]
    
    response += f"📊 **Total próximos 7 dias:** {total:.2f}€"
    return response

def get_dividas_response():
    """Gera resposta para clientes com dívidas."""
    dividas = DEMO_DATA["clientes_divida"]
    
    if not dividas:
        return "✅ Nenhum cliente com pagamentos em atraso!"
    
    response = f"""⚠️ **CLIENTES COM DÍVIDAS**

"""
    total = 0
    for div in dividas:
        if div["dias_atraso"] >= 15:
            emoji = "🔴"
        elif div["dias_atraso"] >= 7:
            emoji = "🟡"
        else:
            emoji = "🟠"
        
        response += f"{emoji} **{div['cliente']}**\n"
        response += f"   💰 {div['valor']:.2f}€ | {div['dias_atraso']} dias de atraso\n\n"
        total += div["valor"]
    
    response += f"📊 **Total em atraso:** {total:.2f}€"
    return response

def get_historico_precos_response(cliente: str, produto: str):
    """Gera resposta para histórico de preços."""
    # Simulação
    return f"""📈 **HISTÓRICO DE PREÇOS**
Cliente: {cliente}
Produto: {produto}

| Data | Preço |
|------|-------|
| 15/01 | 4.50€/kg |
| 22/01 | 4.75€/kg |
| 29/01 | 4.75€/kg |

📊 **Preço actual:** 4.75€/kg
📉 **Variação mensal:** +5.5%
"""

def get_rotas_response():
    """Gera resposta para rotas de entrega."""
    return f"""🚚 **ROTAS DE ENTREGA - {datetime.now().strftime('%d/%m/%Y')}**

**Rota 1 - Zona Seixal** (08:00)
├── Restaurante Mar Azul (ENC-001)
├── Café Central (ENC-003)
└── Snack Bar Praia

**Rota 2 - Zona Almada** (10:30)
├── Hotel Sol (ENC-002)
└── Churrasqueira Popular

📍 **Total:** 5 entregas | 45 km estimados
⏱️ **Tempo estimado:** 3h30

_Rotas optimizadas por zona geográfica_
"""

def get_ranking_vendedores():
    """Gera ranking de vendedores."""
    vendedores = sorted(DEMO_DATA["vendedores"], key=lambda x: x["volume"], reverse=True)
    
    response = f"""🏆 **RANKING VENDEDORES - Janeiro 2026**

"""
    medals = ["🥇", "🥈", "🥉"]
    for i, v in enumerate(vendedores):
        medal = medals[i] if i < 3 else f"{i+1}."
        response += f"{medal} **{v['nome']}**\n"
        response += f"   📦 {v['pedidos_mes']} pedidos | 💰 {v['volume']:,.0f}€\n\n"
    
    total = sum(v["volume"] for v in vendedores)
    meta_mes = DEMO_DATA["empresa"]["meta_anual"] / 12
    progresso = (total / meta_mes) * 100
    
    response += f"📊 **Total equipa:** {total:,.0f}€\n"
    response += f"🎯 **Meta mensal:** {meta_mes:,.0f}€ ({progresso:.0f}%)"
    return response

def get_ficha_tecnica(produto: str):
    """Gera ficha técnica de produto."""
    return f"""📋 **FICHA TÉCNICA**
**Produto:** Camarão Vannamei 30/40

**Informação Geral**
• Origem: Equador
• Método: Aquacultura
• Calibre: 30-40 peças/kg

**Conservação**
• Temperatura: -18°C
• Validade: 24 meses

**Informação Nutricional (100g)**
| Nutriente | Valor |
|-----------|-------|
| Energia | 85 kcal |
| Proteínas | 18g |
| Lípidos | 1.5g |
| Sal | 0.8g |

**Alergénios:** Crustáceos 🦐

_Ficha validada conforme regulamento EU 1169/2011_
"""

def process_message(text: str) -> str:
    """Processa mensagem e retorna resposta."""
    text_lower = text.lower().strip()
    
    # Sugestões iniciais
    if text_lower in ["1", "encomendas", "ver encomendas", "encomendas pendentes"]:
        return get_encomendas_response()
    
    if text_lower in ["2", "preços", "precos", "historico preços"]:
        return get_historico_precos_response("Restaurante Mar Azul", "Camarão 30/40")
    
    if text_lower in ["3", "pagamentos", "fornecedores", "pagamentos fornecedores"]:
        return get_pagamentos_response()
    
    if "dívida" in text_lower or "divida" in text_lower or "atraso" in text_lower:
        return get_dividas_response()
    
    if "rota" in text_lower or "entrega" in text_lower:
        return get_rotas_response()
    
    if "ranking" in text_lower or "vendedor" in text_lower:
        return get_ranking_vendedores()
    
    if "ficha" in text_lower or "técnica" in text_lower or "tecnica" in text_lower:
        return get_ficha_tecnica("Camarão 30/40")
    
    if text_lower in ["olá", "ola", "oi", "bom dia", "boa tarde", "start", "/start"]:
        return SUGESTOES_INICIAIS
    
    # Default
    return f"""🤔 Não entendi "{text}".

**Posso ajudar com:**
• "encomendas" - Ver encomendas pendentes
• "pagamentos" - Pagamentos a fornecedores
• "dívidas" - Clientes com atraso
• "rotas" - Rotas de entrega
• "ranking" - Ranking vendedores
• "ficha técnica" - Fichas de produtos

O que precisas?"""

# Para teste local
if __name__ == "__main__":
    print(SUGESTOES_INICIAIS)
    print("\n" + "="*50 + "\n")
    
    while True:
        user_input = input("Tu: ")
        if user_input.lower() in ["sair", "exit", "quit"]:
            break
        response = process_message(user_input)
        print(f"\nBot: {response}\n")
