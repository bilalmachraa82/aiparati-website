# 🎬 DEMO SCRIPT - Aurora Oceano (30 min)

## Setup Antes da Demo
1. Abrir Telegram com bot Aurora
2. Ter produtos.json aberto (referência)
3. Ter regras_negociacao.json (mostrar)

---

## PARTE 1: Introdução (3 min)

### Slide 1: O Problema
"A Paula gere mais de 100 pedidos por dia. Vendedores ligam, mandam WhatsApp, pedem descontos... É impossível fazer tudo bem."

### Slide 2: A Solução
"O bot Aurora responde aos vendedores, regista pedidos, e sabe negociar preços dentro das regras. A Paula só intervém quando necessário."

---

## PARTE 2: Demo Vendedor (10 min)

### Cenário 1: Consulta de Preço
```
VENDEDOR: "Quanto custa o camarão 30/40?"

BOT: "📦 CAMARÃO 30/40 VAN. 20% VID.
     Ref: 3412
     💰 Preço: 4.75€/kg (sem IVA)
     📦 Stock: Disponível"
```

### Cenário 2: Registar Pedido
```
VENDEDOR: "Pedido Restaurante Mar Azul: 20kg camarão 30/40, 10kg polvo 2000"

BOT: "✅ Pedido #PED-001 registado!
     
     Cliente: Restaurante Mar Azul (fiel)
     
     📦 Itens:
     • 20kg Camarão 30/40 = 95.00€
     • 10kg Polvo 2000/3000 = 122.00€
     
     💰 Total: 217.00€
     🚚 Entrega: Amanhã
     
     Confirma? (Sim/Não)"
```

### Cenário 3: Negociação OK
```
VENDEDOR: "O cliente quer 5% de desconto"

BOT: "✅ Desconto aprovado!
     
     Cliente fiel + pedido >200€ = até 8% permitido
     
     💰 Total com 5%: 206.15€
     
     Confirmo com o cliente?"
```

### Cenário 4: Negociação Recusada
```
VENDEDOR: "Ele quer 15% de desconto"

BOT: "❌ Não consigo aprovar 15%.
     
     Máximo automático: 8% (cliente fiel)
     
     💡 Opções:
     1. Aceitar 8% → Total: 199.64€
     2. Consulto a Paula (5 min)
     3. Sugerir produto alternativo"
```

### Cenário 5: Consultar Paula
```
VENDEDOR: "Consulta a Paula"

BOT: "⏳ A contactar Paula...

     [Paula recebe notificação]
     
     Paula, o Restaurante Mar Azul pede 15% 
     num pedido de 217€.
     Cliente fiel (25 pedidos anteriores).
     
     Aprovar? (Sim/Não/Contraproposta)"
```

---

## PARTE 3: Demo Paula (10 min)

### Dashboard Matinal (08:00)
```
BOT → PAULA:

"☀️ Bom dia Paula!

📊 Resumo Aurora Oceano - 29 Jan

📦 Pedidos ontem: 47
💰 Volume: 12.340€
✅ Processados: 45
⏳ Pendentes: 2

👥 Vendedores activos: 4
🏆 Top: Carlos (18 pedidos)

⚠️ ALERTAS:
• Stock baixo: Bacalhau lombo (5 cx)
• Cliente Hotel Sol sem visita há 10 dias

📋 Aprovar:
• Pedido #042 - 15% desconto (217€)

O que precisa?"
```

### Aprovar Desconto
```
PAULA: "Aprova o 42 com 12%"

BOT: "✅ Pedido #042 aprovado com 12%
     Cliente notificado.
     Vendedor Carlos informado.
     
     💰 Total final: 190.96€"
```

### Consulta Rápida
```
PAULA: "Quanto vendemos de camarão esta semana?"

BOT: "📊 Vendas Camarão (22-29 Jan):

     • 30/40: 234kg (1.112€)
     • 20/30: 156kg (1.244€)  
     • Selvagem: 45kg (891€)
     
     📈 +12% vs semana anterior
     
     🏆 Top cliente: Hotel Sol (89kg)"
```

### Relatório
```
PAULA: "Relatório do mês"

BOT: "📊 Janeiro 2026 (até 29)

     📦 Total pedidos: 1.247
     💰 Volume: 89.340€
     📈 vs Dez: +8%
     
     🏆 Top Produtos:
     1. Camarão 30/40 (890kg)
     2. Polvo 2000/3000 (456kg)
     3. Bacalhau posta (234kg)
     
     👥 Top Clientes:
     1. Hotel Sol (12.400€)
     2. Rest. Mar Azul (8.900€)
     3. Café Central (4.200€)
     
     📧 Enviar PDF?"
```

---

## PARTE 4: Perguntas e Valor (7 min)

### Benefícios Quantificados
| Antes | Depois |
|-------|--------|
| Paula 8h/dia em pedidos | 2h/dia |
| 15% pedidos com erro | <2% |
| 30 min tempo resposta | 2 min |
| Vendedor 8 visitas/dia | 12 visitas/dia |

### Investimento
- Setup: 2 semanas
- Mensal: €XXX

### Próximos Passos
1. Validar catálogo (esta semana)
2. Configurar regras desconto (com Paula)
3. Treinar vendedores (1h)
4. Go-live piloto (2 semanas)

---

## NOTAS PARA APRESENTADOR

### Se perguntarem "E se o vendedor escrever mal?"
"O bot entende variações. 'camarão 3040', 'camarão 30-40', 'camarao' - tudo funciona."

### Se perguntarem "E produtos novos?"
"Basta actualizar o catálogo Moloni. O bot sincroniza automaticamente."

### Se perguntarem "E se a Paula não responder?"
"Após 15 min sem resposta, o bot escala ou aplica a regra padrão."

### Se perguntarem "Quanto custa?"
"Depende do volume. Para a Auroroceano, estimamos €X setup + €Y/mês."

---

*Demo preparada por AiParaTi*
